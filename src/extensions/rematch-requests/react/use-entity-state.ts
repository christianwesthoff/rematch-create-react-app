import Config from '../config'
import { QueryState, Entities } from '../types';
import { useSelector } from 'react-redux';
import React from 'react';
import { getEntitiesFromQuery } from '../selectors/entities'

const useEntityState = (queryState: QueryState): Entities => {
    const { entitiesSelector } = Config;
    const selectedEntityState = useSelector(state => {
        const entitiesState = entitiesSelector(state);
        const entitySelector = getEntitiesFromQuery(entitiesState, queryState);
        if (!entitySelector) return {};
        return entitySelector;
    });
  
    const entityState = React.useMemo(
      () => selectedEntityState,
      [selectedEntityState],
    );
  
    return entityState;
  };
  
  export default useEntityState;