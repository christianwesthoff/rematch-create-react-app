const get = <T1 extends NonNullable<any>, T2>(object: T1, path: string|Array<string>, defaultVal: T2): T2 | undefined => {
  const pathArray = Array.isArray(path) ? path : path.split('.').filter(key => key);
  const pathArrayFlat = pathArray.flatMap(part => typeof part === 'string' ? part.split('.') : part);
  const checkValue = pathArrayFlat.reduce((obj, key) => obj && obj[key], object);
  return checkValue === undefined ? defaultVal : checkValue
}

export default get;