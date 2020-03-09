import { State as MutationsState } from './reducers/mutations';
import { State as QueriesState } from './reducers/queries';
import { State as EntititesState } from './reducers/entities';

type RematchRequestConfig = {
	queriesSelector: (state:any) => QueriesState, 
	entitiesSelector: (state:any) => EntititesState,
	mutationsSelector: (state:any) => MutationsState 
}

// Config values are set during plugin initalization
const config: RematchRequestConfig = {
	queriesSelector: () => { throw new Error("Queries selector was not initialized."); },
	entitiesSelector: () => { throw new Error("Entities selector was not initialized."); },
	mutationsSelector: () => { throw new Error("Mutatitons selector was not initialized."); }
}

export default config;
