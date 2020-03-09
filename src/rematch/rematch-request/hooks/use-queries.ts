import * as React from 'react';
import { useDispatch } from 'react-redux';
import { queryAsync, cancelQuery } from '../actions';

import { QueryConfig, RequestKey, ExtractStateFromQueriesConfig } from '../types';

import useConstCallback from './use-const-callback';
import useMemoizedQueryConfigs from './use-memoized-query-configs';
import useQueriesState from './use-queries-state';
import { QueriesState } from '../types';
import { getQueryKey } from '../lib/keys';
import { reselectEntityStateFromQueryState } from '../lib/reselect';

const diff = <T>(a: Array<T>, b: Array<T>): Array<T> => {
  const bSet = new Set(b);
  return a.filter(x => !bSet.has(x));
};

const calcUpDownQueryConfigs = (
  invalidQueryConfigs?: Array<RequestKey | undefined> | undefined,
  prevQueryConfigs?: Array<QueryConfig | undefined> | undefined,
  queryConfigs?: Array<QueryConfig | undefined> | undefined,
) => {
    if (!prevQueryConfigs || !queryConfigs || !invalidQueryConfigs) return undefined;
    const prevQueryKeys = prevQueryConfigs.map(config => getQueryKey(config));
    const queryKeys = queryConfigs.map(config => getQueryKey(config));
    const queryConfigByQueryKey = queryKeys.reduce((acc, curr, i) => {
        const queryConfig = queryConfigs[i];
        if (queryConfig) {
            acc.set(curr, queryConfig);
        }
        return acc;
    }, new Map());

    // Keys that existed before that no longer exist, should be subject to cancellation
    const cancelKeys = diff(prevQueryKeys, queryKeys);

    const prevInvalidKeys = prevQueryKeys.filter(key => !invalidQueryConfigs.includes(key));

    // Keys that are new or invalid, should be subject to a new request
    const requestKeys = diff(queryKeys, prevInvalidKeys);
    const requestQueryConfigs = requestKeys
      .map(queryKey => queryConfigByQueryKey.get(queryKey)) as Array<QueryConfig | undefined> | undefined;

    return { cancelKeys, requestQueryConfigs };
};

const useQueries = <TQueryConfigs extends Array<QueryConfig>>(
  providedQueryConfigs?: TQueryConfigs | undefined,
): [QueriesState, () => void, (state: any) => ExtractStateFromQueriesConfig<TQueryConfigs>] => {
  const reduxDispatch = useDispatch();

  const previousQueryConfigs = React.useRef<Array<QueryConfig | undefined> | undefined>([]);

  // This hook manually tracks the pending state, which is synchronized as precisely as possible
  // with the Redux state. This may seem a little hacky, but we're trying to avoid any asynchronous
  // synchronization. Hence why the pending state here is using a ref and it is updated via a
  // synchronous callback, which is called from the redux-query query middleware.
  const pendingRequests = React.useRef<Set<RequestKey>>(new Set());

  // These "const callbacks" are memoized across re-renders. Unlike useCallback, useConstCallback
  // guarantees memoization, which is relied upon elsewhere in this hook to explicitly control when
  // certain side effects occur.
  const dispatchRequestToRedux = useConstCallback((queryConfig?: QueryConfig | undefined) => {
    
    if (!queryConfig) return undefined;

    const promise = reduxDispatch(queryAsync(queryConfig));

    if (promise) {
      const queryKey = getQueryKey(queryConfig);

      if (queryKey) {
        pendingRequests.current.add(queryKey);
      }
    }
  });

  const dispatchCancelToRedux = useConstCallback((queryKey: RequestKey) => {
    if (pendingRequests.current.has(queryKey)) {
      reduxDispatch(cancelQuery(queryKey));
      pendingRequests.current.delete(queryKey);
    }
  });

  const finishedCallback = useConstCallback((queryKey: RequestKey) => {
    return () => {
      if (queryKey != null) {
        pendingRequests.current.delete(queryKey);
      }
    };
  });

  const transformQueryConfig = useConstCallback(
    (queryConfig?: QueryConfig | undefined): QueryConfig | undefined => {
        if (!queryConfig) return undefined;
        const queryKey = getQueryKey(queryConfig);
        if (!queryKey) return undefined;
        return {
            ...queryConfig,
            preDispatchCallback: finishedCallback(queryKey),
            retry: true,
        };
    }
  );

  // Query configs are memoized based on query key. As long as the query keys in the list don't
  // change, the query config list won't change.
  const queryConfigs = useMemoizedQueryConfigs(providedQueryConfigs, transformQueryConfig);

  const queriesState = useQueriesState(queryConfigs);

  const { invalidCount, invalidState, combinedMaps } = queriesState;

  const refresh = React.useCallback(() => {
    if (queryConfigs) {
        queryConfigs.forEach(requestReduxAction => {
            if (requestReduxAction) {
                dispatchRequestToRedux({
                    ...requestReduxAction,
                    force: true,
                });
            }
        });
    }
  }, [dispatchRequestToRedux, queryConfigs]);

  const invalidStateRef = React.useRef<Array<string | undefined>>([]);
  invalidStateRef.current = invalidState;

  React.useEffect(() => {
    // Whenever the list of query configs change, we need to manually diff the query configs
    // against the previous list of query configs. Whatever was there and is no longer, will be
    // cancelled. Whatever is new, will turn into a request.
    const upDownDiff = calcUpDownQueryConfigs(
      invalidStateRef.current,
      previousQueryConfigs.current,
      queryConfigs,
    );

    if (!upDownDiff) return;
    const { cancelKeys, requestQueryConfigs } = upDownDiff;
    
    if (!requestQueryConfigs) return;

    requestQueryConfigs.forEach(r => dispatchRequestToRedux(r));
    cancelKeys.forEach((queryKey: any) => dispatchCancelToRedux(queryKey));

    previousQueryConfigs.current = queryConfigs;
  }, [dispatchCancelToRedux, dispatchRequestToRedux, queryConfigs, invalidCount]);

  // When the component unmounts, cancel all pending requests
  React.useEffect(() => {
    const dep = pendingRequests.current;
    return () => {
        Array.from(dep).forEach(dispatchCancelToRedux);
    };
  }, [dispatchCancelToRedux]);

  const reselect = reselectEntityStateFromQueryState<any, ExtractStateFromQueriesConfig<TQueryConfigs>>(combinedMaps);
  return [queriesState, refresh, reselect];
};

export default useQueries;