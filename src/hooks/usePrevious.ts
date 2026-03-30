import { useState } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const [[prev, curr], setState] = useState<[T | undefined, T]>([undefined, value]);

  if (curr !== value) {
    setState([curr, value]);
  }

  return prev;
}
