# ML-002 — TransactionForm snapshot test fails depending on the current date

- **Type:** Bug (test)
- **Status:** Resolved in `505bd1a` (kept as a worked example of "bug → failing test → fix")
- **Area:** `src/components/TransactionForm/__test__/TransactionForm.test.tsx`
- **Severity:** Medium (blocks `git commit` via the pre-commit hook)

## Summary

The test `TransactionForm › renders with default props` uses a snapshot that includes the date field. The field defaults to today's date, so the snapshot only passes on the day it was recorded.

## Environment

- Jest 30, jsdom, Node 20
- Run date: 2026-11-05 (snapshot recorded on 2026-05-04)

## Steps to reproduce

1. `cd moneylover`
2. `pnpm jest src/components/TransactionForm`

## Expected result

All tests pass on any date.

## Actual result

```
- value="2026-05-04"
+ value="2026-11-05"
Snapshots: 1 failed
```

## Root cause

The default value of the date input is `new Date()`. The snapshot stores a fixed date string.

## Fix

Freeze the system time in this test with `jest.useFakeTimers({ now: new Date('2026-05-04T12:00:00') })` and restore it with `jest.useRealTimers()` in `finally`. The snapshot did not need to be updated.

## Lessons

- Running `jest -u` would have hidden the problem for only one day.
- Any snapshot or assertion that renders "now" needs a frozen clock.
