@AGENTS.md

# Project rules

- The Postgres database is shared with another production app (schema `public`). Payload lives only in schema `htad`.
- Never enable `push`, never run `payload migrate:fresh` / `migrate:reset`, never touch the `public` schema.
- Schema changes: `npm run migrate:create <name>`, review that every statement targets `"htad".*`, then `npm run migrate` locally. Production migrates itself: Vercel runs the `vercel-build` script (`payload migrate && next build`), so a migration ships with the code that needs it.
- The local `.env` points at a local Postgres, not production.
- UI labels live in `src/lib/dictionary.ts`; editable content lives in Payload (EN/VI localized).
