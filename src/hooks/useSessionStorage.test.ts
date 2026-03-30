import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { readStorageValue } from './storage';
import { useSessionStorage } from './useSessionStorage';

describe('useSessionStorage', () => {
  afterEach(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.clear();
    }
    vi.unstubAllGlobals();
  });

  it('reads existing JSON value from sessionStorage', () => {
    window.sessionStorage.setItem('prefs', JSON.stringify({ theme: 'dark' }));

    const { result } = renderHook(() => useSessionStorage('prefs', { theme: 'light' }));

    expect(result.current[0]).toEqual({ theme: 'dark' });
  });

  it('syncs updates to sessionStorage with JSON serialization', () => {
    const { result } = renderHook(() => useSessionStorage('enabled', false));
    expectTypeOf(result.current[0]).toEqualTypeOf<boolean>();

    act(() => {
      result.current[1](true);
    });

    expect(window.sessionStorage.getItem('enabled')).toBe('true');
    expect(result.current[0]).toBe(true);
  });

  it('returns initial value on JSON parse error', () => {
    window.sessionStorage.setItem('bad-json', '{ invalid json');

    const { result } = renderHook(() => useSessionStorage('bad-json', { retry: 3 }));

    expect(result.current[0]).toEqual({ retry: 3 });
  });

  it('returns initial value when window is undefined (SSR guard)', () => {
    vi.stubGlobal('window', undefined);

    const value = readStorageValue(undefined, 'ssr', 'fallback');
    expect(value).toBe('fallback');
  });
});
