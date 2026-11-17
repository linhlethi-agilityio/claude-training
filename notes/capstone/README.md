# Capstone (Days 12–15)

The "client" (the lead) briefs a feature for the training app. Everything about the feature lives here.

| File | Owner | Content |
|---|---|---|
| `brief.md` | Client (lead) | The brief, copied word for word |
| `spec.md` | BA | Requirements, decisions, out of scope |
| `CAP-xxx-<slug>.md` | BA | One story each: user story, Given/When/Then, open questions |
| `test-matrix.md` | QA | Criteria × cases |

Rules:

- Developers ask questions only in the ticket's `## Open questions` (the `ticket-intake` skill).
- A story is built only when it passes the zero-questions test or its blocking questions are answered.

## Story template

```md
# CAP-001 — <title>

- **Type:** Story
- **Status:** Draft | Ready | In progress | Done
- **Spec:** spec.md#<section>

## User story

As a <user>, I want <goal>, so that <benefit>.

## Acceptance criteria

- [ ] Given <context>, when <action>, then <result>.

## Out of scope

-

## Open questions

- [ ] Q1 (dev, YYYY-MM-DD): ... Options: A) ... B) ... Proposed: ...
```
