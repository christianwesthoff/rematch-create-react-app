import * as React from 'react';
import { useSelector } from 'react-redux';
import * as querySelectors from '../selectors/query';
import { QueriesState, QueryConfig, QueryState } from '../types';
import Config from '../config';
import useQueryState from './use-query-state';
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

    const queryStates = queryConfigs?.reduce((acc, curr) => {
        const queryKey = getQueryKey(curr);
        if (!queryKey) return acc;
        acc[queryKey] = useQueryState(curr);
        return acc;
    }, {} as any) ?? {}

    const queryState = React.useMemo(
    () => ({
        isPending,
        isFinished,
        queryStates
    }),
    [isFinished, isPending, queryStates],
    );

    return queryState;
};

export default useQueriesState;