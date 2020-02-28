import { LocationState, Path, LocationDescriptorObject } from "history";
import { CallHistoryMethodAction } from "connected-react-router";

export type valuesOf<T extends Array<any>>= T[number];

export type RouterState<T> = {
    [P in valuesOf<T>]: LocationState
}

export type RouterDispatch<T extends Array<string>> = {
    [P in valuesOf<T>]: {
        push<S = LocationState>(path: Path, state?: S): CallHistoryMethodAction<[ Path, S? ]>;
        push<S = LocationState>(location: LocationDescriptorObject<S>): CallHistoryMethodAction<[ LocationDescriptorObject<S> ]>;
        replace<S = LocationState>(path: Path, state?: S): CallHistoryMethodAction<[ Path, S? ]>;
        replace<S = LocationState>(location: LocationDescriptorObject<S>): CallHistoryMethodAction<[ LocationDescriptorObject<S> ]>;
        go(n: number): CallHistoryMethodAction<[ number ]>;
        goBack(): CallHistoryMethodAction<[]>;
        goForward(): CallHistoryMethodAction<[]>;
    }
}