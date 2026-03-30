import { act, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  it('calls handler on mousedown outside the ref element', () => {
    const handler = vi.fn();
    const outer = document.createElement('div');
    const inner = document.createElement('button');
    outer.appendChild(inner);
    document.body.appendChild(outer);

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(inner.parentElement as HTMLDivElement);
      useClickOutside(ref, handler);
    });

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledTimes(1);
    unmount();
    document.body.removeChild(outer);
  });

  it('calls handler on touchstart outside the ref element', () => {
    const handler = vi.fn();
    const outer = document.createElement('div');
    document.body.appendChild(outer);

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(outer);
      useClickOutside(ref, handler);
    });

    const outsideNode = document.createElement('span');
    document.body.appendChild(outsideNode);

    act(() => {
      outsideNode.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledTimes(1);
    unmount();
    document.body.removeChild(outer);
    document.body.removeChild(outsideNode);
  });

  it('does NOT call handler on mousedown inside the ref element', () => {
    const handler = vi.fn();
    const outer = document.createElement('div');
    const inner = document.createElement('button');
    outer.appendChild(inner);
    document.body.appendChild(outer);

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(outer);
      useClickOutside(ref, handler);
    });

    act(() => {
      inner.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(handler).not.toHaveBeenCalled();
    unmount();
    document.body.removeChild(outer);
  });

  it('removes event listeners on unmount', () => {
    const handler = vi.fn();
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const el = document.createElement('div');

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(el);
      useClickOutside(ref, handler);
    });

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
    removeSpy.mockRestore();
  });
});
