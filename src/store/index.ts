import { init } from '@rematch/core'
import { RematchRootDispatch, RematchRootState, RematchRootSelect } from 'rematch/util'
import * as models from 'models'
import createSelect, { ModelSelectors } from '@rematch/select'
import createQuery from 'rematch/rematch-request'
import createSubscribe from 'rematch/rematch-subscribe'
import buildNetworkInterface from 'rematch/rematch-request/network'
import createRouter from 'rematch/rematch-react-router'
import createReapop from 'rematch/rematch-reapop'
import createPersist from '@rematch/persist'
import { AxiosInstance } from 'axios'
import { ReduxApi } from 'rematch/rematch-request/types'

const networkInterface = buildNetworkInterface((client: AxiosInstance, reduxApi?: ReduxApi | undefined): AxiosInstance => {
	if (!reduxApi) return client;
	client.interceptors.request.use(config => {
		const { getState } = reduxApi;
		const { auth } = getState();
		if (auth && auth.credentials) {
			config.headers.authorization = `Bearer ${auth.credentials.accessToken}`;
		}
		return config;
	});
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
});

const defaultNotification = {
	status: 'info',
	position: 'tr',
	dismissible: true,
	dismissAfter: 2000,
	allowHTML: true,
	closeButton: true
};

export const store = init({
	models,
	plugins: [
		createSelect(),
		createPersist({
			whitelist: ['auth', 'userInfo'],
			throttle: 5000,
			version: 1,
		}),
		createSubscribe(),
		createRouter("router"),
		createReapop("notifications", defaultNotification),
		createQuery({ networkInterface, entitiesModelName: "entities", queriesModelName: "queries", mutationsModelName: "mutations" })
	]
});

// store.dispatch.auth.init();

export type RootState = RematchRootState<typeof models> & ModelSelectors<typeof models>

export type RootDispatch = RematchRootDispatch<typeof models>;

export type RootSelect = RematchRootSelect<typeof models>;

export default store;