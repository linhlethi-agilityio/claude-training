# claude-training

Training repo. The app lives in `moneylover/` (Next.js 16 + React 19 + Supabase + Tailwind 4). Bug tickets live in `notes/tickets/`.

## Commands (run from `moneylover/`, use pnpm)

- Install: `pnpm install` · Dev: `pnpm dev` (http://localhost:3000)
- Test: `pnpm test` · single file: `pnpm jest <path>` · Lint: `pnpm lint`
- Build: `pnpm build`. Needs `.env.local` (copy `.env.sample`); see ticket ML-001.
- Git hooks: pre-commit runs lint + all tests; pre-push runs `build`.

## Architecture

- `libs/`: Supabase queries · `services/`: cached reads (`'use cache'` + `cacheTag`) · `actions/`: server mutations (`'use server'` + `updateTag`)
- `app/`: routes · `ui/`: page-level content · `components/`: reusable UI, one folder each with `index.tsx`
- Amounts and balances are whole numbers (`bigint` in DB); see ticket ML-003.

## Conventions

- Import via `@/` aliases and barrel `index.ts` files; group imports under comments (`// Constants`, `// Utils`, `// Components`, ...).
- Named exports, arrow function components, Tailwind classes merged with `cn()`.
- Prettier: single quotes, semicolons, trailing commas, width 100.
- Tests sit next to the code in `__test__/`; anything that renders "today" needs a frozen clock (`jest.useFakeTimers({ now })`).
- Conventional Commits with ticket id: `fix(ML-003): ...`, `docs: ...`. One branch per ticket, small commits.
- Repo content (code, notes, tickets, commits, MRs) is in English.

## Never do

- Never commit to `main` directly or push without the user asking.
- Never commit `.env*` files other than `.env.sample`, or paste real keys anywhere.
- Never use `--no-verify`, and never run `jest -u` to make a failing snapshot pass without finding the cause.
- Never change `supabase/migrations/` or the DB schema unless the ticket says so.
- Never mix unrelated changes into a ticket's branch.
