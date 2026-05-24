# EvenTee — Components

> All UI components with full specs. See [color.md](./color.md) for color tokens · [spacing.md](./spacing.md) for spacing · [typography.md](./typography.md) for type scale.

---

## Button

Four variants · Three sizes.

### Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | `#4338CA` | White | None | Create event, confirm, save, check in |
| Secondary | Transparent | `#343A40` | `0.5px solid #DEE2E6` | Cancel, back, skip |
| Ghost | Transparent | `#4338CA` | None | Edit event, inline actions, view details |
| Danger | Transparent | `#EF4444` | `0.5px solid #FECACA` | Delete event, remove guest |

**Hover:** Primary → `#3730A3` · Secondary → bg `#F1F3F5`
**Disabled:** opacity 0.4 · cursor `not-allowed`

### Sizes

| Size | Font | Padding | Border Radius |
|------|------|---------|---------------|
| sm | 12px | 5px 12px | 6px |
| md | 13px | 8px 16px | 8px |
| lg | 15px | 12px 24px | 10px |

---

## Input

**Default:** 14px · padding 9px 12px · border-radius 8px · border `0.5px solid #DEE2E6` · bg `#FFFFFF`

| State | Border | Background | Shadow |
|-------|--------|-----------|--------|
| Focus | `1.5px solid #4338CA` | `#EEF2FF` | `0 0 0 3px rgba(67,56,202,0.12)` |
| Error | `1.5px solid #EF4444` | `#FEE2E2` | `0 0 0 3px rgba(239,68,68,0.10)` |
| Disabled | — | — | opacity 0.5 |

---

## Select / Dropdown

Used for guest category, event type, seating options.

**Default:** Same as Input — 14px · padding 9px 12px · border-radius 8px · border `0.5px solid #DEE2E6` · bg `#FFFFFF`

| State | Border | Background |
|-------|--------|-----------|
| Focus | `1.5px solid #4338CA` | `#EEF2FF` |
| Error | `1.5px solid #EF4444` | `#FEE2E2` |

---

## Wizard Step Button

Numbered step indicator for the multi-step event creation wizard.

| State | Number Circle | Label | Background |
|-------|-------------|-------|-----------|
| Active | `#4338CA` · white text | `#212529` · weight 600 | `#EEF2FF` left border |
| Completed | `#22C55E` · white text | `#6C757D` | Transparent |
| Pending | `#DEE2E6` · `#ADB5BD` text | `#ADB5BD` | Transparent |

Border radius: `999px` on number circle (24px diameter)

---

## Guest Card

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
| RSVP status | `body` (14px) · `#212529` |
| Check-in time | `body-sm` (13px) · `#6C757D` |

---

## Badge

Font: 11px · weight 600 · Padding: 3px 8px · Border radius: 999px

| Variant | Background | Text | Usage |
|---------|-----------|------|-------|
| Published | `#EEF2FF` | `#312E81` | Event is live |
| Saved | `#EAF7EF` | `#166534` | Data saved |
| Draft | `#F1F3F5` | `#495057` | Unsaved / neutral state |
| Checked in | `#EAF7EF` | `#166534` | Guest attended |
| Pending | `#F1F3F5` | `#495057` | Awaiting RSVP |
| Duplicate | `#FEF3C7` | `#92400E` | Already checked in |
| Invalid | `#FEE2E2` | `#991B1B` | QR not recognized |
| VIP | `#FDF6E3` | `#8B6914` | VIP guest |

---

## Scan Result Overlay

Prominent overlay shown after QR scan on the scanner page.

| Severity | Background | Border | Text | Icon |
|----------|-----------|--------|------|------|
| Success | `#EAF7EF` | `0.5px solid #BBE8CC` | `#166534` | `Check` |
| Duplicate | `#FEF3C7` | `0.5px solid #FDE68A` | `#92400E` | `AlertTriangle` |
| Invalid | `#FEE2E2` | `0.5px solid #FECACA` | `#991B1B` | `XCircle` |

**Structure:**
```
┌───────────────────────────────────────────┐
│  ✓  Chioma Okafor                         │
│     VIP  ·  Table A  ·  Seat 3            │
│     Checked in at 14:30                   │
└───────────────────────────────────────────┘
```

- Icon size: 20px · aligns top-left
- Heading: `body` (14px) · weight 600
- Subtext: `body-sm` (13px) · `#6C757D`
- Duration: auto-dismiss after 3000ms

---

## Modal

Base modal structure used for event delete confirmation, seating conflict warnings, and order details.

- Overlay: `rgba(0,0,0,0.4)`
- Card: bg `#FFFFFF` · border `1.5px solid #CED4DA` · border-radius 12px · padding 24px

---

## Guest Table

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Guest Name           Category    RSVP      Table     Check-in        Actions    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Chioma Okafor        VIP         Yes ✓     Table A   14:30            [...]     │
│ Emeka Nwosu          Regular     Pending   —         —                [...]     │
│ Amina Bello          Family      No ✗      —         —                [...]     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Table container | bg `#FFFFFF` · border `0.5px solid #DEE2E6` · border-radius `radius-lg` |
| Header | bg `#F8F9FA` · border-bottom `1px solid #DEE2E6` · `label` 12px · `#6C757D` |
| Data rows | `body-sm` 13px · `#212529` · border-bottom `0.5px solid #DEE2E6` |
| Hover | bg `#F8F9FA` |

---

## Order Table

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Order #    Guest            Product     Size   Qty   Amount    Status       │
├─────────────────────────────────────────────────────────────────────────────┤
│ ORD-001    Chioma Okafor    Ankara Gown  XL     2     ₦30,000   Paid ✓      │
│ ORD-002    Emeka Nwosu      Senator Fit  L      1     ₦25,000   Pending     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Navigation

### Sidebar — Desktop (220px fixed)

| State | Background | Text | Icon |
|-------|-----------|------|------|
| Default | Transparent | `#6C757D` | `#ADB5BD` |
| Hover | `#F1F3F5` | `#495057` | `#495057` |
| Active | `#EEF2FF` | `#312E81` | `#4338CA` |

Active indicator: `3px solid #4338CA` left border
Nav item: `body-sm` (13px) · padding `space-3`/`space-4` · `radius-md` (8px)

Nav items: Events · Guests · Orders · Settings · Account

### Mobile Tab Bar (fixed bottom, 56px)

bg `#FFFFFF` · border-top `0.5px solid #DEE2E6`
Active: `#4338CA` · Inactive: `#ADB5BD` · Label: `caption` (11px)

Tabs: Events (`Calendar`) · Guests (`Users`) · Scan (`ScanLine`) · Orders (`ShoppingCart`)

---

## Wizard Shell

Multi-step form shell for event creation.

| Element | Spec |
|---------|------|
| Step indicator | Horizontal progress bar at top |
| Step label | `label` 12px · `#6C757D` · active: `#4338CA` |
| Content area | Padding `space-6` (24px) |
| Navigation | Back (ghost) + Next/Confirm (primary) at bottom |
| Transition | Slide content: `translateX(-12px) → 0` + opacity, 200ms |

---

## Event Card

One card per event in the events list.

```
┌──────────────────────────────────────────────────────┐
│  Ada's Wedding                       [Published]     │
│  Sat 12 Jun 2026  ·  Harbour Point  ·  150 guests    │
│  Created 2 May 2026                 RSVP: 85/150     │
│──────────────────────────────────────────────────────│
│  [Open]  [Guests]  [Check-in]  [Share]              │
└──────────────────────────────────────────────────────┘
```

| State | Border | Background |
|-------|--------|-----------|
| Default | `0.5px solid #DEE2E6` | `#FFFFFF` |
| Hover | `0.5px solid #CED4DA` | `#F8F9FA` |

---

## Live Attendance Counter

Shown at the top of the check-in scanner page.

```
✓  145 / 200  Checked In  |  ⏳ 35 Pending  |  ✗ 3 Invalid
```

- Font: `body` (14px) · Inter 600
- Numbers: `heading-3` (20px) · Bricolage 600
- Sticky top bar: bg `#FFFFFF` · border-bottom `0.5px solid #DEE2E6`
