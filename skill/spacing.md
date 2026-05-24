# EvenTee — Spacing

> One scale. 4px base. Every spacing decision maps to a token.

---

## Base Unit

**4px** — all spacing values are multiples of 4px.

---

## Spacing Tokens

| Token | Value | CSS var | Usage |
|-------|-------|---------|-------|
| `space-1` | 4px | `--space-1` | Icon internal padding, micro gaps between inline elements |
| `space-2` | 8px | `--space-2` | Badge padding, gap between icon and label, inline chip gap |
| `space-3` | 12px | `--space-3` | Button padding (sm), input gap, nav item vertical padding |
| `space-4` | 16px | `--space-4` | Card padding, form field spacing, gap between event cards |
| `space-5` | 20px | `--space-5` | Button padding (lg), list item vertical gap |
| `space-6` | 24px | `--space-6` | Section padding, card internal spacing, modal padding |
| `space-8` | 32px | `--space-8` | Between cards in workspace, modal padding (lg) |
| `space-10` | 40px | `--space-10` | Section breaks, panel top padding |
| `space-12` | 48px | `--space-12` | Page-level section separators |
| `space-16` | 64px | `--space-16` | Hero sections, top-of-page breathing room |

**CSS definitions:**
```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

---

## Spacing by Component

| Component | Padding | Gap |
|-----------|---------|-----|
| Button (sm) | 5px 12px | — |
| Button (md) | 8px 16px | — |
| Button (lg) | 12px 24px | — |
| Input (all sizes) | 9px 12px | — |
| Badge | 3px 8px | — |
| Guest card body | 14px | — |
| Guest card header | 12px 16px | — |
| Modal card | 24px | — |
| Scan result overlay | 20px | 12px between elements |
| Wizard form fields (vertical stack) | — | 16px (`space-4`) |
| Wizard form → Confirm button | — | 24px (`space-6`) |
| Event cards (list) | — | 16px (`space-4`) |
| Guest table cells | 12px 16px | — |
| Nav item | 12px 16px | — |
| Order item row | 12px 16px | — |

---

## Border Radius Tokens

| Token | Value | CSS var | Usage |
|-------|-------|---------|-------|
| `radius-sm` | 4px | `--radius-sm` | Badges, chips, tags, code blocks, inline alerts |
| `radius-md` | 8px | `--radius-md` | Buttons, inputs, nav items |
| `radius-lg` | 12px | `--radius-lg` | Cards, panels, modals, form card (auth) |
| `radius-full` | 999px | `--radius-full` | Pills (step indicators), avatars |

**CSS definitions:**
```css
:root {
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-full: 999px;
}
```

---

## Layout

### Desktop (≥ 1024px)

```
┌──────────┬──────────────────────────────────┐
│ Sidebar  │  Workspace                       │
│  220px   │  fluid (remaining width)         │
└──────────┴──────────────────────────────────┘
```

| Zone | Width | Notes |
|------|-------|-------|
| Sidebar | 220px fixed | Always visible · contains nav |
| Workspace | fluid | Wizard, guest list, scanner, analytics |

### Tablet (768px – 1023px)

- Sidebar collapses to icon-only rail (56px)
- Workspace takes full remaining width

### Mobile (< 768px)

- Full-width single-column layout
- Scanner fills entire viewport
- Bottom tab bar replaces sidebar (56px fixed bottom)
- Tab bar: Events · Guests · Scan · Orders

---

## Grid & Alignment

| Rule | Value |
|------|-------|
| Page horizontal padding (desktop) | `space-8` (32px) |
| Page horizontal padding (mobile) | `space-4` (16px) |
| Max workspace content width | 960px (centered on very wide screens) |
| Guest table max width | 100% (scrollable on mobile) |
| Event card gap (vertical stack) | `space-4` (16px) |
| Section heading bottom margin | `space-4` (16px) |

---

## Rules

1. Never use arbitrary pixel values — always map to a spacing token
2. Use `space-4` (16px) as the default gap between related elements
3. Use `space-8` (32px) when separating unrelated sections
4. Padding inside components must be consistent — use the same token on all 4 sides unless intentionally asymmetric
5. Border radius must follow the token system — no custom values like 6px or 10px outside the button size spec
