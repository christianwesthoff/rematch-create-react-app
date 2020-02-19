import { Entities, QueryState } from "../types";

export const getEntitiesFromQuery = (
      entities: Entities,
      queryState: QueryState,
): Entities => {
    if (!queryState || !queryState.maps) return {};
    return Object.keys(queryState.maps).reduce((acc: any, curr: string) => {
        const { maps } = queryState;
        acc[curr] = maps![curr].map((p: any) => entities[curr][p]);
        return acc;
    }, {});
}