import { ExtractStateFromQueryConfig, QueryConfig, QueryState, ExtractStateFromQueriesConfig, Maps } from "../types";
import { getQueryKey } from "../lib/keys";
import { reselectEntityStateFromQueryState } from "../lib/reselect";
import Config from '../config';

export const getEntityStateFromQuery = <TQueryConfig extends QueryConfig, TState = any>(
    state: TState,
    queryConfig: TQueryConfig
): ExtractStateFromQueryConfig<TQueryConfig> => {
    const { queriesSelector } = Config
    const queryKey = getQueryKey(queryConfig)
    if (!queryKey) return {} as ExtractStateFromQueryConfig<TQueryConfig>
    const queryState = queriesSelector(state)[queryKey] as QueryState
    const reselect = reselectEntityStateFromQueryState(queryState.maps)
    if (!reselect) return {} as ExtractStateFromQueryConfig<TQueryConfig>
    return reselect(state) as ExtractStateFromQueryConfig<TQueryConfig>
}
  
export const getEntityStateFromQueries = <TQueryConfigs extends Array<QueryConfig>, TState = any>(
    state: TState,
    queryConfigs: TQueryConfigs
): ExtractStateFromQueriesConfig<TQueryConfigs> => {
    const { queriesSelector } = Config
    const maps = queryConfigs.reduce((acc, curr) => {
        const queryKey = getQueryKey(curr)
        if (!queryKey) return acc;
        const queryState = queriesSelector(state)[queryKey] as QueryState
        const map = queryState.maps;
        if (!map) return acc;
        Object.keys(map).forEach(key => {
            acc[key] = Array.from(new Set((acc[key] || []).concat(map[key])))
        })
        return acc;
    }, {} as Maps)
    const reselect = reselectEntityStateFromQueryState(maps)
    if (!reselect) return {} as ExtractStateFromQueriesConfig<TQueryConfigs>
    return reselect(state) as ExtractStateFromQueriesConfig<TQueryConfigs>
}