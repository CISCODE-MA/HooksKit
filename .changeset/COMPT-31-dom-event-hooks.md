---
"@ciscode/hooks-kit": minor
---

feat(COMPT-31): add DOM & event hooks — useMediaQuery, useWindowSize, useClickOutside, useIntersectionObserver

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
