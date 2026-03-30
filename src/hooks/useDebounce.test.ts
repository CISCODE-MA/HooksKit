import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately and updates after delay', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 100 },
    });

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 100 });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('second');
  });

  it('resets the timer when value changes', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'a', delay: 100 },
    });

    rerender({ value: 'b', delay: 100 });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    rerender({ value: 'c', delay: 100 });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current).toBe('c');
  });

  it('resets the timer when delay changes', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 1, delay: 100 },
    });

    rerender({ value: 2, delay: 200 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(1);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(2);
  });
});
