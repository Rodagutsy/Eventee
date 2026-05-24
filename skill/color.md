# EvenTee — Color System

## Brand Identity
EvenTee uses Deep Indigo as the primary brand color paired with Champagne Gold as the secondary accent, alongside slate neutrals and semantic colors.

---

## Primary — Deep Indigo

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#4338CA` (700) | Brand primary — buttons, links, active states, focus rings, step indicators |
| `--color-primary-hover` | `#3730A3` (800) | Hover state — button hover, chip hover, active nav item |
| `--color-primary-pressed` | `#312E81` (900) | Pressed state |
| `--color-primary-tint` | `#EEF2FF` (50) | Subtle backgrounds — badge bg, input focus bg, selected row |
| `--color-primary-text` | `#312E81` (900) | Dark text on tint backgrounds |

### Full Ramp

| Stop | Hex |
|------|-----|
| 50 | `#EEF2FF` |
| 100 | `#E0E7FF` |
| 200 | `#C7D2FE` |
| 300 | `#A5B4FC` |
| 400 | `#818CF8` |
| 500 | `#6366F1` |
| 600 | `#4F46E5` |
| 700 | `#4338CA` ← **base** |
| 800 | `#3730A3` |
| 900 | `#312E81` |

---

## Secondary — Champagne Gold

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-secondary` | `#D4AF37` | Accent — badges, highlights, decorative elements |
| `--color-secondary-hover` | `#C5A028` | Hover state for gold elements |
| `--color-secondary-tint` | `#FDF6E3` | Subtle gold backgrounds |
| `--color-secondary-text` | `#8B6914` | Dark text on gold tint |

---

## Semantic Colors

### Success
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#22C55E` | Check-in confirmed, RSVP yes, payment complete |
| `--color-success-tint` | `#EAF7EF` | Success backgrounds |
| Success border | `#BBE8CC` | Success tint border |
| Success text | `#166534` | Text on success tint |

### Warning
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-warning` | `#F59E0B` | Duplicate scan, pending items, maybe RSVP |
| `--color-warning-tint` | `#FEF3C7` | Warning backgrounds |
| Warning border | `#FDE68A` | Warning tint border |
| Warning text | `#92400E` | Text on warning tint |

### Danger
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-danger` | `#EF4444` | Invalid QR, RSVP no, delete action, error state |
| `--color-danger-tint` | `#FEE2E2` | Error/danger backgrounds |
| Danger border | `#FECACA` | Danger tint border |
| Danger text | `#991B1B` | Text on danger tint |

---

## Neutral Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-page` | `#F8F9FA` (50) | Page background, panel background |
| `--color-bg-surface` | `#F1F3F5` (100) | Card surface, input background, skeleton loader |
| `--color-bg-card` | `#FFFFFF` | Card background |
| `--color-border-default` | `#DEE2E6` (300) | Dividers, card borders, input borders (default) |
| 400 | `#CED4DA` | Focused card borders, secondary borders |
| `--color-text-muted` | `#ADB5BD` (500) | Placeholder text, disabled icons, muted metadata |
| `--color-text-secondary` | `#6C757D` (600) | Secondary body text, form helper text, captions |
| 700 | `#495057` | Medium-emphasis text |
| `--color-text-primary` | `#212529` (900) | Display headings, high-emphasis text |
| 800 | `#343A40` | Primary body text, headings, labels |

---

## CSS Custom Properties

```css
:root {
  /* Brand */
  --color-primary:         #4338CA;
  --color-primary-hover:   #3730A3;
  --color-primary-pressed: #312E81;
  --color-primary-tint:    #EEF2FF;
  --color-primary-text:    #312E81;

  /* Secondary */
  --color-secondary:        #D4AF37;
  --color-secondary-hover:  #C5A028;
  --color-secondary-tint:   #FDF6E3;
  --color-secondary-text:   #8B6914;

  /* Semantic */
  --color-success:         #22C55E;
  --color-success-tint:    #EAF7EF;
  --color-warning:         #F59E0B;
  --color-warning-tint:    #FEF3C7;
  --color-danger:          #EF4444;
  --color-danger-tint:     #FEE2E2;

  /* Surface & Text */
  --color-bg-page:         #F8F9FA;
  --color-bg-card:         #FFFFFF;
  --color-bg-surface:      #F1F3F5;
  --color-border-default:  #DEE2E6;
  --color-text-primary:    #212529;
  --color-text-secondary:  #6C757D;
  --color-text-muted:      #ADB5BD;
}
```

---

## Accessibility

| Pairing | Contrast Ratio | WCAG Level |
|---------|---------------|------------|
| White on `#4338CA` (700) | 5.8:1 | AA Pass |
| White on `#3730A3` (800) | 7.1:1 | AAA Pass |
| Dark text on tint 50 | 12.5:1 | AAA Pass |
| Body text on page bg | 18.1:1 | AAA Pass |

> Deep Indigo passes AA at base (700) with white text — use confidently for all text sizes.

---

## Dark Mode

Flip tint stops: `50 → 900`, `100 → 800`, `200 → 700`. Text on tints flips from 900 to 200.

- Primary button stays `#4338CA` — no change needed in dark mode

---

## Guest Category Badge Colors

| Category | Color | Hex |
|----------|-------|-----|
| VIP | Champagne Gold | `#D4AF37` |
| Regular | Slate (400) | `#94A3B8` |
| Family | Blue (400) | `#3B82F6` |
| Friends | Green (400) | `#22C55E` |
| Corporate | Deep Indigo (400) | `#818CF8` |
| Media | Purple (400) | `#A855F7` |
| Other | Gray (400) | `#9CA3AF` |

---

## RSVP Status Badge Colors

| Status | Color | Hex |
|--------|-------|-----|
| Yes | Green | `#22C55E` |
| No | Red | `#EF4444` |
| Maybe | Amber | `#F59E0B` |
| Pending | Gray | `#ADB5BD` |
| Waitlist | Deep Indigo (300) | `#A5B4FC` |

---

## Check-in Status Colors

| Status | Color | Hex |
|--------|-------|-----|
| Checked in | Green | `#22C55E` |
| Not checked in | Gray | `#ADB5BD` |
| Duplicate scan | Amber | `#F59E0B` |
| Invalid QR | Red | `#EF4444` |

---

## Rules

1. `#4338CA` is for **interactive elements only** — never decorative backgrounds
2. Deep Indigo passes AA at base with white text — use for all button sizes
3. Never use color as the only differentiator — always pair with icon, label, or pattern
4. Use tint (50) for subtle context backgrounds, not emphasis
5. Champagne Gold is for accent highlights (VIP badges, decorative elements) — never primary actions
