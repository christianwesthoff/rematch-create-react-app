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
      const { requestKey } = action;

      return {
        ...state,
        [requestKey]: {
          isFinished: false,
          isPending: true,
          isError: false,
          payload: action.body,
          requestCount: state[requestKey] ? state[requestKey].requestCount + 1 : 1
        }
      };
    }
    case actionTypes.MUTATE_SUCCESS: {
      const { requestKey } = action;

      return {
        ...state,
        [requestKey]: {
          ...state[requestKey],
          isFinished: true,
          isPending: false,
          lastUpdated: action.time,
          status: action.status,
          headers: action.responseHeaders
        },
      };
    }
    case actionTypes.MUTATE_FAILURE: {
      const { requestKey } = action;

      return {
        ...state,
        [requestKey]: {
          ...state[requestKey],
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
      const { requestKey } = action;

      if (requestKey && state[requestKey].isPending) {
        // Make sure request is actually pending

        return {
          ...state,
          [requestKey]: {
            ...state[requestKey],
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
