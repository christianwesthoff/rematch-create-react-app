import { mutateAsync } from "../actions";
import React from "react";
import useMutationState from "./use-mutation-state";
import { MutationState, MutationConfig } from "../types";
import { useDispatch } from "react-redux";

const useMutation = <TMutationConfig extends MutationConfig, TParams extends Array<any>>(
  makeMutationConfig: (...args: TParams) => TMutationConfig,
): [MutationState, (...args: TParams) => void] => {
  const reduxDispatch = useDispatch();

  // This query config and query state are driven based off of the callback – so they represent
  // the the query config that was used for the most-recent mutation callback.
  const [mutationConfig, setMutationConfig] = React.useState<MutationConfig | undefined>(undefined);

  const mutationState = useMutationState(mutationConfig);

  const mutate = React.useCallback(
    (...args: TParams) => {
      const queryConfig = makeMutationConfig(...args);

      setMutationConfig(queryConfig);

      return reduxDispatch(mutateAsync(queryConfig));
    },
    [makeMutationConfig, reduxDispatch],
  );

  return [mutationState, mutate];
};

export default useMutation;