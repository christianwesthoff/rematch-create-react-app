import { Notification } from 'reapop'

export type valuesOf<T extends any[]>= T[number];

export type ReapopState<T extends string> = {
    [P in valuesOf<Array<T>>]: Array<Notification>;
}

export type ReapopDispatch<T extends string> = {
    [P in valuesOf<Array<T>>]: {
        addNotification(notification: Notification): Notification;
        updateNotification(notification: Notification): Notification;
        removeNotification(notification: Notification): {type: string; payload: Notification};
        removeNotifications(): {type: string};
    }
}