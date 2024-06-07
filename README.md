# API

- NestJS
- Postgresql

## Install locally

1. `cp .env.example .env`
2. `docker-compose up -d`

## Prisma

- run migration locally: `npx prisma migrate dev --name init`
- generate prisma client: `prisma generate`


## Drop all tables

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
