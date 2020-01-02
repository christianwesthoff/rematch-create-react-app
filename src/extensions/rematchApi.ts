import { ExtractRematchDispatchersFromEffects, Model, Plugin } from '@rematch/core'
import { Models } from 'extensions/util'

export type ApiStateEntry = {
	isLoading: boolean,
	error: string|null
}

export interface ApiConfig {
	name?: string
	// whitelist?: string[]
	// blacklist?: string[]
}

export interface ApiState<M extends Models> {
	api: {
		effects: {
			[modelName in keyof M]: {
				[effectName in keyof ExtractRematchDispatchersFromEffects<M[modelName]['effects']>]: ApiStateEntry
			}
		},
	}
}


const createAction = (isLoading: boolean, error: string|null = null) => (
	state: any,
	{ name, action }: any
) => {
	return {
		...state,
		effects: {
			...state.effects,
			[name]: {
				...state.effects[name],
				[action]: { isLoading, error }
			},
		},
	};
}

const state:any = {
	effects: {},
}

const validateConfig = (config:any) => {
	if (config.name && typeof config.name !== 'string') {
		throw new Error('loading plugin config name must be a string')
	}
	// if (config.whitelist && !Array.isArray(config.whitelist)) {
	// 	throw new Error(
	// 		'loading plugin config whitelist must be an array of strings'
	// 	)
	// }
	// if (config.blacklist && !Array.isArray(config.blacklist)) {
	// 	throw new Error(
	// 		'loading plugin config blacklist must be an array of strings'
	// 	)
	// }
	// if (config.whitelist && config.blacklist) {
	// 	throw new Error(
	// 		'loading plugin config cannot have both a whitelist & a blacklist'
	// 	)
	// }
}

export default (config: ApiConfig = {}): Plugin => {
	validateConfig(config);

	const pluginModelName = config.name || 'api';

	const api: Model = {
		name: pluginModelName,
		reducers: {
			start: createAction(true),
			success: createAction(false),
			error: (state:any, payload:any) => createAction(false, payload.error)(state, payload),
		},
		state: {
			...state
		},
	}

	return {
		config: {
			models: {
				api
			},
		},
		onModel({ name }: Model) {
			const skipModels = [pluginModelName];
			if (skipModels.includes(name)) {
				return;
			}

			api.state.effects[name] = {};
			const modelActions = (this.dispatch as any)[name];

			// map over effects within models
			Object.keys(modelActions).forEach((action: string) => {
				if ((this.dispatch as any)[name][action].isEffect !== true) {
					return;
				}

				state.effects[name][action] = { error: null, isLoading: false };
				api.state.effects[name][action] = state.effects[name][action];

				// const actionType = `${name}/${action}`;

				// // ignore items not in whitelist
				// if (config.whitelist && !config.whitelist.includes(actionType)) {
				// 	return;
				// }

				// // ignore items in blacklist
				// if (config.blacklist && config.blacklist.includes(actionType)) {
				// 	return;
				// }

				// copy orig effect pointer
				const origEffect = (this.dispatch as any)[name][action];

				// create function with pre & post loading calls
				const effectWrapper: any = async (...props:any) => {
					try {
						(this.dispatch as any).api.start({ name, action });
						// waits for dispatch function to finish before calling "hide"
						const effectResult = await origEffect(...props);
						(this.dispatch as any).api.success({ name, action });
						return effectResult;
					} catch (err) {
						(this.dispatch as any).api.error({ name, action, err });
						throw err;
					}
				}
				effectWrapper.isEffect = true;

				// replace existing effect with new wrapper
				(this.dispatch as any)[name][action] = effectWrapper;
			})
		},
	}
}