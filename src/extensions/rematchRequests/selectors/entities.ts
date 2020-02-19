import { Entities, QueryState, QueryConfig } from "../types";

export const getEntitiesFromQuery = (
      entities: Entities,
      queryState: QueryState,
      queryConfig?: QueryConfig
): Entities => {
    if (!queryState || !queryState.maps) {
        if (queryConfig && queryConfig.transform) {
            return Object.keys(queryConfig.transform).reduce((acc: any, cur: any) => {
                acc[cur] = [];
                return acc;
            }, {})
        }
        return {};
    }
    return Object.keys(queryState.maps).reduce((acc: any, curr: string) => {
        const { maps } = queryState;
        const map = maps![curr];
        acc[curr] = map ? map.map((p: any) => entities[curr][p]) : [];
        return acc;
    }, {});
}