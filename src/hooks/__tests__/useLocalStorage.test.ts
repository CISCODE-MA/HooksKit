import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { readStorageValue } from '../storage';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  afterEach(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
    vi.unstubAllGlobals();
  });

  it('reads existing JSON value from localStorage', () => {
    window.localStorage.setItem('user', JSON.stringify({ name: 'Ana' }));

    const { result } = renderHook(() => useLocalStorage('user', { name: 'Default' }));

    expect(result.current[0]).toEqual({ name: 'Ana' });
  });

  it('syncs updates to localStorage with JSON serialization', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    expectTypeOf(result.current[0]).toEqualTypeOf<number>();

    act(() => {
      result.current[1](5);
    });

    expect(window.localStorage.getItem('count')).toBe('5');
    expect(result.current[0]).toBe(5);
  });

  it('returns initial value on JSON parse error', () => {
    window.localStorage.setItem('bad-json', '{ invalid json');

    const { result } = renderHook(() => useLocalStorage('bad-json', 42));

    expect(result.current[0]).toBe(42);
  });

  it('returns initial value when window is undefined (SSR guard)', () => {
    vi.stubGlobal('window', undefined);

    const value = readStorageValue(undefined, 'ssr', 'fallback');
    expect(value).toBe('fallback');
  });
});
