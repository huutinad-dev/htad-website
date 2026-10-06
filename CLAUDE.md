@AGENTS.md

# Project rules

- The Postgres database is shared with another production app (schema `public`). Payload lives only in schema `htad`.
- Never enable `push`, never run `payload migrate:fresh` / `migrate:reset` / `migrate:down` (down rolls back a whole batch of migrations, not one), never touch the `public` schema.
- **Local and production share one database and one R2 bucket**: the local `.env` points at production on purpose, so both show the same data. Everything done locally is done to production:
  - No throwaway test records. Edits in the local `/admin` are production edits, and deleting a media item deletes the file production uses.
  - `npm run seed` wipes content; it refuses to run unless `DATABASE_URL` is local.
  - Pages are cached (ISR, 10 min) and only the environment that saved a change purges its own cache.
- Schema changes are **expand first, contract later**, because the code deployed on Vercel keeps running against the database while new code is developed:
  1. `npm run migrate:create <name>`, then review that every statement targets `"htad".*` and is additive: new tables, new nullable columns, data copied rather than moved. No drops, renames or deletes of anything the deployed code still reads.
  2. `npm run migrate` applies it to the shared database straight away, so local works; the Vercel build (`vercel-build` = `payload migrate && next build`) then finds it already applied.
  3. Dropping what the old code needed goes in a separate migration, created only after the new code is live.
- UI labels live in `src/lib/dictionary.ts`; editable content lives in Payload (EN/VI localized). Admin labels are bilingual via `src/i18n/admin.ts`.
