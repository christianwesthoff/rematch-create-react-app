import idx from 'idx';

import { State as QueriesState } from '../reducers/queries';
import { getRequestKey } from '../lib/request-key';
import { QueryConfig, Maps } from '../types';

export const isFinished = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): boolean => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return false;
  }

  return idx(state, (_: any) => _[queryKey].isFinished) || false;
};

export const isInvalid = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): boolean => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return false;
  }

  return idx(state, (_: any) => _[queryKey].isInvalid) || false;
};

export const error = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): any => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[queryKey].error) || undefined;
};

export const isError = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): boolean => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return false;
  }

  return idx(state, (_: any) => _[queryKey].isError) || false;
};

export const maps = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): Maps | undefined => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[queryKey].maps) || false;
};

export const isPending = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): boolean => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return false;
  }

  return idx(state, (_: any) => _[queryKey].isPending) || false;
};

export const status = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): number | undefined => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[queryKey].status);
};

export const headers = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): { [key: string]: any } | undefined => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[queryKey].headers);
};

export const lastUpdated = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): number | undefined => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[queryKey].lastUpdated);
};

export const requestCount = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): number => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return 0;
  }

  return idx(state, (_: any) => _[queryKey].requestCount) || 0;
};

export const invalidCount = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): number => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return 0;
  }

  return idx(state, (_: any) => _[queryKey].invalidCount) || 0;
};