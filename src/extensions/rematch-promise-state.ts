import { ExtractRematchDispatchersFromEffects, Model, Models, Plugin } from '@rematch/core'

export type LoadingStateEntry = {
	isLoading: boolean,
	error: string|null
}

export interface LoadingConfig {
	name?: string
	whitelist?: string[]
	blacklist?: string[]
	asNumber?: boolean
}

export interface LoadingState<M extends Models> {
	loading: {
		models: { [modelName in keyof M]: LoadingStateEntry },
		effects: {
			[modelName in keyof M]: {
				[effectName in keyof ExtractRematchDispatchersFromEffects<M[modelName]['effects']>]: LoadingStateEntry
			}
		},
	}
}


const createAction = (isLoading: boolean, error?: string) => (
	state: any,
	{ name, action }: any
) => {
	return {
		...state,
		models: {
			...state.models,
			[name]: { isLoading, error }
		},
		effects: {
			...state.effects,
			[name]: {
				...state.effects[name],
				[action]: { isLoading, error }
			},
		},
	};
}

const cntState:any = {
	models: {},
	effects: {},
}

const validateConfig = (config:any) => {
	if (config.name && typeof config.name !== 'string') {
		throw new Error('loading plugin config name must be a string')
	}
	if (config.asNumber && typeof config.asNumber !== 'boolean') {
		throw new Error('loading plugin config asNumber must be a boolean')
	}
	if (config.whitelist && !Array.isArray(config.whitelist)) {
		throw new Error(
			'loading plugin config whitelist must be an array of strings'
		)
	}
	if (config.blacklist && !Array.isArray(config.blacklist)) {
		throw new Error(
			'loading plugin config blacklist must be an array of strings'
		)
	}
	if (config.whitelist && config.blacklist) {
		throw new Error(
			'loading plugin config cannot have both a whitelist & a blacklist'
		)
	}
}

export default (config: LoadingConfig = {}): Plugin => {
	validateConfig(config);

	const loadingModelName = config.name || 'loading';

	const loading: Model = {
		name: loadingModelName,
		reducers: {
			start: createAction(true),
			success: createAction(false),
			error: (state:any, payload:any) => createAction(false, payload.error)(state, payload)
		},
		state: {
			...cntState,
		},
	}

	return {
		config: {
			models: {
				loading,
			},
		},
		onModel({ name }: Model) {
			// do not run dispatch on "loading" model
			if (name === loadingModelName) {
				return
			}

			cntState.models[name] = { error: null, isLoading: false };
			loading.state.models[name] =  cntState.models[name];
			loading.state.effects[name] = {};
			const modelActions = (<any>this.dispatch)[name];

			// map over effects within models
			Object.keys(modelActions).forEach((action: string) => {
				if ((<any>this.dispatch)[name][action].isEffect !== true) {
					return;
				}

				cntState.effects[name][action] = { error: null, isLoading: false };
				loading.state.effects[name][action] = cntState.effects[name][action];

				const actionType = `${name}/${action}`;

				// ignore items not in whitelist
				if (config.whitelist && !config.whitelist.includes(actionType)) {
					return;;
				}

				// ignore items in blacklist
				if (config.blacklist && config.blacklist.includes(actionType)) {
					return
				}

				// copy orig effect pointer
				const origEffect = (<any>this.dispatch)[name][action];

				// create function with pre & post loading calls
				const effectWrapper: any = async (...props:any) => {
					try {
						(<any>this.dispatch).loading.start({ name, action });
						// waits for dispatch function to finish before calling "hide"
						const effectResult = await origEffect(...props);
						(<any>this.dispatch).loading.success({ name, action });
						return effectResult
					} catch (error) {
						(<any>this.dispatch).loading.error({ name, action, error });
					}
				}

				effectWrapper.isEffect = true;

				// replace existing effect with new wrapper
				(<any>this.dispatch)[name][action] = effectWrapper;
			})
		},
	}
}