import { createHashHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { Plugin } from '@rematch/core'

export const history = createHashHistory();

const getRouterModel = ():any => {
	return {
		baseReducer: connectRouter(history),
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