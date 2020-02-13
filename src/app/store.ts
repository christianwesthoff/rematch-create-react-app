import { init } from '@rematch/core'
import { RematchRootDispatch, RematchRootState } from 'extensions/util'
import * as models from 'models'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'
import { ApiState } from 'extensions/rematchApi'
import apiPlugin from 'extensions/rematchApi'
import { entitiesReducer, queriesReducer, queryMiddleware } from 'redux-query';
import superagentInterface from 'redux-query-interface-superagent';

export const getQueries = (state:any) => state.queries;
export const getEntities = (state:any) => state.entities;

export const store = init({
	redux: {
		reducers: {
			entities: entitiesReducer,
			queries: queriesReducer
		},
		middlewares: [queryMiddleware(superagentInterface, getQueries, getEntities)]
	},
	models,
	plugins: [immerPlugin(), selectPlugin(), apiPlugin()],
});

export type RootState = RematchRootState<typeof models> & ApiState<typeof models>;

export type RootDispatch = RematchRootDispatch<typeof models>;

export default store;