---
"@ciscode/hooks-kit": minor
---

feat(COMPT-32): add async & lifecycle hooks — usePrevious, useToggle, useInterval, useTimeout, useIsFirstRender

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
