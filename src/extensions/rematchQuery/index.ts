import { QueryMiddlewareConfig } from "./types";
import queryMiddleware from "./middleware/query"
import { Plugin, Middleware } from '@rematch/core'

export default (config: QueryMiddlewareConfig): Plugin => {
	const middleware = <Middleware>queryMiddleware(config);

	return {
		middleware
	}
}