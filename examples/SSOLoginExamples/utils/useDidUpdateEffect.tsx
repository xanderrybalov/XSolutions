import { useRef, useEffect } from 'react';

export const useDidUpdateEffect = (
    cb: () => void,
    inputs: any[],
    effectType: 'useEffect' | 'useLayoutEffect' = 'useEffect'
) => {
    const didMountRef = useRef(false);

    useEffect(() => {
        if (didMountRef.current) {
            cb();
        } else {
            didMountRef.current = true;
        }
    }, inputs);
};
