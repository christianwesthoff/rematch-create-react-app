import { NetworkInterface, RequestConfig, AdditionalHeadersSelector } from "./types";
import queryMiddleware from "./middleware/request"
import { Plugin, Middleware } from '@rematch/core'
import queriesReducer from "./reducers/queries";
import entitiesReducer from "./reducers/entities";
import mutationsReducer from "./reducers/mutations";
import { bindActionCreators } from 'redux'
import { queryAsync, mutateAsync, invalidateQuery } from './actions'
import Config from './config'

const getMutationsSelector = (mutationsModelName: string) => (state: any) => state[mutationsModelName];
const getMutationsModel = (): any => { 
	return {
		baseReducer: mutationsReducer,
		effects: (dispatch: any) => bindActionCreators({
			mutateAsync,
		}, dispatch)
	};
}

const getQueriesSelector = (queriesModelName: string) => (state: any) => state[queriesModelName];
const getQueriesModel = (): any => { 
	return {
		baseReducer: queriesReducer,
		effects: (dispatch: any) => bindActionCreators({
			queryAsync,
			invalidateQuery
		}, dispatch)
	};
}

const getEntitiesSelector = (entitiesModelName: string) => (state: any) => state[entitiesModelName];
const getEntitiesModel = (): any => { 
	return {
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
	
	const queriesSelector = getQueriesSelector(queriesModelName);
	Config.queriesSelector = queriesSelector;
	
	const entitiesSelector = getEntitiesSelector(entitiesModelName);
	Config.entitiesSelector = entitiesSelector;

	const mutationsSelector = getMutationsSelector(mutationsModelName);
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
				[queriesModelName]: getQueriesModel(),
				[entitiesModelName]: getEntitiesModel(),
				[mutationsModelName]: getMutationsModel()
			},
		},
		middleware
	}
}