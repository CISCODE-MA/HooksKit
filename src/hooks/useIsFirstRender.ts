import { useRef } from 'react';

export function useIsFirstRender(): boolean {
  const isFirstRender = useRef(true);

  // Reading and writing ref.current during render is intentional here:
  // isFirstRender tracks mount state only and never drives output directly.
  /* eslint-disable react-hooks/refs */
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return true;
  }
  /* eslint-enable react-hooks/refs */

  return false;
}
