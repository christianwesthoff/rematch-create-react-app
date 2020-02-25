import { init } from '@rematch/core'
import { RematchRootDispatch, RematchRootState } from 'rematch/util'
import * as models from 'models'
import selectPlugin from '@rematch/select'
import queryPlugin from 'rematch/rematch-request'
import subscribePlugin from 'rematch/rematch-subscribe'
import buildNetworkInterface from 'rematch/rematch-request/network'
import routerPlugin from 'rematch/rematch-router'
import { AxiosInstance } from 'axios'
import { ReduxApi } from 'rematch/rematch-request/types'

const configureAxiosClient = (client: AxiosInstance, reduxApi?: ReduxApi | undefined): AxiosInstance => {
	if (!reduxApi) return client;
	client.interceptors.request.use(config => {
		const { getState } = reduxApi;
		const { auth } = getState();
		if (auth && auth.credentials) {
			config.headers.authorization = `Bearer ${auth.credentials.accessToken}`;
		}
		return config;
	})
	client.interceptors.response.use(
		res => res,
		async err => {
		  const { dispatch, getState } = reduxApi;
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
}

const networkInterface = buildNetworkInterface(configureAxiosClient)
export const store = init({
	models,
	plugins: [
		selectPlugin(),
		subscribePlugin(),
		routerPlugin("router"),
		queryPlugin({ networkInterface, entitiesModelName: "entities", queriesModelName: "queries", mutationsModelName: "mutations" })
	]
});

store.dispatch.auth.init();

export type RootState = RematchRootState<typeof models>

export type RootDispatch = RematchRootDispatch<typeof models>;

export default store;