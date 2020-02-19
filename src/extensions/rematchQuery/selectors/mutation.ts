import idx from 'idx';

import { State as MutationsState } from '../reducers/mutations';
import { getRequestKey } from '../lib/request-key';
import { MutationConfig } from '../types';

export const isFinished = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): boolean => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return false;
  }

  return idx(state, (_: any) => _[queryKey].isFinished) || false;
};

export const isInvalid = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): boolean => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return false;
  }

  return idx(state, (_: any) => _[queryKey].isInvalid) || false;
};

export const error = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): any => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[queryKey].error) || undefined;
};

export const isError = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): boolean => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return false;
  }

  return idx(state, (_: any) => _[queryKey].isError) || false;
};

export const isPending = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): boolean => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return false;
  }

  return idx(state, (_: any) => _[queryKey].isPending) || false;
};

export const status = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): number | undefined => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[queryKey].status);
};

export const headers = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): { [key: string]: any } | undefined => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[queryKey].headers);
};

export const lastUpdated = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): number | undefined => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[queryKey].lastUpdated);
};

export const payload = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): any => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[queryKey].payload);
};

export const requestCount = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): number => {
  const queryKey = getRequestKey(config);

  if (!queryKey) {
    return 0;
  }

  return idx(state, (_: any) => _[queryKey].requestCount) || 0;
};