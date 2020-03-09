import { Notification } from 'reapop';

type ValuesOf<T extends Array<any>>= T[number];

export type ReapopState<T extends string> = {
    [P in ValuesOf<Array<T>>]: Array<Notification>;
}

export type ReapopDispatch<T extends string> = {
    [P in ValuesOf<Array<T>>]: {
        addNotification(notification: Notification): Notification;
        updateNotification(notification: Notification): Notification;
        removeNotification(notification: Notification): {type: string; payload: Notification};
        removeNotifications(): {type: string};
    }
}