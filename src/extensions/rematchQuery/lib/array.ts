function escapeRegExp(str: string){
  return str.replace(/[./+?^${}()|[\]\\]/g, '\\$&');
}

export const wildcardFilter = (arr: Array<string>, str: string) => {
    const regex = new RegExp('^' + escapeRegExp(str).replace(/\*/g, '.*') + '$');
    return arr.filter(item => regex.test(item));
}