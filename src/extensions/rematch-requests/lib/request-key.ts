import { RequestKeyGetter } from '../types';
import stringify from 'fast-json-stable-stringify';


export const getQueryKey: RequestKeyGetter = queryConfig => {
  if (!queryConfig) {
    return undefined;
  }

  const { url, body, requestKey } = queryConfig;

  if (requestKey !== null && requestKey !== undefined) {
    return requestKey;
  }
  return stringify({ url, body });
};

export const getMutationKey: RequestKeyGetter = queryConfig => {
  if (!queryConfig) {
    return undefined;
  }

  const { url, requestKey } = queryConfig;

  if (requestKey !== null && requestKey !== undefined) {
    return requestKey;
  }
  return stringify({ url });
};
