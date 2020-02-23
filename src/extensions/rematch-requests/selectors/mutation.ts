import idx from 'idx';

import { State as MutationsState } from '../reducers/mutations';
import { getMutationKey } from '../lib/request-key';
import { MutationConfig } from '../types';

export const isFinished = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): boolean => {
  const requestKey = getMutationKey(config);

  if (!requestKey) {
    return false;
  }

  return idx(state, (_: any) => _[requestKey].isFinished) || false;
};

export const isInvalid = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): boolean => {
  const requestKey = getMutationKey(config);

  if (!requestKey) {
    return false;
  }

  return idx(state, (_: any) => _[requestKey].isInvalid) || false;
};

export const error = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): any => {
  const requestKey = getMutationKey(config);

  if (!requestKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[requestKey].error) || undefined;
};

export const isError = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): boolean => {
  const requestKey = getMutationKey(config);

  if (!requestKey) {
    return false;
  }

  return idx(state, (_: any) => _[requestKey].isError) || false;
};

export const isPending = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): boolean => {
  const requestKey = getMutationKey(config);

  if (!requestKey) {
    return false;
  }

  return idx(state, (_: any) => _[requestKey].isPending) || false;
};

export const status = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): number | undefined => {
  const requestKey = getMutationKey(config);

  if (!requestKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[requestKey].status);
};

export const headers = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): { [key: string]: any } | undefined => {
  const requestKey = getMutationKey(config);

  if (!requestKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[requestKey].headers);
};

export const lastUpdated = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): number | undefined => {
  const requestKey = getMutationKey(config);

  if (!requestKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[requestKey].lastUpdated);
};

export const payload = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): any => {
  const requestKey = getMutationKey(config);

  if (!requestKey) {
    return undefined;
  }

  return idx(state, (_: any) => _[requestKey].payload);
};

export const requestCount = (
  state: MutationsState,
  config?: MutationConfig | undefined,
): number => {
  const requestKey = getMutationKey(config);

  if (!requestKey) {
    return 0;
  }

  return idx(state, (_: any) => _[requestKey].requestCount) || 0;
};