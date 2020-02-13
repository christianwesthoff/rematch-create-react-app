import idx from 'idx';

import { State as ErrorsState } from '../reducers/errors';
import { getQueryKey } from '../lib/query-key';
import { QueryConfig } from '../types';

export const responseBody = (
  errorsState: ErrorsState,
  queryConfig: QueryConfig,
): { [key: string]: any } | undefined => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return undefined;
  }

  return idx(errorsState, (_: any) => _[queryKey].responseBody);
};

export const responseText = (
  errorsState: ErrorsState,
  queryConfig: QueryConfig,
): string | undefined => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return undefined;
  }

  return idx(errorsState, (_: any) => _[queryKey].responseText);
};

export const responseHeaders = (
  errorsState: ErrorsState,
  queryConfig: QueryConfig,
): { [key: string]: any } | undefined => {
  const queryKey = getQueryKey(queryConfig);

  if (!queryKey) {
    return undefined;
  }

  return idx(errorsState, (_: any) => _[queryKey].responseHeaders);
};
