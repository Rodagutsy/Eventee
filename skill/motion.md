# EvenTee — Motion

> Motion should feel fast, purposeful, and satisfying. Every animation serves a function — confirming actions, guiding attention, or signaling that something is happening.

---

## Principles

- **Fast by default** — most transitions are 150–300ms. Never slow.
- **Functional only** — no decorative animations. Every motion has a reason.
- **Reduced motion first** — design animations so they degrade gracefully.
- **Four key moments:** Check-in scan · RSVP confirm · Copy invite link · Wizard step transition — these must feel polished.

---

## Duration Tokens

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `duration-instant` | 80ms | ease-out | Button active press, toggle flick, stagger delay unit |
| `duration-fast` | 150ms | ease-out | Hover states, scan confirmation flash, fade in/out |
| `duration-normal` | 200ms | ease-in-out | Tab switch, badge appear, input focus transition |
| `duration-enter` | 300ms | ease-out | Check-in result slide-in, QR pass reveal |
| `duration-modal` | 250ms | ease-out | Modal / drawer open and close |
| `duration-loading` | 1200ms | linear loop | Spinner rotation |

**CSS variables:**
```css
--duration-instant: 80ms;
--duration-fast:    150ms;
--duration-normal:  200ms;
--duration-enter:   300ms;
--duration-modal:   250ms;
--duration-loading: 1200ms;
```

---

## Key Interaction Moments

### 1. QR Scan Result *(Core magic moment — must feel satisfying)*

The most important moment in EvenTee. Security staff scans a guest QR and the result must be instant and clear.

**Step-by-step:**

| Step | Action | Timing |
|------|--------|--------|
| 1 | Spinner appears · label "Verifying QR code..." | On scan detect |
| 2 | Verification response received | < 500ms |
| 3 | Spinner fades out | 150ms |
| 4 | Result card slides in from top | 300ms ease-out |
| 5 | Success: green check · Duplicate: amber warning · Invalid: red X | Instant |

**Result entry animation:**
```css
@keyframes resultEnter {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scan-result {
  animation: resultEnter 300ms ease-out forwards;
}
```

**Auto-dismiss:**
- Success: 3000ms
- Duplicate: 2000ms
- Invalid: 2000ms

---

### 2. RSVP Confirmation *(Guest-facing — must feel rewarding)*

The guest has confirmed attendance. This must feel satisfying and trustworthy.

| Step | Action | Timing |
|------|--------|--------|
| 1 | RSVP button shows spinner | On click |
| 2 | Server confirms | < 1s |
| 3 | Button turns green (Yes) and shows Check icon | 150ms |
| 4 | QR pass card slides in below | 300ms ease-out |
| 5 | "Attendance Confirmed!" heading appears | 200ms |

---

### 3. Copy Invite Link Confirmation *(Inline — no toast needed)*

Immediate, satisfying feedback that the copy succeeded. The button itself becomes the confirmation.

| Time | State |
|------|-------|
| 0ms | `Copy` icon · `#6C757D` |
| 150ms | Swap to `Check` icon · color `#22C55E` |
| 150ms–1950ms | Hold `Check` icon |
| 1950ms | Fade back to `Copy` icon (150ms) |

```css
.copy-btn .icon-check {
  color: #22C55E;
  transition: opacity var(--duration-fast) ease-out;
}
```

---

### 4. Wizard Step Transition

Moving between wizard steps should feel smooth and directional.

| Direction | Animation |
|-----------|-----------|
| Forward | Current content slides out left (-12px) + new content slides in from right (+12px) |
| Backward | Current content slides out right (+12px) + previous content slides in from left (-12px) |

Duration: 200ms ease-out per step.

---

### 5. Modal Open / Close

| Direction | Animation |
|-----------|-----------|
| Open | Overlay fades in (150ms) + card fades in + `translateY(8px) → 0` (250ms) |
| Close | Card fades out (150ms) + overlay fades out (150ms) |

---

## Hover & Focus Transitions

All hover and focus state changes use `duration-fast` (150ms).

```css
transition: background-color 150ms ease-out,
            border-color 150ms ease-out,
            color 150ms ease-out,
            box-shadow 150ms ease-out;
```

---

## Skeleton Pulse Animation

Used during CSV import or guest list loading.

```css
@keyframes skeletonPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.skeleton {
  background: #F1F3F5;
  border-radius: 4px;
  animation: skeletonPulse 1500ms ease-in-out infinite;
}
```

---

## Reduced Motion

All animations must respect `prefers-reduced-motion: reduce`.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 150ms !important;
    transform: none !important;
  }
}
```

| Animation | Normal behavior | Reduced motion |
|-----------|----------------|----------------|
| Scan result entry | `translateY(-8px) → 0` + opacity | Opacity only · no translate |
| QR pass reveal | Slide in from bottom | Instant fade in |
| Wizard step transition | Slide direction | Instant crossfade |
| Modal open | Slide up + fade | Fade only |
| Spinner | Rotating arc | Static arc or opacity pulse |
| Skeleton pulse | Opacity loop | Allowed (subtle, no movement) |
| Hover transitions | 150ms | 0ms (instant) |

See [accessibility.md](./accessibility.md) for full reduced motion policy.

---

## Rules

1. Hover and focus transitions: always 150ms — never 0ms (jarring) or > 200ms (sluggish)
2. Scan result animation: 300ms max — must feel instant for security staff
3. No bouncing, elastic, or spring easings — EvenTee is professional, not playful
4. No looping animations in idle state — spinner runs only during active processing
5. Toast entrance: fade in at 150ms · no slide from bottom (too distracting)
6. Scan result auto-dismiss: minimum 2000ms (enough to read), maximum 3000ms
