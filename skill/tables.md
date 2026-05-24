# EvenTee — Tables

> EvenTee uses tables for structured multi-column data — specifically the guest list, order list, and delivery tracking views.

---

## When to Use a Table vs Cards

| Layout | Use when |
|--------|----------|
| **Table** | Guest list — rows of guests with consistent columns (name, category, RSVP, table, check-in) |
| **Card list** | Event list — each item has rich actions (Open, Guests, Check-in, Share) |
| **Table** | Order list — comparing orders across guests (product, size, amount, status) |

The **Event List** uses cards — see [components.md](./components.md) for the Event Card spec.

Tables are used for the **Guest List**, **Order List**, and **Delivery Tracking**.

---

## Guest Table

### Structure

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Guest Name           Category    RSVP      Table     Check-in        Actions   │  ← header row
├─────────────────────────────────────────────────────────────────────────────────┤
│  Chioma Okafor        VIP         Yes ✓     Table A   14:30            [...]   │  ← data row
│  Emeka Nwosu          Regular     Pending   —         —                [...]   │
│  Amina Bello          Family      No ✗      —         —                [...]   │
│  Tunde Bakare         Corporate   Maybe ?   Table B   —                [...]   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  4 guests · 1 checked in · 2 pending · 1 declined                              │  ← summary row
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Header Row

| Property | Value |
|----------|-------|
| Background | `#F8F9FA` (`--color-bg-page`) |
| Border-bottom | `1px solid #DEE2E6` |
| Text | `label` (12px · Inter 500) · `#6C757D` |
| Padding | 10px 16px |
| Text transform | None — sentence case |

### Data Row

| Property | Value |
|----------|-------|
| Background | `#FFFFFF` |
| Border-bottom | `0.5px solid #DEE2E6` |
| Text | `body-sm` (13px · Inter 400) · `#212529` |
| Padding | 12px 16px |
| Hover background | `#F8F9FA` |

### Summary Row

| Property | Value |
|----------|-------|
| Background | `#EEF2FF` (primary tint) |
| Font weight | 600 |
| Border-top | `1px solid #DEE2E6` |
| Text | `body-sm` (13px) · `#312E81` |

---

## Column Types

| Column | Alignment | Type |
|--------|-----------|------|
| Guest Name | Left | Text — `body-sm` · `#212529` |
| Category | Left | Badge — colored by category |
| RSVP | Center | Icon + text — colored by status |
| Table | Left | Text — `caption` · `#6C757D` |
| Check-in | Center | Time or "—" if not checked in |
| Actions | Right | Ghost button · `#4338CA` |

### Category Badge Colors

| Category | Hex |
|----------|-----|
| VIP | `#D4AF37` (Champagne Gold) |
| Regular | `#94A3B8` |
| Family | `#3B82F6` |
| Friends | `#22C55E` |
| Corporate | `#818CF8` |
| Media | `#A855F7` |
| Other | `#9CA3AF` |

### RSVP Status Colors

| Status | Color |
|--------|-------|
| Yes | `#22C55E` · Check icon |
| No | `#EF4444` · X icon |
| Maybe | `#F59E0B` · HelpCircle icon |
| Pending | `#ADB5BD` · Clock icon |
| Waitlist | `#A5B4FC` · List icon |

---

## Order Table

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Order #    Guest            Product     Size   Qty   Amount    Status      │
├─────────────────────────────────────────────────────────────────────────────┤
│  ORD-001    Chioma Okafor    Ankara Gown  XL     2     ₦30,000   Paid ✓     │
│  ORD-002    Emeka Nwosu      Senator Fit  L      1     ₦25,000   Pending    │
│  ORD-003    Amina Bello      Lace Blouse  M      3     ₦45,000   Failed     │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Column | Alignment |
|--------|-----------|
| Order # | Left |
| Guest | Left |
| Product | Left |
| Size | Center |
| Qty | Right |
| Amount | Right — NGN |
| Status | Center — badge |

---

## Delivery Tracking Table

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Guest            Product       Address                Status        Actions   │
├────────────────────────────────────────────────────────────────────────────────┤
│  Chioma Okafor    Ankara Gown   12 Admiralty Way, Lekki  In Transit    [...]   │
│  Emeka Nwosu      Senator Fit   5 Bourdillon Rd, Ikoyi  Delivered ✓   [...]   │
└────────────────────────────────────────────────────────────────────────────────┘
```

| Status | Badge Color |
|--------|------------|
| Pending pickup | `#ADB5BD` |
| In transit | `#4338CA` |
| Delivered | `#22C55E` |
| Failed delivery | `#EF4444` |

---

## Table Container

```css
.table-container {
  background: #FFFFFF;
  border: 0.5px solid #DEE2E6;
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}
```

---

## Empty Table State

When no guests have been added yet.

```
        [Users icon — 40px — #ADB5BD]

        No guests yet

        Add guests via CSV upload, manual entry,
        or share the registration link.

        [  Add guests  ]
```

| Element | Spec |
|---------|------|
| Icon | `Users` · Lucide · 40px · `#ADB5BD` |
| Heading | "No guests yet" · `heading-3` · `#212529` |
| Body | `body` (14px) · `#6C757D` · centered |
| Padding | `space-12` (48px) top/bottom |

---

## Sorting

Guest tables support single-column sorting. Clicking a sortable column header toggles ascending / descending.

| State | Indicator |
|-------|-----------|
| Unsorted | No icon |
| Ascending | `ChevronUp` icon (Lucide · 12px · `#6C757D`) beside header label |
| Descending | `ChevronDown` icon (Lucide · 12px · `#6C757D`) beside header label |

Sortable columns: Guest Name · Category · RSVP · Check-in

---

## Mobile Behavior

On mobile (< 768px), the full table is replaced with a stacked card list — one card per row — showing the same data vertically.

Each mobile card shows: Guest name, Category badge, RSVP status, Table, Check-in time, Action buttons.

---

## Rules

1. Use card layout for the event list — table for guest data only
2. Always include an empty state — never show a blank table
3. Category badge colors must match the guest category spec
4. Tables are never used for navigation — only data display
5. No horizontal scroll on desktop — design columns to fit within the workspace width
6. Mobile: collapse to stacked cards — never force horizontal scroll on small screens
7. RSVP and check-in statuses must include both icon and text — never color alone
