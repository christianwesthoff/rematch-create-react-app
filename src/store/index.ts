import { init } from '@rematch/core'
import { RematchRootDispatch, RematchRootState, RematchRootSelect } from 'rematch/types'
import * as models from 'models'
import createSelect from '@rematch/select'
import createQuery from 'rematch/rematch-request'
import buildNetworkInterface from 'rematch/rematch-request/network'
import createRouter from 'rematch/rematch-react-router'
import createReapop from 'rematch/rematch-reapop'
import createPersist from '@rematch/persist'
import { AxiosInstance } from 'axios'
import { ReduxApi, RequestState, RequestDispatch } from 'rematch/rematch-request/types'
import { ReapopState, ReapopDispatch } from 'rematch/rematch-reapop/types'
import { RouterState, RouterDispatch } from 'rematch/rematch-react-router/types'
import { createTransform } from 'redux-persist'
import patch from 'rematch/patch'

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

const createFilter = (reducer: string, properties: Array<string>) => {
	const filter = (state: any, key: any) => {
		if (reducer !== key) return state;
		return Object.keys(state)
			.filter(key => properties.includes(key))
			.reduce((obj: any, key: any) => {
				obj[key] = state[key];
				return obj;
			}, {}) };
	return createTransform(filter, filter);
}

const persistConfig = {
	whitelist: ['auth', 'userInfo'],
	transforms: [
		createFilter('auth', ['isAuthorized', 'credentials']), 
		createFilter('userInfo', ['claims'])
	],
	throttle: 1000,
	version: 1,
};

patch(models);

export const store = init({
	models,
	plugins: [
		createSelect(),
		// createSubscribe(),
		createPersist(persistConfig),
		createRouter("router"),
		createReapop("notifications", defaultNotification),
		createQuery({ networkInterface, entitiesModelName: "entities", queriesModelName: "queries", mutationsModelName: "mutations" })
	]
});

export type RootState = RematchRootState<typeof models> & 
						ReapopState<"notifications"> & 
						RouterState<"router"> & 
						RequestState<"queries", "entities", "mutations">

export type RootDispatch = RematchRootDispatch<typeof models> & 
						   ReapopDispatch<"notifications"> & 
						   RouterDispatch<"router"> &
						   RequestDispatch<"queries", "entities", "mutations">;

export type RootSelect = RematchRootSelect<typeof models>;

export default store;