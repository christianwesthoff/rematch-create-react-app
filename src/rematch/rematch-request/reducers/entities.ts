import {
  QUERY_SUCCESS,
  RESET,
  UPDATE_ENTITIES,
} from '../constants/action-types';
import { optimisticUpdateEntities } from '../lib/update';

import { Action } from '../actions';
import { OptimisticUpdate } from '../types';

export type State = {
  [key: string]: any;
};

const initialState = {};

const entities = (state: State = initialState, action: Action) => {
  if (action.type === RESET) {
    return 'entities' in action ? action.entities : initialState;
  } else if (action.type === QUERY_SUCCESS) {
    return {
      ...state,
      ...action.entities,
    };
  } else if (action.type === UPDATE_ENTITIES) {
    return {
      ...state,
      ...optimisticUpdateEntities(action.update as OptimisticUpdate, state),
    };
  } else {
    return state;
  }
};

export default entities;
