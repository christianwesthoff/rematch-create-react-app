import { NetworkInterface, RequestConfig, AdditionalHeadersSelector } from "./types";
import queryMiddleware from "./middleware/query"
import { Plugin, Middleware } from '@rematch/core'
import queriesReducer from "./reducers/queries";
import entitiesReducer from "./reducers/entities";
import { bindActionCreators } from 'redux'
import { requestAsync, invalidateQueryPattern } from './actions'
import Config from './config'

const buildQueriesSelector = (queriesModelName: string) => (state: any) => state[queriesModelName];
const buildQueriesModel = (queriesModelName: string): any => { 
	return {
		name: queriesModelName,
		baseReducer: queriesReducer,
		effects: (dispatch: any) => bindActionCreators({
			requestAsync,
			invalidateQueryPattern
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
	const queriesSelector = buildQueriesSelector(queriesModelName);
	const entitiesSelector = buildEntitiesSelector(entitiesModelName);

	Config.queriesSelector = queriesSelector;
	Config.entitiesSelector = entitiesSelector;

	const middleware = queryMiddleware(networkInterface, 
		queriesSelector, 
		entitiesSelector, 
		additionalHeadersSelector, 
		customConfig) as Middleware;

	return {
		config: {
			models: {
				[queriesModelName]: buildQueriesModel(queriesModelName),
				[entitiesModelName]: buildEntitiesModel(entitiesModelName)
			},
		},
		middleware
	}
}