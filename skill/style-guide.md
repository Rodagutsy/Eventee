# EvenTee — Style Guide

> Master reference for EvenTee's design system. Use this as your starting point. Each section links to the full spec file.

---

## What is EvenTee?

EvenTee is a mobile-first event management platform focused on secure invite-only events with integrated guest verification, seating, Aso Ebi commerce, and logistics coordination. It replaces WhatsApp, Excel, and paper-based guest lists.

**Tech stack:** Next.js · React · Tailwind · Supabase (DB + Auth + Storage) · Paystack · TypeScript · Vercel (hosting)

---

## Design Principles

| Principle | Meaning |
|-----------|---------|
| **Mobile-first** | One primary action per screen, bottom navigation, large tap targets |
| **Offline-first** | Check-in works without internet; auto-syncs when reconnected |
| **Deterministic** | QR verification and seating are rule-based, not AI-guessed |
| **Nigerian market native** | OTP login, WhatsApp sharing, USSD payments, NGN currency |
| **Visible confirmations** | Every action produces immediate, clear feedback |

---

## File Index

| File | What it covers |
|------|---------------|
| [color.md](./color.md) | Deep Indigo brand, Champagne Gold accent, semantic colors, neutral scale, CSS tokens, accessibility, dark mode |
| [typography.md](./typography.md) | Fonts, type scale, weights, line heights, letter spacing, usage rules |
| [spacing.md](./spacing.md) | Spacing tokens, border radius, layout breakpoints |
| [components.md](./components.md) | All UI components with full visual specs |
| [forms.md](./forms.md) | Wizard form fields, validation, auth forms |
| [icons.md](./icons.md) | Lucide icon set, sizes, usage rules |
| [motion.md](./motion.md) | Animation tokens, easing, key interaction moments |
| [loading-states.md](./loading-states.md) | Spinner, skeleton, processing states |
| [empty-states.md](./empty-states.md) | Empty, no-results, and error states |
| [notifications.md](./notifications.md) | Toasts, inline alerts, scan results |
| [tables.md](./tables.md) | Guest table, order table specs |
| [accessibility.md](./accessibility.md) | WCAG compliance, contrast, keyboard nav, reduced motion |
| [skills.md](./skills.md) | Event management capabilities and feature specs |
| [design-system.md](./design-system.md) | Full combined reference (all sections in one file) |

---

## Quick Token Reference

### Colors

```css
--color-primary:         #4338CA;   /* Brand — buttons, links, active states */
--color-primary-hover:   #3730A3;   /* Hover */
--color-primary-tint:    #EEF2FF;   /* Focus bg, selected bg */
--color-primary-text:    #312E81;   /* Text on tint */

--color-secondary:       #D4AF37;   /* Accent — VIP badges, highlights */

--color-success:         #22C55E;
--color-warning:         #F59E0B;
--color-danger:          #EF4444;

--color-bg-page:         #F8F9FA;
--color-bg-card:         #FFFFFF;
--color-bg-surface:      #F1F3F5;
--color-border-default:  #DEE2E6;
--color-text-primary:    #212529;
--color-text-secondary:  #6C757D;
--color-text-muted:      #ADB5BD;
```

### Spacing

| Token | Value |
|-------|-------|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-6` | 24px |
| `space-8` | 32px |

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `radius-sm` | 4px | Badges, chips |
| `radius-md` | 8px | Buttons, inputs |
| `radius-lg` | 12px | Cards, modals |
| `radius-full` | 999px | Step indicators |

### Type Scale (Most Used)

| Token | Size | Font |
|-------|------|------|
| `heading-2` | 26px | Bricolage 600 |
| `heading-3` | 20px | Bricolage 600 |
| `body` | 14px | Inter 400 |
| `body-sm` | 13px | Inter 400 |
| `label` | 12px | Inter 500 |
| `caption` | 11px | Inter 400 |

---

## Layout

| Breakpoint | Structure |
|------------|-----------|
| Desktop | Sidebar 220px + fluid workspace |
| Tablet | Sidebar collapses to icon rail |
| Mobile | Full-width stacked · bottom tab bar |

---

## Elevation (Border-Based — No Shadows)

| Level | Border | Usage |
|-------|--------|-------|
| 0 | `0.5px solid #DEE2E6` | Default cards |
| 1 | `0.5px solid #CED4DA` | Focused cards, panels |
| 2 | `1px solid #ADB5BD` | Dropdowns |
| 3 | `1.5px solid #ADB5BD` | Modals, toasts |

---

## Brand Rules

1. `#4338CA` (Deep Indigo) is for **interactive elements only** — never decorative backgrounds
2. `#D4AF37` (Champagne Gold) is for accent only — VIP badges, decorative highlights — never primary actions
3. All QR verification is deterministic — no AI guesswork in check-in decisions
4. Offline check-in must always work — internet is not required
5. Lucide Icons only — outlined, stroke-width 2px — never filled icons
6. Border-based elevation only — no box-shadows anywhere
