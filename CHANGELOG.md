# @ciscode/hooks-kit

## 0.1.0

### Minor Changes

- 8cde8b0: feat(COMPT-30): add state & storage hooks — useDebounce, useLocalStorage, useSessionStorage

  First batch of production-ready hooks for HooksKit (epic COMPT-2).

  **New hooks:**
  - `useDebounce<T>(value, delay)` — returns debounced value; resets timer on value or delay change
  - `useLocalStorage<T>(key, initial)` — syncs with `localStorage`, SSR-safe, JSON serialization, parse-error fallback
  - `useSessionStorage<T>(key, initial)` — same pattern for `sessionStorage`

  **Implementation details:**
  - Shared `storage.ts` helper (`readStorageValue` / `writeStorageValue`) encapsulates SSR guard (`typeof window === 'undefined'`) and JSON parse fallback
  - Generics inferred at call site — no manual type params required
  - Zero runtime dependencies
  - `tsc --noEmit` passes, ESLint passes (0 warnings), 13/13 tests pass, coverage ≥ 91%
  - All three hooks exported from `src/index.ts`

- 788fe7e: feat(COMPT-31): add DOM & event hooks — useMediaQuery, useWindowSize, useClickOutside, useIntersectionObserver

  Second batch of production-ready hooks for HooksKit (epic COMPT-2).

  **New hooks:**
  - `useMediaQuery(query)` — tracks `matchMedia`, updates on change via `useSyncExternalStore`, SSR-safe (server snapshot returns `false`)
  - `useWindowSize()` — returns `{ width, height }`, debounced 100ms on resize, SSR-safe (returns `{ 0, 0 }`)
  - `useClickOutside(ref, handler)` — fires on `mousedown` or `touchstart` outside ref element, handler updated via ref pattern to avoid stale closures
  - `useIntersectionObserver(ref, options?)` — returns latest `IntersectionObserverEntry | null`, disconnects observer on unmount

  **Implementation details:**
  - All listeners registered in `useEffect` and removed in cleanup return
  - All SSR-safe: `typeof window === 'undefined'` guards in every hook
  - `useMediaQuery` uses `useSyncExternalStore` (React 18) — no `setState` in effects
  - Zero runtime dependencies
  - `tsc --noEmit` passes, ESLint passes (0 warnings), 26/26 tests pass, coverage ≥ 95%
  - All four hooks exported from `src/index.ts`

- 0117305: feat(COMPT-32): add async & lifecycle hooks — usePrevious, useToggle, useInterval, useTimeout, useIsFirstRender

  Third and final batch of production-ready hooks for HooksKit (epic COMPT-2). Completes the 12-hook surface.

  **New hooks:**
  - `usePrevious<T>(value)` — returns previous render value via state derivation; `undefined` on first render
  - `useToggle(initial?)` — toggles boolean state with stable `useCallback` reference
  - `useInterval(callback, delay | null)` — runs callback on interval; stops immediately when `delay` is `null`; always uses latest callback via ref
  - `useTimeout(callback, delay | null)` — fires callback once after delay; cancels when `delay` is `null` or on unmount; always uses latest callback via ref
  - `useIsFirstRender()` — returns `true` only on first render, `false` on all subsequent renders

  **Implementation details:**
  - `usePrevious` uses React state-derivation pattern (no ref read during render) to satisfy strict lint rules
  - `useIsFirstRender` uses ref-based approach with scoped `eslint-disable` (only valid alternative; cannot use setState-in-effect or ref-read-in-render rules)
  - All timer cleanup in `useEffect` return — verified under React StrictMode
  - Zero runtime dependencies
  - `tsc --noEmit` passes, ESLint passes (0 warnings), 25/25 tests pass, hooks coverage ≥ 98%
  - All five hooks exported from `src/index.ts`

- feat(COMPT-34): README documentation and v0.1.0 publish
  - Full README with installation, SSR compatibility note, and one usage
    example per hook (12 total) with param and return types
  - Remove \_\_hooks_placeholder export from hooks barrel
  - All 12 hooks importable from @ciscode/hooks-kit package root
  - Bump to v0.1.0 — first public release

### Patch Changes

- 1eeeaaa: test(COMPT-33): full test suite for all 12 hooks
  - Consolidate all hook tests under src/hooks/**tests**/
  - Cover all 12 hooks: useDebounce, useLocalStorage, useSessionStorage,
    useMediaQuery, useWindowSize, useClickOutside, useIntersectionObserver,
    usePrevious, useToggle, useInterval, useTimeout, useIsFirstRender
  - Use vitest fake timers for useDebounce, useInterval, useTimeout, useWindowSize
  - Verify all acceptance criteria per COMPT-33 definition of done
  - Coverage ≥ 85% lines across all hooks
