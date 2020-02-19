import * as actionTypes from '../constants/action-types';

import { Action } from '../actions';
import { ResponseHeaders, Status, Maps } from '../types';
import { wildcardFilter } from '../lib/array';

export type State = {
  [key: string]: {
    headers?: ResponseHeaders | undefined;
    isFinished: boolean;
    isPending: boolean;
    isError: boolean;
    error?: any;
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
          isError: false,
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
          isError: true,
          error: action.responseBody,
          lastUpdated: action.time,
          status: action.status,
          headers: action.responseHeaders,
          maps: {} as Maps
        },
      };
    }
    case actionTypes.CANCEL_REQUEST: {
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
            isInvalid: false,
            status: 0
          },
        };
      }

      return state;
    }
    case actionTypes.INVALIDATE_REQUEST: {
      const { queryPattern, queryKey } = action;

      if (queryPattern) {

        const stateKeys = getStateKeys(state);
        let newState = { ...state };
        const filtered = wildcardFilter(stateKeys, queryPattern);
        for(let index in filtered) {
          let key = filtered[index];
          newState = { 
            ...newState, 
            [key]: {
              ...state[key],
              invalidCount: state[key] ? state[key].invalidCount + 1 : 1,
              isInvalid: true,
              maps: {} as Maps
            } 
          }
        }

        return newState;
      } else if (queryKey) {
        
        if (state[queryKey]) {
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

      return state;
    }
    default: {
      return state;
    }
  }
};

export default queries;
