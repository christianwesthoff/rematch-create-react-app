import * as React from 'react';
import { useSelector } from 'react-redux';
import * as mutationSelectors from '../selectors/mutation';
import { MutationState } from '../types';
import { QueryConfig } from '../types';
import Config from '../config'

const useMutationState = (queryConfig?: QueryConfig | undefined): MutationState => {

  const { mutationSelector } = Config;

  const isPending = useSelector(state =>
    mutationSelectors.isPending(mutationSelector(state), queryConfig),
  );

  const isFinished = useSelector(state =>
    mutationSelectors.isFinished(mutationSelector(state), queryConfig),
  );

  const isInvalid = useSelector(state =>
    mutationSelectors.isInvalid(mutationSelector(state), queryConfig),
  );

  const status = useSelector(state => 
    mutationSelectors.status(mutationSelector(state), queryConfig)
  );

  const headers = useSelector(state => 
    mutationSelectors.headers(mutationSelector(state), queryConfig)
  );

  const lastUpdated = useSelector(state =>
    mutationSelectors.lastUpdated(mutationSelector(state), queryConfig)
  );

  const requestCount = useSelector(state =>
    mutationSelectors.requestCount(mutationSelector(state), queryConfig)
  );

  const isError = useSelector(state =>
    mutationSelectors.isError(mutationSelector(state), queryConfig)
  );

  const error = useSelector(state =>
    mutationSelectors.error(mutationSelector(state), queryConfig)
  );

  const payload = useSelector(state =>
    mutationSelectors.payload(mutationSelector(state), queryConfig)
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