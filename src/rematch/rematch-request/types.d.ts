import { HttpMethod } from './constants/http-methods';
import { PublicAction } from './actions';
import { State as QueriesState } from './reducers/queries';
import { State as EntitiesState } from './reducers/entities';
import { State as MutationsState } from './reducers/mutations';
import { RootDispatch, RootState } from 'store';

type ValuesOf<T extends Array<any>>= T[number];

export type RequestState<T1 extends string, T2 extends string, T3 extends string> = {
  [P in ValuesOf<Array<T1>>]: QueriesState
} &  {
  [P in ValuesOf<Array<T2>>]: EntitiesState
} & {
  [P in ValuesOf<Array<T3>>]: MutationsState
};

export type RequestDispatch<T1 extends string, T2 extends string, T3 extends string> = {
  [P in ValuesOf<Array<T1>>]: {
    invalidateQuery: (_:Array<string>|string) => Promise<void>
  }
} &  {
  [P in ValuesOf<Array<T2>>]: {}
} & {
  [P in ValuesOf<Array<T3>>]: {}
};

export type ExtractNormalizedStateFromQueryConfig<T> = T extends QueryConfig & {
  transform?: (...args: Array<any>) => infer O
} ? {
  [P in keyof O]: O[P]
} : never

export type ExtractStateFromQueryConfig<T> = T extends QueryConfig & {
    transform?: (...args: Array<any>) => infer O
} ? {
    [P in keyof O]: O[P] extends Record<any, infer T> ? Array<T> : never
} : never

export type ExtractKeyFromQueryConfig<T> = T extends QueryConfig & {
    transform?: (...args: Array<any>) => infer O
} ? {
    [P in keyof O]: O[P] extends Record<infer T, any> ? Array<T> : never
} : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

export type ExtractStateFromQueriesConfig<T extends Array<any>> = UnionToIntersection<ExtractStateFromQueryConfig<T[number]>>
export type ExtractKeyFromQueriesConfig<T extends Array<any>> = UnionToIntersection<ExtractKeyFromQueryConfig<T[number]>>
export type ExtractNormalizedStateFromQueriesConfig<T extends Array<any>> = UnionToIntersection<ExtractStaExtractNormalizedStateFromQueryConfigeFromQueryConfig<T[number]>>

export type MutationState = {
  isFinished: boolean;
  isPending: boolean;
  isError: boolean;
  error?: string;
  payload?: any;
};

export type QueryState = {
  isFinished: boolean;
  isPending: boolean;
  isError: boolean;
  error?: string;
  isInvalid: boolean;
  invalidCount: number;
  maps?: Maps
};

export type QueriesState = {
  isFinished: boolean,
  isPending: boolean,
  isError: boolean,
  errors?: Array<string> | undefined;
  invalidCount: number,
  isInvalid: Array<RequestKey | undefined>,
  maps?: Maps
};

export type CredentialOption = 'include' | 'same-origin' | 'omit';

export type RequestOptions = {
  credentials?: CredentialOption;
  method?: HttpMethod;
  headers?: { [key: string]: any };
};

export type MutationConfig = {
  body?: RequestBody;
  force?: boolean;
  meta?: Meta;
  options?: RequestOptions;
  requestKey?: RequestKey;
  retry?: boolean;
  preDispatchCallback?: () => void | undefined;
  url: Url;
  trigger?: Trigger | undefined,
};

export type QueryConfig = {
  body?: RequestBody;
  force?: boolean;
  meta?: Meta;
  options?: RequestOptions;
  requestKey?: RequestKey;
  transform?: Transform;
  update?: Update;
  map?: Map;
  retry?: boolean;
  preDispatchCallback?: () => void | undefined;
  url: Url;
  trigger?: Trigger | undefined
};

export type Url = string;

export type RequestBody = any;

export type RequestHeaders = { [key: string]: any };

export type Meta = { [key: string]: any };

export type RequestKey = string;

export type RequestPattern = string;

export type ResponseBody = any;

export type ResponseText = string;

export type ResponseHeaders = { [key: string]: any };

export type Status = number;

export type Duration = number;

export type Maps = { [key: string]: Array<string|number|symbol> };

export type Entities = { [key: string]: any };

export type Trigger = (
  body?: ResponseBody | undefined,
  headers?: ResponseHeaders | undefined,
) => Array<string>;

export type Transform = (
  body?: ResponseBody | undefined,
  headers?: ResponseHeaders | undefined,
) => { [key: string]: any };

export type Update = { [key: string]: (prevValue: any, newValue: any) => any };

export type Map = { [key: string]: (value: any) => any };

export type OptimisticUpdate = { [key: string]: (prevValue: any) => any };

export type Rollback = { [key: string]: (initialValue: any, currentValue: any) => any };

export type NetworkHandler = {
  abort: () => void;
  execute: (
    callback: (
      error: any,
      status: Status,
      responseBody?: ResponseBody | undefined,
      responseHeaders?: ResponseHeaders | undefined,
    ) => void,
  ) => void;
};

export type NetworkOptions = {
  body?: RequestBody | undefined;
  headers?: RequestHeaders | undefined;
  credentials?: CredentialOption | undefined;
};

export interface ReduxApi<RD, RS> {
  dispatch: RD ,
  getState: () => RS
}

export type NetworkInterface = (
  url: Url,
  method: HttpMethod,
  networkOptions: NetworkOptions,
  reduxApi?: ReduxApi<any, any> | undefined
) => NetworkHandler;

export type AdditionalHeadersSelector = (state: any) => { [key: string]: string };

export type QueriesSelector = (state: any) => QueriesState;

export type EntitiesSelector = (state: any) => EntitiesState;

export type MutationsSelector = (state: any) => MutationsState;

export type RequestKeyGetter = (config?: QueryConfig | MutationConfig | undefined) => RequestKey | undefined;

export type ActionPromiseValue = {
  body: ResponseBody;
  duration: Duration;
  entities?: Entities;
  headers?: ResponseHeaders | undefined;
  status: Status;
  text?: ResponseText | undefined;
  transformed?: Entities;
};

export type Action = PublicAction;

export type RequestConfig = {
  defaultHeaders?: RequestHeaders | undefined,
  backoff?: {
    maxAttempts: number;
    minDuration: number;
    maxDuration: number;
  };
  retryableStatusCodes?: Array<Status>;
};