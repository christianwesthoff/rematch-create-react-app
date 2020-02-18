import * as React from 'react';

/**
 * Creates a flipflop like variable which can be watched; only triggers change on a certain value
 */
const useWatch = <T>(value: T, expectedValue: T): boolean => {
    const [state, setState] = React.useState(false);
    const previous = React.useRef(value);
    React.useEffect(() => {
        if ((!previous || previous.current !== value) && value === expectedValue) {
            setState(!state);
        }
      }, [value]);
    return state;
}

export default useWatch;