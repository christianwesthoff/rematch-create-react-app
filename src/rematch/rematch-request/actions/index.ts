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

type QueryStartParams = {
  body: RequestBody;
  meta?: Meta | undefined;
  requestKey: RequestKey;
  url: Url;
};

type QueryStartAction = {
  type: '@@request/QUERY_START';
} & QueryStartParams;

export const requestStart = ({
  body,
  meta,
  requestKey,
  url,
}: QueryStartParams): QueryStartAction => {
  return {
    type: actionTypes.QUERY_START,
    url,
    body,
    meta,
    requestKey,
  };
};

type QuerySuccessParams = {
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

type QuerySuccessAction = {
  type: '@@request/QUERY_SUCCESS';
  time: number;
} & QuerySuccessParams;

export const querySuccess = ({
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
}: QuerySuccessParams): QuerySuccessAction => {
  return {
    type: actionTypes.QUERY_SUCCESS,
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

type QueryFailureParams = {
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

type QueryFailureAction = {
  type: '@@request/QUERY_FAILURE';
  time: number;
} & QueryFailureParams;

export const queryFailure = ({
  body,
  duration,
  meta,
  requestKey,
  responseBody,
  responseHeaders,
  responseText,
  status,
  url,
}: QueryFailureParams): QueryFailureAction => {
  return {
    type: actionTypes.QUERY_FAILURE,
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

type QueryAsyncAction = {
  type: '@@request/QUERY_ASYNC';
} & QueryConfig;

export const queryAsync = ({
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
  preDispatchCallback,
  trigger
}: QueryConfig): QueryAsyncAction => {
  return {
    type: actionTypes.QUERY_ASYNC,
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
    preDispatchCallback,
    trigger
  };
};

type MutateStartParams = {
  body: RequestBody;
  meta?: Meta | undefined;
  requestKey: RequestKey;
  url: Url;
};

type MutateStartAction = {
  type: '@@request/MUTATE_START';
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
  type: '@@request/MUTATE_SUCCESS';
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
  type: '@@request/MUTATE_FAILURE';
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
  type: '@@request/MUTATE_ASYNC';
} & MutationConfig;

export const mutateAsync = ({
  body,
  meta,
  options,
  requestKey,
  url,
  trigger
}: MutationConfig): MutateAsyncAction => {
  return {
    type: actionTypes.MUTATE_ASYNC,
    body,
    meta,
    options,
    requestKey,
    url,
    trigger
  };
};


type ValidateQueryAction = {
  type: '@@request/VALIDATE_QUERY';
  queryPatterns: Array<RequestPattern>;
};

export const validateQuery = (queryPatterns: Array<RequestPattern>|RequestPattern): ValidateQueryAction => {
  const prepareQueryPatterns = Array.isArray(queryPatterns) ? queryPatterns : [queryPatterns]
  return {
    type: actionTypes.VALIDATE_QUERY,
    queryPatterns: prepareQueryPatterns,
  };
};

type InvalidateQueryAction = {
  type: '@@request/INVALIDATE_QUERY';
  queryPatterns: Array<RequestPattern>;
};

export const invalidateQuery = (queryPatterns: Array<RequestPattern>|RequestPattern): InvalidateQueryAction => {
  const prepareQueryPatterns = Array.isArray(queryPatterns) ? queryPatterns : [queryPatterns]
  return {
    type: actionTypes.INVALIDATE_QUERY,
    queryPatterns: prepareQueryPatterns,
  };
};

type CancelRequestAction = {
  type: '@@request/CANCEL_QUERY';
  requestKey?: RequestKey | undefined;
};

export const cancelQuery = (requestKey: RequestKey): CancelRequestAction => {
  return {
    type: actionTypes.CANCEL_QUERY,
    requestKey,
  };
};

type CancelMutationAction = {
  type: '@@request/CANCEL_MUTATION';
  requestKey?: RequestKey | undefined;
};

export const CancelMutation = (requestKey: RequestKey): CancelMutationAction => {
  return {
    type: actionTypes.CANCEL_MUTATION,
    requestKey,
  };
};

type UpdateEntitiesAction = {
  type: '@@request/UPDATE_ENTITIES';
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
  type: '@@request/RESET';
  entities: Entities;
};

export const reset = ({ entities }: ResetParams): ResetAction => {
  return {
    type: actionTypes.RESET,
    entities,
  };
};

export type PublicAction =
  | QueryAsyncAction
  | CancelRequestAction
  | UpdateEntitiesAction
  | MutateAsyncAction
  | CancelMutationAction
  | ResetAction
  | ValidateQueryAction
  | InvalidateQueryAction;

export type Action =
  | PublicAction
  | QueryStartAction
  | QuerySuccessAction
  | QueryFailureAction
  | MutateStartAction
  | MutateSuccessAction
  | MutateFailureAction