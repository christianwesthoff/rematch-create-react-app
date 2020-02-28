import { Notification } from 'reapop'

export type ReapopState<K> = {
    [P in keyof T]: Notification[];
}

export type ReapopDispatch<K> = {
    [P in keyof T]: {
        addNotification(notification: Notification): Notification;
        updateNotification(notification: Notification): Notification;
        removeNotification(notification: Notification): {type: string; payload: Notification};
        removeNotifications(): {type: string};
    }
}