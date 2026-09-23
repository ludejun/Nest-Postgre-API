<h1 align="center">Nest-Postgre-API</h1>

<p align="center">
  A production-ready Node REST API scaffold: Nest + PostgreSQL + TypeORM + JWT.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/nest-12-e0234e?logo=nestjs&logoColor=white" alt="nest 12" />
  <img src="https://img.shields.io/badge/typeorm-0.3-fe0902" alt="typeorm 0.3" />
  <img src="https://img.shields.io/badge/postgres-8-4169e1?logo=postgresql&logoColor=white" alt="postgres" />
  <img src="https://img.shields.io/badge/typescript-5.9-3178c6?logo=typescript&logoColor=white" alt="typescript 5.9" />
  <img src="https://img.shields.io/badge/pnpm-10-f69220?logo=pnpm&logoColor=white" alt="pnpm 10" />
  <br />
  <a href="https://github.com/ludejun/Nest-Postgre-API/actions/workflows/ci.yml"><img src="https://github.com/ludejun/Nest-Postgre-API/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/ludejun/Nest-Postgre-API/blob/master/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" /></a>
</p>

<p align="center">
  <a href="./CHANGELOG.md">Changelog</a>
  ·
  <a href="./CONTRIBUTING.md">Contributing</a>
  ·
  <a href="./README.md">中文文档</a>
</p>

---

A RESTful API scaffold built on Nest and PostgreSQL, meant as the starting point for a real
project rather than a toy.

Structure and conventions follow [nodepress](https://github.com/surmon-china/nodepress). TypeORM
takes some getting used to if you are coming from raw SQL, but it pays off: it integrates natively
with Nest, entities line up with the tables, and the query API stays readable —
see the [find options](https://typeorm.io/find-options).

Server port, database credentials and auth settings all live in `src/app.config.ts`.

## Requirements

Node >= 20, PostgreSQL, and [pnpm](https://pnpm.io/).

## Commands

```shell
pnpm install
pnpm start:dev     # development, watch mode
pnpm build         # compile to dist/
pnpm start:prod    # run the compiled output

pnpm lint          # eslint
pnpm typecheck     # tsc --noEmit
pnpm test          # vitest (unit)
pnpm test:e2e      # vitest (e2e — needs a reachable database)
pnpm format        # prettier --write
```

## API conventions

**HTTP status codes** (see `src/errors/`):

| | |
| --- | --- |
| `200` | OK |
| `201` | Created (POST) |
| `400` | The request was understood but rejected by the business rules |
| `401` | Authentication failed |
| `403` | Insufficient permissions for the request or its parameters |
| `404` | No such resource |
| `405` | No such method |
| `500` | Server error |

**Response shape** (see `src/interfaces/http.interface.ts`):

- `status` — `success` or `error`.
- `message` — always present, added by the `@HttpProcessor` decorator.
- `error` — the error from wherever it occurred. Required whenever `status` is `error`, so failures
  are debuggable.
- `debug` — the stack trace, in development only.
- `result` — required whenever `status` is `success`.
  - list responses: `{ pagination: {...}, data: [...] }`
  - single resources: the resource itself, e.g. `{ title: '', content: ... }`

## Application structure

**Entry points**

| File | Role |
| --- | --- |
| `main.ts` | Loads config, starts the app, registers the global services |
| `app.module.ts` | Root module; composes the feature modules |
| `app.controller.ts` | Root controller |
| `app.config.ts` | Everything configurable: database, app, third parties |
| `app.environment.ts` | Global environment flags |

**Request pipeline**

1. `request` — the request arrives
2. `middleware` — CORS and origin checks
3. `guard` — authentication
4. `interceptor:before` — inbound stream (empty in this app)
5. `pipe` — parameter extraction and validation
6. `controller` — the route handler
7. `service` — the business logic
8. `interceptor:after` — response and error formatting
9. `filter` — catches anything thrown anywhere above and turns it into an error response

**Authentication flow**

1. `guard` inspects the request
2. `guard.canActivate` runs the inherited handling
3. `JwtStrategy.validate` calls the auth service
4. `guard.handleRequest` lets the request through, or blocks it

**Authorisation levels**

- Every mutating operation (create / update / delete) requires a valid token — see
  `src/guards/auth.guard.ts`.
- GET requests that read table data validate the token opportunistically: no token, or a valid
  token, both pass; an invalid token does not.

**Parameter validation** (`src/decorators/query-params.decorator.ts`)

- An ordinary user reaching for an advanced query parameter is treated as unauthorised → `403`.
- Any request with invalid parameters is stopped by the validator → `400`.

**Interceptors** (`src/interceptors/`)

- *transform* — turns a successful service Promise into the standard response shape.
- *error* — catches a failing service Promise.
- *logging* — replaces the default global logger.

**Decorators** (`src/decorators/`)

- *controller response* — normalises the output, including `message` and pagination.
- *query params* — validates and formats `query` / `params` and the derived metadata.

**Guards** (`src/guards/`) — every non-GET request goes through the `Auth` guard.

**Middleware** (`src/middlewares/`) — CORS handling and origin filtering.

**Pipes** (`src/pipes/`) — `validation.pipe` validates everything built on class-validator.

**Feature modules** (`src/modules/`) — an `Auth` module and a `Cats` demo.

**Core processors** (`src/processors/`)

- *database* — the TypeORM connection.
- *helper* — email, IP geolocation, SEO submission and Google credentials services.

### Google Indexing API

[Full setup guide](https://developers.google.com/search/apis/indexing-api/v3/quickstart)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
