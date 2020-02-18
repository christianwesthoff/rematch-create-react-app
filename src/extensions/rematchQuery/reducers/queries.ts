import * as actionTypes from '../constants/action-types';

import { Action } from '../actions';
import { ResponseHeaders, Status, Maps } from '../types';
import { wildcardFilter } from '../lib/array';

export type State = {
  [key: string]: {
    headers?: ResponseHeaders | undefined;
    isFinished: boolean;
    isPending: boolean;
    isInvalid: boolean;
    invalidCount: number;
    lastUpdated?: number;
    queryCount: number;
    status?: Status;
    maps?: Maps
  };
};

const initialState = {};

const getStateKeys = (queries: State): string[] => {
  const queryKeys: string[] = [];

  for (const queryKey in queries) {
    queryKeys.push(queryKey)
  }

  return queryKeys;
};

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
          queryCount: state[queryKey] ? state[queryKey].queryCount + 1 : 1,
          invalidCount: state[queryKey] ? state[queryKey].invalidCount : 0,
          maps: {} as Maps
        }
      };
    }
    case actionTypes.REQUEST_SUCCESS: {
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
          maps: action.maps
        },
      };
    }
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
          headers: action.responseHeaders
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
            status: 0
          },
        };
      }

      return state;
    }
    case actionTypes.INVALIDATE_QUERY: {
      const { queryPattern, queryKey } = action;

      if (queryPattern) {

        const stateKeys = getStateKeys(state);
        let newState = { ...state };
        const filtered = wildcardFilter(stateKeys, queryPattern);
        for(let index in filtered) {
          let current = filtered[index];
          newState = { 
            ...newState, 
            [current]: {
              ...state[current],
              invalidCount: state[current] ? state[current].invalidCount + 1 : 1,
              isInvalid: true,
              maps: {} as Maps
            } 
          }
        }

        return newState;
      } else if (queryKey && state[queryKey]) {

        return {
          ...state,
          [queryKey]: {
            ...state[queryKey],
            invalidCount: state[queryKey] ? state[queryKey].invalidCount + 1 : 1,
            isInvalid: true,
            maps: {} as Maps
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
