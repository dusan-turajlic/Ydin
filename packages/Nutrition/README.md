# Ydin Nutrition

A macro and calorie tracking application built with React, TypeScript, and modern web technologies.

> Part of the [Ydin](../../README.md) suite of health and wellness apps.

## Features

- **Calorie & Macro Tracking** - Track daily calories, protein, carbohydrates, and fat
- **Food Database** - Search thousands of food items via OpenFoodDex
- **Barcode Scanner** - Quickly add foods by scanning product barcodes
- **Quick Add** - Manually enter macros when food isn't in the database
- **Time-based Logging** - Organize food intake by hour throughout the day
- **Offline-First** - Local SQLite database for fast, offline search

## Development

### Commands

Run from this directory (`packages/Nutrition`):

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run E2E tests
pnpm test:e2e

# Lint code
pnpm lint
```

Or from the root directory:

```bash
pnpm dev           # Starts this app
pnpm build         # Builds all packages including this one
```

### Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **State** | Jotai |
| **Storage** | SQLite WASM (primary), IndexedDB, LocalStorage |
| **Testing** | Vitest, React Testing Library |

## Architecture

This app follows a **layered MVC-inspired architecture**:

```
┌─────────────────────────────────────────────────────────┐
│  Views (src/views/)        │  Page-level components    │
├─────────────────────────────────────────────────────────┤
│  Components (src/components/) │  Reusable UI blocks    │
├─────────────────────────────────────────────────────────┤
│  Atoms (src/atoms/)        │  Global state (Jotai)     │
├─────────────────────────────────────────────────────────┤
│  Services (src/services/)  │  Business logic & APIs    │
├─────────────────────────────────────────────────────────┤
│  Domain (src/domain/)      │  Date/time handling       │
├─────────────────────────────────────────────────────────┤
│  Providers (@ydin/storage) │  Storage abstraction      │
├─────────────────────────────────────────────────────────┤
│  Models (src/modals/)      │  TypeScript interfaces    │
└─────────────────────────────────────────────────────────┘
```

**Key Principle**: Each layer only communicates with adjacent layers. Components use services, services use providers—never skip layers.

### Layer Summary

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Views** | Page composition | `Tracker.tsx` |
| **Components** | UI + user interaction | `DiaryTracker.tsx`, `FoodSearchSheet.tsx` |
| **Atoms** | Global state | `day.ts`, `sheet.ts` |
| **Services** | Business logic, API calls | `openFoodDex/index.ts` |
| **Domain** | Date/time operations | `Day`, `Week`, `Time`, `CoreDate` |
| **Providers** | Storage operations | `@ydin/storage-provider` |
| **Models** | TypeScript interfaces | `IOpenFoodDexObject` |

### Date & Time Handling

> ⚠️ **Never use raw JavaScript `Date` objects.** Always use the domain layer.

This app uses a dedicated domain layer for all date/time operations:

```typescript
import { Day, Week, Time, CoreDate, DateConfig } from '@/domain';

// Get today
const today = Day.today();

// Work with weeks
const week = Day.getWeek(today);
const days = week.days; // Array of 7 CoreDate objects

// Navigate
const nextWeek = week.next();
const tomorrow = Day.add(today, 1);

// Format with locale awareness
const label = Day.toShortWeekday(today); // "Mon"
const timeLabel = Time.toLabel(now);     // "14:30" or "2:30 PM"
```

See [CONTRIBUTING.md](../../CONTRIBUTING.md#date--time-handling) for the complete guide.

## Folder Structure

```
src/
├── atoms/              # Jotai state atoms
├── components/         # Reusable UI components
│   └── ui/             # Small UI primitives
├── constants/          # App constants (colors, nutrition, tabs)
├── domain/             # Date/time handling (CoreDate, Day, Week, Time)
├── hooks/              # Custom React hooks
├── modals/             # TypeScript interfaces (models)
├── services/           # Business logic & APIs
│   ├── api/            # External API integrations
│   └── storage/        # Storage service layer
├── utils/              # Utility functions
└── views/              # Page-level components
```

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed architecture documentation, coding guidelines, and testing strategy.
