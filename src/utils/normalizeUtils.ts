export const asRecords = <K extends string|number|symbol, T extends any>(list: Array<T>, selector: (elem:T) => K):Record<K, T> => 
    list.reduce((acc, curr) => {
        const key = selector(curr);
        acc[key] = curr;
        return acc;
    }, {} as any);