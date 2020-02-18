import Config from '../config'
import { QueryState, QueryConfig } from '../types';
import { useSelector } from 'react-redux';
import React from 'react';

const getEntitiesFromQuery = (queryState?: QueryState | undefined, queryConfig?: QueryConfig | undefined) => {
    const { entitiesSelector } = Config;
    if (queryState && queryState.maps && queryConfig && queryConfig.map) {
        return (state: any) => Object.keys(queryState.maps!).reduce((acc: any, curr: string) => {
            const maps = queryState.maps![curr];
            acc[curr] = maps.map(p => entitiesSelector(state)[curr][p]);
            return acc;
          }, {});
    }
    return undefined;
}

const useEntitiyState = (queryState?: QueryState | undefined, queryConfig?: QueryConfig | undefined): any | undefined=> {
  
    const selectedEntityState = useSelector(state => {
        const entitySelector = getEntitiesFromQuery(queryState, queryConfig);
        if (!entitySelector) return undefined;
        return entitySelector(state);
    });;
  
    const entityState = React.useMemo(
      () => selectedEntityState,
      [selectedEntityState],
    );
  
    return entityState;
  };
  
  export default useEntitiyState;