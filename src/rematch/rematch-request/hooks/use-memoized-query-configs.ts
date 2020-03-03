import * as React from 'react';
import { getQueryKey } from '../lib/keys';

import { QueryConfig, RequestKey } from '../types';

const identity = (x: any) => x;

/**
 * This hook memoizes the list of query configs that are returned form the `mapPropsToConfigs`
 * function. It also transforms the query configs to set `retry` to `true` and pass a
 * synchronous callback to track pending state.
 *
 * `mapPropsToConfigs` may return null, undefined, a single query config,
 * or a list of query configs. null and undefined values are ignored, and single query configs are
 * normalized to be lists.
 *
 * Memoization is handled by comparing query keys. If the list changes in size, or any query config
 * in the list's query key changes, an entirely new list of query configs is returned.
 */

const useMemoizedQueryConfigs = (
  providedQueryConfigs?: Array<QueryConfig | undefined> | undefined,
  transform: (queryConfig?: QueryConfig) => QueryConfig | undefined = identity,
): Array<QueryConfig | undefined> | undefined => {
  const queryConfigs = providedQueryConfigs
    ? providedQueryConfigs
        .map(
          (queryConfig?: QueryConfig | undefined): QueryConfig | undefined=> {
            const queryKey = getQueryKey(queryConfig);

            if (queryKey) {
              return transform(queryConfig);
            }
          },
        )
    : [];
  const [memoizedQueryConfigs, setMemoizedQueryConfigs] = React.useState(queryConfigs);
  const previousQueryKeys = React.useRef<Array<RequestKey | undefined>>(
    queryConfigs.map(getQueryKey),
  );

  React.useEffect(() => {
    const queryKeys = queryConfigs.map(getQueryKey);

    if (
      queryKeys.length !== previousQueryKeys.current.length ||
      queryKeys.some((queryKey, i) => previousQueryKeys.current[i] !== queryKey)
    ) {
      previousQueryKeys.current = queryKeys;
      setMemoizedQueryConfigs(queryConfigs);
    }
  }, [queryConfigs]);

  return memoizedQueryConfigs;
};

export default useMemoizedQueryConfigs;