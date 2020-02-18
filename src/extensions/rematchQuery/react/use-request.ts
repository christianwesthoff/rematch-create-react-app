import * as React from 'react';
import { useDispatch } from 'react-redux';
import { requestAsync, cancelQuery } from '../actions';
import { getQueryKey } from '../lib/query-key';
import { QueryConfig, QueryKey } from '../types';

import useConstCallback from './use-const-callback';
import useMemoizedQueryConfig from './use-memoized-query-config';
import useQueryState from './use-query-state';
import useWatcher from './use-watcher';

import { QueryState } from '../types';
import useEntityState from './use-entity-state';

const useRequest = (
  providedQueryConfig?: QueryConfig | undefined,
): [QueryState | undefined, any] => {
  const reduxDispatch = useDispatch();

  // This hook manually tracks the pending state, which is synchronized as precisely as possible
  // with the Redux state. This may seem a little hacky, but we're trying to avoid any asynchronous
  // synchronization. Hence why the pending state here is using a ref and it is updated via a
  // synchronous callback, which is called from the redux-query query middleware.
  const isPendingRef = React.useRef(false);

  // These "const callbacks" are memoized across re-renders. Unlike useCallback, useConstCallback
  // guarantees memoization, which is relied upon elsewhere in this hook to explicitly control when
  // certain side effects occur.
  const finishedCallback = useConstCallback(() => {
    isPendingRef.current = false;
  });

  // Setting `retry` to `true` for these query configs makes it so that when this query config is
  // passed to a requestAsync action, if a previous request with the same query key failed, it will
  // retry the request (if `retry` is `false`, then it would essentially ignore the action).
  const transformQueryConfig = useConstCallback(
    (queryConfig?: QueryConfig | undefined): QueryConfig | undefined => {
        if (queryConfig) {
            return {
                ...queryConfig,
                unstable_preDispatchCallback: finishedCallback,
                retry: true,
              };
        }
        return undefined;
    },
  );

  // Query configs are memoized based on query key. As long as the query key doesn't change, the
  // query config won't change.
  const queryConfig = useMemoizedQueryConfig(providedQueryConfig, transformQueryConfig);

  // This is an object that contains metadata about the query, like things from querySelectors
  // (e.g.`isPending`, `queryCount`, etc.)
  const queryState = useQueryState(queryConfig);

  const dispatchRequestToRedux = useConstCallback((queryConfig: QueryConfig) => {
    const promise = reduxDispatch(requestAsync(queryConfig));

    // If a promise is not returned, we know that the query middleware ignored this request and
    // one will not be made, so don't consider it as "pending".
    if (promise) {
      isPendingRef.current = true;
    }

    return promise;
  });

  const dispatchCancelToRedux = useConstCallback((queryKey: QueryKey) => {
    reduxDispatch(cancelQuery(queryKey));
    isPendingRef.current = false;
  });

//   const forceRequest = React.useCallback(() => {
//     if (queryConfig) {
//       return dispatchRequestToRedux({
//         ...queryConfig,
//         force: true,
//       });
//     }
//   }, [dispatchRequestToRedux, queryConfig]);


  const entities = useEntityState(queryState, queryConfig);

  // Trigger change also if query is invalid
  const invalidQueryStateWatcher = useWatcher(queryState ? queryState.isInvalid : false, true);

  React.useEffect(() => {
    // Dispatch `requestAsync` actions whenever the query config (note: memoized based on query
    // key) changes.
    if (queryConfig) {
      dispatchRequestToRedux(queryConfig);
    }

    return () => {
      // If there is an pending request whenever the component unmounts of the query config
      // changes, cancel the pending request.
      if (isPendingRef.current) {
        const queryKey = getQueryKey(queryConfig);

        if (queryKey) {
          dispatchCancelToRedux(queryKey);
        }
      }
    };
  
  }, [dispatchCancelToRedux, dispatchRequestToRedux, queryConfig, invalidQueryStateWatcher]);

  return [queryState, entities];
};

export default useRequest;