# Test Coverage Analysis

## Current State

**Test coverage: 0%** — The codebase has no tests, no test framework, and no CI/CD pipeline.

The project is a single-file static website (`index.html`) with ~110 lines of embedded JavaScript containing several distinct functional units. While the project is small, the JavaScript logic includes stateful behavior and side effects that are prone to regressions.

---

## Testable Units Identified

### 1. `updateClock()` — Clock Display (line 701)

**What it does:** Formats the current time in the `Asia/Tehran` timezone and writes it to the DOM.

**Risk level:** Low
**Current coverage:** None

**Recommended tests:**
- Verify output format is `HH:MM` (zero-padded)
- Verify timezone conversion produces a valid time string
- Verify the DOM element is updated

---

### 2. `showToast(message)` — Toast Notifications (line 712)

**What it does:** Displays a temporary notification by adding/removing a CSS class after a 3-second timeout.

**Risk level:** Low
**Current coverage:** None

**Recommended tests:**
- Verify the `show` class is added on call
- Verify the `show` class is removed after timeout
- Verify the toast text content matches the input message

---

### 3. `getData(key, defaultValue)` / `setData(key, value)` — localStorage Helpers (lines 720-727)

**What they do:** Wrappers around `localStorage.getItem`/`setItem` with JSON serialization.

**Risk level:** Medium — these are used by every stateful feature (visitors, likes, guestbook)
**Current coverage:** None

**Recommended tests:**
- `getData` returns `defaultValue` when key does not exist
- `getData` correctly parses stored JSON (strings, numbers, arrays, objects)
- `getData` returns `defaultValue` when stored value is malformed JSON (currently **unhandled** — `JSON.parse` will throw)
- `setData` serializes and stores values correctly

**Bug found:** `getData` does not handle corrupt/malformed localStorage entries. If `JSON.parse` throws, the entire page will break. This should be wrapped in a try/catch.

---

### 4. Visitor Counter Logic (lines 730-737)

**What it does:** Increments a persistent visitor count on first visit using localStorage flags.

**Risk level:** Medium
**Current coverage:** None

**Recommended tests:**
- First visit: counter increments from default (142) to 143
- Subsequent visits: counter remains unchanged
- DOM element displays the correct count
- Behavior after localStorage is cleared (simulating a new browser)

---

### 5. Like System (lines 739-755)

**What it does:** Allows one like per browser, persisted in localStorage. Updates DOM and shows toast feedback.

**Risk level:** Medium
**Current coverage:** None

**Recommended tests:**
- First click: like count increments, DOM updates, toast shows success message
- Second click: like count does NOT increment, toast shows "already liked" message
- Widget text changes to "ممنون! 💖" after liking
- State persists across page reloads (localStorage)

---

### 6. `escapeHtml(text)` — XSS Prevention (line 780)

**What it does:** Escapes HTML entities by leveraging DOM `textContent`/`innerHTML` round-trip.

**Risk level:** High — this is a security-critical function
**Current coverage:** None

**Recommended tests:**
- Basic text passes through unchanged
- `<script>alert('xss')</script>` is escaped
- HTML entities like `&`, `<`, `>`, `"`, `'` are all escaped
- Empty string input returns empty string
- Unicode/RTL text (Persian characters) passes through correctly
- Nested HTML tags are escaped

---

### 7. Guestbook — Message Submission (lines 786-805)

**What it does:** Handles form submission, validates input, stores messages in localStorage, and re-renders the message list.

**Risk level:** High — user input handling with persistence
**Current coverage:** None

**Recommended tests:**
- Valid submission: message is added to localStorage array
- Empty name or text: submission is rejected (no message added)
- Whitespace-only input: submission is rejected after `.trim()`
- Messages are stored with correct `{ name, text, time }` structure
- Form inputs are cleared after successful submission
- Toast notification is shown on successful submission
- Input `maxlength` attributes (30 for name, 200 for text) are respected in HTML

---

### 8. `renderMessages()` — Message Rendering (lines 760-778)

**What it does:** Renders guestbook messages into the DOM in reverse chronological order, or shows an empty-state message.

**Risk level:** Medium
**Current coverage:** None

**Recommended tests:**
- Zero messages: shows the "no messages" placeholder
- One or more messages: renders in reverse order (newest first)
- Message count is updated in the stats display
- HTML in message names/text is escaped (integration with `escapeHtml`)
- Large number of messages renders correctly

---

## Priority Recommendations

### P0 — Fix First, Then Test

| Issue | Location | Description |
|-------|----------|-------------|
| Missing error handling in `getData` | Line 721 | `JSON.parse` will throw on corrupt localStorage data, crashing the entire page. Wrap in try/catch. |

### P1 — High Priority Tests

| Area | Reason |
|------|--------|
| `escapeHtml()` | Security-critical. XSS vulnerabilities if this breaks. |
| Guestbook submission | User input handling with persistence. Most complex logic in the codebase. |
| `getData`/`setData` | Foundation for all stateful features. A bug here cascades everywhere. |

### P2 — Medium Priority Tests

| Area | Reason |
|------|--------|
| Like system | Stateful user interaction with duplicate-prevention logic. |
| Visitor counter | Stateful counter with first-visit detection. |
| `renderMessages()` | Rendering logic with conditional branches. |

### P3 — Low Priority Tests

| Area | Reason |
|------|--------|
| `updateClock()` | Simple formatting with no branching logic. |
| `showToast()` | Simple DOM class toggle with timeout. |

---

## Recommended Testing Setup

Since this is a vanilla JS project with DOM manipulation, a suitable stack would be:

1. **Jest** + **jsdom** — for unit testing JS functions in a simulated DOM environment
2. **`@testing-library/dom`** — for DOM interaction testing (clicks, form submissions)
3. **Optional: Playwright or Cypress** — for end-to-end testing if the project grows

### Suggested project structure:

```
alisagv.github.io/
  index.html
  js/
    clock.js
    storage.js
    likes.js
    visitors.js
    guestbook.js
    toast.js
    escapeHtml.js
  tests/
    storage.test.js
    escapeHtml.test.js
    guestbook.test.js
    likes.test.js
    visitors.test.js
  package.json
  jest.config.js
```

Extracting the embedded JS into separate modules would make the code independently testable without requiring a full browser environment for every test.

---

## Summary

| Metric | Value |
|--------|-------|
| Total testable functions | 8 |
| Functions with tests | 0 |
| Coverage | 0% |
| Bugs found during analysis | 1 (missing error handling in `getData`) |
| Security-critical untested code | 1 function (`escapeHtml`) |
| Recommended P0 fixes | 1 |
| Recommended P1 tests | 3 areas |
| Recommended P2 tests | 3 areas |
| Recommended P3 tests | 2 areas |
