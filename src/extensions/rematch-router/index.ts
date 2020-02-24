import { bindActionCreators, Dispatch } from 'redux'
import { createBrowserHistory } from 'history'
import {
	routerReducer,
	push,
	replace,
	go,
	goBack,
	goForward,
	routerMiddleware,
} from 'react-router-redux'
import { Plugin } from '@rematch/core'

const getRouterModel = ():any => {
	return {
		baseReducer: routerReducer,
		effects: (dispatch: Dispatch) =>
			bindActionCreators(
				{
					push,
					replace,
					go,
					goBack,
					goForward,
				},
				dispatch
			)
	};
}

const routerPlugin = (name: string): Plugin => {
	const browserHistory = createBrowserHistory()
	const middleware = routerMiddleware(browserHistory)

	return {
		config: {
			models: {
				[name]: getRouterModel(),
			},
		},
		middleware,
		onStoreCreated() {
			return {
				browserHistory,
			}
		}
	}
}

export default routerPlugin;