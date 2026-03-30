import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWindowSize, useWindowSize } from './useWindowSize';

describe('useWindowSize', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('returns current window dimensions on mount', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({ width: 1024, height: 768 });
  });

  it('updates size after resize event with 100ms debounce', () => {
    vi.useFakeTimers();

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useWindowSize());

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1280,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(50);
    });

    expect(result.current).toEqual({ width: 1024, height: 768 });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current).toEqual({ width: 1280, height: 800 });
  });

  it('debounces rapid resize events — only last one applies', () => {
    vi.useFakeTimers();

    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 600,
    });

    const { result } = renderHook(() => useWindowSize());

    act(() => {
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(30);
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(30);
    });

    expect(result.current.width).toBe(800);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.width).toBe(1920);
  });

  it('removes resize listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useWindowSize());

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeSpy.mockRestore();
  });

  it('getWindowSize returns {0,0} in SSR context (typeof window === undefined)', () => {
    vi.stubGlobal('window', undefined);
    expect(getWindowSize()).toEqual({ width: 0, height: 0 });
  });
});
