import * as actionTypes from '../constants/action-types';

import { Action } from '../actions';
import { ResponseHeaders, Status } from '../types';

export type State = {
  [key: string]: {
    headers?: ResponseHeaders | undefined;
    isFinished: boolean;
    isMutation: boolean;
    isPending: boolean;
    isInvalid: boolean;
    lastUpdated?: number;
    queryCount: number;
    status?: Status;
  };
};

const initialState = {};

const queries = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case actionTypes.RESET: {
      return {};
    }
    case actionTypes.REQUEST_START: {
      const { queryKey } = action;

      return {
        ...state,
        [queryKey]: {
          isFinished: false,
          isPending: true,
          isInvalid: false,
          isMutation: false,
          queryCount: state[queryKey] ? state[queryKey].queryCount + 1 : 1,
        },
      };
    }
    case actionTypes.REQUEST_SUCCESS:
    case actionTypes.REQUEST_FAILURE: {
      const { queryKey } = action;

      return {
        ...state,
        [queryKey]: {
          ...state[queryKey],
          isFinished: true,
          isPending: false,
          lastUpdated: action.time,
          status: action.status,
          headers: action.responseHeaders,
        },
      };
    }
    case actionTypes.CANCEL_QUERY: {
      const { queryKey } = action;

      if (queryKey && state[queryKey].isPending) {
        // Make sure query is actually pending

        return {
          ...state,
          [queryKey]: {
            ...state[queryKey],
            isFinished: true,
            isPending: false,
            status: 0,
          },
        };
      }

      return state;
    }
    case actionTypes.RESET_QUERY: {
      const { queryKey } = action;
      if (queryKey) {
        return {
          ...state,
          [queryKey]: {
            ...state[queryKey],
            isInvalid: true,
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
