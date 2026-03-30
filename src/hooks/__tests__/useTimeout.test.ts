import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useTimeout } from '../useTimeout';

describe('useTimeout', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('fires callback exactly once after delay', () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    renderHook(() => useTimeout(callback, 200));

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not fire when delay is null', () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    renderHook(() => useTimeout(callback, null));

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it('stops when delay changes to null before firing', () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    const { rerender } = renderHook(
      ({ delay }: { delay: number | null }) => useTimeout(callback, delay),
      { initialProps: { delay: 500 as number | null } },
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({ delay: null });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it('clears timeout on unmount', () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    const { unmount } = renderHook(() => useTimeout(callback, 300));

    unmount();

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it('always uses the latest callback reference', () => {
    vi.useFakeTimers();
    const first = vi.fn();
    const second = vi.fn();

    const { rerender } = renderHook(({ cb }: { cb: () => void }) => useTimeout(cb, 200), {
      initialProps: { cb: first },
    });

    rerender({ cb: second });

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
