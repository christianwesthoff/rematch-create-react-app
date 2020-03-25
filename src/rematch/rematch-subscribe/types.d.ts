import { Dispatch, Action } from 'redux';

export type Listener = (action: Action, dispatch: Dispatch) => void;
export type ActionType = string;
export type SubscribeAttribute = 'before' | 'after';