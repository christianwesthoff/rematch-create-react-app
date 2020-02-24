import { init } from '@rematch/core'
import { RematchRootDispatch, RematchRootState } from 'extensions/util'
import * as models from 'models'
import selectPlugin from '@rematch/select'
import queryPlugin from 'extensions/rematch-request'
import subscribePlugin from 'extensions/rematch-subscribe'
import buildNetworkInterface from 'extensions/rematch-request/network'
import routerPlugin from 'extensions/rematch-router'

const networkInterface = buildNetworkInterface((client) => {
	client.interceptors.request.use(config => {
		const { getState } = store;
		const { auth } = getState();
		if (auth && auth.credentials) {
			config.headers.authorization = `Bearer ${auth.credentials.accessToken}`;
		}
		return config;
	})
	client.interceptors.response.use(
		res => res,
		async err => {
		  const { dispatch, getState } = store;
		  if (err.config && err.response && err.response.status === 401) {
			  await dispatch.auth.refresh();
			  const { auth } = getState();
			  if (auth && auth.credentials) {
				return client.request(err.config);
			  }
			  dispatch.router.push("/");
			  return Promise.reject(err);
		  } else {
			return Promise.reject(err);
		  }
		}
	);
	return client;
})

export const store = init({
	models,
	plugins: [
		selectPlugin(),
		subscribePlugin(),
		routerPlugin("router"),
		queryPlugin({ networkInterface, entitiesModelName: "entities", queriesModelName: "queries", mutationsModelName: "mutations" })
	]
});
export type RootState = RematchRootState<typeof models>

export type RootDispatch = RematchRootDispatch<typeof models>;

export default store;