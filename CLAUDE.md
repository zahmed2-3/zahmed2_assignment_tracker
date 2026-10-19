# CLAUDE.md — Student Assignment Tracker

Project instructions for AI assistants (and humans) working on this repo.

## Project summary
TCSS 490 — Artifact 2. A single-page student assignment tracker built with plain
HTML, CSS, and JavaScript. Users can add assignments with due dates, mark them
completed, and delete them. Data is saved in the browser with `localStorage`.

## Files
| File | Purpose |
|------|---------|
| `index.html` | Page structure: form (name + due date + Add), summary line, list, empty message |
| `style.css` | Dark theme. All colors are CSS variables in `:root` |
| `script.js` | App logic: load/save, add, toggle complete, delete, render |
| `CLAUDE.md` | This file — project rules and context |
| `AI_DEVELOPMENT_LOG.md` | Record of AI-assisted work actually done |

## How to run
No build step, no server, no dependencies. Open `index.html` in a browser
(double-click it, or use VS Code's "Live Server" extension).

## Data model
Stored in `localStorage` under the key `"assignments"` as a JSON array:
```json
[{ "id": 1792371199611.42, "title": "Essay draft", "dueDate": "2026-10-25", "completed": false }]
```
- `dueDate` is the `YYYY-MM-DD` string from `<input type="date">`.
- Parse dates with `parseDate()` (local time), **not** `new Date("YYYY-MM-DD")`,
  which uses UTC and can show the wrong day in Pacific time.

## Coding rules
1. **Keep it simple.** Vanilla HTML/CSS/JS only — no frameworks, libraries, or build tools.
2. **Every change to data follows the same pattern:** update `assignments` →
   `saveAssignments()` → `render()`.
3. **Never use `innerHTML` with user input.** Use `textContent` so assignment
   names can't inject HTML.
4. Wrap `localStorage` access in `try/catch` (it can throw in private browsing).
5. Keep the dark theme: add new colors as variables in `:root`, don't hard-code them.
6. Keep code readable for a student audience: short functions, clear names, brief comments.
7. After any change, re-run the manual test checklist below and add an entry to
   `AI_DEVELOPMENT_LOG.md` describing what was actually done.

## Behavior to preserve
- Unfinished assignments show first, sorted by soonest due date; completed ones move to the bottom.
- Due-date labels: overdue = red, due within 2 days = amber (only for unfinished items).
- Completed items are crossed out and faded.
- Summary shows "X of Y completed"; an empty-state message shows when the list is empty.
- Empty names (or only spaces) are rejected.

## Manual test checklist
1. Open `index.html` → "No assignments yet" message appears.
2. Add an assignment with a name and date → it appears in the list.
3. Add one with a past date → its due label is red and says "(overdue)".
4. Check the checkbox → item is crossed out, moves to the bottom, summary updates.
5. Refresh the page → everything (including completed state) is still there.
6. Click Delete → item disappears; refresh → still gone.
7. Try to add with a blank name → it's not added.
8. Shrink the window to phone width → layout still fits, no sideways scrolling.
