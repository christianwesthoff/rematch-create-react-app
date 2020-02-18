import { rematchQueryConfig } from '../index'
import { QueryState, QueryConfig } from '../types';
import { useSelector } from 'react-redux';

const getEntitiesFromQuery = (queryState?: QueryState | undefined, queryConfig?: QueryConfig | undefined) => {
    const { entitiesSelector } = rematchQueryConfig;
    if (queryState && queryState.maps && queryConfig && queryConfig.map) {
        return (state: any) => Object.keys(queryState.maps!).reduce((acc: any, curr: string) => {
            const maps = queryState.maps![curr];
            acc[curr] = maps.map(p => entitiesSelector(state)[curr][p]);
            return acc;
          }, {});
    }

    return undefined;
}

const useEntityState = (queryState?: QueryState | undefined, queryConfig?: QueryConfig | undefined) => useSelector(state => {
    const entitySelector = getEntitiesFromQuery(queryState, queryConfig);
    if (entitySelector) {
        return entitySelector(state);
    }
    return undefined;
})

export default useEntityState;