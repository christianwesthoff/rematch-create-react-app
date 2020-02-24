import { Middleware, Dispatch, MiddlewareAPI, Action } from 'redux';
import { ActionType, Listener } from '../types'

type ActionListenerContainer = {
    action: ActionType;
    listener: Listener;
  };

const _actionsSubscribedBefore: Array<ActionListenerContainer> = [];
const _actionsSubscribedAfter: Array<ActionListenerContainer> = [];

const subscribe = (
  actionListenerContainer: ActionListenerContainer,
  listenerContainer: ActionListenerContainer[]
): () => void => {
  if (!actionListenerContainer.action) {
    throw new Error('Missing action name.');
  }
  if (typeof actionListenerContainer.listener !== 'function') {
    throw new Error('Listener must be a function.');
  }
  listenerContainer.push(actionListenerContainer);
  return () => {
    const index = listenerContainer.indexOf(actionListenerContainer);
    listenerContainer.splice(index, 1);
  };
};

export const subscribeBefore = (action: ActionType, listener: Listener) => {
  const actionListenerContainer = { action, listener };
  return subscribe(actionListenerContainer, _actionsSubscribedBefore);
};

export const subscribeAfter = (action: ActionType, listener: Listener) => {
  const actionListenerContainer = { action, listener };
  return subscribe(actionListenerContainer, _actionsSubscribedAfter);
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