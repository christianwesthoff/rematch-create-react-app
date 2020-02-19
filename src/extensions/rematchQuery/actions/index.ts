import * as actionTypes from '../constants/action-types';

import {
  Duration,
  Entities,
  Meta,
  QueryConfig,
  QueryKey,
  RequestBody,
  ResponseBody,
  ResponseHeaders,
  ResponseText,
  Status,
  Update,
  Url,
  QueryPattern,
  Maps,
  QueryUrl,
} from '../types';

type RequestStartParams = {
  body: RequestBody;
  meta?: Meta | undefined;
  queryKey: QueryKey;
  url: Url;
};

type RequestStartAction = {
  type: '@@query/REQUEST_START';
} & RequestStartParams;

export const requestStart = ({
  body,
  meta,
  queryKey,
  url,
}: RequestStartParams): RequestStartAction => {
  return {
    type: actionTypes.REQUEST_START,
    url,
    body,
    meta,
    queryKey,
  };
};

type RequestSuccessParams = {
  body: RequestBody;
  duration: Duration;
  maps: Maps;
  entities: Entities;
  meta?: Meta | undefined;
  responseBody?: ResponseBody | undefined;
  responseHeaders?: ResponseHeaders | undefined;
  responseText?: ResponseText | undefined;
  queryKey: QueryKey;
  status: Status;
  url: Url;
};

type RequestSuccessAction = {
  type: '@@query/REQUEST_SUCCESS';
  time: number;
} & RequestSuccessParams;

export const requestSuccess = ({
  body,
  duration,
  maps,
  entities,
  meta,
  queryKey,
  responseBody,
  responseHeaders,
  responseText,
  status,
  url,
}: RequestSuccessParams): RequestSuccessAction => {
  return {
    type: actionTypes.REQUEST_SUCCESS,
    url,
    body,
    duration,
    status,
    maps,
    entities,
    responseBody,
    responseText,
    responseHeaders,
    meta,
    queryKey,
    time: Date.now(),
  };
};

type RequestFailureParams = {
  body: RequestBody;
  duration: Duration;
  meta?: Meta | undefined;
  responseBody?: ResponseBody | undefined;
  responseHeaders?: ResponseHeaders | undefined;
  responseText?: ResponseText | undefined;
  queryKey: QueryKey;
  status: Status;
  url: Url;
};

type RequestFailureAction = {
  type: '@@query/REQUEST_FAILURE';
  time: number;
} & RequestFailureParams;

export const requestFailure = ({
  body,
  duration,
  meta,
  queryKey,
  responseBody,
  responseHeaders,
  responseText,
  status,
  url,
}: RequestFailureParams): RequestFailureAction => {
  return {
    type: actionTypes.REQUEST_FAILURE,
    url,
    body,
    duration,
    status,
    responseBody,
    responseText,
    responseHeaders,
    meta,
    queryKey,
    time: Date.now(),
  };
};

type RequestAsyncAction = {
  type: '@@query/REQUEST_ASYNC';
} & QueryConfig;

export const requestAsync = ({
  body,
  force,
  meta,
  options,
  queryKey,
  retry,
  transform,
  update,
  map,
  url,
  // /* eslint-disable-next-line @typescript-eslint/camelcase */
  unstable_preDispatchCallback,
}: QueryConfig): RequestAsyncAction => {
  return {
    type: actionTypes.REQUEST_ASYNC,
    body,
    force,
    queryKey,
    meta,
    options,
    retry,
    transform,
    update,
    map,
    url,
    // /* eslint-disable-next-line @typescript-eslint/camelcase */
    unstable_preDispatchCallback,
  };
};

type InvalidateQueryAction = {
  type: '@@query/INVALIDATE_QUERY';
  queryPattern?: QueryPattern | undefined;
  queryKey?: QueryKey | undefined;
  queryUrl?: QueryUrl | undefined;
};

export const invalidateQueryConfig = (queryKey: QueryKey): InvalidateQueryAction => {
  return {
    type: actionTypes.INVALIDATE_QUERY,
    queryKey,
  };
};

export const invalidateQueryPattern = (queryPattern: QueryPattern): InvalidateQueryAction => {
  return {
    type: actionTypes.INVALIDATE_QUERY,
    queryPattern,
  };
};

export const invalidateQueryUrl = (queryUrl: QueryUrl): InvalidateQueryAction => {
  return {
    type: actionTypes.INVALIDATE_QUERY,
    queryUrl,
  };
};

type CancelQueryAction = {
  type: '@@query/CANCEL_QUERY';
  queryKey?: QueryKey | undefined;
};

export const cancelQuery = (queryKey: QueryKey): CancelQueryAction => {
  return {
    type: actionTypes.CANCEL_QUERY,
    queryKey,
  };
};

type UpdateEntitiesAction = {
  type: '@@query/UPDATE_ENTITIES';
  update: Update;
};

export const updateEntities = (update: Update): UpdateEntitiesAction => {
  return {
    type: actionTypes.UPDATE_ENTITIES,
    update,
  };
};

type ResetParams = {
  entities: Entities;
};

type ResetAction = {
  type: '@@query/RESET';
  entities: Entities;
};

export const reset = ({ entities }: ResetParams): ResetAction => {
  return {
    type: actionTypes.RESET,
    entities,
  };
};

export type PublicAction =
  | RequestAsyncAction
  | CancelQueryAction
  | UpdateEntitiesAction
  | ResetAction
  | InvalidateQueryAction;

export type Action =
  | PublicAction
  | RequestStartAction
  | RequestSuccessAction
  | RequestFailureAction
  | InvalidateQueryAction;
