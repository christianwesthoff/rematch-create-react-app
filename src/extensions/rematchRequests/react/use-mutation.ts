import React from 'react';
import { useDispatch } from 'react-redux';
import { requestAsync, cancelRequst } from '../actions';
import { getRequestKey } from '../lib/request-key';
import { QueryConfig, RequestKey, MutationState, MutationConfig } from '../types';

import useConstCallback from './use-const-callback';

import useMutationState from './use-mutation-state';
import useMemoizedMutationConfig from './use-memoized-mutation-config';

const useMutation = <TMutationConfig extends MutationConfig>(
  providedMutationConfig?: TMutationConfig,
): [MutationState, any] => {
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
  const transformMutationConfig = useConstCallback(
    (queryConfig?: MutationConfig | undefined): MutationConfig | undefined => {
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
  const mutationConfig = useMemoizedMutationConfig(providedMutationConfig, transformMutationConfig);


  // const isInvalid = queryState ? queryState.isInvalid : false
  const dispatchRequestToRedux = useConstCallback((queryConfig: QueryConfig) => {
    const promise = reduxDispatch(requestAsync(queryConfig));

    // If a promise is not returned, we know that the query middleware ignored this request and
    // one will not be made, so don't consider it as "pending".
    if (promise) {
      isPendingRef.current = true;
    }

    return promise;
  });

  const dispatchCancelToRedux = useConstCallback((requestKey: RequestKey) => {
    reduxDispatch(cancelRequst(requestKey));
    isPendingRef.current = false;
  });


  // This is an object that contains metadata about the query, like things from querySelectors
  // (e.g.`isPending`, `queryCount`, etc.)
  const mutationState = useMutationState(mutationConfig);

  React.useEffect(() => {
    // Dispatch `requestAsync` actions whenever the query config (note: memoized based on query
    // key) changes.

    if (mutationConfig) {
      dispatchRequestToRedux(mutationConfig);
    }

    return () => {
      // If there is an pending request whenever the component unmounts of the query config
      // changes, cancel the pending request.
      if (isPendingRef.current) {
        const requestKey = getRequestKey(mutationConfig);

        if (requestKey) {
          dispatchCancelToRedux(requestKey);
        }
      }
    };
  
  }, [dispatchCancelToRedux, dispatchRequestToRedux, mutationConfig]);

  const { payload, ...requestProps } = mutationState;
  return [requestProps, payload];
};

export default useMutation;