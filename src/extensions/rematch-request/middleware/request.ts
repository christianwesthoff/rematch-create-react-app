import Backoff from 'backo2';
import idx from 'idx';
import { Middleware, Dispatch, MiddlewareAPI } from 'redux';
import {
  requestStart,
  queryFailure,
  querySuccess,
  mutateStart,
  mutateFailure,
  mutateSuccess,
  invalidateQuery
} from '../actions';
import * as actionTypes from '../constants/action-types';
import httpMethods, { HttpMethod } from '../constants/http-methods';
import * as statusCodes from '../constants/status-codes';
import { getQueryKey, getMutationKey } from '../lib/request-key';
import { updateEntities, updateMaps } from '../lib/update';
import { PublicAction } from '../actions';
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
  MutationsSelector,
  Update,
  Map
} from '../types';
import { State as QueriesState } from '../reducers/queries';
import { State as MutationsState } from '../reducers/mutations';

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

const getQueryKeys = (queries: QueriesState): Array<RequestKey> => {
  const requestKeys: Array<RequestKey> = [];

  for (const requestKey in queries) {
    requestKeys.push(requestKey)
  }

  return requestKeys;
};

const getPendingMutations = (mutations: MutationsState): MutationsState => {
  const pendingMutations: MutationsState = {};

  for (const requestKey in mutations) {
    if (mutations.hasOwnProperty(requestKey)) {
      const mutation = mutations[requestKey];

      if (mutation.isPending) {
        pendingMutations[requestKey] = mutation;
      }
    }
  }

  return pendingMutations;
};

const getPendingQueries = (queries: QueriesState): QueriesState => {
  const pendingQueries: QueriesState = {};

  for (const requestKey in queries) {
    if (queries.hasOwnProperty(requestKey)) {
      const query = queries[requestKey];

      if (query.isPending) {
        pendingQueries[requestKey] = query;
      }
    }
  }

  return pendingQueries;
};

const isStatusOk = (status?: Status | undefined): boolean => {
  return status !== null && status !== undefined && status >= 200 && status < 300;
};

const defaultTransform: Transform = (body?: ResponseBody | undefined) => body || {};

const updateFromTransform = (transform: any): Update => {
  return Object.keys(transform).reduce((accum: any, key: string) => {
    accum[key] = (prevValue: any, newValue: any) => {
      return {...prevValue || {}, ...newValue }; 
    } 
    return accum;
  }, {}) as Update;
}

const mapFromTransform = (transform: any): Map => {
  return Object.keys(transform).reduce((accum: any, key: string) => {
    accum[key] = (values: any) => {
      return Object.keys(values); 
    } 
    return accum;
  }, {}) as Map;
}

const queryMiddleware = (
  networkInterface: NetworkInterface,
  queriesSelector: QueriesSelector,
  entitiesSelector: EntitiesSelector,
  mutationsSelector: MutationsSelector,
  additionalHeadersSelector?: AdditionalHeadersSelector | undefined,
  customConfig?: RequestConfig | undefined
): Middleware => {

  const networkHandlersByRequestKey: { [key: string]: NetworkHandler } = {};

  const abortQuery = (requestKey: string) => {
    const networkHandler = networkHandlersByRequestKey[requestKey];

    if (networkHandler) {
      networkHandler.abort();
      delete networkHandlersByRequestKey[requestKey];
    }
  };

  return ({ dispatch, getState }: MiddlewareAPI) => (next: Dispatch) => (action: PublicAction) => {
    let returnValue;
    const config = { ...defaultConfig, ...customConfig };

    switch (action.type) {
      case actionTypes.MUTATE_ASYNC: {
        const {
          url,
          body,
          options = {},
          meta,
          triggerPatterns
        } = action;

        if (!url) {
          throw new Error('Missing required url field for request');
        }

        const requestKey = getQueryKey({
          body: action.body,
          requestKey: action.requestKey,
          url: action.url,
        });

        if (!requestKey) {
          throw new Error('Failed to generate requestKey for request');
        }

        const state = getState();
        const mutations = mutationsSelector(state);

        const mutationsState = mutations[requestKey];
        const isPending = idx(mutationsState, (_: any) => _.isPending);
        const payload = idx(mutationsState, (_: any) => _.payload);

        const additionalHeaders = !!additionalHeadersSelector ? additionalHeadersSelector(state) : {};

        if (!isPending && payload !== action.body) {
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

              networkHandlersByRequestKey[requestKey] = networkHandler;

              dispatch(
                mutateStart({
                  body,
                  meta,
                  requestKey,
                  url,
                }),
              );

              attempts += 1;

              networkHandler.execute((err, status, responseBody, responseHeaders) => {
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
                if (action.preDispatchCallback) {
                  action.preDispatchCallback();
                }

                if (err || !isStatusOk(status)) {
                  dispatch(
                    mutateFailure({
                      body,
                      duration,
                      meta,
                      requestKey,
                      responseBody,
                      responseHeaders,
                      status,
                      // responseText,
                      url,
                    }),
                  );

                  resolve({
                    body: responseBody,
                    duration,
                    status: status,
                    // text: responseText,
                    headers: responseHeaders,
                  });
                } else {
                  dispatch(
                    mutateSuccess({
                      body,
                      duration,
                      meta,
                      requestKey,
                      responseBody,
                      responseHeaders,
                      status,
                      // responseText,
                      url,
                    }),
                  );
                  if (triggerPatterns) {
                      dispatch(
                        invalidateQuery(triggerPatterns),
                      );
                  }

                  resolve({
                    body: responseBody,
                    duration,
                    status,
                    // text: responseText,
                    headers: responseHeaders,
                  });
                }

                delete networkHandlersByRequestKey[requestKey];
              });
            };

            attemptRequest();
          });
        }

        break;
      }
      case actionTypes.QUERY_ASYNC: {
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

        const requestKey = getMutationKey({
          body: action.body,
          requestKey: action.requestKey,
          url: action.url,
        });

        if (!requestKey) {
          throw new Error('Failed to generate requestKey for request');
        }

        const state = getState();
        const queries = queriesSelector(state);

        const queriesState = queries[requestKey];
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

              networkHandlersByRequestKey[requestKey] = networkHandler;

              dispatch(
                requestStart({
                  body,
                  meta,
                  requestKey,
                  url,
                }),
              );

              attempts += 1;

              networkHandler.execute((err, status, responseBody, responseHeaders) => {
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
                if (action.preDispatchCallback) {
                  action.preDispatchCallback();
                }

                if (err || !isStatusOk(status)) {
                  dispatch(
                    queryFailure({
                      body,
                      duration,
                      meta,
                      requestKey,
                      responseBody,
                      responseHeaders,
                      status,
                      // responseText,
                      url,
                    }),
                  );

                  resolve({
                    body: responseBody,
                    duration,
                    status: status,
                    // text: responseText,
                    headers: responseHeaders,
                  });
                } else {
                  const callbackState = getState();
                  const entities = entitiesSelector(callbackState);
                  transformed = transform(responseBody, responseHeaders);
                  newEntities = updateEntities(update || updateFromTransform(transformed), entities, transformed);
                  maps = updateMaps(map || mapFromTransform(transformed), transformed);
                  dispatch(
                    querySuccess({
                      body,
                      duration,
                      meta,
                      entities: newEntities,
                      requestKey,
                      responseBody,
                      responseHeaders,
                      status,
                      // responseText,
                      url,
                      maps
                    }),
                  );

                  resolve({
                    body: responseBody,
                    duration,
                    status,
                    // text: responseText,
                    transformed,
                    entities: newEntities,
                    headers: responseHeaders,
                  });
                }

                delete networkHandlersByRequestKey[requestKey];
              });
            };

            attemptRequest();
          });
        }

        break;
      }
      case actionTypes.CANCEL_MUTATION: {
        const { requestKey } = action;

        if (!requestKey) {
          throw new Error('Missing required requestKey field');
        }

        const state = getState();
        const queries = mutationsSelector(state);
        const pendingMutations= getPendingMutations(queries);

        if (requestKey in pendingMutations) {
          abortQuery(requestKey);
          returnValue = next(action);
        } else {
          // eslint-disable-next-line
          console.warn('Trying to cancel a request that is not in flight: ', requestKey);
          returnValue = null;
        }

        break;
      }
      case actionTypes.CANCEL_QUERY: {
        const { requestKey } = action;

        if (!requestKey) {
          throw new Error('Missing required requestKey field');
        }

        const state = getState();
        const queries = queriesSelector(state);
        const pendingQueries = getPendingQueries(queries);

        if (requestKey in pendingQueries) {
          abortQuery(requestKey);
          returnValue = next(action);
        } else {
          // eslint-disable-next-line
          console.warn('Trying to cancel a request that is not in flight: ', requestKey);
          returnValue = null;
        }

        break;
      }
      case actionTypes.INVALIDATE_QUERY: {
        const { queryPatterns } = action;

        if (!queryPatterns) {
          throw new Error('Missing required queryPattern or requestKey field');
        }

        const state = getState();
        const queries = queriesSelector(state);
        const pendingQueries = getPendingQueries(queries);

        if (queryPatterns) {
          const requestKeys = getQueryKeys(queries);
          const filtered = requestKeys.filter(key => queryPatterns.some(pattern => key.includes(pattern)));
          for(let index in filtered) {
              const key = filtered[index];
              if (key in pendingQueries) {
                abortQuery(key);
              }
          }
        }

        returnValue = next(action);
        break;
      }
      case actionTypes.RESET: {
        const state = getState();
        const queries = queriesSelector(state);
        const pendingQueries = getPendingQueries(queries);

        for (const requestKey in pendingQueries) {
          if (pendingQueries.hasOwnProperty(requestKey)) {
            abortQuery(requestKey);
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
