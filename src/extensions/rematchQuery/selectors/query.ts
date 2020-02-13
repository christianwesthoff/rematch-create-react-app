import idx from 'idx';

import { State as QueriesState } from '../reducers/queries';
import { getQueryKey } from '../lib/query-key';
import { QueryConfig } from '../types';

export const isFinished = (
  queriesState: QueriesState,
  queryConfig?: QueryConfig | undefined,
): boolean => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return false;
  }

  return idx(queriesState, (_: any) => _[queryKey].isFinished) || false;
};

export const isInvalid = (
  queriesState: QueriesState,
  queryConfig?: QueryConfig | undefined,
): boolean => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return false;
  }

  return idx(queriesState, (_: any) => _[queryKey].isInvalid) || false;
};

export const isPending = (
  queriesState: QueriesState,
  queryConfig?: QueryConfig | undefined,
): boolean => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return false;
  }

  return idx(queriesState, (_: any) => _[queryKey].isPending) || false;
};

export const status = (
  queriesState: QueriesState,
  queryConfig?: QueryConfig | undefined,
): number | undefined => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return undefined;
  }

  return idx(queriesState, (_: any) => _[queryKey].status);
};

export const headers = (
  queriesState: QueriesState,
  queryConfig?: QueryConfig | undefined,
): { [key: string]: any } | undefined => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return undefined;
  }

  return idx(queriesState, (_: any) => _[queryKey].headers);
};

export const lastUpdated = (
  queriesState: QueriesState,
  queryConfig?: QueryConfig | undefined,
): number | undefined => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return undefined;
  }

  return idx(queriesState, (_: any) => _[queryKey].lastUpdated);
};

export const queryCount = (
  queriesState: QueriesState,
  queryConfig?: QueryConfig | undefined,
): number => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return 0;
  }

  return idx(queriesState, (_: any) => _[queryKey].queryCount) || 0;
};
