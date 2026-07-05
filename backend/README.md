# Enterprise AI Data Intelligence Platform — Java Backend

Spring Boot 3.3 (Java 21) service that powers the NexusIQ frontend:
Natural Language → SQL via OpenAI GPT-4.1, schema-aware prompting,
SQL safety validation, execution metrics, and AI explanations.

## Features

- **NL → SQL** (`POST /api/ask`) — schema-aware prompt to GPT-4.1
- **Safety validator** — blocks `DROP DELETE UPDATE ALTER TRUNCATE CREATE EXEC INSERT GRANT REVOKE MERGE`; only `SELECT` / `WITH` execute
- **Schema inspection** (`GET /api/schema`, `POST /api/schema/refresh`) — JDBC metadata, cached with Caffeine
- **Query execution** (`POST /api/execute`) — returns rows, columns, execution ms
- **AI explanation + optimization hints** for every generated query
- **CORS** enabled for the React frontend

## Run locally

```bash
export OPENAI_API_KEY=sk-...
mvn spring-boot:run
```

Defaults to an in-memory H2 database. Point at Postgres via `DB_URL`, `DB_USER`, `DB_PASSWORD`.

## Docker

```bash
docker compose up --build
```

## Project layout

```
src/main/java/com/enterprise/ai/
  EnterpriseAiApplication.java
  config/AppConfig.java
  controller/ApiController.java
  dto/Dtos.java
  exception/GlobalExceptionHandler.java
  service/{LlmSqlService, QueryExecutionService, SchemaService}.java
  util/SqlSafetyValidator.java
src/main/resources/application.yml
```

## Frontend

The React/TanStack Start frontend lives at the repo root and calls this API via the
`Base URL` shown in Settings (default `http://localhost:8080/api`).
