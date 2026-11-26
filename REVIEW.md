# Review criteria

Used by the Claude Code review on every pull request, by `/code-review` triage and by the `review-checklist` skill. Report what matters; skip the rest.

## What to look for, in order

1. **Bugs:** wrong results, missing `await`, falsy-zero checks, null access, broken edge cases (empty, zero, negative, very long input).
2. **Security:** server actions must read the user from the session (`auth()`), never from arguments; every update, delete or single-row read filters by owner; no secrets or `.env*` in the diff; user input validated on the server.
3. **Spec:** the change does what the ticket's decisions say, and nothing else. Acceptance criteria have tests.
4. **Tests:** a new test fails without the fix; no snapshot updated without a reason; anything that renders "today" uses a frozen clock.

## Important (must be fixed before merge)

- Any bug that gives a wrong amount, balance or date, or loses or exposes data.
- Any security finding above.
- A change that contradicts a decision in the ticket.
- A failing or missing test for an acceptance criterion.

## Not important here

- Naming and style that Prettier and ESLint already cover.
- Refactors outside the diff.
- Comments or docs wording, unless it is wrong.

## Format

- Inline comments on the exact line, labelled **Important**, **Should fix** or **Nit**, and **Verified** (you ran or read it) or **Suspected**.
- **At most 5 nits.** If there are more, pick the 5 that matter most.
- End with one summary comment: the 3 riskiest spots in the diff, then a verdict (approve / approve with nits / changes requested).
- Review only: never push commits or change files.
