import { init } from '@rematch/core'
import { RematchRootDispatch, RematchRootState } from 'extensions/util'
import * as models from 'models'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'
import queryPlugin from 'extensions/rematch-request'
import subscribePlugin from 'extensions/rematch-subscribe'
import networkInterface from 'extensions/rematch-request/network'
import routerPlugin from 'extensions/rematch-router'

export const store = init({
	models,
	plugins: [
		immerPlugin(), 
		selectPlugin(),
		subscribePlugin(),
		routerPlugin("router"),
		queryPlugin({ networkInterface, entitiesModelName: "entities", queriesModelName: "queries", mutationsModelName: "mutations" })
	]
});

export type RootState = RematchRootState<typeof models>

export type RootDispatch = RematchRootDispatch<typeof models>;

export default store;