# ML-001 — `next build` crashes when Supabase env vars are missing

- **Type:** Bug
- **Status:** Open
- **Area:** Build / config — `src/libs/supabase.ts`, `src/constants/env.ts`
- **Severity:** Medium (blocks `git push` via the pre-push hook on any fresh clone)

## Summary

On a fresh clone without `.env.local`, `pnpm build` fails while collecting page data for `/api/auth/[...nextauth]` with `Error: supabaseUrl is required.` The Supabase client is created at module load time, and `PROCESS_ENV` falls back to an empty string, so the build crashes instead of giving a clear setup error.

## Environment

- Next.js 16.2.1 (Turbopack), Node 20, pnpm
- macOS, fresh clone, no `.env.local`
- Commit: `505bd1a`

## Steps to reproduce

1. `cd moneylover`
2. Make sure no env file exists: `ls -a | grep env` shows only `.env.sample`
3. `pnpm install`
4. `pnpm build`

## Expected result

Either the build succeeds (the client is only needed at request time), or it fails fast with a clear message naming the missing variables and pointing to `.env.sample`.

## Actual result

```
Collecting page data using 10 workers ...Error: supabaseUrl is required.
    at module evaluation (src/libs/supabase.ts:6:14)
    at Object.<anonymous> (.next/server/app/api/auth/[...nextauth]/route.js:6:3)
> Build error occurred
Error: Failed to collect page data for /api/auth/[...nextauth]
husky - pre-push script failed (code 1)
```

## Notes / hypotheses (to verify, not trusted)

- `src/libs/supabase.ts` calls `createClient(PROCESS_ENV.SUPABASE_URL, ...)` at import time.
- `src/constants/env.ts` uses `|| ''`, which hides the missing value until `createClient` throws.

## Open questions for the reporter

1. Should the build pass without real credentials (e.g. CI without secrets), or is failing acceptable as long as the message is clear?
2. Is `.env.local` the agreed file name? `.gitignore` ignores `.env.local` but not `.env`.
3. `.env.sample` lists both `PUBLISHABLE_KEY` and `ANON_KEY`. Which one is actually required?

## Acceptance criteria

- [ ] Fresh clone + `pnpm build` without env either succeeds or fails with a message that names the missing variable(s).
- [ ] A test covers the missing-env behaviour.
- [ ] README "Getting Started" mentions `cp .env.sample .env.local`.
