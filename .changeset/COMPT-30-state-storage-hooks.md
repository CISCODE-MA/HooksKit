---
"@ciscode/reactts-developerkit": minor
---

feat(COMPT-30): add state & storage hooks — useDebounce, useLocalStorage, useSessionStorage

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
