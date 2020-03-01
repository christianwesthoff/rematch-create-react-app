import { Entities, QueryState } from '../types';

export const getEntitiesFromQuery = (
      entities: Entities,
      queryState: QueryState
): Entities => {
    if (!queryState || !queryState.maps) {
        return {};
    }
    return Object.keys(queryState.maps).reduce((acc: any, curr: string) => {
        const { maps } = queryState;
        const map = maps![curr];
        acc[curr] = map ? map.map((p: any) => entities[curr][p]) : [];
        return acc;
    }, {});
}