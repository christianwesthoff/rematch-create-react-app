const escapeRegExp = (str: string): string => str.replace(/[./+?^${}()|[\]\\]/g, '\\$&');

export const wildcardFilter = (arr: Array<string>, str: string): Array<string> => {
    const regex = new RegExp(escapeRegExp(str).replace(/\*/g, '.*'));
    return arr.filter(item => regex.test(item));
}