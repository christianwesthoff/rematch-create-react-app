export const wildcardFilter = (arr: Array<string>, str: string) => 
    arr.filter(item => new RegExp('^' + str.replace(/\*/g, '.*') + '$').test(item));