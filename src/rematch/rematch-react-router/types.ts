import { LocationState, Path, LocationDescriptorObject } from "history";
import { CallHistoryMethodAction } from "connected-react-router";

export type RouterState<T> = {
    [P in keyof T]: LocationState
}

export type RouterDispatch<T> = {
    [P in keyof T]: {
        push<S = LocationState>(path: Path, state?: S): CallHistoryMethodAction<[ Path, S? ]>;
        push<S = LocationState>(location: LocationDescriptorObject<S>): CallHistoryMethodAction<[ LocationDescriptorObject<S> ]>;
        replace<S = LocationState>(path: Path, state?: S): CallHistoryMethodAction<[ Path, S? ]>;
        replace<S = LocationState>(location: LocationDescriptorObject<S>): CallHistoryMethodAction<[ LocationDescriptorObject<S> ]>;
        go(n: number): CallHistoryMethodAction<[ number ]>;
        goBack(): CallHistoryMethodAction<[]>;
        goForward(): CallHistoryMethodAction<[]>;
    }
}