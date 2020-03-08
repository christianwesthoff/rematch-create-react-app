import { Entities, Maps } from '../types';
import Config from '../config';

export const reselectEntityStateFromQueryState = <TState = any>(
      maps?: Maps | undefined
): ((state: TState) => Entities) | undefined => {
    const { entitiesSelector } = Config;
    if (!maps) return undefined;
    return (state: TState) => Object.keys(maps).reduce((acc: any, curr: string) => {
        const map = maps[curr];
        acc[curr] = map.map((p: any) => (entitiesSelector(state) as Entities)[curr][p]);
        return acc;
    }, {});
}