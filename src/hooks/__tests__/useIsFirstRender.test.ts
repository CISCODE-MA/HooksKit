import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useIsFirstRender } from '../useIsFirstRender';

describe('useIsFirstRender', () => {
  it('returns true on first render', () => {
    const { result } = renderHook(() => useIsFirstRender());
    expect(result.current).toBe(true);
  });

  it('returns false on subsequent renders', () => {
    const { result, rerender } = renderHook(() => useIsFirstRender());

    expect(result.current).toBe(true);

    rerender();
    expect(result.current).toBe(false);

    rerender();
    expect(result.current).toBe(false);
  });

  it('resets to true on fresh mount', () => {
    const { result: first } = renderHook(() => useIsFirstRender());
    expect(first.current).toBe(true);

    const { result: second } = renderHook(() => useIsFirstRender());
    expect(second.current).toBe(true);
  });
});
