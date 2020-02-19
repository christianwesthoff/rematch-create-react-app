import * as React from 'react';
import { getRequestKey } from '../lib/request-key';
import { QueryConfig, MutationConfig } from '../types';

const identity = (x: any):any => x;

/**
 * Other hooks are guaranteed to only receive a new Redux action if and only if the reqeust key of
 * the provided mutationConfig changes.
 */
const useMemoizedMutationConfig = (
  providedMutationConfig?: MutationConfig | undefined,
  transform: (mutationConfig?: MutationConfig | undefined) => MutationConfig | undefined = identity,
): MutationConfig | undefined => {
  const [queryConfig, setQueryConfig] = React.useState(
    providedMutationConfig ? transform(providedMutationConfig) : undefined,
  );
  const previousrequestKey = React.useRef(getRequestKey(providedMutationConfig));

  React.useEffect(() => {
    const requestKey = getRequestKey(providedMutationConfig);

    if (requestKey !== previousrequestKey.current) {
      previousrequestKey.current = requestKey;
      setQueryConfig(providedMutationConfig ? transform(providedMutationConfig) : undefined);
    }
  }, [providedMutationConfig, transform]);

  return queryConfig;
};

export default useMemoizedMutationConfig;