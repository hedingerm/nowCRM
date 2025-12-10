# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Root-level commands (pnpm 10.19.0, Node 20+)
pnpm build:libs              # Build all libraries
pnpm build:apps              # Build all apps
pnpm build:all               # Build everything
pnpm lint:libs               # Lint libraries
pnpm lint:apps               # Lint apps
pnpm lint:all                # Lint all

# Development setup
make dev                     # Prepare local development environment
make up                      # Full Docker setup with one command
make init-env                # Initialize environment variables

# Frontend (apps/nowcrm)
pnpm --filter nowcrm dev     # Start dev server with Turbopack
pnpm --filter nowcrm build   # Production build
pnpm --filter nowcrm lint:fix

# Playwright E2E tests (apps/nowcrm)
pnpm --filter nowcrm playwright:test

# Backend services (composer, journeys, dal)
pnpm --filter composer dev   # Watch mode with tsx
pnpm --filter composer test  # Jest tests
pnpm --filter journeys dev
pnpm --filter dal dev

# Strapi (apps/nowcrm-strapi)
pnpm --filter nowcrm-strapi dev    # strapi develop
pnpm --filter nowcrm-strapi build

# Shared library (libs/services)
pnpm --filter @nowcrm/services build
pnpm generate-index:services       # Auto-generate barrel exports
pnpm generate-service-factory      # Generate service factory
```

## Architecture

**Monorepo** using pnpm workspaces with Docker Compose orchestration.

### Apps (`/apps`)
- **nowcrm**: Next.js 15 frontend (React 19, TypeScript 5.9, ShadCN UI, next-intl for i18n)
- **composer**: Express.js - content generation, channel dispatch, AWS SES event ingestion
- **journeys**: Express.js - automated multi-step marketing journeys (RabbitMQ, cron jobs)
- **dal**: Express.js - orchestrates heavy async/bulk operations (BullMQ queues)
- **nowcrm-strapi**: Strapi 5 - universal data backend, auth layer, admin panel
- **wiki-payload**: Payload CMS - documentation and knowledge base

### Shared Library (`/libs/services`)
- Types for CRM entities (Contact, Journey, Composition, Campaign, etc.)
- Service layer for Strapi API calls
- Zod validators

### Infrastructure
- **Database**: PostgreSQL 17
- **Cache/Queue**: Redis + RabbitMQ + BullMQ
- **CI/CD**: `.github/workflows/main.yaml` - creates release, builds services, pushes to GitHub Container Registry, Telegram notifications

## Code Style (enforced by Biome)

### Key Principles
- **Functional components only** (no classes)
- **Named exports only** (no default exports)
- **Types over interfaces** (except extending third-party)
- **String literals over enums**
- **No 'any' type allowed**
- **Event handlers over useEffect** for state updates

### Naming
- Variables/functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Types/Classes: `PascalCase` (component props suffix with `Props`)
- Files/directories: `kebab-case`

### File Structure
```
apps/nowcrm/
├── components/     # Reusable UI components
├── app/            # Route components
├── lib/            # Server actions and utils
├── hooks/          # Custom hooks
├── types/          # Type definitions
└── messages/       # I18N JSONs (en, fr, de, it)

apps/{composer,journeys,dal}/src/
├── api/            # API routes
├── common/         # Shared utilities
├── lib/            # Functions, types, workers
```

### TypeScript
- Strict mode enabled, noImplicitAny
- Use type inference when clear, explicit types when ambiguous
- Descriptive generic names (`TData` not `T`)
- Type guards for runtime checking, discriminated unions preferred

## Testing (Playwright E2E)

- **Pattern**: Page Object Model (POM)
- **Location**: `apps/nowcrm/tests/`
- **File naming**: Numbered prefixes for execution order (e.g., `01Authentication.spec.ts`)

Key practices:
- Prefer role-based locators over CSS selectors
- Use Faker for test data generation
- Include descriptive assertion messages
- Clean up test data in `finally` blocks
- Global setup handles authentication state

## Internationalization (next-intl)

Supported languages: English (en), French (fr), German (de), Italian (it)

```typescript
// Server components
const t = await getTranslations('Contacts');

// Client components
const t = useTranslations('auth');
```

Translation files: `apps/nowcrm/messages/{en,fr,de,it}.json`
