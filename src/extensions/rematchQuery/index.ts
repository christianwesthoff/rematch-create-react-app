import { NetworkInterface, RequestConfig, AdditionalHeadersSelector } from "./types";
import queryMiddleware from "./middleware/query"
import { Plugin, Middleware } from '@rematch/core'
import queriesReducer from "./reducers/queries";
import entitiesReducer from "./reducers/entities";
import mutationsReducer from "./reducers/mutations";
import { bindActionCreators } from 'redux'
import { requestAsync, mutateAsync, invalidateRequestByPattern, invalidateRequest } from './actions'
import Config from './config'

const buildMutationsSelector = (mutationsModelName: string) => (state: any) => state[mutationsModelName];
const buildMutationsModel = (mutationsModelName: string): any => { 
	return {
		name: mutationsModelName,
		baseReducer: mutationsReducer,
		effects: (dispatch: any) => bindActionCreators({
			mutateAsync,
		}, dispatch)
	};
}

const buildQueriesSelector = (queriesModelName: string) => (state: any) => state[queriesModelName];
const buildQueriesModel = (queriesModelName: string): any => { 
	return {
		name: queriesModelName,
		baseReducer: queriesReducer,
		effects: (dispatch: any) => bindActionCreators({
			requestAsync,
			invalidateRequestByPattern,
			invalidateRequest
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
	queriesModelName: string,
	mutationsModelName: string
}

export default (config: RematchQueryConfig): Plugin => {
	const { networkInterface, customConfig, additionalHeadersSelector, entitiesModelName, queriesModelName, mutationsModelName } = config;
	const queriesSelector = buildQueriesSelector(queriesModelName);
	const entitiesSelector = buildEntitiesSelector(entitiesModelName);
	const mutationsSelector = buildMutationsSelector(mutationsModelName);

	Config.queriesSelector = queriesSelector;
	Config.entitiesSelector = entitiesSelector;
	Config.mutationsSelector = mutationsSelector;
	
	const middleware = queryMiddleware(networkInterface, 
		queriesSelector, 
		entitiesSelector, 
		mutationsSelector,
		additionalHeadersSelector, 
		customConfig) as Middleware;

	return {
		config: {
			models: {
				[queriesModelName]: buildQueriesModel(queriesModelName),
				[entitiesModelName]: buildEntitiesModel(entitiesModelName),
				[mutationsModelName]: buildMutationsModel(mutationsModelName)
			},
		},
		middleware
	}
}