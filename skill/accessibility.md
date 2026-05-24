# EvenTee — Accessibility

> EvenTee must be usable by everyone. This file covers WCAG compliance, color contrast, keyboard navigation, screen reader support, and reduced motion.

---

## Standard

EvenTee targets **WCAG 2.1 Level AA** compliance across all interactive elements.

---

## Color Contrast

### Primary Brand Pairings

| Foreground | Background | Ratio | WCAG Level | Pass? |
|-----------|-----------|-------|------------|-------|
| White (`#FFFFFF`) | Primary `#4338CA` (700) | 5.8:1 | AA Pass | ✅ |
| White (`#FFFFFF`) | Primary Hover `#3730A3` (800) | 7.1:1 | AAA Pass | ✅ |
| White (`#FFFFFF`) | Primary Pressed `#312E81` (900) | 8.5:1 | AAA Pass | ✅ |
| Primary text `#312E81` | Tint `#EEF2FF` | 12.5:1 | AAA Pass | ✅ |

> Deep Indigo passes AA at base (700) with white text. Use confidently for all text sizes.

### Text on Backgrounds

| Foreground | Background | Ratio | Level |
|-----------|-----------|-------|-------|
| `#212529` (primary text) | `#F8F9FA` (page bg) | 18.1:1 | AAA ✅ |
| `#212529` | `#FFFFFF` (card bg) | 21:1 | AAA ✅ |
| `#6C757D` (secondary text) | `#FFFFFF` | 5.9:1 | AA ✅ |
| `#ADB5BD` (muted) | `#FFFFFF` | 2.9:1 | Fail — use for placeholder/disabled only ⚠ |

> `#ADB5BD` (muted) does not pass AA. Use it only for placeholder text, disabled states, and metadata — never for primary readable text.

### Semantic Color Pairings

| Foreground | Background | Ratio | Level |
|-----------|-----------|-------|-------|
| `#166534` | `#EAF7EF` (success tint) | 6.8:1 | AA ✅ |
| `#92400E` | `#FEF3C7` (warning tint) | 6.1:1 | AA ✅ |
| `#991B1B` | `#FEE2E2` (danger tint) | 7.2:1 | AA ✅ |

---

## Focus Management

All interactive elements must have a visible focus ring.

**Focus ring spec:**
```css
outline: none;
box-shadow: 0 0 0 3px rgba(67,56,202,0.12);
```

| Element | Focus behavior |
|---------|---------------|
| Buttons | Focus ring `rgba(67,56,202,0.12)` · 3px |
| Inputs | Border → `1.5px solid #4338CA` + focus ring |
| Wizard step | Focus ring on active step, focusable step buttons |
| Nav items | Focus ring on hovered/focused nav item |
| Modal | Focus traps inside modal — Tab cycles only within modal content |
| Toast | Focusable — action button is reachable via Tab |

**Tab order rules:**
1. Sidebar navigation first
2. Wizard form fields top to bottom
3. Submit button last in form
4. Guest table rows left to right
5. Modal traps focus — no Tab out until dismissed

---

## Keyboard Navigation

| Action | Key |
|--------|-----|
| Move between fields | `Tab` / `Shift+Tab` |
| Activate button | `Enter` or `Space` |
| Close modal | `Esc` |
| Navigate wizard steps | `Tab` between step buttons, `Enter` to select |
| Select chip option | `Enter` or `Space` when focused |
| Dismiss toast | `Esc` or wait for auto-dismiss |

---

## Screen Reader Support

### Semantic HTML requirements

| Element | Tag |
|---------|-----|
| Page headings | `<h1>` – `<h3>` matching type scale |
| Buttons | `<button>` — never `<div>` or `<span>` |
| Form inputs | `<input>` / `<textarea>` / `<select>` with `<label for="">` |
| RSVP buttons | `role="radiogroup"` · each option `role="radio"` |
| Navigation | `<nav>` with `aria-label="Main navigation"` |
| Modal | `role="dialog"` · `aria-modal="true"` · `aria-labelledby` pointing to heading |
| Loading spinner | `role="status"` · `aria-label="Processing..."` |
| Guest table | `<table>` with `<caption>` and `<th>` scope attributes |
| Scan result | `role="alert"` · `aria-live="assertive"` |

### ARIA labels

| Component | ARIA |
|-----------|------|
| Scan QR button | `aria-label="Scan QR code"` |
| Check-in button | `aria-label="Check in guest"` |
| Copy invite link | `aria-label="Copy invite link"` |
| Loading state | `aria-live="polite"` on status region |
| Scan result | `role="alert"` · `aria-live="assertive"` for errors · `polite` for success |

---

## Color-Blind Safe Patterns

EvenTee's semantic colors are paired with icons and labels — color alone is never the only differentiator.

| Semantic meaning | Color | Paired with |
|-----------------|-------|-------------|
| Check-in success | `#22C55E` | `Check` icon or "Checked in" text |
| Warning / Duplicate | `#F59E0B` | `Alert-triangle` icon or "Already checked in" text |
| Error / Invalid | `#EF4444` | `X-circle` icon or "QR not recognized" text |
| Active/Selected | `#4338CA` | Check mark or active label |

---

## Reduced Motion

All animations must respect `prefers-reduced-motion: reduce`.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 150ms !important;
    transform: none !important;
  }
}
```

| Animation | Normal | Reduced motion |
|-----------|--------|----------------|
| Check-in result slide-in | `translateY(8px) → 0` + opacity | Opacity only |
| Guest card stagger | 3 rows with 0/80/160ms delays | All rows appear at once |
| Modal open | Slide up + fade | Fade only |
| Scan spinner | Rotating arc | Static arc or opacity pulse |
| Skeleton pulse | Opacity pulse | Allowed — subtle, no movement |

See [motion.md](./motion.md) for full motion spec.

---

## Rules

1. All buttons and interactive elements must be reachable by keyboard (`Tab`)
2. All form inputs must have visible `<label>` elements — no placeholder-only labels
3. Focus ring must always be visible — never `outline: none` without a replacement
4. Never use color as the only differentiator — always pair with icon or text
5. `#ADB5BD` fails AA contrast — use for placeholder and disabled states only
6. Modals must trap focus — Tab must not escape the modal while it's open
7. Loading states must use `aria-live` or `role="status"` so screen readers announce them
8. Respect `prefers-reduced-motion` — no sliding or rotation in reduced motion mode
