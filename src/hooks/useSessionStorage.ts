import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { readStorageValue, writeStorageValue } from './storage';

export function useSessionStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const storage = typeof window === 'undefined' ? undefined : window.sessionStorage;

  const [storedValue, setStoredValue] = useState<T>(() => {
    return readStorageValue(storage, key, initialValue);
  });

  useEffect(() => {
    writeStorageValue(storage, key, storedValue);
  }, [key, storedValue, storage]);

  return [storedValue, setStoredValue];
}
