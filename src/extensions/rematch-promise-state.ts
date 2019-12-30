import { ExtractRematchDispatchersFromEffects, Model, Models, Plugin } from '@rematch/core'

export interface LoadingConfig {
	name?: string
	whitelist?: string[]
	blacklist?: string[]
	asNumber?: boolean
}

export interface LoadingState<M extends Models> {
	loading: {
		global: boolean,
		models: { [modelName in keyof M]: boolean },
		effects: {
			[modelName in keyof M]: {
				[effectName in keyof ExtractRematchDispatchersFromEffects<M[modelName]['effects']>]: boolean
			}
		},
	}
}

const cntState:any = {
	global: 0,
	models: {},
	effects: {},
}

const createLoadingAction = (converter: (b:any) => any, i: number) => (
	state: any,
	{ name, action }: any
) => {
	cntState.global += i
	cntState.models[name] += i
	cntState.effects[name][action] += i

	return {
		...state,
		global: converter(cntState.global),
		models: {
			...state.models,
			[name]: converter(cntState.models[name]),
		},
		effects: {
			...state.effects,
			[name]: {
				...state.effects[name],
				[action]: converter(cntState.effects[name][action]),
			},
		},
	}
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
	validateConfig(config)

	const loadingModelName = config.name || 'loading'

	const converter =
		config.asNumber === true ? (cnt: number) => cnt : (cnt: number) => cnt > 0

	const loading: Model = {
		name: loadingModelName,
		reducers: {
			hide: createLoadingAction(converter, -1),
			show: createLoadingAction(converter, 1),
		},
		state: {
			...cntState,
		},
	}

	cntState.global = 0
	loading.state.global = converter(cntState.global)

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

			cntState.models[name] = 0
			loading.state.models[name] = converter(cntState.models[name])
			loading.state.effects[name] = {}
			const modelActions = (<any>this.dispatch)[name]

			// map over effects within models
			Object.keys(modelActions).forEach((action: string) => {
				if ((<any>this.dispatch)[name][action].isEffect !== true) {
					return
				}

				cntState.effects[name][action] = 0
				loading.state.effects[name][action] = converter(
					cntState.effects[name][action]
				)

				const actionType = `${name}/${action}`

				// ignore items not in whitelist
				if (config.whitelist && !config.whitelist.includes(actionType)) {
					return
				}

				// ignore items in blacklist
				if (config.blacklist && config.blacklist.includes(actionType)) {
					return
				}

				// copy orig effect pointer
				const origEffect = (<any>this.dispatch)[name][action]

				// create function with pre & post loading calls
				const effectWrapper: any = async (...props:any) => {
					try {
						(<any>this.dispatch).loading.show({ name, action })
						// waits for dispatch function to finish before calling "hide"
						const effectResult = await origEffect(...props)
						(<any>this.dispatch).loading.hide({ name, action })
						return effectResult
					} catch (error) {
						(<any>this.dispatch).loading.hide({ name, action })
						throw error
					}
				}

				effectWrapper.isEffect = true;

				// replace existing effect with new wrapper
				(<any>this.dispatch)[name][action] = effectWrapper
			})
		},
	}
}