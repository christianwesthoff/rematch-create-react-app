const collapse = <T1 extends NonNullable<any>, T2>(object: T1, usePath = true, seperator = '_', result: any = {}, path: any = []): T2 =>
    (!object || typeof object !== 'object' || (object as any) instanceof Date ?
        Object.assign(result, { [usePath ? path.join(seperator) : path.splice(-1,1)]: object }) :
            Object.entries(object).forEach(([key, value]) => collapse(value, usePath, seperator, result, path.concat([key])))) || result;

export default collapse;