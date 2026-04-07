import { type RefObject, useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options?: IntersectionObserverInit,
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    const observer = new IntersectionObserver(([newEntry]) => {
      if (newEntry) setEntry(newEntry);
    }, optionsRef.current);

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return entry;
}
