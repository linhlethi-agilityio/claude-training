---
name: brainstorming
description: Work out what to build and how before any code - echo the request, ask what is missing, lay out 2-3 approaches, and write the agreed design into the ticket. Use before planning a new feature, a capstone story, or a ticket whose approach is still open, or when the user asks to brainstorm or discuss a design.
---

<!-- Adapted from obra/superpowers (skills/brainstorming, commit 22f0b463e7a5), MIT License, Copyright (c) 2025 Jesse Vincent. See .claude/skills/THIRD_PARTY_NOTICES.md. Changes: shortened; the design goes into the ticket instead of docs/superpowers/specs; no visual companion, builder-check subagent or writing-plans hand-off; repo-specific dependency check added. -->

# Brainstorming

You build what you believe the user wants, and that belief is usually thinner than it feels. This skill finds out what they want, and why, before anything gets built.

## First: what do you actually know?

- **Everything that matters is in the request or the ticket** (the ticket has decisions for every open question): say so in one line and hand over to `fix-ticket`.
- **Something non-trivial is missing:** start the conversation below.

## Look before you ask

Read the ticket in `notes/tickets/`, the files it names, and the code they connect to, until you can explain how the relevant parts work today and what the change would touch. Never ask what the ticket, the code or CLAUDE.md already answers, and never reopen a decision already written in the ticket.

**Check dependencies.** List the files and layers (`libs/`, `services/`, `actions/`, `components/`, `ui/`) the change would touch, then compare with other open tickets and branches (`git branch`, `git worktree list`, open PRs). If two pieces of work touch the same files, they can't run in parallel as split: say so, and propose a split by layer or file, or an order.

## Your first message

- **They've said what they want:** in about 200 words, echo the request back (what, who for, why), add what you found in the code that bears on it, and flag anything that would change what gets built (a constraint, a conflict, an overlap with other work, a cheaper path). If the why is missing, ask one open question about it. Otherwise ask about the one open point that would change the most.
- **They haven't:** one open question about the biggest unsettled thing, and say what the answer would change.

If the user didn't ask for a discussion, end with a one-line offer to just get going.

## The conversation

- Ask only when the answer changes what gets built and nothing in the repo answers it. Otherwise state your call and reason as a proposal they can correct.
- One question at a time, in plain words, built on their last answer.
- **Lay out the approaches** in a message of their own: two or three real options grounded in this codebase, what each trades off, and which you'd pick and why. If there's only one sensible way, say why the others don't fit.
- **Play it back** as you go: describe each part you understand in a short paragraph and ask what's wrong or missing. Mark what they said as theirs and what you filled in as your proposal.

## Write the design into the ticket

Once they've picked an approach, write it into the ticket file:

- `## Approaches`: the options, the trade-offs, which one was picked and why.
- Each open question gets a **Decision:** line.
- `## Out of scope`, and the dependency note (files touched, what must merge first).

For a bigger change, offer `/grill-me` next to stress-test the design before building.

<HARD-GATE>
No product code, migrations, dependency installs or branches until the user approves the design written in the ticket. Reading and exploring are fine. After approval the next step is the `fix-ticket` skill.
</HARD-GATE>

## Red flags

| Thought | Reality |
|---|---|
| "I'll offer a menu of what they might want" | Ask them to describe it first. Options steer. |
| "I'll fill in sensible defaults" | Fine, but say them out loud so they can reject them. |
| "Both tickets are small, run them in parallel" | Check the files first. Shared files mean waiting or a conflict. |
| "They said 'sounds good'" | Approval covers what you showed them, not a design you haven't written into the ticket. |
