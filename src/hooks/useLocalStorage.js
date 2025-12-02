import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with automatic JSON serialization
 * @param {string} key - localStorage key
 * @param {any} initialValue - default value if key doesn't exist
 * @returns {[any, function]} - [value, setValue] tuple
 */
const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded. Consider clearing old data.');
            } else {
                console.error(`Error saving to localStorage key "${key}":`, error);
            }
        }
    }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;
