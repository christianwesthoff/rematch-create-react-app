import { createBrowserHistory as createHistory } from 'history'
import { connectRouter, routerMiddleware, push, replace, go, goBack, goForward } from 'connected-react-router'
import { Plugin } from '@rematch/core'
import { bindActionCreators } from 'redux'

export const history = createHistory();

const getRouterModel = ():any => {
	return {
		baseReducer: connectRouter(history),
		effects: (dispatch: any) => bindActionCreators({
			push,
			replace,
			go,
			goBack,
			goForward
		}, dispatch)
	};
}

const routerPlugin = (name: string): Plugin => {
	const middleware = routerMiddleware(history)

	return {
		config: {
			models: {
				[name]: getRouterModel(),
			},
		},
		middleware
	}
}

export default routerPlugin;