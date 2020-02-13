import Backoff from 'backo2';
import idx from 'idx';

import {
  requestStart,
  requestFailure,
  requestSuccess
} from '../actions';
import * as actionTypes from '../constants/action-types';
import httpMethods, { HttpMethod } from '../constants/http-methods';
import * as statusCodes from '../constants/status-codes';
import { getQueryKey } from '../lib/query-key';
import { updateEntities } from '../lib/update';

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
  Entities,
} from '../types';
import { State as QueriesState } from '../reducers/queries';

type Config = {
  backoff: {
    maxAttempts: number;
    minDuration: number;
    maxDuration: number;
  };
  retryableStatusCodes: Array<Status>;
};

type ReduxStore = {
  dispatch: (action: Action) => any;
  getState: () => any;
};

type Next = (action: PublicAction) => any;

const defaultConfig: Config = {
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
  customConfig?: Config | undefined,
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
      case actionTypes.REQUEST_ASYNC: {
        const {
          url,
          body,
          force,
          retry,
          transform = defaultTransform,
          update,
          options = {},
          meta,
        } = action;

        if (!url) {
          throw new Error('Missing required url field for request');
        }

        const queryKey = getQueryKey({
          body: action.body,
          queryKey: action.queryKey,
          url: action.url,
        });

        if (!queryKey) {
          throw new Error('Failed to generate queryKey for request');
        }

        const state = getState();
        const queries = queriesSelector(state);

        const queriesState = queries[queryKey];
        const isPending = idx(queriesState, (_: any) => _.isPending);
        const status = idx(queriesState, (_: any) => _.status);
        const hasSucceeded = isStatusOk(status);

        if (force || !queriesState || (retry && !isPending && !hasSucceeded)) {
          returnValue = new Promise<ActionPromiseValue>(resolve => {
            const start = new Date();
            const { method = httpMethods.GET as HttpMethod } = options;
            let attempts = 0;
            const backoff = new Backoff({
              min: config.backoff.minDuration,
              max: config.backoff.maxDuration,
            });

            const attemptRequest = () => {
              const networkHandler = networkInterface(url, method, {
                body,
                headers: options.headers,
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
                  config.retryableStatusCodes.includes(status) &&
                  attempts < config.backoff.maxAttempts
                ) {
                  // TODO take into account Retry-After header if 503
                  setTimeout(attemptRequest, backoff.duration());
                  return;
                }

                const end = new Date();
                const duration = +end - +start;
                let transformed;
                let newEntities;

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
      case actionTypes.CANCEL_QUERY: {
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
