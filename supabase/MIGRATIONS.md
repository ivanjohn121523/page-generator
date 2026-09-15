# Database migrations

SQL files in `supabase/migrations/` define the schema. You can apply them to a **local** Postgres (Docker) or to the **remote** Supabase project.

## Local database from migrations

This is the way to create a database on your machine. Docker must be running (Docker Desktop on Windows).

### 1. Start local Supabase

From the repo root:

```bash
npx supabase start
```

That boots local Postgres, Auth, and Studio, then applies every file in `supabase/migrations/`.

When it finishes, the CLI prints URLs and keys. Defaults:

| Service | URL |
| --- | --- |
| API | `http://127.0.0.1:55321` |
| Database | `postgresql://postgres:postgres@127.0.0.1:55322/postgres` |
| Studio | `http://127.0.0.1:55323` |

### 2. Point the app at local Postgres

In `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon / publishable key from supabase start>
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55322/postgres
```

Then restart `npm run dev`.

### 3. Rebuild the local database

After you add or change a migration file:

```bash
npx supabase db reset
```

This drops the local database, recreates it, and runs all migrations from scratch. It does **not** change your cloud project.

### 4. Stop local services

```bash
npx supabase stop
```

npm scripts:

```bash
npm run db:start
npm run db:reset
npm run db:stop
```

---

## Push migrations to the remote (cloud) database

Use this when you want to update the hosted Supabase project, not the local Docker database.

### Set `DATABASE_URL`

**Project Settings → Database → Connection string**

Use the **Session pooler** (port `5432`) or the **Direct connection**. Do **not** use the transaction pooler (port `6543`).

URL-encode special characters in the password (`@`, `#`, `%`, and so on).

### Preview, then apply

**PowerShell**

```powershell
$url = (Select-String -Path .env -Pattern '^DATABASE_URL=(.+)$').Matches.Groups[1].Value

npx supabase db push --db-url $url --dry-run
npx supabase db push --db-url $url
```

**bash / zsh**

```bash
set -a
source .env
set +a

npx supabase db push --db-url "$DATABASE_URL" --dry-run
npx supabase db push --db-url "$DATABASE_URL"
```

`--dry-run` only prints what would change.

### Alternative: link the project

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

`YOUR_PROJECT_REF` is the id in `https://supabase.com/dashboard/project/<ref>`.

---

## Add a new migration

```text
supabase/migrations/YYYYMMDDHHmmss_short_name.sql
```

Example: `20260916103000_add_sites.sql`

- Local: `npx supabase db reset` (or `npx supabase migration up` if the local stack is already running)
- Remote: `npx supabase db push --db-url "$DATABASE_URL"`

The CLI records applied files, so remote push skips migrations that already ran.

## What CI does

On git push, `.github/workflows/deploy-migrations.yml` runs `supabase db push` against the `DATABASE_URL` GitHub secret (the **remote** database).
