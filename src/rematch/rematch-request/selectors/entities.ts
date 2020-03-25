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
    if (queryConfigs.length === 0) return {} as ExtractStateFromQueriesConfig<TQueryConfigs>
<<<<<<< HEAD
    const combinedMaps = queryConfigs.reduce((acc, curr) => {
=======
    const maps = queryConfigs.reduce((acc, curr) => {
>>>>>>> e73fba21edd6d1fdf10c6f435282ab1879ff025d
        const queryKey = getQueryKey(curr)
        if (!queryKey) return acc
        const queryState = queriesSelector(state)[queryKey] as QueryState
        const { maps } = queryState
        if (!maps) return acc
        Object.keys(maps).forEach(key => {
            acc[key] = Array.from(new Set((acc[key] || []).concat(maps[key])))
        })
        return acc
    }, {} as Maps)
    const reselect = reselectEntityStateFromQueryState(combinedMaps)
    if (!reselect) return {} as ExtractStateFromQueriesConfig<TQueryConfigs>
    return reselect(state) as ExtractStateFromQueriesConfig<TQueryConfigs>
}