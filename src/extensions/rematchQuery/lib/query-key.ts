import { QueryKeyGetter } from '../types';

export const getQueryKey: QueryKeyGetter = queryConfig => {
  if (!queryConfig) {
    return undefined;
  }

  const { url, queryKey } = queryConfig;

  if (queryKey !== null && queryKey !== undefined) {
    return queryKey;
  } else {
    return url;
  }
};
