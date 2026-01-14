# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ydin is a pnpm monorepo containing health and wellness applications built with React 19, TypeScript, Vite, and Tailwind CSS.

## Common Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                    # Start Nutrition app dev server (localhost:5173)
pnpm storybook              # Start Design System Storybook (localhost:6006)

# Testing
pnpm test                   # Run all tests across all packages
pnpm --filter @ydin/nutrition test:unit   # Run unit tests only
pnpm --filter @ydin/nutrition test:e2e    # Run E2E tests only

# Code quality
pnpm lint                   # Lint all packages
pnpm lint:fix               # Lint and auto-fix
pnpm format                 # Format with Prettier
```

## Architecture

The Nutrition app follows a **layered MVC-inspired architecture** where each layer only communicates with adjacent layers:

```
Views (src/views/)           → Page composition
    ↓
Components (src/components/) → UI + user interaction
    ↓
Atoms (src/atoms/)           → Global state (Jotai)
    ↓
Services (src/services/)     → Business logic, API calls
    ↓
Domain (src/domain/)         → Date/time handling
    ↓
Providers (@ydin/storage)    → Storage abstraction (SQLite, IndexedDB, LocalStorage)
    ↓
Models (src/modals/)         → TypeScript interfaces
```

**Key principle**: Components use services, services use providers—never skip layers.

## Packages

| Package | Location | Purpose |
|---------|----------|---------|
| `@ydin/nutrition` | `packages/Nutrition/` | Main calorie/macro tracking app |
| `@ydin/design-system` | `packages/DesignSystem/` | Shared component library |
| `@ydin/storage-provider` | `packages/StorageProvider/` | Storage abstraction layer |

## Critical Patterns

### Date & Time Handling

**Never use raw JavaScript `Date` objects.** Always use the domain layer:

```typescript
import { CoreDate, Day, Week, Time, DateConfig } from '@/domain';

const today = Day.today();                    // Get today
const tomorrow = Day.add(today, 1);           // Add days
const week = Day.getWeek(today);              // Get week containing date
const formatted = Day.toShortWeekday(today);  // "Mon"
const timeLabel = Time.toLabel(now);          // "14:30" or "2:30 PM"
```

### Storage Provider

```typescript
import createProvider from '@ydin/storage-provider';

const provider = createProvider('sqlite', 'my-db', 1);
await provider.create('/diary/entries', { date: '2026-01-06', calories: 2000 });
await provider.search('/foods', { name: { fuzzy: 'apple' } });
```

### State Management with Jotai

```typescript
const setDialogState = useSetAtom(loggerDialog);  // Write only
const dialogState = useAtomValue(loggerDialog);   // Read only
setState(prev => ({ ...prev, open: true }));      // Update with spread
```

## Testing Strategy

Tests are organized by level. Push tests down to the lowest appropriate level:

- **E2E tests** (`e2e/tests/`): Critical user journeys only
- **Component tests** (`__test__/*.spec.tsx`): User interactions, props behavior
- **Unit tests** (`services/__test__/`): Business logic, utilities
- **Provider tests** (`providers/__test__/*.e2e.ts`): Storage interface testing

Run single test file: `pnpm --filter @ydin/nutrition test src/services/__test__/myService.spec.ts`

## Deployment Notes

The Nutrition app requires these HTTP headers for SQLite WASM with OPFS:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

## Import Aliases

Use `@/` for cleaner imports in the Nutrition package:

```typescript
import { searchGenerator } from '@/services/api/openFoodDex';
import type { IOpenFoodDexObject } from '@/modals';
```
