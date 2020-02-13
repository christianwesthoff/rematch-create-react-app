import stringify from 'fast-json-stable-stringify';

import { QueryKeyGetter } from '../types';

export const getQueryKey: QueryKeyGetter = queryConfig => {
  if (!queryConfig) {
    return undefined;
  }

  const { url, body, queryKey } = queryConfig;

  if (queryKey !== null && queryKey !== undefined) {
    return queryKey;
  } else {
    return stringify({ url, body }) as string;
  }
};
