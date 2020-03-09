import * as React from 'react';
import { useSelector } from 'react-redux';
import * as querySelectors from '../selectors/query';
import { QueriesState, QueryConfig, Maps } from '../types';
import Config from '../config';
import { getQueryKey } from '../lib/keys';

const useQueriesState = (queryConfigs?: Array<QueryConfig | undefined> | undefined): QueriesState => {
    const { queriesSelector } = Config;

    const queriesState = useSelector(queriesSelector);

    const isPending = queryConfigs?.some(queryConfig =>
        querySelectors.isPending(queriesState, queryConfig),
    ) ?? false;

    const isFinished = queryConfigs?.every(queryConfig =>
        querySelectors.isFinished(queriesState, queryConfig),
    ) ?? false;

    const isError = queryConfigs?.some(queryConfig =>
        querySelectors.isError(queriesState, queryConfig),
    ) ?? false;

    const errors = queryConfigs?.map(queryConfig =>
        querySelectors.error(queriesState, queryConfig)
    ).filter(error => !!error) ?? [];

    const invalidCount = queryConfigs?.reduce((acc, queryConfig) => {
        acc += querySelectors.invalidCount(queriesState, queryConfig);
        return acc;
    }, 0) ?? 0;

    const isInvalid = queryConfigs?.filter(queryConfig =>  querySelectors.isInvalid(queriesState, queryConfig))
        .map(queryConfig => getQueryKey(queryConfig)) || [];
    
    const maps = queryConfigs?.reduce((acc, queryConfig) => {
        const map = querySelectors.maps(queriesState, queryConfig);
        if (!map) return acc;
        Object.keys(map).forEach(key => {
            acc[key] = Array.from(new Set((acc[key] || []).concat(map[key])))
        })
        return acc;
    }, {} as Maps) ?? {}

    const queryState = React.useMemo(
        () => ({
            isPending,
            isFinished,
            isError,
            errors,
            invalidCount,
            isInvalid,
            maps
        }),
        [isFinished, isPending, isError, errors, invalidCount, isInvalid, maps],
    );

    return queryState;
};

export default useQueriesState;