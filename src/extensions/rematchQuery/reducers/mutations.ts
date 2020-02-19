import * as actionTypes from '../constants/action-types';

import { Action } from '../actions';
import { ResponseHeaders, Status } from '../types';

export type State = {
  [key: string]: {
    headers?: ResponseHeaders | undefined;
    isFinished: boolean;
    isPending: boolean;
    isError: boolean;
    error?: any;
    lastUpdated?: number;
    requestCount: number;
    status?: Status;
    payload?: any;
  };
};

const initialState = {};

const queries = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case actionTypes.RESET: {
      return {};
    }
    case actionTypes.MUTATE_START: {
      const { queryKey } = action;

      return {
        ...state,
        [queryKey]: {
          isFinished: false,
          isPending: true,
          isError: false,
          payload: action.body,
          requestCount: state[queryKey] ? state[queryKey].requestCount + 1 : 1
        }
      };
    }
    case actionTypes.MUTATE_SUCCESS: {
      const { queryKey } = action;

      return {
        ...state,
        [queryKey]: {
          ...state[queryKey],
          isFinished: true,
          isPending: false,
          lastUpdated: action.time,
          status: action.status,
          headers: action.responseHeaders
        },
      };
    }
    case actionTypes.MUTATE_FAILURE: {
      const { queryKey } = action;

      return {
        ...state,
        [queryKey]: {
          ...state[queryKey],
          isFinished: true,
          isPending: false,
          isError: true,
          error: action.responseBody,
          lastUpdated: action.time,
          status: action.status,
          headers: action.responseHeaders
        },
      };
    }
    case actionTypes.CANCEL_MUTATION: {
      const { queryKey } = action;

      if (queryKey && state[queryKey].isPending) {
        // Make sure query is actually pending

        return {
          ...state,
          [queryKey]: {
            ...state[queryKey],
            isFinished: true,
            isPending: false,
            isError: false,
            status: 0
          },
        };
      }

      return state;
    }
    default: {
      return state;
    }
  }
};

export default queries;
