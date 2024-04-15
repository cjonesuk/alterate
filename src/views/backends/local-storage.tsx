import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  const update = useCallback(
    (value: T) => {
      setState(value);

      localStorage.setItem(key, JSON.stringify(value));
    },
    [key]
  );

  return [state, update];
}
