import { Notification } from 'reapop'

export type valuesOf<T extends any[]>= T[number];

export type ReapopState<T extends Array<string>> = {
    [P in valuesOf<T>]: Array<Notification>;
}

export type ReapopDispatch<T extends Array<string>> = {
    [P in valuesOf<T>]: {
        addNotification(notification: Notification): Notification;
        updateNotification(notification: Notification): Notification;
        removeNotification(notification: Notification): {type: string; payload: Notification};
        removeNotifications(): {type: string};
    }
}