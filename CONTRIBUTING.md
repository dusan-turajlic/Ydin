# Contributing to Ydin

Welcome to Ydin! This guide will help you understand the codebase architecture and get you up to speed quickly so you can start contributing effectively.

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Code Organization](#code-organization)
- [Layer Responsibilities (MVC Pattern)](#layer-responsibilities-mvc-pattern)
- [Coding Guidelines](#coding-guidelines)
- [DRY Principles](#dry-principles)
- [State Management](#state-management)
- [Adding New Features](#adding-new-features)
- [Testing Strategy](#testing-strategy)
  - [Philosophy: Less is More](#philosophy-less-is-more)
  - [Test Levels: Where Should This Test Live?](#test-levels-where-should-this-test-live)
  - [Decision Guide: Should I Write This Test?](#decision-guide-should-i-write-this-test)
  - [Test File Organization](#test-file-organization)
  - [What to Test at Each Level](#what-to-test-at-each-level)
  - [Error Testing Strategy](#error-testing-strategy)
- [Common Patterns](#common-patterns)
- [Date & Time Handling](#date--time-handling)
  - [Why We Don't Use Raw Date Objects](#why-we-dont-use-raw-date-objects)
  - [The Date Domain Layer](#the-date-domain-layer)
  - [Date Domain Usage Guide](#date-domain-usage-guide)

---

## Quick Start

```bash
# 1. Clone and install
git clone <repository-url>
cd Ydin
pnpm install

# 2. Start development server
pnpm dev

# 3. Run tests (in another terminal)
pnpm test
```

The app runs at `http://localhost:5173` by default.

---

## Architecture Overview

Ydin follows a **layered architecture** inspired by the MVC pattern, adapted for React:

```
┌─────────────────────────────────────────────────────────────────────┐
│                           VIEWS (UI Layer)                          │
│    React Components that render UI and handle user interactions     │
│                         src/views/                                  │
├─────────────────────────────────────────────────────────────────────┤
│                        COMPONENTS (View Logic)                       │
│    Reusable UI components with presentation logic                   │
│                       src/components/                               │
├─────────────────────────────────────────────────────────────────────┤
│                      STATE (Controller Layer)                        │
│    Jotai atoms that manage application state                        │
│                         src/atoms/                                  │
├─────────────────────────────────────────────────────────────────────┤
│                      SERVICES (Business Logic)                       │
│    API calls, data transformation, business rules                   │
│                        src/services/                                │
├─────────────────────────────────────────────────────────────────────┤
│                       DOMAIN (Core Logic)                            │
│    Date/time handling, business entities                            │
│                        src/domain/                                  │
├─────────────────────────────────────────────────────────────────────┤
│                      PROVIDERS (Data Access)                         │
│    Database operations, storage abstraction                         │
│                   packages/StorageProvider/                         │
├─────────────────────────────────────────────────────────────────────┤
│                         MODELS (Data Types)                          │
│    TypeScript interfaces and type definitions                       │
│                         src/modals/                                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → Component → Atom (state) → Service → Provider → Storage
                  ↑                                              │
                  └──────────────── Response ───────────────────┘
```

---

## Code Organization

```
packages/Nutrition/src/
├── atoms/                  # Jotai atoms (global state)
│   ├── day.ts              # Selected day state
│   ├── sheet.ts            # Modal sheet state
│   ├── targets.ts          # Nutrition target state
│   └── time.ts             # Time-related state
│
├── components/             # Reusable UI components
│   ├── DiaryTracker.tsx    # Main diary view
│   ├── FoodSearchSheet.tsx # Food search modal
│   ├── ProductDetail.tsx   # Food item detail view
│   ├── Scanner.tsx         # Barcode scanner
│   ├── SearchResults.tsx   # Search results list
│   ├── TopNavigation.tsx   # Top navigation bar
│   ├── WeekDaySelector.tsx # Week/day navigation
│   └── ui/                 # Small UI primitives
│
├── domain/                 # Date/time domain layer (see Date & Time Handling)
│   ├── CoreDate.ts         # Immutable UTC date wrapper
│   ├── DateConfig.ts       # Locale/format configuration
│   ├── Day.ts              # Day-level operations
│   ├── Time.ts             # Time-level operations
│   ├── Week.ts             # Week container class
│   └── index.ts            # Domain exports
│
├── hooks/                  # Custom React hooks
│   ├── useOpenFoodDex.ts   # Food database initialization
│   └── useSheetContentHeight.ts
│
├── modals/                 # Data models/interfaces (TypeScript types)
│   └── index.ts            # IOpenFoodDexObject, Product, etc.
│
├── services/               # Business logic & external APIs
│   ├── api/
│   │   └── openFoodDex/    # Food database service
│   └── storage/
│       ├── diary/          # Diary-specific storage logic
│       └── foodTracker/    # Food tracking storage
│
├── utils/                  # Pure utility functions
│   ├── colors.ts           # Color utilities
│   ├── debounce.ts         # Debounce helper
│   ├── format.ts           # Formatting utilities
│   └── macros.ts           # Macro calculations
│
├── views/                  # Page-level components
│   ├── Tracker.tsx         # Main food tracking page
│   └── NotFound.tsx        # 404 page
│
├── constants/              # App-wide constants
│   ├── colors.ts
│   ├── nutrition.ts
│   └── tabs.ts
│
├── App.tsx                 # Root component with routing
├── main.tsx               # Entry point
└── index.css              # Global styles

packages/StorageProvider/   # Separate package for storage abstraction
├── src/
│   ├── base.ts             # Abstract base provider
│   ├── index.ts            # Provider factory
│   ├── indexDB/            # IndexedDB implementation
│   ├── localstorage/       # LocalStorage implementation
│   └── sqlite/             # SQLite WASM implementation
```

---

## Layer Responsibilities (MVC Pattern)

### 1. **Views** (`src/views/`)
Page-level components that compose the UI. Views should:
- Combine components to create pages
- Handle route-level logic
- Be minimal - delegate to components

```tsx
// ✅ Good: Views compose components
export default function Tracker() {
    return (
        <div>
            <WeekDaySelector />
            <DiaryTracker />
        </div>
    )
}

// ❌ Bad: Views with business logic
export default function Tracker() {
    const [foods, setFoods] = useState([]);
    useEffect(() => {
        fetch('/api/foods').then(/* ... */);  // Move to service!
    }, []);
    // ... lots of logic
}
```

### 2. **Components** (`src/components/`)
Reusable UI building blocks. Components should:
- Handle presentation and user interaction
- Use atoms for shared state
- Call services for data operations
- Be composable and reusable

```tsx
// ✅ Good: Component uses atom and service
function Search() {
    const setDialogState = useSetAtom(loggerDialog);
    const [results, setResults] = useState([]);
    
    const handleSearch = async (query: string) => {
        // Service handles the business logic
        const items = await searchFoods(query);
        setResults(items);
    };
    
    return (/* JSX */);
}

// ❌ Bad: Component with provider logic
function Search() {
    const handleSearch = async (query: string) => {
        // Don't access provider directly from components!
        const sqlite = await initSQLite();
        const results = await sqlite.run('SELECT * FROM ...');
    };
}
```

### 3. **Atoms** (`src/atoms/`)
Global state management using Jotai. Atoms should:
- Define the shape of shared state
- Be minimal and focused
- Include TypeScript types

```tsx
// ✅ Good: Focused atom with clear types
export const LoggerDialogState = {
    DEFAULT: "DEFAULT",
    LAUNCHER: "LAUNCHER",
    FOOD_ITEM: "FOOD_ITEM",
} as const;

interface LoggerDialogMetadata {
    tab?: string;
    id?: string;
    barcode?: string;
}

export const loggerDialog = atom({
    open: false,
    state: LoggerDialogState.DEFAULT,
    metadata: {} as LoggerDialogMetadata,
});
```

### 4. **Services** (`src/services/`)
Business logic and external integrations. Services should:
- Encapsulate business rules
- Handle API calls and data transformation
- Be framework-agnostic (no React imports)
- Use providers for storage

```tsx
// ✅ Good: Service encapsulates business logic
// src/services/api/openFoodDex/index.ts

import createProvider from "@/providers";
import type { IOpenFoodDexObject } from "@/modals";

const provider = createProvider("sqlite", DB_NAME, DB_VERSION);

// Pure async generator - no React
export async function* searchGenerator(freeText: string): AsyncGenerator<IOpenFoodDexObject> {
    for await (const item of provider.search<IOpenFoodDexObject>('/products', {
        name: { fuzzy: freeText }
    })) {
        yield item;
    }
}

// Pure async function - no React
export async function searchByBarcode(barcode: string): Promise<Product | null> {
    const res = await fetch(`${FOOD_DEX_URL}/products/${barcode}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
```

### 5. **Providers** (`src/providers/`)
Data access abstraction layer. Providers should:
- Implement the `BaseProvider` interface
- Handle all storage operations
- Be interchangeable (SQLite, IndexedDB, LocalStorage)
- NOT contain business logic

```tsx
// ✅ Good: Provider only handles storage
export default abstract class BaseProvider {
    abstract getAll<T>(path: string): Promise<T[]>;
    abstract get<T>(path: string): Promise<T>;
    abstract create<T>(path: string, data: T, generateId?: boolean): Promise<T & { id: string }>;
    abstract createMany<T>(dataArray: { path: string, data: T }[], generateId?: boolean): Promise<void>;
    abstract search<T>(path: string, query: IBaseSearchQuary): AsyncGenerator<T>;
    abstract update<T>(path: string, data: Partial<T>): Promise<T>;
    abstract delete(path: string): Promise<void>;
}

// Factory function to create providers
export default function createProvider(
    provider: ProviderType = 'indexDB',
    dbName?: string,
    dbVersion?: number
): BaseProvider {
    switch (provider) {
        case 'sqlite': return new SQLiteProvider(dbName, dbVersion);
        case 'indexDB': return new IndexDBProvider(dbName, dbVersion);
        case 'local': return new LocalStorageProvider(dbName, dbVersion);
    }
}
```

### 6. **Models** (`src/modals/`)
TypeScript interfaces and types. Models should:
- Define data structures
- Be pure types (no runtime code)
- Be shared across layers

```tsx
// ✅ Good: Pure type definitions
export interface IOpenFoodDexObject {
    code: string;
    name: string;
    brand: string;
    categories: string[];
    kcal?: number;
    protein?: number;
    fat?: number;
    carbs?: number;
    fiber?: number;
}

export interface Product {
    code: string;
    product_name?: string;
    brands?: string;
    macros?: {
        per100g?: MacroValues;
        serving?: MacroValues;
    };
}
```

---

## Coding Guidelines

### DRY Principles

**1. Extract Reusable Components**

```tsx
// ❌ Bad: Duplicated progress bar logic
function FoodItem() {
    return (
        <>
            <div className="h-2 bg-gray-700 rounded-full">
                <div style={{ width: `${proteinPct}%` }} />
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
                <div style={{ width: `${carbsPct}%` }} />
            </div>
        </>
    );
}

// ✅ Good: Reusable component
function ProgressBar({ percentage, color }: Props) {
    return (
        <div className="h-2 bg-gray-700 rounded-full">
            <div 
                className="h-full rounded-full" 
                style={{ width: `${percentage}%`, backgroundColor: color }} 
            />
        </div>
    );
}

function FoodItem() {
    return (
        <>
            <ProgressBar percentage={proteinPct} color="#F87171" />
            <ProgressBar percentage={carbsPct} color="#34D399" />
        </>
    );
}
```

**2. Extract Shared Logic into Hooks**

```tsx
// ❌ Bad: Duplicated fetch logic
function ComponentA() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('/api/foods').then(r => r.json()).then(setData);
    }, []);
}

function ComponentB() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('/api/foods').then(r => r.json()).then(setData);
    }, []);
}

// ✅ Good: Custom hook
function useFoods() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('/api/foods').then(r => r.json()).then(setData);
    }, []);
    return data;
}

function ComponentA() {
    const foods = useFoods();
}

function ComponentB() {
    const foods = useFoods();
}
```

**3. Extract Business Logic into Services**

```tsx
// ❌ Bad: Business logic in component
function FoodItem({ macros }) {
    // Calorie calculation is business logic
    const calories = (macros.protein * 4) + (macros.fat * 9) + (macros.carbs * 4);
}

// ✅ Good: Service function
// src/services/nutrition/index.ts
export function calculateCalories(macros: Macros): number {
    return (macros.protein * 4) + (macros.fat * 9) + (macros.carbs * 4);
}

// Component uses service
import { calculateCalories } from '@/services/nutrition';

function FoodItem({ macros }) {
    const calories = calculateCalories(macros);
}
```

**4. Use Constants for Magic Values**

```tsx
// ❌ Bad: Magic numbers scattered
function FoodItem() {
    const caloriesPct = (calories / 2000) * 100;
    const proteinPct = (protein / 150) * 100;
}

// ✅ Good: Centralized constants
// src/constants.ts
export const DAILY_TARGETS = {
    calories: 2000,
    protein: 150,
    fat: 65,
    carbs: 225,
} as const;

// Component uses constants
import { DAILY_TARGETS } from '@/constants';

function FoodItem() {
    const caloriesPct = (calories / DAILY_TARGETS.calories) * 100;
}
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `FoodItem.tsx`, `WeekDaySelector.tsx` |
| Hooks | camelCase with `use` prefix | `useOpenFoodDex.ts` |
| Services | camelCase | `openFoodDex/index.ts` |
| Utilities | camelCase | `browser.ts`, `uuid.ts` |
| Types/Models | PascalCase with `I` prefix for interfaces | `IOpenFoodDexObject` |
| Constants | SCREAMING_SNAKE_CASE | `DAILY_TARGETS`, `DB_NAME` |

### Import Aliases

Use the `@/` alias for cleaner imports:

```tsx
// ✅ Good: Use path alias
import { searchGenerator } from '@/services/api/openFoodDex';
import type { IOpenFoodDexObject } from '@/modals';
import { DAILY_TARGETS } from '@/constants';

// ❌ Bad: Relative paths
import { searchGenerator } from '../../../services/api/openFoodDex';
```

---

## State Management

### When to Use Each State Type

| State Type | When to Use | Example |
|------------|-------------|---------|
| `useState` | Local UI state | Form inputs, loading states |
| Jotai Atom | Shared/global state | Dialog open state, user settings |
| URL State | Shareable state | Selected date, filters |
| Server State | Remote data | Food database results |

### Jotai Best Practices

```tsx
// ✅ Separate read and write when needed
const setDialogState = useSetAtom(loggerDialog);  // Write only
const dialogState = useAtomValue(loggerDialog);   // Read only

// ✅ Use spread to update atoms
setState(prev => ({ ...prev, open: true }));

// ❌ Don't mutate atoms directly
state.open = true;  // Bad!
```

---

## Adding New Features

### Checklist for New Features

1. **Define Models** (`src/modals/`)
   - Add TypeScript interfaces for new data types

2. **Create Provider Methods** (if storage needed)
   - Add methods to `BaseProvider` interface
   - Implement in all provider classes

3. **Build Services** (`src/services/`)
   - Create business logic functions
   - Keep framework-agnostic

4. **Add Atoms** (if shared state needed)
   - Define minimal, focused atoms
   - Include TypeScript types

5. **Create Components** (`src/components/`)
   - Build UI components
   - Use services for data operations
   - Use atoms for shared state

6. **Add Views** (if new page)
   - Compose components into pages
   - Add routes in `App.tsx`

7. **Write Tests**
   - Unit tests for services/utilities
   - Component tests for UI logic
   - E2E tests for user flows

### Example: Adding a "Favorites" Feature

```
1. Models: Add IFavoriteFood interface
2. Provider: Implement storage methods
3. Service: Create favorites service (add, remove, list)
4. Atom: Create favoritesAtom for UI state
5. Component: Build FavoriteButton, FavoritesList
6. Tests: Unit test service, component test UI
```

---

## Testing Strategy

### Philosophy: Less is More

Our testing philosophy prioritizes **meaningful tests over comprehensive coverage**. We test what matters to users, not implementation details. Every test should answer: *"Does this protect a real user experience or business-critical behavior?"*

**Core Principles:**

1. **Test user interactions, not implementation** - If users don't see it, don't test it
2. **Simple error cases only** - Test likely failures, not edge cases that never happen
3. **Test at the right level** - Push tests down to the lowest appropriate level
4. **Avoid test bloat** - Question every test's value

### Test Levels: Where Should This Test Live?

```
┌─────────────────────────────────────────────────────────────────────┐
│                    E2E TESTS (Playwright)                          │
│  ❌ Don't test: Complex business logic, error handling             │
│  ✅ Do test: Critical user journeys, smoke tests                   │
│  Location: e2e/tests/*.spec.ts                                     │
├─────────────────────────────────────────────────────────────────────┤
│                  VIEW TESTS (Vitest Browser)                        │
│  ❌ Don't test: Component-level interactions                       │
│  ✅ Do test: Simple page-level user flows                          │
│  Location: src/views/__test__/*.e2e.ts                             │
├─────────────────────────────────────────────────────────────────────┤
│                COMPONENT TESTS (Vitest + RTL)                       │
│  ❌ Don't test: Internal state, styling, implementation details    │
│  ✅ Do test: User interactions, props behavior, callbacks          │
│  Location: src/components/__test__/*.spec.tsx                      │
├─────────────────────────────────────────────────────────────────────┤
│                   UNIT TESTS (Vitest)                               │
│  ❌ Don't test: Simple pass-through functions, obvious code        │
│  ✅ Do test: Business logic, utilities, service public interfaces  │
│  Location: src/services/__test__/*.spec.ts, src/utils/__test__/    │
├─────────────────────────────────────────────────────────────────────┤
│                 PROVIDER TESTS (Vitest Browser)                     │
│  ❌ Don't test: Provider internals                                 │
│  ✅ Do test: Public CRUD interface, cross-provider compatibility   │
│  Location: src/providers/__test__/*.e2e.ts                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Decision Guide: Should I Write This Test?

Ask yourself these questions:

| Question | If YES | If NO |
|----------|--------|-------|
| Does a user directly interact with this? | Test it | Consider skipping |
| Would a failure break a critical flow? | Test it | Consider skipping |
| Is this testing behavior or implementation? | Behavior → Test | Implementation → Skip |
| Can I test this at a lower level? | Push it down | Test here |
| Does this test already exist elsewhere? | Skip duplicate | Write it |

### Test File Organization

**Default: Single test file per source file**

```
src/components/FoodItem.tsx
src/components/__test__/FoodItem.spec.tsx
```

**When to split test files:**

Only split when a single test file exceeds ~200-300 lines AND tests fall into distinct categories. Use these suffixes:

| Suffix | Purpose | Content |
|--------|---------|---------|
| `.smoke.spec.ts` | Quick sanity checks | Basic rendering, initialization |
| `.interactions.spec.ts` | User behavior | Click, input, navigation |
| `.errors.spec.ts` | Failure handling | API errors, validation |

**Example split structure:**
```
src/components/__test__/
├── FoodItem.spec.tsx              # Default: all tests here
└── (only if needed):
    ├── FoodItem.smoke.spec.tsx    # Basic rendering tests
    ├── FoodItem.interactions.spec.tsx  # User interactions
    └── FoodItem.errors.spec.tsx   # Error cases
```

> ⚠️ **Before splitting**: Question if you're testing at the right level. Too many tests often means you should push logic down to services/utilities.

### What to Test at Each Level

#### E2E Tests (Playwright)
**Purpose:** Verify the app works end-to-end from a user's perspective

```typescript
// ✅ Good: Critical user journey
test('user can search and add food to diary', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Search food').fill('Apple');
    await page.getByText('Apple (100g)').click();
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Added to diary')).toBeVisible();
});

// ❌ Bad: Testing implementation details
test('clicking search sets loading state', async ({ page }) => {
    // This tests implementation, not user value
});
```

#### Component Tests
**Purpose:** Verify components respond correctly to user interaction

```tsx
// ✅ Good: Tests user interaction
it('calls onSelect when food item is clicked', async () => {
    const onSelect = vi.fn();
    render(<FoodItem food={mockFood} onSelect={onSelect} />);
    
    await userEvent.click(screen.getByText('Apple'));
    
    expect(onSelect).toHaveBeenCalledWith(mockFood);
});

// ✅ Good: Tests visible output
it('displays macro information', () => {
    render(<FoodItem food={mockFood} />);
    
    expect(screen.getByText('150 kcal')).toBeVisible();
    expect(screen.getByText('10g protein')).toBeVisible();
});

// ❌ Bad: Tests internal state
it('sets loading state to true when clicked', () => {
    // Internal state is implementation detail
});

// ❌ Bad: Tests styling
it('has correct background color', () => {
    // CSS is implementation detail
});
```

#### Unit Tests (Services & Utilities)
**Purpose:** Verify business logic works correctly

```typescript
// ✅ Good: Tests public interface
describe('calculateCalories', () => {
    it('calculates correctly from macros', () => {
        const macros = { protein: 10, carbs: 20, fat: 5 };
        expect(calculateCalories(macros)).toBe(165); // 10*4 + 20*4 + 5*9
    });
});

// ✅ Good: Tests important error case
describe('searchByBarcode', () => {
    it('throws when product not found', async () => {
        await expect(searchByBarcode('invalid')).rejects.toThrow('Product not found');
    });
});

// ❌ Bad: Tests implementation
it('calls fetch with correct headers', () => {
    // Implementation detail
});
```

### Error Testing Strategy

**Test only:**
- Errors users will see (validation, not found, network failures)
- Errors that affect data integrity
- Errors from external dependencies (APIs, storage)

**Skip:**
- Defensive coding errors (null checks that "can't happen")
- Framework-level errors React/TypeScript already catch
- Every possible exception path

```typescript
// ✅ Good: User-facing error
it('shows error message when search fails', async () => {
    server.use(rest.get('/api/search', () => HttpResponse.error()));
    
    render(<Search />);
    await userEvent.type(screen.getByRole('searchbox'), 'apple');
    
    expect(await screen.findByText('Search failed')).toBeVisible();
});

// ❌ Bad: Unlikely edge case
it('handles null response body', () => {
    // When would this actually happen?
});
```

### Test Commands

```bash
# All tests
pnpm test

# Unit tests only (jsdom)
pnpm test:unit

# E2E tests only (real browser)
pnpm test:e2e

# Interactive UI
pnpm test:ui

# With coverage report
pnpm test:coverage
```

### Quick Reference

| I want to test... | Test Level | Location |
|-------------------|------------|----------|
| User can complete a flow | E2E | `e2e/tests/` |
| Button click triggers callback | Component | `__test__/*.spec.tsx` |
| Business calculation is correct | Unit | `services/__test__/` |
| Storage works across browsers | Provider E2E | `providers/__test__/*.e2e.ts` |
| Component shows correct data | Component | `__test__/*.spec.tsx` |
| API error shows message | Component | `__test__/*.spec.tsx` |

---

## Common Patterns

### Async Generator for Streaming Results

```tsx
// Service returns async generator
async function* searchGenerator(query: string): AsyncGenerator<Food> {
    for await (const item of provider.search('/foods', { name: { fuzzy: query } })) {
        yield item;
    }
}

// Component consumes with for-await
async function handleSearch(query: string) {
    const results = new Map();
    for await (const result of searchGenerator(query)) {
        results.set(result.code, result);
    }
    setResults(Array.from(results.values()));
}
```

### Web Worker for Heavy Operations

```tsx
// Hook manages worker lifecycle
export function useOpenFoodDex(url: string) {
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        workerRef.current = new Worker(
            new URL('@/services/api/openFoodDex/worker.ts', import.meta.url),
            { type: 'module' }
        );
        workerRef.current.postMessage({ type: 'start', url });

        return () => {
            workerRef.current?.terminate();
        };
    }, [url]);
}
```

### Dialog State Pattern

```tsx
// Centralized dialog state with metadata
const loggerDialog = atom({
    open: false,
    state: LoggerDialogState.DEFAULT,
    metadata: {} as { tab?: string; id?: string; barcode?: string },
});

// Components update state to navigate
setState({ 
    ...state, 
    open: true, 
    state: LoggerDialogState.FOOD_ITEM,
    metadata: { barcode: '12345' }
});
```

---

## Date & Time Handling

### Why We Don't Use Raw Date Objects

> ⚠️ **NEVER use the native JavaScript `Date` object directly in this codebase.**

The native `Date` object has well-documented problems:
- **Timezone confusion** - `Date` mixes local and UTC representations unpredictably
- **Mutability** - Methods like `setDate()` mutate the object, causing bugs
- **Inconsistent APIs** - `getMonth()` is 0-indexed, `getDate()` returns day of month, `getDay()` returns weekday
- **Locale handling** - Formatting depends on system locale, which varies across environments

Instead, we use a **Date Domain Layer** that provides:
- Immutable date objects (all operations return new instances)
- Consistent UTC normalization
- Configurable locale/week settings via `DateConfig`
- Clear separation between day-level and time-level operations

### The Date Domain Layer

The domain layer consists of four main exports:

| Class/Object | Purpose | Instance/Static |
|--------------|---------|-----------------|
| `CoreDate` | Immutable UTC date wrapper | Instance class |
| `Day` | Day-level operations (today, add days, format) | Static utility class |
| `Week` | 7-day week container with navigation | Instance class |
| `Time` | Time-level operations (hours, minutes, format) | Static utility class |
| `DateConfig` | Locale and formatting configuration | Singleton object |

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DateConfig (Singleton)                       │
│    Stores: locale, hour12, weekStartsOn                             │
│    Used by: Day, Week, Time for formatting                          │
├─────────────────────────────────────────────────────────────────────┤
│                         CoreDate (Instance)                          │
│    Immutable UTC date wrapper                                        │
│    Created via: CoreDate.now(), CoreDate.fromDate(), fromISO()      │
│    Operations: addDays(), atHour(), atTime(), atStartOfDay()        │
├─────────────────────────────────────────────────────────────────────┤
│      Day (Static)          │      Week (Instance)                    │
│  Day-level operations      │  7-day container                        │
│  Uses CoreDate internally  │  Uses CoreDate for each day             │
├─────────────────────────────────────────────────────────────────────┤
│                         Time (Static)                                │
│    Time-level operations (hours, minutes)                            │
│    Formatting respects DateConfig.hour12                             │
└─────────────────────────────────────────────────────────────────────┘
```

### Date Domain Usage Guide

#### Import from the domain layer

```typescript
import { CoreDate, Day, Week, Time, DateConfig } from '@/domain';
```

#### Getting the current date/time

```typescript
// ✅ Good: Use Day.today() for the current day (00:00 UTC)
const today = Day.today();

// ✅ Good: Use CoreDate.now() for current moment with time
const now = CoreDate.now();

// ❌ Bad: Never use new Date()
const bad = new Date();  // Don't do this!
```

#### Working with days

```typescript
// Get today
const today = Day.today();

// Add or subtract days
const tomorrow = Day.add(today, 1);
const yesterday = Day.add(today, -1);

// Check if two dates are the same day
if (Day.isSame(dateA, dateB)) {
    // Same calendar day
}

// Get start of day (00:00 UTC)
const startOfDay = Day.startOf(someDate);

// Format a day
const formatted = Day.format(today, { weekday: 'long', month: 'short', day: 'numeric' });
// → "Monday, Jan 6"

// Get short weekday name
const weekday = Day.toShortWeekday(today);
// → "Mon"

// Generate a deterministic UUID for a date
const uuid = Day.toUUID(today);
```

#### Working with weeks

```typescript
// Get the week containing today
const currentWeek = Day.getWeek(Day.today());
// or
const currentWeek = new Week(CoreDate.now());

// Access the week's properties
currentWeek.start;  // CoreDate of week start (Monday or Sunday per config)
currentWeek.days;   // Array of 7 CoreDate objects
currentWeek.uuid;   // Deterministic UUID for this week

// Navigate between weeks
const nextWeek = currentWeek.next();
const prevWeek = currentWeek.prev();

// Check if a date is in this week
if (currentWeek.contains(someDate)) {
    // Date is within this week
}
```

#### Working with time

```typescript
// Set a specific hour on a date
const atNoon = Time.withHour(today, 12);

// Set hour and minute
const at1430 = Time.withTime(today, 14, 30);

// Format time respecting DateConfig.hour12
const label = Time.toLabel(at1430);
// → "14:30" (if hour12 = false)
// → "2:30 PM" (if hour12 = true)

// Generate a time-based UUID
const timeUuid = Time.toUUID(someDateTime, namespaceUuid);
```

#### Configuring locale and format

```typescript
import { DateConfig } from '@/domain';

// Update configuration (e.g., from user preferences)
DateConfig.set({
    locale: 'sv-SE',      // Swedish locale
    hour12: false,        // 24-hour clock
    weekStartsOn: 'monday' // Week starts on Monday
});

// Reset to defaults
DateConfig.reset();

// Current values
console.log(DateConfig.locale);      // "sv-SE"
console.log(DateConfig.hour12);      // false
console.log(DateConfig.weekStartsOn); // "monday"
```

#### CoreDate basics (low-level)

Most of the time you'll use `Day`, `Week`, and `Time`. But for direct manipulation:

```typescript
// Create from various sources
const now = CoreDate.now();
const fromJs = CoreDate.fromDate(new Date());
const fromIso = CoreDate.fromISO('2026-01-06T14:30:00Z');

// Access components (all UTC)
now.year;       // 2026
now.month;      // 0 (January, 0-indexed)
now.dayOfMonth; // 6
now.hours;      // 14
now.minutes;    // 30
now.weekday;    // 0-6 (0 = Sunday)
now.timestamp;  // Unix timestamp in ms

// Immutable operations
const tomorrow = now.addDays(1);
const atMidnight = now.atStartOfDay();
const atNoon = now.atHour(12);
const at1430 = now.atTime(14, 30);

// Formatting
now.toISOString();  // "2026-01-06T14:30:00.000Z"
now.formatDate({ weekday: 'short' }, 'en-US');  // "Tue"
now.formatTime({ hour: '2-digit', minute: '2-digit' });  // "14:30"

// Comparison
dateA.equals(dateB);   // Same timestamp?
dateA.isBefore(dateB); // dateA < dateB?
dateA.isAfter(dateB);  // dateA > dateB?
```

#### Common patterns

```typescript
// ✅ Iterate through a week's days
const week = Day.getWeek(Day.today());
for (const day of week.days) {
    console.log(Day.toShortWeekday(day), Day.format(day, { day: 'numeric' }));
}

// ✅ Get weekday index respecting config (0 = first day of week)
const weekdayIndex = Day.getWeekdayIndex(someDate);
// If weekStartsOn = 'monday': Mon=0, Tue=1, ..., Sun=6
// If weekStartsOn = 'sunday': Sun=0, Mon=1, ..., Sat=6

// ✅ Create entries keyed by date UUID
const entries = new Map<string, DiaryEntry>();
const key = Day.toUUID(Day.today());
entries.set(key, myEntry);

// ✅ Parse user-provided ISO string
const userDate = CoreDate.fromISO(userInput);
const normalizedDay = Day.startOf(userDate);
```

#### What NOT to do

```typescript
// ❌ NEVER use raw Date
const bad = new Date();
const alsoBad = new Date('2026-01-06');

// ❌ NEVER compare dates with ===
if (dateA.date === dateB.date) // Wrong!

// ✅ Use Day.isSame() or CoreDate.equals()
if (Day.isSame(dateA, dateB)) // Correct!
if (dateA.equals(dateB)) // Also correct!

// ❌ NEVER mutate dates
someDate.date.setDate(10); // Mutating the internal Date!

// ✅ Use immutable operations
const newDate = someDate.addDays(1); // Returns new instance

// ❌ NEVER access .getMonth(), .getDate() etc. on the raw Date
const month = someDate.date.getMonth(); // Avoid!

// ✅ Use the typed accessors
const month = someDate.month; // Clean!
```

---

## Questions?

If you have questions or need help:
1. Check existing code for patterns
2. Review this guide
3. Open a GitHub issue

Happy contributing! 🎉

