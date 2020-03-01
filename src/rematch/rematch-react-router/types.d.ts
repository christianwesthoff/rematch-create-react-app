import { LocationState, Path, LocationDescriptorObject } from 'history';
import { CallHistoryMethodAction } from 'connected-react-router';

export type valuesOf<T extends Array<any>>= T[number];

export type RouterState<T extends string> = {
    [P in valuesOf<Array<T>>]: LocationState & { location: Location<LocationState>, action: Action }
}

export type RouterDispatch<T extends string> = {
    [P in valuesOf<Array<T>>]: {
        push<S = LocationState>(path: Path, state?: S): CallHistoryMethodAction<[ Path, S? ]>;
        push<S = LocationState>(location: LocationDescriptorObject<S>): CallHistoryMethodAction<[ LocationDescriptorObject<S> ]>;
        replace<S = LocationState>(path: Path, state?: S): CallHistoryMethodAction<[ Path, S? ]>;
        replace<S = LocationState>(location: LocationDescriptorObject<S>): CallHistoryMethodAction<[ LocationDescriptorObject<S> ]>;
        go(n: number): CallHistoryMethodAction<[ number ]>;
        goBack(): CallHistoryMethodAction<[]>;
        goForward(): CallHistoryMethodAction<[]>;
    }
}