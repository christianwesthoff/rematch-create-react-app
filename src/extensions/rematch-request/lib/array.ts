export const wildcardFilter = (arr: Array<string>, str: string): Array<string> => {
    const regex = new RegExp(str.replace(/[./+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*'));
    return arr.filter(item => regex.test(item));
}