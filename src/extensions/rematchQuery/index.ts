import { NetworkInterface, RequestConfig, AdditionalHeadersSelector } from "./types";
import queryMiddleware from "./middleware/query"
import { Plugin, Middleware, Model } from '@rematch/core'
import queriesReducer from "./reducers/queries";
import entitiesReducer from "./reducers/entities";
import { bindActionCreators } from 'redux'
import { requestAsync } from './actions'

const queriesModelName = "queries";
const buildQueriesSelector = (queriesModelName: string) => (state: any) => state[queriesModelName];
const buildQueriesModel = (queriesModelName: string): any => { 
	return {
		name: queriesModelName,
		baseReducer: queriesReducer,
		effects: (dispatch: any) => bindActionCreators({
			requestAsync,
		}, dispatch)
	};
}

const buildEntitiesSelector = (entitiesModelName: string) => (state: any) => state[entitiesModelName];
const buildEntitiesModel = (entitiesModelName: string): any => { 
	return {
		name: entitiesModelName, 
		baseReducer: entitiesReducer
	}
};

export type RematchQueryConfig = {
	networkInterface: NetworkInterface,
	customConfig?: RequestConfig | undefined,
	additionalHeadersSelector?: AdditionalHeadersSelector | undefined
	entitiesModelName: string,
	queriesModelName: string
}

export default (config: RematchQueryConfig): Plugin => {
	const { networkInterface, customConfig, additionalHeadersSelector, entitiesModelName, queriesModelName } = config;
	const middleware = queryMiddleware(networkInterface, 
		buildQueriesSelector(queriesModelName), 
		buildEntitiesSelector(entitiesModelName), 
		additionalHeadersSelector, 
		customConfig) as Middleware;

	return {
		config: {
			models: {
				queries: buildQueriesModel(queriesModelName),
				entities: buildEntitiesModel(entitiesModelName)
			},
		},
		middleware
	}
}