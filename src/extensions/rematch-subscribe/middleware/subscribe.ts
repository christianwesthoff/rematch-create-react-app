import { Middleware, Dispatch, MiddlewareAPI, Action } from 'redux';
import { ActionType, Listener } from '../types'

type ActionListenerContainer = {
    action: string;
    listener: Listener;
  };

const _actionsSubscribedBefore: ActionListenerContainer[] = [];
const _actionsSubscribedAfter: ActionListenerContainer[] = [];

const subscribeAction = (
  actionListenerContainer: ActionListenerContainer,
  listenerContainer: ActionListenerContainer[]
) => {
  if (!actionListenerContainer.action) {
    throw new Error('Expected the action to be a string.');
  }
  if (typeof actionListenerContainer.listener !== 'function') {
    throw new Error('Expected the listener to be a function.');
  }
  listenerContainer.push(actionListenerContainer);
  return () => {
    const index = listenerContainer.indexOf(actionListenerContainer);
    listenerContainer.splice(index, 1);
  };
};

export const subscribeActionBefore = (action: ActionType, listener: Listener) => {
  const actionListenerContainer = { action, listener };
  return subscribeAction(actionListenerContainer, _actionsSubscribedBefore);
};

export const subscribeActionAfter = (action: ActionType, listener: Listener) => {
  const actionListenerContainer = { action, listener };
  return subscribeAction(actionListenerContainer, _actionsSubscribedAfter);
};

const callActionListeners = (
  action: Action,
  dispatch: Dispatch,
  listenerContainer: ActionListenerContainer[]
) => {
  for (let i = listenerContainer.length - 1; i >= 0; i--) {
    const listener = listenerContainer[i]
    if (typeof action === 'object' && listener.action === action.type) {
      listener.listener(action, dispatch);
    }
  }
}

const subscribeMiddleware: Middleware = ({ dispatch }: MiddlewareAPI) => (
    next: Dispatch
  ) => <A extends Action>(action: A) => {
    callActionListeners(action, dispatch, _actionsSubscribedBefore);
    const result = next(action);
    callActionListeners(action, dispatch, _actionsSubscribedAfter);
    return result;
  };
  
export default subscribeMiddleware;