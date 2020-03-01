import Config from '../config';
import { QueryState, Entities } from '../types';
import { useSelector } from 'react-redux';
import React from 'react';
import { getEntitiesFromQuery } from '../selectors/entities';

const useEntityState = (queryState: QueryState): Entities => {
    const { entitiesSelector } = Config;
    const selectedEntityState = useSelector(state => {
        return getEntitiesFromQuery(entitiesSelector(state), queryState);
    });
  
    const entityState = React.useMemo(
      () => selectedEntityState,
      [selectedEntityState],
    );
  
    return entityState;
  };
  
  export default useEntityState;