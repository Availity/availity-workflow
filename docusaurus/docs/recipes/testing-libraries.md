---
title: Testing Libraries
---

`@availity/workflow` uses Vitest as its test runner. Tests run via `av test` or `yarn test`.

## Included Libraries

- **`vitest`** — test runner and assertion library
- **`@testing-library/react`** — React component testing utilities
- **`@testing-library/jest-dom`** — custom DOM matchers (works with Vitest)
- **`jsdom`** — browser environment for tests

## Setup

Create a `vitest.setup.js` file at your project root to add global test configuration:

```js
import '@testing-library/jest-dom/vitest';
```

Then reference it in `workflow.js`:

```js
export default (config) => {
  config.development.vitestOverrides = {
    setupFiles: ['./vitest.setup.js'],
  };
  return config;
};
```

## Example Test

```jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders heading', () => {
    render(<App />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
```

## Mocking API Responses

```js
import { vi, describe, it, expect } from 'vitest';

vi.mock('axios');

describe('data fetching', () => {
  it('fetches user data', async () => {
    const axios = await import('axios');
    axios.default.get.mockResolvedValue({ data: { name: 'Jane' } });
    // ... test component that calls axios
  });
});
```

## More Info

- [Vitest Guide](https://vitest.dev/guide/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Migrating from Jest](https://vitest.dev/guide/migration.html#jest)
