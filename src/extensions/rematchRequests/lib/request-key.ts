import { RequestKeyGetter } from '../types';

export const getRequestKey: RequestKeyGetter = queryConfig => {
  if (!queryConfig) {
    return undefined;
  }

  const { url, requestKey } = queryConfig;

  if (requestKey !== null && requestKey !== undefined) {
    return requestKey;
  } else {
    return url;
  }
};
