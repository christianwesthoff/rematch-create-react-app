import * as React from 'react';
import { useSelector } from 'react-redux';
import * as querySelectors from '../selectors/query';
import { QueryState } from '../types';
import { QueryConfig } from '../types';
import Config from '../config'

const useQueryState = (queryConfig?: QueryConfig | undefined): QueryState | undefined=> {

  const { queriesSelector } = Config;

  const isPending = useSelector(state =>
    querySelectors.isPending(queriesSelector(state), queryConfig),
  );

  const isFinished = useSelector(state =>
    querySelectors.isFinished(queriesSelector(state), queryConfig),
  );

  const isInvalid = useSelector(state =>
    querySelectors.isInvalid(queriesSelector(state), queryConfig),
  );

  const maps = useSelector(state =>
    querySelectors.maps(queriesSelector(state), queryConfig),
  );

  const status = useSelector(state => 
    querySelectors.status(queriesSelector(state), queryConfig)
  );

  const headers = useSelector(state => 
    querySelectors.headers(queriesSelector(state), queryConfig)
  );

  const lastUpdated = useSelector(state =>
    querySelectors.lastUpdated(queriesSelector(state), queryConfig),
  );

  const queryCount = useSelector(state =>
    querySelectors.queryCount(queriesSelector(state), queryConfig),
  );

  const invalidCount = useSelector(state =>
    querySelectors.invalidCount(queriesSelector(state), queryConfig),
  );

  const queryState = React.useMemo(
    () => ({
      isPending,
      isFinished,
      isInvalid,
      invalidCount,
      status,
      headers,
      lastUpdated,
      queryCount,
      maps
    }),
    [headers, maps, isFinished, isPending, isInvalid, lastUpdated, queryCount, status, invalidCount],
  );

  return queryState;
};

export default useQueryState;