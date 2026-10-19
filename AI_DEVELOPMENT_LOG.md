# AI Development Log — Student Assignment Tracker

**Student:** Zak Ahmed (zahmed2@uw.edu)
**Course:** TCSS 490 — Artifact 2
**AI tool:** Claude (Cowork mode, model `claude-opus-5-5`)

---

## Session 1 — October 18, 2026

### Prompt given to the AI
> Create a student assignment tracker using HTML, CSS and JavaScript. The website
> should let me add assignments with due dates, mark assignments as completed, and
> delete assignments. Use localStorage to save my assignments even after refreshing
> the page. Make the website look clean with a dark theme and simple code. Create a
> CLAUDE.md file with project instructions and an AI development log documenting the
> work we actually complete. Explain how to test the website when finished.

### What the AI did
1. **Checked the project folder** — it was empty, so the project started from scratch.
2. **Wrote `index.html`** — a form (assignment name, date picker, Add button), a
   summary line, the assignment list, and an empty-state message.
3. **Wrote `style.css`** — dark theme using CSS variables; dark date picker via
   `color-scheme: dark`; crossed-out styling for completed items; red/amber due labels;
   flex-wrap form so it works on phone screens.
4. **Wrote `script.js`** with these functions:
   - `loadAssignments()` / `saveAssignments()` — read/write JSON in `localStorage` (in `try/catch`)
   - `parseDate()`, `daysUntil()`, `formatDueText()` — friendly due labels like "(tomorrow)" or "(overdue)"
   - `addAssignment()`, `toggleCompleted()`, `deleteAssignment()` — each updates the array, saves, and re-renders
   - `render()` — sorts (unfinished first, then by due date), builds list items with
     `textContent`, updates the summary and empty message
5. **Tested automatically** with a headless Chromium browser (Playwright) — see results below.
6. **Wrote `CLAUDE.md`** (project rules + test checklist) and this log.

### Design decisions
- **Vanilla JS, no libraries** — matches the "simple code" requirement and needs no setup.
- **Dates parsed as local time** — `new Date("2026-10-25")` is treated as UTC midnight,
  which shows as the *previous day* in Pacific time. `parseDate()` avoids that bug.
- **`textContent` instead of `innerHTML`** — so typing something like `<b>Lab</b>`
  displays as text instead of being run as HTML.
- **Completed items sink to the bottom** so the list always shows what's left to do first.

### Testing performed
Automated browser test (Playwright + Chromium), 11 checks:

| # | Check | Result |
|---|-------|--------|
| 1 | Empty message shown on first load | PASS |
| 2 | Two assignments can be added | PASS |
| 3 | HTML in a title shows as plain text; list sorted by date | PASS |
| 4 | Past due date highlighted as overdue | PASS |
| 5 | Checkbox marks an assignment completed | PASS (after test fix, see below) |
| 6 | Summary updates to "1 of 2 completed" | PASS |
| 7 | Assignments and completed state survive a page refresh | PASS |
| 8 | Delete removes an assignment | PASS |
| 9 | Deletion survives a page refresh | PASS |
| 10 | Blank (spaces-only) name is rejected | PASS |
| 11 | No JavaScript console errors | PASS |

Screenshots were also checked at desktop (1100px) and phone (375px) widths — the
layout fit with no horizontal scrolling.

### Problems found and fixed
- **Test failure on "mark completed" (first run: 3 FAILs).** Investigation showed the
  app was working; the *test* was wrong. Playwright's `check()` clicked the first item,
  the app moved that completed item to the bottom, and Playwright re-checked "the first
  item" — which was now a different assignment — and clicked it too. Fixed by using a
  single `click()` in the test. All 11 checks then passed.
- **Possible duplicate IDs.** While debugging, the AI noticed IDs came from `Date.now()`,
  so two assignments added in the same millisecond could share an ID (then toggling or
  deleting one would affect the wrong item). Changed to `Date.now() + Math.random()`.
- **Playwright browser setup** — the first test run failed because the freshly
  installed Playwright looked for a browser version that wasn't present; fixed by
  pointing it to the preinstalled Chromium. (Environment issue, not an app bug.)

### What I (the student) should still verify
- [ ] Run the manual test checklist in `CLAUDE.md` in my own browser
- [ ] Read through `script.js` and make sure I understand each function

---

<!-- Add future sessions below using the same format: prompt, what was done, testing, problems fixed. -->
