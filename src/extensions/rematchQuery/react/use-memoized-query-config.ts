import * as React from 'react';
import { getQueryKey } from '../lib/query-key';
import { QueryConfig } from '../types';

const identity = (x: any):any => x;

/**
 * Other hooks are guaranteed to only receive a new Redux action if and only if the query key of
 * the provided queryConfig changes.
 */
const useMemoizedQueryConfig = (
  providedQueryConfig?: QueryConfig | undefined,
  transform: (queryConfig?: QueryConfig | undefined) => QueryConfig | undefined = identity,
): QueryConfig | undefined => {
  const [queryConfig, setQueryConfig] = React.useState(
    providedQueryConfig ? transform(providedQueryConfig) : undefined,
  );
  const previousQueryKey = React.useRef(getQueryKey(providedQueryConfig));

  React.useEffect(() => {
    const queryKey = getQueryKey(providedQueryConfig);

    if (queryKey !== previousQueryKey.current) {
      previousQueryKey.current = queryKey;
      setQueryConfig(providedQueryConfig ? transform(providedQueryConfig) : undefined);
    }
  }, [providedQueryConfig, transform]);

  return queryConfig;
};

export default useMemoizedQueryConfig;