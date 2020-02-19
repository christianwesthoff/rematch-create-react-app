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
  queryKey: RequestKey;
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
  queryKey: RequestKey;
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
  queryKey: RequestKey;
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
  requestKey: queryKey,
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
    requestKey: queryKey,
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
  queryKey: RequestKey;
  url: Url;
};

type MutateStartAction = {
  type: '@@query/MUTATE_START';
} & MutateStartParams;

export const mutateStart = ({
  body,
  meta,
  queryKey,
  url,
}: MutateStartParams): MutateStartAction => {
  return {
    type: actionTypes.MUTATE_START,
    url,
    body,
    queryKey,
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
  queryKey: RequestKey;
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
  queryKey,
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
    queryKey,
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
  queryKey: RequestKey;
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
  queryKey,
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
    queryKey,
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
  requestKey: queryKey,
  url,
  triggerKeys,
  triggerPatterns
}: MutationConfig): MutateAsyncAction => {
  return {
    type: actionTypes.MUTATE_ASYNC,
    body,
    meta,
    options,
    requestKey: queryKey,
    url,
    triggerKeys,
    triggerPatterns
  };
};

type InvalidateRequestAction = {
  type: '@@query/INVALIDATE_REQUEST';
  queryPattern?: RequestPattern | undefined;
  queryKey?: RequestKey | undefined;
};

export const invalidateRequest = (queryKey: RequestKey): InvalidateRequestAction => {
  return {
    type: actionTypes.INVALIDATE_REQUEST,
    queryKey,
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
  queryKey?: RequestKey | undefined;
};

export const cancelRequst = (queryKey: RequestKey): CancelRequestAction => {
  return {
    type: actionTypes.CANCEL_REQUEST,
    queryKey,
  };
};

type CancelMutationAction = {
  type: '@@query/CANCEL_MUTATION';
  queryKey?: RequestKey | undefined;
};

export const CancelMutation = (queryKey: RequestKey): CancelMutationAction => {
  return {
    type: actionTypes.CANCEL_MUTATION,
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