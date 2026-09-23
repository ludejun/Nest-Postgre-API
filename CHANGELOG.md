# Changelog

## Unreleased

### Fixed

- **None of the npm scripts ran.** Every one of them starts with `cross-env`,
  which was never in `devDependencies`.
- **Three more dependencies were used but never declared**: `lodash` (15 call
  sites), `body-parser` and `jsonwebtoken`. They resolved through hoisting under
  npm/yarn and fail under pnpm. `lodash` is now declared; `body-parser` is
  replaced by Express's own `json()` / `urlencoded()`; the `jsonwebtoken` import
  only provided a type and is gone.
- **`CatsService` swallowed errors and returned them as data.** Both methods
  ended in `catch (err) { return err; }`, so a failed query reached the client
  as a 200 with an `Error` object in the body. Errors now propagate, and there
  are tests for it.
- **`CatEntity` was missing the columns the API accepts.** The endpoint takes
  `age` and `breed`, but the entity declared only `id` and `name`, so TypeORM
  silently dropped both on write.
- The e2e spec used `import * as request from 'supertest'`, which is not
  callable with `esModuleInterop` on.

### Changed

- **Nest 7 → 12**, and with it: `HttpModule` / `HttpService` moved from
  `@nestjs/common` to `@nestjs/axios`.
- **TypeORM 0.2 → 0.3**: `createConnection` → `DataSource`, `ConnectionOptions`
  → `DataSourceOptions`, and `findOne()` now requires explicit `where` options.
- Remaining dependencies to current: pg 8.23, helmet 4 → 8, express-rate-limit
  5 → 8, class-validator 0.13 → 0.15, nodemailer 6 → 10, TypeScript 4.2 → 5.9.
- **Jest → Vitest.** `@nestjs/testing` 12 is ESM-only, and Jest 30 cannot
  `require()` ESM before Node 24.9. Vitest runs the suite through SWC, which —
  unlike esbuild — implements `emitDecoratorMetadata`, so Nest's DI works.
- `@nestjs/cli` is pinned to 11: the 12 line pulls in an ESM-only `ora` through
  `@angular-devkit/schematics`, which crashes on Node 22 with
  `ERR_REQUIRE_CYCLE_MODULE`.
- The project uses pnpm.

### Added

- ESLint 9 flat config with typescript-eslint, replacing ESLint 7. 0 errors.
- Real tests for the Cats module: 9 tests covering both the service and the
  controller with the repository mocked, where the previous specs were Nest CLI
  stubs that could not resolve their own dependencies.
- `README_EN.md`, `CONTRIBUTING.md` and this changelog.
- `ci.yml`: lint, typecheck, test and build on Node 20 and 22.
