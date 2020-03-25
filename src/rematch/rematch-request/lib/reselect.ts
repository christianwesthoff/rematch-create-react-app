import { Entities, Maps, QueryConfig, QueryState, ExtractStateFromQueryConfig } from '../types';
import Config from '../config';
import { getQueryKey } from './keys';

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

export const getEntityStateFromQuery = <TQueryConfig extends QueryConfig, TState = any>(
    state: TState,
    config: TQueryConfig,
  ): ExtractStateFromQueryConfig<TQueryConfig> => {
    const { queriesSelector } = Config
    const queryKey = getQueryKey(config)
    if (!queryKey) return {} as ExtractStateFromQueryConfig<TQueryConfig>;
    const queryState = queriesSelector(state)[queryKey] as QueryState
    const reselect = reselectEntityStateFromQueryState(queryState.maps)
    if (!reselect) return {} as ExtractStateFromQueryConfig<TQueryConfig>;
    return reselect(state) as ExtractStateFromQueryConfig<TQueryConfig>;
  };
  