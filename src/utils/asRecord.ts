const asRecord = <K extends string|number|symbol, T extends NonNullable<any>>(array: Array<T>, keyFn: (elem:T) => K):Record<K, T> => 
    array.reduce((acc, curr) => {
        const key = keyFn(curr);
        acc[key] = curr;
        return acc;
    }, {} as T);

export default asRecord;