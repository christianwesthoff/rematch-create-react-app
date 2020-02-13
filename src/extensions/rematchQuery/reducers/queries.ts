import * as actionTypes from '../constants/action-types';

import { Action } from '../actions';
import { ResponseHeaders, Status, QueryKey } from '../types';

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

const filterStateWildcard = (arr: string[], str: string) => arr.filter(item => new RegExp('^' + str.replace(/\*/g, '.*') + '$').test(item));

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
    case actionTypes.MUTATE_START:
    case actionTypes.REQUEST_START: {
      const { queryKey } = action;

      return {
        ...state,
        [queryKey]: {
          isFinished: false,
          isPending: true,
          isInvalid: false,
          isMutation: action.type === actionTypes.MUTATE_START,
          queryCount: state[queryKey] ? state[queryKey].queryCount + 1 : 1,
        },
      };
    }
    case actionTypes.REQUEST_SUCCESS:
    case actionTypes.MUTATE_FAILURE:
    case actionTypes.MUTATE_SUCCESS:
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
      const { queryPattern } = action;

      if (queryPattern) {

        const stateKeys = getStateKeys(state);
        let newState = { ...state };

        for(let match in filterStateWildcard(stateKeys, queryPattern)) {
           newState = { ...newState, [match]: {
            ...state[match],
            isInvalid: true,
          } }
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
