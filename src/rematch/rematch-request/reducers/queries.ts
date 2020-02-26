import * as actionTypes from '../constants/action-types';

import { Action } from '../actions';
import { ResponseHeaders, Status, Maps } from '../types';

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
    requestCount: number;
    status?: Status;
    maps?: Maps
  };
};

const initialState = {};

const getStateKeys = (queries: State): string[] => {
  const requestKeys: string[] = [];

  for (const requestKey in queries) {
    requestKeys.push(requestKey)
  }

  return requestKeys;
};

const queries = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case actionTypes.RESET: {
      return {};
    }
    case actionTypes.QUERY_START: {
      const { requestKey } = action;

      return {
        ...state,
        [requestKey]: {
          isFinished: false,
          isPending: true,
          isError: false,
          isInvalid: false,
          requestCount: state[requestKey] ? state[requestKey].requestCount + 1 : 1,
          invalidCount: state[requestKey] ? state[requestKey].invalidCount : 0,
          maps: {} as Maps
        }
      };
    }
    case actionTypes.QUERY_SUCCESS: {
      const { requestKey } = action;

      return {
        ...state,
        [requestKey]: {
          ...state[requestKey],
          isFinished: true,
          isPending: false,
          lastUpdated: action.time,
          status: action.status,
          headers: action.responseHeaders,
          maps: action.maps
        },
      };
    }
    case actionTypes.QUERY_FAILURE: {
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
          headers: action.responseHeaders,
          maps: {} as Maps
        },
      };
    }
    case actionTypes.CANCEL_QUERY: {
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
            isInvalid: false,
            status: 0
          },
        };
      }

      return state;
    }
    case actionTypes.INVALIDATE_QUERY: {
      const { queryPatterns } = action;

      if (queryPatterns) {

        const stateKeys = getStateKeys(state);
        let newState = { ...state };
        const filtered = stateKeys.filter(key => queryPatterns.some(pattern => key.includes(pattern)));
        for(let index in filtered) {
          let key = filtered[index];
          newState = { 
            ...newState, 
            [key]: {
              ...state[key],
              invalidCount: state[key] ? state[key].invalidCount + 1 : 1,
              isInvalid: true,
              maps: {}
            } 
          }
        }

        return newState;
      }

      return state;
    }
    default: {
      return state;
    }
  }
};

export default queries;
