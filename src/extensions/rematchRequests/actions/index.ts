import * as actionTypes from '../constants/action-types';

import {
  Duration,
  Entities,
  Meta,
  QueryConfig,
  RequestKey,
  RequestBody,
  ResponseBody,
  ResponseHeaders,
  ResponseText,
  Status,
  Update,
  Url,
  RequestPattern,
  Maps,
  MutationConfig
} from '../types';

type RequestStartParams = {
  body: RequestBody;
  meta?: Meta | undefined;
  requestKey: RequestKey;
  url: Url;
};

type RequestStartAction = {
  type: '@@query/REQUEST_START';
} & RequestStartParams;

export const requestStart = ({
  body,
  meta,
  requestKey,
  url,
}: RequestStartParams): RequestStartAction => {
  return {
    type: actionTypes.REQUEST_START,
    url,
    body,
    meta,
    requestKey,
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
  requestKey: RequestKey;
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
  requestKey,
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
    requestKey,
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
  requestKey: RequestKey;
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
  requestKey,
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
    requestKey,
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
  requestKey,
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
    requestKey,
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

type MutateStartParams = {
  body: RequestBody;
  meta?: Meta | undefined;
  requestKey: RequestKey;
  url: Url;
};

type MutateStartAction = {
  type: '@@query/MUTATE_START';
} & MutateStartParams;

export const mutateStart = ({
  body,
  meta,
  requestKey,
  url,
}: MutateStartParams): MutateStartAction => {
  return {
    type: actionTypes.MUTATE_START,
    url,
    body,
    requestKey,
    meta,
  };
};

type MutateSuccessParams = {
  body: RequestBody;
  duration: Duration;
  meta?: Meta | undefined;
  responseBody?: ResponseBody | undefined;
  responseHeaders?: ResponseHeaders | undefined;
  responseText?: ResponseText | undefined;
  requestKey: RequestKey;
  status: Status;
  url: Url;
};

type MutateSuccessAction = {
  type: '@@query/MUTATE_SUCCESS';
  time: number;
} & MutateSuccessParams;

export const mutateSuccess = ({
  body,
  duration,
  meta,
  requestKey,
  responseBody,
  responseHeaders,
  responseText,
  status,
  url,
}: MutateSuccessParams): MutateSuccessAction => {
  return {
    type: actionTypes.MUTATE_SUCCESS,
    url,
    body,
    duration,
    status,
    responseBody,
    responseText,
    responseHeaders,
    requestKey,
    time: Date.now(),
    meta,
  };
};

type MutateFailureParams = {
  body: RequestBody;
  duration: Duration;
  meta?: Meta | undefined;
  responseBody?: ResponseBody | undefined;
  responseHeaders?: ResponseHeaders | undefined;
  responseText?: ResponseText | undefined;
  requestKey: RequestKey;
  status: Status;
  url: Url;
};

type MutateFailureAction = {
  type: '@@query/MUTATE_FAILURE';
  time: number;
} & MutateFailureParams;

export const mutateFailure = ({
  body,
  duration,
  meta,
  requestKey,
  responseBody,
  responseHeaders,
  responseText,
  status,
  url,
}: MutateFailureParams): MutateFailureAction => {
  return {
    type: actionTypes.MUTATE_FAILURE,
    url,
    body,
    duration,
    status,
    responseBody,
    responseText,
    responseHeaders,
    requestKey,
    time: Date.now(),
    meta,
  };
};

type MutateAsyncAction = {
  type: '@@query/MUTATE_ASYNC';
} & MutationConfig;

export const mutateAsync = ({
  body,
  meta,
  options,
  requestKey,
  url,
  triggerKeys,
  triggerPatterns
}: MutationConfig): MutateAsyncAction => {
  return {
    type: actionTypes.MUTATE_ASYNC,
    body,
    meta,
    options,
    requestKey,
    url,
    triggerKeys,
    triggerPatterns
  };
};

type InvalidateRequestAction = {
  type: '@@query/INVALIDATE_REQUEST';
  queryPattern?: RequestPattern | undefined;
  requestKey?: RequestKey | undefined;
};

export const invalidateRequest = (requestKey: RequestKey): InvalidateRequestAction => {
  return {
    type: actionTypes.INVALIDATE_REQUEST,
    requestKey,
  };
};

export const invalidateRequestByPattern = (queryPattern: RequestPattern): InvalidateRequestAction => {
  return {
    type: actionTypes.INVALIDATE_REQUEST,
    queryPattern,
  };
};

type CancelRequestAction = {
  type: '@@query/CANCEL_REQUEST';
  requestKey?: RequestKey | undefined;
};

export const cancelRequst = (requestKey: RequestKey): CancelRequestAction => {
  return {
    type: actionTypes.CANCEL_REQUEST,
    requestKey,
  };
};

type CancelMutationAction = {
  type: '@@query/CANCEL_MUTATION';
  requestKey?: RequestKey | undefined;
};

export const CancelMutation = (requestKey: RequestKey): CancelMutationAction => {
  return {
    type: actionTypes.CANCEL_MUTATION,
    requestKey,
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
  | CancelRequestAction
  | UpdateEntitiesAction
  | MutateAsyncAction
  | CancelMutationAction
  | ResetAction
  | InvalidateRequestAction;

export type Action =
  | PublicAction
  | RequestStartAction
  | RequestSuccessAction
  | RequestFailureAction
  | MutateStartAction
  | MutateSuccessAction
  | MutateFailureAction
  | InvalidateRequestAction;