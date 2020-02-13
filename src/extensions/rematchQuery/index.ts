import { QueryMiddlewareConfig } from "./types";
import queryMiddleware from "./middleware/query"
import { Plugin, Middleware } from '@rematch/core'

export default (config: QueryMiddlewareConfig): Plugin => {
	const { networkInterface, customConfig } = config;
	const middleware = <Middleware>queryMiddleware(networkInterface, state => state.queries, state => state.entities, customConfig);

	return {
		middleware
	}
}