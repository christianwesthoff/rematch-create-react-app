import Backoff from 'backo2';
import idx from 'idx';

import {
  requestStart,
  requestFailure,
  requestSuccess,
  mutateStart,
  mutateFailure,
  mutateSuccess,
  invalidateRequest,
  invalidateRequestByPattern
} from '../actions';
import * as actionTypes from '../constants/action-types';
import httpMethods, { HttpMethod } from '../constants/http-methods';
import * as statusCodes from '../constants/status-codes';
import { getRequestKey } from '../lib/request-key';
import { updateEntities, updateMaps } from '../lib/update';

import { Action, PublicAction } from '../actions';
import {
  ActionPromiseValue,
  EntitiesSelector,
  NetworkHandler,
  NetworkInterface,
  QueriesSelector,
  ResponseBody,
  Status,
  Transform,
  RequestKey,
  AdditionalHeadersSelector,
  RequestConfig,
  MutationsSelector
} from '../types';
import { State as QueriesState } from '../reducers/queries';
import { State as MutationsState } from '../reducers/mutations';
import { wildcardFilter } from '../lib/array';

type ReduxStore = {
  dispatch: (action: Action) => any;
  getState: () => any;
};

type Next = (action: PublicAction) => any;

const defaultConfig: RequestConfig = {
  defaultHeaders: {},
  backoff: {
    maxAttempts: 5,
    minDuration: 300,
    maxDuration: 5000,
  },
  retryableStatusCodes: [
    statusCodes.UNKNOWN, // normally means a failed connection
    statusCodes.REQUEST_TIMEOUT,
    statusCodes.TOO_MANY_REQUESTS, // hopefully backoff stops this getting worse
    statusCodes.SERVICE_UNAVAILABLE,
    statusCodes.GATEWAY_TIMEOUT,
  ],
};

const getQueryKeys = (queries: QueriesState): RequestKey[] => {
  const queryKeys: RequestKey[] = [];

  for (const queryKey in queries) {
    queryKeys.push(queryKey)
  }

  return queryKeys;
};

const getPendingMutations = (mutations: MutationsState): MutationsState => {
  const pendingMutations: MutationsState = {};

  for (const queryKey in mutations) {
    if (mutations.hasOwnProperty(queryKey)) {
      const mutation = mutations[queryKey];

      if (mutation.isPending) {
        pendingMutations[queryKey] = mutation;
      }
    }
  }

  return pendingMutations;
};

const getPendingQueries = (queries: QueriesState): QueriesState => {
  const pendingQueries: QueriesState = {};

  for (const queryKey in queries) {
    if (queries.hasOwnProperty(queryKey)) {
      const query = queries[queryKey];

      if (query.isPending) {
        pendingQueries[queryKey] = query;
      }
    }
  }

  return pendingQueries;
};

const isStatusOk = (status?: Status | undefined): boolean => {
  return status !== null && status !== undefined && status >= 200 && status < 300;
};

const defaultTransform: Transform = (body?: ResponseBody | undefined) => body || {};

const queryMiddleware = (
  networkInterface: NetworkInterface,
  queriesSelector: QueriesSelector,
  entitiesSelector: EntitiesSelector,
  mutationsSelector: MutationsSelector,
  additionalHeadersSelector?: AdditionalHeadersSelector | undefined,
  customConfig?: RequestConfig | undefined
) => {

  const networkHandlersByQueryKey: { [key: string]: NetworkHandler } = {};

  const abortQuery = (queryKey: string) => {
    const networkHandler = networkHandlersByQueryKey[queryKey];

    if (networkHandler) {
      networkHandler.abort();
      delete networkHandlersByQueryKey[queryKey];
    }
  };

  return ({ dispatch, getState }: ReduxStore) => (next: Next) => (action: PublicAction) => {
    let returnValue;
    const config = { ...defaultConfig, ...customConfig };

    switch (action.type) {
      case actionTypes.MUTATE_ASYNC: {
        const {
          url,
          body,
          options = {},
          meta,
          triggerKeys,
          triggerPatterns
        } = action;

        if (!url) {
          throw new Error('Missing required url field for request');
        }

        const queryKey = getRequestKey({
          body: action.body,
          requestKey: action.requestKey,
          url: action.url,
        });

        if (!queryKey) {
          throw new Error('Failed to generate queryKey for request');
        }

        const state = getState();
        const mutations = mutationsSelector(state);

        const mutationsState = mutations[queryKey];
        const isPending = idx(mutationsState, (_: any) => _.isPending);
        const payload = idx(mutationsState, (_: any) => _.payload);

        const additionalHeaders = !!additionalHeadersSelector ? additionalHeadersSelector(state) : {};

        if (!(isPending && payload === action.body)) {
          returnValue = new Promise<ActionPromiseValue>(resolve => {
            const start = new Date();
            const { method = httpMethods.POST as HttpMethod } = options;
            let attempts = 0;
            const backoff = new Backoff({
              min: config.backoff!.minDuration,
              max: config.backoff!.maxDuration,
            });

            const attemptRequest = () => {
              const networkHandler = networkInterface(url, method, {
                body,
                headers: { ...options.headers, ...config.defaultHeaders, ...additionalHeaders },
                credentials: options.credentials,
              });

              networkHandlersByQueryKey[queryKey] = networkHandler;

              dispatch(
                mutateStart({
                  body,
                  meta,
                  queryKey,
                  url,
                }),
              );

              attempts += 1;

              networkHandler.execute((err, status, responseBody, responseText, responseHeaders) => {
                if (
                  config.retryableStatusCodes!.includes(status) &&
                  attempts < config.backoff!.maxAttempts
                ) {
                  // TODO take into account Retry-After header if 503
                  setTimeout(attemptRequest, backoff.duration());
                  return;
                }

                const end = new Date();
                const duration = +end - +start;
                if (action.unstable_preDispatchCallback) {
                  action.unstable_preDispatchCallback();
                }

                if (err || !isStatusOk(status)) {
                  dispatch(
                    mutateFailure({
                      body,
                      duration,
                      meta,
                      queryKey,
                      responseBody,
                      responseHeaders,
                      status,
                      responseText,
                      url,
                    }),
                  );

                  resolve({
                    body: responseBody,
                    duration,
                    status: status,
                    text: responseText,
                    headers: responseHeaders,
                  });
                } else {
                  dispatch(
                    mutateSuccess({
                      body,
                      duration,
                      meta,
                      queryKey,
                      responseBody,
                      responseHeaders,
                      status,
                      responseText,
                      url,
                    }),
                  );

                  if (triggerKeys) {
                    for(let key in triggerKeys) {
                      dispatch(
                        invalidateRequest(key),
                      );
                    }
                  }

                  if (triggerPatterns) {
                    for(let pattern in triggerPatterns) {
                      dispatch(
                        invalidateRequestByPattern(pattern),
                      );
                    }
                  }

                  resolve({
                    body: responseBody,
                    duration,
                    status,
                    text: responseText,
                    headers: responseHeaders,
                  });
                }

                delete networkHandlersByQueryKey[queryKey];
              });
            };

            attemptRequest();
          });
        }

        break;
      }
      case actionTypes.REQUEST_ASYNC: {
        const {
          url,
          body,
          force,
          retry,
          transform = defaultTransform,
          update,
          map,
          options = {},
          meta,
        } = action;

        if (!url) {
          throw new Error('Missing required url field for request');
        }

        const queryKey = getRequestKey({
          body: action.body,
          requestKey: action.requestKey,
          url: action.url,
        });

        if (!queryKey) {
          throw new Error('Failed to generate queryKey for request');
        }

        const state = getState();
        const queries = queriesSelector(state);

        const queriesState = queries[queryKey];
        const isPending = idx(queriesState, (_: any) => _.isPending);
        const isInvalid = idx(queriesState, (_: any) => _.isInvalid);
        const status = idx(queriesState, (_: any) => _.status);
        const hasSucceeded = isStatusOk(status);
        
        const additionalHeaders = !!additionalHeadersSelector ? additionalHeadersSelector(state) : {};

        if (force || isInvalid || !queriesState || (retry && !isPending && !hasSucceeded)) {
          returnValue = new Promise<ActionPromiseValue>(resolve => {
            const start = new Date();
            const { method = httpMethods.GET as HttpMethod } = options;
            let attempts = 0;
            const backoff = new Backoff({
              min: config.backoff!.minDuration,
              max: config.backoff!.maxDuration,
            });

            const attemptRequest = () => {
              const networkHandler = networkInterface(url, method, {
                body,
                headers: { ...options.headers, ...config.defaultHeaders, ...additionalHeaders },
                credentials: options.credentials,
              });

              networkHandlersByQueryKey[queryKey] = networkHandler;

              dispatch(
                requestStart({
                  body,
                  meta,
                  queryKey,
                  url,
                }),
              );

              attempts += 1;

              networkHandler.execute((err, status, responseBody, responseText, responseHeaders) => {
                if (
                  config.retryableStatusCodes!.includes(status) &&
                  attempts < config.backoff!.maxAttempts
                ) {
                  // TODO take into account Retry-After header if 503
                  setTimeout(attemptRequest, backoff.duration());
                  return;
                }

                const end = new Date();
                const duration = +end - +start;
                let transformed;
                let newEntities;
                let maps;
                if (action.unstable_preDispatchCallback) {
                  action.unstable_preDispatchCallback();
                }

                if (err || !isStatusOk(status)) {
                  dispatch(
                    requestFailure({
                      body,
                      duration,
                      meta,
                      queryKey,
                      responseBody,
                      responseHeaders,
                      status,
                      responseText,
                      url,
                    }),
                  );

                  resolve({
                    body: responseBody,
                    duration,
                    status: status,
                    text: responseText,
                    headers: responseHeaders,
                  });
                } else {
                  const callbackState = getState();
                  const entities = entitiesSelector(callbackState);
                  transformed = transform(responseBody, responseText);
                  newEntities = updateEntities(update, entities, transformed);
                  maps = updateMaps(map, transformed);
                  dispatch(
                    requestSuccess({
                      body,
                      duration,
                      meta,
                      entities: newEntities,
                      queryKey,
                      responseBody,
                      responseHeaders,
                      status,
                      responseText,
                      url,
                      maps
                    }),
                  );

                  resolve({
                    body: responseBody,
                    duration,
                    status,
                    text: responseText,
                    transformed,
                    entities: newEntities,
                    headers: responseHeaders,
                  });
                }

                delete networkHandlersByQueryKey[queryKey];
              });
            };

            attemptRequest();
          });
        }

        break;
      }
      case actionTypes.CANCEL_MUTATION: {
        const { queryKey } = action;

        if (!queryKey) {
          throw new Error('Missing required queryKey field');
        }

        const state = getState();
        const queries = mutationsSelector(state);
        const pendingMutations= getPendingMutations(queries);

        if (queryKey in pendingMutations) {
          abortQuery(queryKey);
          returnValue = next(action);
        } else {
          // eslint-disable-next-line
          console.warn('Trying to cancel a request that is not in flight: ', queryKey);
          returnValue = null;
        }

        break;
      }
      case actionTypes.CANCEL_REQUEST: {
        const { queryKey } = action;

        if (!queryKey) {
          throw new Error('Missing required queryKey field');
        }

        const state = getState();
        const queries = queriesSelector(state);
        const pendingQueries = getPendingQueries(queries);

        if (queryKey in pendingQueries) {
          abortQuery(queryKey);
          returnValue = next(action);
        } else {
          // eslint-disable-next-line
          console.warn('Trying to cancel a request that is not in flight: ', queryKey);
          returnValue = null;
        }

        break;
      }
      case actionTypes.INVALIDATE_REQUEST: {
        const { queryPattern, queryKey } = action;

        if (!queryPattern && !queryKey) {
          throw new Error('Missing required queryPattern or queryKey field');
        }

        const state = getState();
        const queries = queriesSelector(state);
        const pendingQueries = getPendingQueries(queries);

        if (queryPattern) {
          const queryKeys = getQueryKeys(queries);
          const filtered = wildcardFilter(queryKeys, queryPattern);
          for(let index in filtered) {
              const key = filtered[index];
              if (key in pendingQueries) {
                abortQuery(key);
              }
          }
        } else if (queryKey) {
          if (queryKey in pendingQueries) {
            abortQuery(queryKey);
          }
        }

        returnValue = next(action);
        break;
      }
      case actionTypes.RESET: {
        const state = getState();
        const queries = queriesSelector(state);
        const pendingQueries = getPendingQueries(queries);

        for (const queryKey in pendingQueries) {
          if (pendingQueries.hasOwnProperty(queryKey)) {
            abortQuery(queryKey);
          }
        }

        returnValue = next(action);

        break;
      }
      default: {
        returnValue = next(action);
      }
    }

    return returnValue;
  };
};

export default queryMiddleware;
