import { useState } from 'react';

const useLocalStorage = (key, defaultValue, userId) => {
  const userKey = `${userId}_${key}`; // Combine userId with key for unique storage

  const [localStorageValue, setLocalStorageValue] = useState(() => {
    try {
      const value = localStorage.getItem(userKey);
      if (value) {
        return JSON.parse(value);
      } else {
        localStorage.setItem(userKey, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (error) {
      localStorage.setItem(userKey, JSON.stringify(defaultValue));
      return defaultValue;
    }
  });

  const setLocalStorageStateValue = valueOrFn => {
    let newValue;
    if (typeof valueOrFn === 'function') {
      newValue = valueOrFn(localStorageValue);
    } else {
      newValue = valueOrFn;
    }
    localStorage.setItem(userKey, JSON.stringify(newValue));
    setLocalStorageValue(newValue);
  };

  return { localStorageValue, setLocalStorageStateValue };
};

export default useLocalStorage;
