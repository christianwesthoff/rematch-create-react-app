// @flow

import { Update, Entities, OptimisticUpdate, Rollback } from '../types';

export const updateEntities = (
  update: Update = {},
  entities: Entities = {},
  transformed: Entities = {},
): Entities => {
  // If update is not supplied, then no change to entities will be made

  return Object.keys(update).reduce((accum: any, key: string) => {
    accum[key] = update[key](entities[key], transformed[key]);

    return accum;
  }, {});
};

export const optimisticUpdateEntities = (
  optimisticUpdate: OptimisticUpdate = {},
  entities: Entities = {},
): Entities => {
  return Object.keys(optimisticUpdate).reduce((accum: any, key: string) => {
    accum[key] = optimisticUpdate[key](entities[key]);

    return accum;
  }, {});
};

export const rollbackEntities = (
  rollback: Rollback = {},
  initialEntities: Entities = {},
  entities: Entities = {},
): Entities => {
  return Object.keys(initialEntities).reduce((accum: any, key: string) => {
    if (rollback[key]) {
      accum[key] = rollback[key](initialEntities[key], entities[key]);
    } else {
      // Default to just reverting to the initial state for that
      // entity (before the optimistic update)
      accum[key] = initialEntities[key];
    }

    return accum;
  }, {});
};
