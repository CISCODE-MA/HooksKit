export function readStorageValue<T>(storage: Storage | undefined, key: string, initialValue: T): T {
  if (typeof window === 'undefined' || storage === undefined) {
    return initialValue;
  }

  try {
    const item = storage.getItem(key);

    if (item === null) {
      return initialValue;
    }

    return JSON.parse(item) as T;
  } catch {
    return initialValue;
  }
}

export function writeStorageValue<T>(storage: Storage | undefined, key: string, value: T): void {
  if (typeof window === 'undefined' || storage === undefined) {
    return;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Swallow write errors (quota/security) while keeping hook state usable.
  }
}
