import idx from 'idx';

import { State as QueriesState } from '../reducers/queries';
import { getQueryKey } from '../lib/query-key';
import { QueryConfig, Maps, MutationState } from '../types';

export const isFinished = (
  queriesState: MutationState,
  queryConfig?: QueryConfig | undefined,
): boolean => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return false;
  }

  return idx(queriesState, (_: any) => _[queryKey].isFinished) || false;
};

export const isInvalid = (
  queriesState: MutationState,
  queryConfig?: QueryConfig | undefined,
): boolean => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return false;
  }

  return idx(queriesState, (_: any) => _[queryKey].isInvalid) || false;
};

export const error = (
  queriesState: MutationState,
  queryConfig?: QueryConfig | undefined,
): any => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return undefined;
  }

  return idx(queriesState, (_: any) => _[queryKey].error) || undefined;
};

export const isError = (
  queriesState: MutationState,
  queryConfig?: QueryConfig | undefined,
): boolean => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return false;
  }

  return idx(queriesState, (_: any) => _[queryKey].isError) || false;
};

export const isPending = (
  queriesState: MutationState,
  queryConfig?: QueryConfig | undefined,
): boolean => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return false;
  }

  return idx(queriesState, (_: any) => _[queryKey].isPending) || false;
};

export const status = (
  queriesState: MutationState,
  queryConfig?: QueryConfig | undefined,
): number | undefined => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return undefined;
  }

  return idx(queriesState, (_: any) => _[queryKey].status);
};

export const headers = (
  queriesState: MutationState,
  queryConfig?: QueryConfig | undefined,
): { [key: string]: any } | undefined => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return undefined;
  }

  return idx(queriesState, (_: any) => _[queryKey].headers);
};

export const lastUpdated = (
  queriesState: MutationState,
  queryConfig?: QueryConfig | undefined,
): number | undefined => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return undefined;
  }

  return idx(queriesState, (_: any) => _[queryKey].lastUpdated);
};

export const payload = (
  queriesState: MutationState,
  queryConfig?: QueryConfig | undefined,
): any => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return undefined;
  }

  return idx(queriesState, (_: any) => _[queryKey].payload);
};

export const requestCount = (
  queriesState: MutationState,
  queryConfig?: QueryConfig | undefined,
): number => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return 0;
  }

  return idx(queriesState, (_: any) => _[queryKey].requestCount) || 0;
};