# EvenTee — Typography

> Two fonts. One brand. No exceptions.

---

## Font Families

| Role | Family | Weights Used | Source | License |
|------|--------|-------------|--------|---------|
| Display / Headings | Bricolage Grotesque | 600, 700 | Google Fonts | OFL (free) |
| Body / UI | Inter | 400, 500, 600 | Google Fonts | OFL (free) |
| Monospace | SF Mono, Fira Code, monospace (fallback) | — | System / Google Fonts | — |

**Import (Google Fonts):**
```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

**CSS font stack:**
```css
--font-display: 'Bricolage Grotesque', sans-serif;
--font-body:    'Inter', sans-serif;
--font-mono:    'SF Mono', 'Fira Code', monospace;
```

---

## Type Scale

| Token | Size | Line Height | Weight | Font | Letter Spacing | Usage |
|-------|------|-------------|--------|------|----------------|-------|
| `display-hero` | 64px | 1.0 | 700 | Bricolage | −3px | Hero / landing headline |
| `display` | 48px | 1.05 | 700 | Bricolage | −2px | Page-level headings |
| `heading-1` | 36px | 1.1 | 700 | Bricolage | −1.5px | Section titles, auth page brand name |
| `heading-2` | 26px | 1.2 | 600 | Bricolage | −0.8px | Panel headings, modal titles |
| `heading-3` | 20px | 1.3 | 600 | Bricolage | −0.4px | Card titles, sidebar headings, event name |
| `body-lg` | 16px | 1.7 | 400 | Inter | 0 | Onboarding text, empty states, auth value prop |
| `body` | 14px | 1.6 | 400 | Inter | 0 | Guest data, form inputs, event descriptions |
| `body-sm` | 13px | 1.6 | 400 | Inter | 0 | Secondary info, helper text, nav items |
| `label` | 12px | 1.4 | 500 | Inter | +0.2px | Form labels, button text, tab labels |
| `caption` | 11px | 1.5 | 400 | Inter | +0.1px | Timestamps, metadata, badge text, stage labels |
| `overline` | 10px | 1.4 | 600 | Inter | +1.5px / UPPERCASE | Section labels, step counters |

---

## CSS Token Definitions

```css
/* Display */
.display-hero {
  font-family: var(--font-display);
  font-size: 64px;
  line-height: 1.0;
  font-weight: 700;
  letter-spacing: -3px;
}

.display {
  font-family: var(--font-display);
  font-size: 48px;
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -2px;
}

/* Headings */
.heading-1 {
  font-family: var(--font-display);
  font-size: 36px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -1.5px;
}

.heading-2 {
  font-family: var(--font-display);
  font-size: 26px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.8px;
}

.heading-3 {
  font-family: var(--font-display);
  font-size: 20px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.4px;
}

/* Body */
.body-lg {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
  font-weight: 400;
}

.body {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.6;
  font-weight: 400;
}

.body-sm {
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.6;
  font-weight: 400;
}

/* Utility */
.label {
  font-family: var(--font-body);
  font-size: 12px;
  line-height: 1.4;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.caption {
  font-family: var(--font-body);
  font-size: 11px;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: 0.1px;
}

.overline {
  font-family: var(--font-body);
  font-size: 10px;
  line-height: 1.4;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
```

---

## Token Usage by Component

| Component | Token |
|-----------|-------|
| Auth page — brand name | `heading-1` · Bricolage 700 |
| Auth page — value prop | `body-lg` · Inter 400 · `#6C757D` |
| Modal title | `heading-2` · Bricolage 600 |
| Event card — name | `heading-3` · Bricolage 600 |
| Guest card — name | `heading-3` · Bricolage 600 |
| Guest table data | `body-sm` · Inter 400 |
| Form labels | `label` · Inter 500 |
| Form inputs / placeholders | `body` · Inter 400 |
| Button text | `label` · Inter 500 |
| Badge text | `caption` · Inter weight 600 |
| Wizard step label | `caption` · Inter 400 · `#6C757D` |
| Nav item labels | `body-sm` · Inter 400 |
| QR token display | `body` · Inter 400 · monospace variant |
| Prices | `body` · Inter 500 · `#212529` |
| Live counter numbers | `heading-3` · Bricolage 600 |

---

## Typography Rules

1. **Bricolage Grotesque for headings only** — `heading-1` through `heading-3` and `display` tokens
2. **Inter for all UI text** — body, labels, buttons, captions, nav items
3. **Monospace for QR tokens and codes only** — never for regular text
4. **Negative letter-spacing on Bricolage only** — −0.4px to −3px on heading tokens, never on body
5. **Minimum body size is 13px** (`body-sm`) — use `caption` (11px) only for timestamps, badges, metadata
6. **Max guest table row line length: 65ch** — prevents overly wide table cells
7. **No text decoration on headings** — no underlines, no strikethrough on Bricolage tokens
8. **Button text uses `label` token** — 12px · Inter 500 · no uppercase except `overline`

---

## Accessibility Notes

- Minimum readable size for body text: 13px (`body-sm`) — do not go below this for any readable content
- `caption` (11px) and `overline` (10px) are for supplementary info only — not for primary readable content
- Use `--color-text-primary` (`#212529`) for all heading text — 18.1:1 contrast on page background (AAA)
- Use `--color-text-secondary` (`#6C757D`) for secondary text — 5.9:1 on white (AA pass)
- `--color-text-muted` (`#ADB5BD`) fails AA contrast — use only for placeholder text and disabled states

See [accessibility.md](./accessibility.md) for full contrast ratio table.
