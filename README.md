# Ydin

**Ydin** is a brand name for a suite of open-source health and wellness applications. Each app under the Ydin umbrella is its own independent application, built with modern web technologies and designed to work seamlessly together.

## Packages

| Package | Description | README |
|---------|-------------|--------|
| **Nutrition** | Macro and calorie tracking app | [View](./packages/Nutrition/README.md) |
| **Design System** | Shared component library | [View](./packages/DesignSystem/README.md) |
| **StorageProvider** | Storage abstraction layer (SQLite, IndexedDB, LocalStorage) | [View](./packages/StorageProvider/README.md) |

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **State** | Jotai |
| **Storage** | SQLite WASM, IndexedDB, LocalStorage |
| **Testing** | Vitest, Playwright |
| **Code Quality** | ESLint + Prettier |

## Prerequisites

- **Node.js** v18 or higher
- **pnpm** (this is a pnpm monorepo)

```bash
# Install pnpm if you don't have it
npm install -g pnpm
```

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd Ydin

# Install all dependencies
pnpm install

# Start the Nutrition app
pnpm dev

# Start Storybook (Design System)
pnpm storybook
```

## Project Structure

```
Ydin/
├── README.md                 # This file
├── CONTRIBUTING.md           # Developer guide & architecture docs
├── LICENSE                   # GPLv3 license
├── package.json              # Root workspace config
├── pnpm-workspace.yaml       # pnpm workspace definition
└── packages/
    ├── Nutrition/            # Macro & calorie tracking app
    ├── DesignSystem/         # Shared component library
    └── StorageProvider/      # Storage abstraction layer
```

## Available Commands

Run these from the root directory:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the Nutrition app dev server |
| `pnpm build` | Build all packages |
| `pnpm storybook` | Start Storybook for the Design System |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format code with Prettier |

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Architecture documentation
- Code organization guidelines
- Testing strategy
- Development workflow

## License

This project is licensed under the GNU General Public License v3.0 (GPLv3) - see the [LICENSE](./LICENSE) file for details.
