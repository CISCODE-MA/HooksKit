import { useEffect, useRef } from 'react';

export function useTimeout(callback: () => void, delay: number | null): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (delay === null) return;

    const id = window.setTimeout(() => {
      callbackRef.current();
    }, delay);

    return () => {
      window.clearTimeout(id);
    };
  }, [delay]);
}
