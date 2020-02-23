import idx from 'idx';

import { State as QueriesState } from '../reducers/queries';
import { getRequestKey } from '../lib/request-key';
import { QueryConfig, Maps } from '../types';

export const isFinished = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): boolean => {
  const requestKey = getRequestKey(config);

  if (!requestKey) {
    return false;
  }

  return idx(state, (_: any) => _[requestKey].isFinished) || false;
};

export const isInvalid = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): boolean => {
  const requestKey = getRequestKey(config);

  if (!requestKey) {
    return false;
  }

  return idx(state, (_: any) => _[requestKey].isInvalid) || false;
};

export const error = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): any => {
  const requestKey = getRequestKey(config);

  if (!requestKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[requestKey].error) || undefined;
};

export const isError = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): boolean => {
  const requestKey = getRequestKey(config);

  if (!requestKey) {
    return false;
  }

  return idx(state, (_: any) => _[requestKey].isError) || false;
};

export const maps = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): Maps | undefined => {
  const requestKey = getRequestKey(config);

  if (!requestKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[requestKey].maps) || false;
};

export const isPending = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): boolean => {
  const requestKey = getRequestKey(config);

  if (!requestKey) {
    return false;
  }

  return idx(state, (_: any) => _[requestKey].isPending) || false;
};

export const status = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): number | undefined => {
  const requestKey = getRequestKey(config);

  if (!requestKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[requestKey].status);
};

export const headers = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): { [key: string]: any } | undefined => {
  const requestKey = getRequestKey(config);

  if (!requestKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[requestKey].headers);
};

export const lastUpdated = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): number | undefined => {
  const requestKey = getRequestKey(config);

  if (!requestKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[requestKey].lastUpdated);
};

export const requestCount = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): number => {
  const requestKey = getRequestKey(config);

  if (!requestKey) {
    return 0;
  }

  return idx(state, (_: any) => _[requestKey].requestCount) || 0;
};

export const invalidCount = (
  state: QueriesState,
  config?: QueryConfig | undefined,
): number => {
  const requestKey = getRequestKey(config);

  if (!requestKey) {
    return 0;
  }

  return idx(state, (_: any) => _[requestKey].invalidCount) || 0;
};