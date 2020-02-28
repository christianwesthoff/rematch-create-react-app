import { init } from '@rematch/core'
import { RematchRootDispatch, RematchRootState, RematchRootSelect } from 'rematch/types'
import * as models from 'models'
import createSelect from '@rematch/select'
import createQuery from 'rematch/rematch-request'
import createSubscribe from 'rematch/rematch-subscribe'
import buildNetworkInterface from 'rematch/rematch-request/network'
import createRouter from 'rematch/rematch-react-router'
import createReapop from 'rematch/rematch-reapop'
import createPersist from '@rematch/persist'
import { AxiosInstance } from 'axios'
import { ReduxApi, RequestState, RequestDispatch } from 'rematch/rematch-request/types'
import { ReapopState, ReapopDispatch } from 'rematch/rematch-reapop/types'
import { RouterState, RouterDispatch } from 'rematch/rematch-react-router/types'

const networkInterface = buildNetworkInterface((client: AxiosInstance, reduxApi?: ReduxApi<RootDispatch, RootState> | undefined): AxiosInstance => {
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
			  await dispatch.auth.refresh(0);
			  const { auth } = getState();
			  if (auth && auth.credentials) {
				return client.request(err.config);
			  }
			  (dispatch as any).router.push("/");
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

const persistConfig = {
	whitelist: ['auth', 'userInfo'],
	transforms: [{ in: ((state: any) => {
		return Object.keys(state).reduce((acc, cur) => {
			// ignore state properties when writing to local storage
			if (!['isError', 'error', 'isLoading'].includes(cur)) {
				acc[cur] = state[cur];
			}
			return acc;
		}, {} as any);
	}), out: ((state: any) => {
		return state;
	}) }],
	throttle: 5000,
	version: 1,
};

export const store = init({
	models,
	plugins: [
		createSelect(),
		createSubscribe(),
		createPersist(persistConfig),
		createRouter("router"),
		createReapop("notifications", defaultNotification),
		createQuery({ networkInterface, entitiesModelName: "entities", queriesModelName: "queries", mutationsModelName: "mutations" })
	]
});

// store.dispatch.auth.init();
export type RootState = RematchRootState<typeof models> & 
						ReapopState<{ "notifications": undefined }> & 
						RouterState<{ "router": undefined }> & 
						RequestState<{ "queries": undefined }, { "entities": undefined }, { "mutations": undefined }>

export type RootDispatch = RematchRootDispatch<typeof models> & 
						   ReapopDispatch<{ "notifications": undefined }> & 
						   RouterDispatch<{ "router": undefined }> &
						   RequestDispatch<{ "queries": undefined }, { "entities": undefined }, { "mutations": undefined }>;

export type RootSelect = RematchRootSelect<typeof models>;

export default store;