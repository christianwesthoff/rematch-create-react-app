// monkey patch models; we switch parameter order of effects because it doesn't allow parameterless functions
const patch = (models: any):void => Object.keys(models).forEach(key => {
	const model = (models as any)[key];
	if (typeof model.effects === "function") {
		const effectsFunc = model.effects;
		model.effects = (dispatch: any) => {
			const effects = effectsFunc(dispatch);
			Object.keys(effects).forEach(key => {
				const effect = effects[key];
				effects[key] = (payload: any, state: any) => effect(state, payload);
			});
			return effects;
		}
	} else if (typeof model.effects === "object") {
		model.effects.forEach((key: string) => {
			const effect = model.effects[key];
			model.effects[key] = (payload: any, state: any) => effect(state, payload);
		})
	}
});

export default patch;