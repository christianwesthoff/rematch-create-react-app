import { State as MutationsState } from './reducers/mutations';
import { State as QueriesState } from './reducers/queries';
import { State as EntititesState } from './reducers/entities';

type RematchRequestConfig = {
	queriesSelector: (state:any) => QueriesState, 
	entitiesSelector: (state:any) => EntititesState,
	mutationsSelector: (state:any) => MutationsState 
}

const config: RematchRequestConfig = {
	queriesSelector: () => ({}),
	entitiesSelector: () => ({}),
	mutationsSelector: () => ({})
}

export default config;
