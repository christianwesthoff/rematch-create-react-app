import { Entities, Maps } from '../types';
import Config from '../config';

export const reselectEntityStateFromQueryState = <TState = any, TResult = Entities>(
      maps?: Maps | undefined
): (state: TState) => TResult => {
    const { entitiesSelector } = Config;
    if (!maps) return () => ({} as TResult);
    return (state: TState) => Object.keys(maps).reduce((acc: any, curr: string) => {
        const map = maps[curr];
        acc[curr] = map.map((p: any) => (entitiesSelector(state) as Entities)[curr][p]);
        return acc;
    }, {});
}