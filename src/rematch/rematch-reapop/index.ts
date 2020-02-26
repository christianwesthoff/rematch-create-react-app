import { Plugin } from '@rematch/core'
import { bindActionCreators } from 'redux'
import { reducer as notificationsReducer, Notification, addNotification, updateNotification, removeNotification, removeNotifications } from 'reapop';

const getReapopModel = (defaultNotification?: Notification | undefined): any => {
	return {
		baseReducer: notificationsReducer(defaultNotification),
		effects: (dispatch: any) => bindActionCreators({
			addNotification,
			updateNotification,
			removeNotification,
			removeNotifications
		}, dispatch)
	};
}

const reapopPlugin = (name: string, defaultNotification?: Notification | undefined): Plugin => {
	return {
		config: {
			models: {
				[name]: getReapopModel(defaultNotification),
			},
		},
	}
}

export default reapopPlugin;