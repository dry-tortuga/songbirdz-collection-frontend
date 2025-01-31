import { useEffect, useState } from 'react';

const useDebounce = (value, delay) => {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {

        const timerId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timerId);
        };

    }, [value, delay]);

    return debouncedValue;

};

export default useDebounce;
