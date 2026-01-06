# Ydin Storage Provider

A storage abstraction layer that provides a unified API for multiple storage backends. Part of the [Ydin](../../README.md) suite of health and wellness apps.

## Features

- **Unified API** - Single interface for all storage operations
- **Multiple Backends** - SQLite WASM, IndexedDB, and LocalStorage
- **Async by Default** - All operations return Promises
- **Type-safe** - Full TypeScript support with generics

## Supported Providers

| Provider | Best For | Persistence | Capacity |
|----------|----------|-------------|----------|
| **SQLite** | Large datasets, complex queries | Persistent | Large (hundreds of MB) |
| **IndexedDB** | Moderate data, offline apps | Persistent | Large (hundreds of MB) |
| **LocalStorage** | Small data, simple key-value | Persistent | Limited (~5-10 MB) |

## Usage

### Installation

The package is available within the monorepo:

```json
{
  "dependencies": {
    "@ydin/storage-provider": "workspace:*"
  }
}
```

### Basic Usage

```typescript
import createProvider from '@ydin/storage-provider';

// Create a provider (defaults to IndexedDB)
const provider = createProvider('indexDB', 'my-database', 1);

// Or use SQLite for larger datasets
const sqliteProvider = createProvider('sqlite', 'my-database', 1, {
  wasmUrl: '/wa-sqlite-async.wasm'
});
```

### API

All providers implement the `BaseProvider` interface:

```typescript
interface BaseProvider {
  // Get all items at a path
  getAll<T>(path: string): Promise<T[]>;

  // Get a single item
  get<T>(path: string): Promise<T>;

  // Create a new item
  create<T>(path: string, data: T, generateId?: boolean): Promise<T & { id: string }>;

  // Create multiple items in batch
  createMany<T>(dataArray: { path: string; data: T }[], generateId?: boolean): Promise<void>;

  // Search with fuzzy or exact matching
  search<T>(path: string, query: IBaseSearchQuary): Promise<T[]>;

  // Update an existing item
  update<T>(path: string, data: Partial<T>): Promise<T>;

  // Delete an item
  delete(path: string): Promise<void>;
}
```

### Examples

```typescript
import createProvider from '@ydin/storage-provider';

const provider = createProvider('indexDB', 'nutrition-db', 1);

// Create an entry
const entry = await provider.create('/diary/entries', {
  date: '2026-01-06',
  calories: 2000,
  protein: 150
});

// Get all entries
const entries = await provider.getAll('/diary/entries');

// Search with fuzzy matching
const results = await provider.search('/foods', {
  name: { fuzzy: 'apple' }
});

// Update an entry
await provider.update(`/diary/entries/${entry.id}`, {
  calories: 2100
});

// Delete an entry
await provider.delete(`/diary/entries/${entry.id}`);
```

### Search Query Interface

```typescript
interface IBaseSearchQuary {
  [field: string]: {
    fuzzy?: string;  // Fuzzy text matching
    exact?: string;  // Exact value matching
  };
}

// Example: Search for foods with fuzzy name match
await provider.search('/foods', {
  name: { fuzzy: 'chick' }  // Matches "chicken", "chickpea", etc.
});

// Example: Exact category match
await provider.search('/foods', {
  category: { exact: 'vegetables' }
});
```

## Development

### Commands

Run from this directory (`packages/StorageProvider`):

```bash
# Run tests
pnpm test

# Run E2E tests (browser-based)
pnpm test:e2e

# Lint code
pnpm lint
```

### Project Structure

```
src/
├── base.ts           # Abstract base class and interfaces
├── index.ts          # Factory function and exports
├── indexDB/          # IndexedDB implementation
├── localstorage/     # LocalStorage implementation
├── sqlite/           # SQLite WASM implementation
└── assets/
    └── wasm.ts       # WASM URL helper
```

### Adding a New Provider

1. Create a new directory in `src/` (e.g., `src/myProvider/`)
2. Implement the `BaseProvider` abstract class
3. Export from `src/index.ts`
4. Add to the `createProvider` factory function

```typescript
// src/myProvider/index.ts
import BaseProvider from '../base';

export default class MyProvider extends BaseProvider {
  async getAll<T>(path: string): Promise<T[]> {
    // Implementation
  }
  // ... implement all abstract methods
}
```

## Tech Stack

| Category | Technology |
|----------|------------|
| **SQLite** | @subframe7536/sqlite-wasm |
| **Testing** | Vitest, Playwright |
| **Language** | TypeScript |

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for coding guidelines and best practices.

