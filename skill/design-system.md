# EvenTee — Design System

> Version 1.0.0 · Last updated 2026-05-23

EvenTee's design system covers typography, color, spacing, components, icons, elevation, motion, and states. It is built for a mobile-first event management platform — helping Nigerian organizers manage guests, seating, check-in, Aso Ebi commerce, and logistics.

---

## 1. Typography

### Fonts

| Role | Family | Weights | Usage |
|------|--------|---------|-------|
| Display | Bricolage Grotesque | 600, 700 | Page titles, section headers, wizard headings |
| Body | Inter | 400, 500, 600 | All UI text, guest data, form labels, buttons |
| Mono | SF Mono, Fira Code, monospace | — | QR data, tokens, code-style data |

Both fonts are available free via Google Fonts (OFL license).

### Type Scale

| Token | Size | Line Height | Weight | Font | Letter Spacing | Usage |
|-------|------|-------------|--------|------|----------------|-------|
| `display-hero` | 64px | 1.0 | 700 | Bricolage | −3px | Hero / landing headline |
| `display` | 48px | 1.05 | 700 | Bricolage | −2px | Page-level headings |
| `heading-1` | 36px | 1.1 | 700 | Bricolage | −1.5px | Section titles, auth pages |
| `heading-2` | 26px | 1.2 | 600 | Bricolage | −0.8px | Panel headings, modal titles |
| `heading-3` | 20px | 1.3 | 600 | Bricolage | −0.4px | Card titles, event names |
| `body-lg` | 16px | 1.7 | 400 | Inter | 0 | Onboarding text, empty states |
| `body` | 14px | 1.6 | 400 | Inter | 0 | Guest data, form inputs, descriptions |
| `body-sm` | 13px | 1.6 | 400 | Inter | 0 | Secondary info, helper text |
| `label` | 12px | 1.4 | 500 | Inter | +0.2px | Form labels, button text, tabs |
| `caption` | 11px | 1.5 | 400 | Inter | +0.1px | Timestamps, tooltips, metadata |
| `overline` | 10px | 1.4 | 600 | Inter | +1.5px / UPPERCASE | Section labels, stage counters |

### Typography Rules
- Always use Bricolage Grotesque for headings, Inter for everything else
- Negative letter-spacing (−1.5px to −3px) on Bricolage headings only
- Minimum body size is 13px (`body-sm`); 11px reserved for captions only
- QR tokens render in monospace
- Max line length for guest descriptions: 65 characters

---

## 2. Color

See [color.md](./color.md) for the full color reference.

**Quick summary:**
- Brand: Deep Indigo `#4338CA`
- Secondary/Accent: Champagne Gold `#D4AF37`
- Page bg: `#F8F9FA` · Card bg: `#FFFFFF` · Surface: `#F1F3F5`
- Primary text: `#212529` · Secondary: `#6C757D` · Muted: `#ADB5BD`
- Success: `#22C55E` · Warning: `#F59E0B` · Danger: `#EF4444`

---

## 3. Spacing

Base unit: **4px**

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon padding, micro gaps |
| `space-2` | 8px | Inline element gaps, badge padding |
| `space-3` | 12px | Button padding (sm), input gaps |
| `space-4` | 16px | Card padding, form field spacing |
| `space-5` | 20px | Button padding (lg), list item gaps |
| `space-6` | 24px | Section padding, card internal spacing |
| `space-8` | 32px | Between cards, modal padding |
| `space-10` | 40px | Section breaks, panel top padding |
| `space-12` | 48px | Page-level section separators |
| `space-16` | 64px | Hero sections, top-of-page breathing room |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Badges, chips, tags, code blocks |
| `radius-md` | 8px | Buttons, inputs, nav items |
| `radius-lg` | 12px | Cards, panels, modals |
| `radius-full` | 999px | Pills, step indicators |

### Layout

| Breakpoint | Structure |
|------------|-----------|
| Desktop | 3-column: sidebar 220px + workspace fluid |
| Tablet | Sidebar collapses to icon rail, stacked layout |
| Mobile | Full-width stacked, bottom tabbed navigation |

---

## 4. Components

### Button

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | `#4338CA` | White | None | Create event, confirm, save |
| Secondary | Transparent | `#343A40` | `0.5px solid #DEE2E6` | Cancel, back, skip |
| Ghost | Transparent | `#4338CA` | None | Edit event, inline actions |
| Danger | Transparent | `#EF4444` | `0.5px solid #FECACA` | Delete event, remove guest |

**Hover:** Primary → `#3730A3` · Secondary → bg `#F1F3F5`
**Disabled:** opacity 0.4, cursor not-allowed

| Size | Font | Padding | Border Radius |
|------|------|---------|---------------|
| sm | 12px | 5px 12px | 6px |
| md | 13px | 8px 16px | 8px |
| lg | 15px | 12px 24px | 10px |

---

### Input

**Default:** 14px · padding 9px 12px · border-radius 8px · border `0.5px solid #DEE2E6` · bg `#FFFFFF`

| State | Border | Background | Shadow |
|-------|--------|-----------|--------|
| Focus | `1.5px solid #4338CA` | `#EEF2FF` | `0 0 0 3px rgba(67,56,202,0.12)` |
| Error | `1.5px solid #EF4444` | `#FEE2E2` | `0 0 0 3px rgba(239,68,68,0.10)` |
| Disabled | — | — | opacity 0.5 |

---

### Wizard Step Indicator

Horizontal step bar for multi-step event creation. Numbered circles connected by lines.

| State | Circle | Label | Line |
|-------|--------|-------|------|
| Completed | Filled `#22C55E` · white text | `#6C757D` | `#22C55E` |
| Active | Filled `#4338CA` · white text | `#212529` weight 600 | `#DEE2E6` |
| Pending | Outlined `#DEE2E6` · `#ADB5BD` text | `#ADB5BD` | `#DEE2E6` |

---

### Guest Card

Core component — one card per guest in the guest list.

```
┌──────────────────────────────────────────────────┐
│  Chioma Okafor                      [VIP]        │
│  +234 801 234 5678  ·  chioma@email.com          │
│  RSVP: Yes ✓     Checked in: 14:30              │
│  Table A · Seat 3                                │
│  [View]  [Message]  [Edit]                       │
└──────────────────────────────────────────────────┘
```

**Header:** bg `#F1F3F5` · border-bottom `0.5px solid #DEE2E6`
**Body:** padding 14px

| Zone | Spec |
|------|------|
| Guest name | `heading-3` · Bricolage 600 |
| Category badge | `caption` 11px · weight 600 · padding 3px 8px · border-radius 999px |
| RSVP status | `body-sm` (13px) · colored by status |
| Check-in time | `body-sm` (13px) · `#6C757D` |

---

### Badge

Font: 11px · weight 600 · Padding: 3px 8px · Border radius: 999px

| Variant | Background | Text | Usage |
|---------|-----------|------|-------|
| Published | `#EEF2FF` | `#312E81` | Event is live |
| Draft | `#F1F3F5` | `#495057` | Unsaved / neutral state |
| Checked in | `#EAF7EF` | `#166534` | Guest attended |
| Duplicate | `#FEF3C7` | `#92400E` | Duplicate scan warning |
| Error | `#FEE2E2` | `#991B1B` | Invalid QR |
| VIP | `#FDF6E3` | `#8B6914` | VIP guest badge |

---

### Check-in Result Overlay

Prominent overlay shown after QR scan on the scanner page.

| Severity | Background | Border | Text | Icon |
|----------|-----------|--------|------|------|
| Success | `#EAF7EF` | `0.5px solid #BBE8CC` | `#166534` | `Check` · `#22C55E` |
| Duplicate | `#FEF3C7` | `0.5px solid #FDE68A` | `#92400E` | `AlertTriangle` · `#F59E0B` |
| Invalid | `#FEE2E2` | `0.5px solid #FECACA` | `#991B1B` | `XCircle` · `#EF4444` |

---

### Modal

- Overlay: `rgba(0,0,0,0.4)`
- Card: bg `#FFFFFF` · border `1.5px solid #CED4DA` · border-radius 12px · padding 24px

---

### Guest Table

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Guest Name           Category    RSVP      Table     Check-in        Actions    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Chioma Okafor        VIP         Yes ✓     Table A   14:30            [...]     │
│ Emeka Nwosu          Regular     Pending   —         —                [...]     │
│ Amina Bello          Family      No ✗      —         —                [...]     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### Scanner Screen

Full-screen camera viewfinder on mobile with attendance counter overlay.

```
┌──────────────────────────────┐
│  ✓ 145 / 200 Checked In     │  ← live counter bar
│                              │
│      ┌──────────────┐       │
│      │              │       │
│      │   Camera     │       │
│      │  Viewfinder  │       │
│      │              │       │
│      └──────────────┘       │
│                              │
│   [Scan] [Manual] [Walk-in] │  ← tab bar
└──────────────────────────────┘
```

---

## 5. Icons

**Library:** Lucide Icons (lucide.dev) · MIT license
**Install:** `npm install lucide-react`
**Style:** Outlined only — never filled · Stroke width: 2px

| Size | Pixels | Usage |
|------|--------|-------|
| sm | 16px | UI / inline — inside buttons, form labels |
| md | 20px | Action — primary CTAs, card action buttons |
| lg | 24px | Decorative — empty states, section headers, nav |

See [icons.md](./icons.md) for full icon set.

---

## 6. Elevation

Border-based elevation only — no box-shadows.

| Level | Border | Usage |
|-------|--------|-------|
| 0 | `0.5px solid #DEE2E6` | Guest cards, event cards, default |
| 1 | `0.5px solid #CED4DA` | Focused cards, panels |
| 2 | `1px solid #ADB5BD` | Dropdowns, popovers |
| 3 | `1.5px solid #ADB5BD` | Modals, toasts |

**Modal overlay:** `rgba(0,0,0,0.4)`
**Focus ring:** `0 0 0 3px rgba(67,56,202,0.12)`

---

## 7. Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `duration-instant` | 80ms | ease-out | Button active press, toggle flick |
| `duration-fast` | 150ms | ease-out | Hover states, scan confirmation flash |
| `duration-normal` | 200ms | ease-in-out | Tab switch, badge appear |
| `duration-enter` | 300ms | ease-out | Card slide-in on check-in result |
| `duration-modal` | 250ms | ease-out | Modal / drawer open |
| `duration-loading` | 1200ms | linear loop | Spinner rotation |

### Key Moments

**Check-in success** (core magic moment)
1. Show spinner: "Verifying QR code..."
2. Result card slides in
3. Green check animation
4. Auto-dismisses after 3 seconds

**Copy invite link confirmation**
1. Copy icon → Check icon at 150ms
2. Icon color turns `#22C55E`
3. Holds for 1800ms
4. Fades back at 150ms

**Accessibility:** All animations must respect `prefers-reduced-motion`.

---

## 8. States

### Empty State
- Icon: `Calendar` (Lucide, 40px, `#ADB5BD`)
- Heading: "No events yet"
- Body: "Create your first event to start managing guests, seating, and check-in."
- CTA: "Create Event" (primary button)

### Loading State
- Spinner: 36px · track `#EEF2FF` · active `#4338CA` · 1200ms linear infinite
- Label: "Processing..."
- Skeleton: 4 rows at 100% / 90% / 80% / 70% width

### Error State
- Border: `0.5px solid #FECACA` · bg `#FEE2E2`
- Icon: `XCircle` (Lucide, 16px, `#A32D2D`)
- Heading: "Something went wrong"
- Body: "Please try again."
- CTA: "Try again" (danger button)

### Toast
- Position: bottom-right · elevation level 3 · auto-dismiss 3000ms
- Success dot: `#22C55E` — check-in confirmed, RSVP saved
- Error dot: `#EF4444` — operation failed

---

## 9. UX Principles

1. **Deterministic first** — all QR verifications and check-in decisions are rule-based, not AI-guessed
2. **Mobile-first** — one primary action per screen, large tap targets, bottom navigation
3. **Offline-capable** — check-in works without internet; syncs when reconnected
4. **Nigerian market native** — OTP login, WhatsApp sharing, USSD payments, screenshot-friendly passes
5. **Visible confirmations** — every action produces immediate, clear feedback

---

## 10. Auth Pages

Sign-up and login pages use existing components only — no new components introduced. Supabase Auth handles all logic.

### Layout

Centered single-column form card on a page background.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                       EvenTee                 ← heading-1      │
│           Smart Event Management            ← body-lg       │
│                                             ← color-text-secondary │
│                                                              │
│         ┌──────────────────────────────┐                    │
│         │  Phone number or Email       │    ← input (md)    │
│         └──────────────────────────────┘                    │
│                                                              │
│         [     Send OTP / Continue     ]   ← primary btn lg │
│                                                              │
│         Already have an account?  Log in   ← body-sm + ghost│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 11. Navigation

### Sidebar (Desktop)

Fixed left sidebar — 220px wide.

```
┌─────────────────────┐
│  EvenTee             │  ← heading-3 · #212529
│─────────────────────│
│  [+ Create event]   │  ← primary button (sm) · full width
│─────────────────────│
│  ⊞  Events          │  ← nav item (active)
│  ◯  Guests          │  ← nav item
│  🛒  Orders          │  ← nav item
│─────────────────────│
│  ⚙  Settings        │  ← nav item (pinned bottom)
│  ◯  Account         │  ← nav item (pinned bottom)
└─────────────────────┘
```

**Nav item states:**

| State | Background | Text | Icon color |
|-------|-----------|------|------------|
| Default | Transparent | `#6C757D` | `#ADB5BD` |
| Hover | `#F1F3F5` | `#495057` | `#495057` |
| Active | `#EEF2FF` | `#312E81` | `#4338CA` |

### Mobile Tab Bar

Bottom tab bar — fixed to bottom of screen · full width · height 56px.

| Tab | Icon | Label |
|-----|------|-------|
| Events | `Calendar` | Events |
| Guests | `Users` | Guests |
| Check-in | `ScanLine` | Scan |
| Orders | `ShoppingCart` | Orders |

Background: `#FFFFFF` · border-top: `0.5px solid #DEE2E6`
Active tab: `#4338CA` · Inactive tab: `#ADB5BD`
Label: `caption` (11px · Inter 400)
