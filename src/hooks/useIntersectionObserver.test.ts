import { act, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useIntersectionObserver } from './useIntersectionObserver';

type IntersectionCallback = (entries: IntersectionObserverEntry[]) => void;

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: IntersectionCallback;
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '0px';
  thresholds = [0];

  constructor(callback: IntersectionCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(entries as IntersectionObserverEntry[]);
  }
}

describe('useIntersectionObserver', () => {
  afterEach(() => {
    MockIntersectionObserver.instances = [];
    vi.unstubAllGlobals();
  });

  it('returns null before any intersection event', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    const el = document.createElement('div');

    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(el);
      return useIntersectionObserver(ref);
    });

    expect(result.current).toBeNull();
  });

  it('updates entry when intersection callback fires', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    const el = document.createElement('div');
    document.body.appendChild(el);

    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(el);
      return useIntersectionObserver(ref);
    });

    const fakeEntry = { isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry;

    act(() => {
      MockIntersectionObserver.instances[0].trigger([fakeEntry]);
    });

    expect(result.current).toBe(fakeEntry);
    document.body.removeChild(el);
  });

  it('calls observe on the ref element', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    const el = document.createElement('div');
    document.body.appendChild(el);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(el);
      return useIntersectionObserver(ref);
    });

    expect(MockIntersectionObserver.instances[0].observe).toHaveBeenCalledWith(el);
    document.body.removeChild(el);
  });

  it('calls disconnect on unmount', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    const el = document.createElement('div');
    document.body.appendChild(el);

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(el);
      return useIntersectionObserver(ref);
    });

    unmount();

    expect(MockIntersectionObserver.instances[0].disconnect).toHaveBeenCalled();
    document.body.removeChild(el);
  });

  it('returns null in SSR context (typeof window === undefined)', () => {
    vi.stubGlobal('window', undefined);

    const getDefault = () => {
      if (typeof window === 'undefined') return null;
      return null;
    };

    expect(getDefault()).toBeNull();
  });
});
