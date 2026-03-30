import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from './useMediaQuery';

type ChangeHandler = () => void;

function mockMatchMedia(initialMatches: boolean) {
  const listeners: ChangeHandler[] = [];

  const mql = {
    matches: initialMatches,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((_type: string, cb: ChangeHandler) => {
      listeners.push(cb);
    }),
    removeEventListener: vi.fn((_type: string, cb: ChangeHandler) => {
      const index = listeners.indexOf(cb);
      if (index > -1) listeners.splice(index, 1);
    }),
    dispatchEvent: vi.fn(),
  };

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mql),
  );

  return {
    mql,
    triggerChange: (newMatches: boolean) => {
      mql.matches = newMatches;
      listeners.forEach((cb) => cb());
    },
  };
}

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true when query initially matches', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('returns false when query does not initially match', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('updates when media query match changes', () => {
    const { triggerChange } = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    act(() => {
      triggerChange(true);
    });

    expect(result.current).toBe(true);
  });

  it('removes event listener on unmount', () => {
    const { mql } = mockMatchMedia(true);
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    unmount();

    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('returns false as SSR-safe default (typeof window === undefined)', () => {
    vi.stubGlobal('window', undefined);

    const getDefault = () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(min-width: 768px)').matches;
    };

    expect(getDefault()).toBe(false);
  });
});

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true when query initially matches', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('returns false when query does not initially match', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('updates when media query match changes', () => {
    const { triggerChange } = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    act(() => {
      triggerChange(true);
    });

    expect(result.current).toBe(true);
  });

  it('removes event listener on unmount', () => {
    const { mql } = mockMatchMedia(true);
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    unmount();

    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('returns false as SSR-safe default (typeof window === undefined)', () => {
    vi.stubGlobal('window', undefined);

    const getDefault = () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(min-width: 768px)').matches;
    };

    expect(getDefault()).toBe(false);
  });
});
