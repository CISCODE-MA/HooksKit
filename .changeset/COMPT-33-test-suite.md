---
'@ciscode/hooks-kit': patch
---

test(COMPT-33): full test suite for all 12 hooks

- Consolidate all hook tests under src/hooks/__tests__/
- Cover all 12 hooks: useDebounce, useLocalStorage, useSessionStorage,
  useMediaQuery, useWindowSize, useClickOutside, useIntersectionObserver,
  usePrevious, useToggle, useInterval, useTimeout, useIsFirstRender
- Use vitest fake timers for useDebounce, useInterval, useTimeout, useWindowSize
- Verify all acceptance criteria per COMPT-33 definition of done
- Coverage ≥ 85% lines across all hooks
