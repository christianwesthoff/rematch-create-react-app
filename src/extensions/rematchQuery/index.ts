import { QueryMiddlewareConfig } from "./types";
import queryMiddleware from "./middleware/query"
import { Plugin, Middleware, Model } from '@rematch/core'
import queries from "./reducers/queries";
import entities from "./reducers/entities";
import { bindActionCreators } from 'redux'
import { requestAsync } from './actions'

const queriesModelName = "queries";
const queriesSelector = (state: any) => state.queries;
const queriesModel: any = {
	name: queriesModelName,
	baseReducer: queries,
	effects: (dispatch: any) => bindActionCreators({
		requestAsync,
	}, dispatch)
}

const entitiesModelName = "entities";
const entitiesSelector = (state: any) => state.entities;
const entitiesModel: any = {
	name: entitiesModelName,
	baseReducer: entities
}

export default (config: QueryMiddlewareConfig): Plugin => {
	const { networkInterface, customConfig } = config;
	const middleware = <Middleware>queryMiddleware(networkInterface, queriesSelector, entitiesSelector, customConfig);

	return {
		config: {
			models: {
				queriesModel,
				entitiesModel
			},
		},
		middleware
	}
}