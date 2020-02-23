import * as React from 'react';
import { useSelector } from 'react-redux';
import * as mutationSelectors from '../selectors/mutation';
import { MutationState, MutationConfig } from '../types';
import Config from '../config'

const useMutationState = (queryConfig?: MutationConfig | undefined): MutationState => {

  const { mutationsSelector } = Config;

  const isPending = useSelector(state =>
    mutationSelectors.isPending(mutationsSelector(state), queryConfig),
  );

  const isFinished = useSelector(state =>
    mutationSelectors.isFinished(mutationsSelector(state), queryConfig),
  );

  const isInvalid = useSelector(state =>
    mutationSelectors.isInvalid(mutationsSelector(state), queryConfig),
  );

  const status = useSelector(state => 
    mutationSelectors.status(mutationsSelector(state), queryConfig)
  );

  const headers = useSelector(state => 
    mutationSelectors.headers(mutationsSelector(state), queryConfig)
  );

  const lastUpdated = useSelector(state =>
    mutationSelectors.lastUpdated(mutationsSelector(state), queryConfig)
  );

  const requestCount = useSelector(state =>
    mutationSelectors.requestCount(mutationsSelector(state), queryConfig)
  );

  const isError = useSelector(state =>
    mutationSelectors.isError(mutationsSelector(state), queryConfig)
  );

  const error = useSelector(state =>
    mutationSelectors.error(mutationsSelector(state), queryConfig)
  );

  const payload = useSelector(state =>
    mutationSelectors.payload(mutationsSelector(state), queryConfig)
  );

  const mutationState = React.useMemo(
    () => ({
      isPending,
      isFinished,
      isInvalid,
      isError,
      status,
      headers,
      lastUpdated,
      requestCount,
      error,
      payload
    }),
    [headers, payload, isFinished, isPending, isInvalid, isError, lastUpdated, status, error],
  );

  return mutationState;
};

export default useMutationState;