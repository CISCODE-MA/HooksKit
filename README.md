# @ciscode/hooks-kit

12 production-ready React hooks. Zero runtime dependencies. SSR-safe.

[![npm](https://img.shields.io/npm/v/@ciscode/hooks-kit)](https://www.npmjs.com/package/@ciscode/hooks-kit)
[![license](https://img.shields.io/npm/l/@ciscode/hooks-kit)](./LICENSE)

---

## Installation

```bash
npm install @ciscode/hooks-kit
```

React 18+ is required as a peer dependency:

```bash
npm install react react-dom
```

---

## Usage

Import any hook directly from the package root — no deep imports needed:

```tsx
import { useDebounce, useLocalStorage, useMediaQuery } from '@ciscode/hooks-kit';
```

---

## SSR Compatibility

All DOM hooks (`useMediaQuery`, `useWindowSize`, `useClickOutside`, `useIntersectionObserver`) include `typeof window === 'undefined'` guards and are safe to render on the server (Next.js, Remix, etc.).

- `useMediaQuery` returns `false` on the server.
- `useWindowSize` returns `{ width: 0, height: 0 }` on the server.
- `useClickOutside` and `useIntersectionObserver` skip effect registration on the server.
- All other hooks (`useDebounce`, `useLocalStorage`, `useSessionStorage`, `usePrevious`, `useToggle`, `useInterval`, `useTimeout`, `useIsFirstRender`) have no DOM dependency and work in any environment.

---

## Hooks

### State & Storage

#### `useDebounce`

Delays updating a value until a given delay has passed since the last change. Useful for search inputs and API calls.

**Signature:**

```ts
function useDebounce<T>(value: T, delay: number): T;
```

| Param   | Type     | Description                          |
| ------- | -------- | ------------------------------------ |
| `value` | `T`      | The value to debounce                |
| `delay` | `number` | Milliseconds to wait before updating |

**Returns:** `T` — the debounced value.

**Example:**

```tsx
import { useDebounce } from '@ciscode/hooks-kit';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

---

#### `useLocalStorage`

Persists state in `localStorage` with JSON serialisation. Returns the initial value if the key is missing or the stored value is unparseable.

**Signature:**

```ts
function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>];
```

| Param          | Type     | Description                                    |
| -------------- | -------- | ---------------------------------------------- |
| `key`          | `string` | The localStorage key                           |
| `initialValue` | `T`      | Fallback value when key is absent or corrupted |

**Returns:** `[T, Dispatch<SetStateAction<T>>]` — same tuple as `useState`.

**Example:**

```tsx
import { useLocalStorage } from '@ciscode/hooks-kit';

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

---

#### `useSessionStorage`

Same as `useLocalStorage` but backed by `sessionStorage`. Data is cleared when the browser tab closes.

**Signature:**

```ts
function useSessionStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>];
```

| Param          | Type     | Description                                    |
| -------------- | -------- | ---------------------------------------------- |
| `key`          | `string` | The sessionStorage key                         |
| `initialValue` | `T`      | Fallback value when key is absent or corrupted |

**Returns:** `[T, Dispatch<SetStateAction<T>>]` — same tuple as `useState`.

**Example:**

```tsx
import { useSessionStorage } from '@ciscode/hooks-kit';

function Wizard() {
  const [step, setStep] = useSessionStorage('wizard-step', 1);

  return (
    <div>
      <p>Step {step}</p>
      <button onClick={() => setStep((s) => s + 1)}>Next</button>
    </div>
  );
}
```

---

### DOM & Events

#### `useMediaQuery`

Reactively tracks a CSS media query. Uses `useSyncExternalStore` for concurrent-safe updates. Returns `false` on the server.

**Signature:**

```ts
function useMediaQuery(query: string): boolean;
```

| Param   | Type     | Description                    |
| ------- | -------- | ------------------------------ |
| `query` | `string` | A valid CSS media query string |

**Returns:** `boolean` — `true` when the query matches, `false` otherwise.

**Example:**

```tsx
import { useMediaQuery } from '@ciscode/hooks-kit';

function Layout() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return <div>{isMobile ? <MobileNav /> : <DesktopNav />}</div>;
}
```

---

#### `useWindowSize`

Returns the current window dimensions, updated on resize with a 100 ms debounce. Returns `{ width: 0, height: 0 }` on the server.

**Signature:**

```ts
function useWindowSize(): WindowSize;

interface WindowSize {
  width: number;
  height: number;
}
```

**Returns:** `WindowSize` — `{ width, height }` in pixels.

**Example:**

```tsx
import { useWindowSize } from '@ciscode/hooks-kit';

function Banner() {
  const { width } = useWindowSize();

  return <div>{width > 1024 ? 'Large screen' : 'Small screen'}</div>;
}
```

---

#### `useClickOutside`

Fires a callback whenever a `mousedown` or `touchstart` event occurs outside the referenced element. Safe to use with portals.

**Signature:**

```ts
function useClickOutside<T extends Element>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
): void;
```

| Param     | Type                                        | Description                          |
| --------- | ------------------------------------------- | ------------------------------------ |
| `ref`     | `RefObject<T \| null>`                      | Ref attached to the element to watch |
| `handler` | `(event: MouseEvent \| TouchEvent) => void` | Called when a click outside occurs   |

**Returns:** `void`.

**Example:**

```tsx
import { useRef } from 'react';
import { useClickOutside } from '@ciscode/hooks-kit';

function Dropdown({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);

  return <div ref={ref}>Dropdown content</div>;
}
```

---

#### `useIntersectionObserver`

Observes when an element enters or exits the viewport using `IntersectionObserver`. Disconnects automatically on unmount.

**Signature:**

```ts
function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options?: IntersectionObserverInit,
): IntersectionObserverEntry | null;
```

| Param     | Type                         | Description                            |
| --------- | ---------------------------- | -------------------------------------- |
| `ref`     | `RefObject<Element \| null>` | Ref attached to the element to observe |
| `options` | `IntersectionObserverInit`   | Optional threshold, root, rootMargin   |

**Returns:** `IntersectionObserverEntry | null` — `null` until the first intersection event.

**Example:**

```tsx
import { useRef } from 'react';
import { useIntersectionObserver } from '@ciscode/hooks-kit';

function LazyImage({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1 });

  return (
    <div ref={ref}>{entry?.isIntersecting ? <img src={src} alt="" /> : <div>Loading…</div>}</div>
  );
}
```

---

### Async & Lifecycle

#### `usePrevious`

Returns the value from the previous render. Returns `undefined` on the first render.

**Signature:**

```ts
function usePrevious<T>(value: T): T | undefined;
```

| Param   | Type | Description        |
| ------- | ---- | ------------------ |
| `value` | `T`  | The value to track |

**Returns:** `T | undefined` — the previous value, or `undefined` on the first render.

**Example:**

```tsx
import { usePrevious } from '@ciscode/hooks-kit';

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>
        Now: {count} — Before: {prevCount ?? 'none'}
      </p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

---

#### `useToggle`

Manages a boolean state with a stable toggle function. The toggle callback reference never changes between renders.

**Signature:**

```ts
function useToggle(initial?: boolean): [boolean, () => void];
```

| Param     | Type      | Description                      |
| --------- | --------- | -------------------------------- |
| `initial` | `boolean` | Initial state (default: `false`) |

**Returns:** `[boolean, () => void]` — current state and a stable toggle function.

**Example:**

```tsx
import { useToggle } from '@ciscode/hooks-kit';

function Modal() {
  const [isOpen, toggle] = useToggle(false);

  return (
    <>
      <button onClick={toggle}>Open</button>
      {isOpen && (
        <dialog open>
          Content <button onClick={toggle}>Close</button>
        </dialog>
      )}
    </>
  );
}
```

---

#### `useInterval`

Runs a callback repeatedly at the given interval. Pass `null` as the delay to pause. The callback reference is always kept up to date — no stale closures.

**Signature:**

```ts
function useInterval(callback: () => void, delay: number | null): void;
```

| Param      | Type             | Description                          |
| ---------- | ---------------- | ------------------------------------ |
| `callback` | `() => void`     | Function to call on each tick        |
| `delay`    | `number \| null` | Interval in ms; pass `null` to pause |

**Returns:** `void`.

**Example:**

```tsx
import { useState } from 'react';
import { useInterval } from '@ciscode/hooks-kit';

function Clock() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useInterval(() => setSeconds((s) => s + 1), running ? 1000 : null);

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Resume'}</button>
    </div>
  );
}
```

---

#### `useTimeout`

Runs a callback once after the given delay. Pass `null` to cancel. Cleans up automatically on unmount.

**Signature:**

```ts
function useTimeout(callback: () => void, delay: number | null): void;
```

| Param      | Type             | Description                        |
| ---------- | ---------------- | ---------------------------------- |
| `callback` | `() => void`     | Function to call after the delay   |
| `delay`    | `number \| null` | Delay in ms; pass `null` to cancel |

**Returns:** `void`.

**Example:**

```tsx
import { useState } from 'react';
import { useTimeout } from '@ciscode/hooks-kit';

function Toast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  useTimeout(() => setVisible(false), 3000);

  return visible ? <div className="toast">{message}</div> : null;
}
```

---

#### `useIsFirstRender`

Returns `true` on the first render and `false` on every subsequent render. Useful for skipping effects on mount.

**Signature:**

```ts
function useIsFirstRender(): boolean;
```

**Returns:** `boolean` — `true` only on the first render.

**Example:**

```tsx
import { useEffect } from 'react';
import { useIsFirstRender } from '@ciscode/hooks-kit';

function DataSync({ value }: { value: string }) {
  const isFirst = useIsFirstRender();

  useEffect(() => {
    if (isFirst) return; // skip on mount
    syncToServer(value);
  }, [value, isFirst]);

  return null;
}
```

---

## Scripts

```bash
npm run build       # Build to dist/ (ESM + CJS + types)
npm test            # Run tests (vitest)
npm run typecheck   # TypeScript typecheck
npm run verify      # Lint + typecheck + tests + coverage
```

---

## License

MIT — see [LICENSE](./LICENSE).

- `npm run lint` – ESLint
- `npm run format` / `npm run format:write` – Prettier
- `npx changeset` – create a changeset

## Release flow (summary)

- Work on a `feature` branch from `develop`
- Merge to `develop`
- Add a changeset for user-facing changes: `npx changeset`
- Promote `develop` → `master`
- Tag `vX.Y.Z` to publish (npm OIDC)

This repository is a **template**. Teams should clone it and focus only on
library logic, not tooling or release mechanics.
