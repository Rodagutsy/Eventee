# Output Experience

## Overview
This document defines the UX for displaying generated event outputs in EvenTee.
It ensures alignment with the verification engine, seating resolver, and commerce processing.

---

## Output Structure

### Guest List
- Display as a structured table of guests with RSVP status
- Each row = one guest with name, category, RSVP status, table assignment, check-in time
- Sortable by name, category, RSVP status, check-in time
- Filterable by category, RSVP status, check-in status

### Seating Chart
- Visual canvas showing tables with assigned guests
- Color-coded by guest category
- Exportable as image

### Check-in Dashboard
- Live attendance counter
- Check-in timeline
- RSVP breakdown

---

## Content Hierarchy

- **Primary focus:** Guest name + RSVP/check-in status (high contrast text)
- **Secondary context:** Category, table assignment, contact info
- **Actions:** View details, message guest, check in (low emphasis, ghost buttons)

---

## UX States

### Loading State
- Confirm button becomes disabled with "Processing…"
- Show 4–6 skeleton guest rows during import
- Display hint: "Usually takes a few seconds"

### Success State
- Guest rows appear with staggered animation
- Scan result shows green success overlay
- Confirmation message displayed
- No page reload

### Error State
- Inline error replaces result area
- Show retry option
- Preserve all user inputs

---

## Interaction Design

### Guest Card Expand/Collapse
- Each guest row can expand to show:
  - Contact details (phone, email)
  - Order history (Aso Ebi purchases)
  - Check-in history
  - Notes

### Check-in Flow
- QR scan → instant verification result
- Manual search → type name → tap check-in
- Walk-in → quick form → create + check-in

### Export
- Export guest list as CSV
- Export seating chart as image
- Copy invite link to clipboard

---

## Clarity & Trust

- QR verification result is instant and unambiguous
- Duplicate scans show clear warning with timestamp
- RSVP changes show confirmation immediately
- Payment verification is confirmed server-side
- All timestamps are shown in local time

---

## Deterministic Engine Alignment

- Every QR verification is rule-based — no AI guesswork
- Seating assignment follows deterministic algorithm
- RSVP state machine follows strict rules
- Users see deterministic outputs with AI suggestions clearly labeled

---

## User Flow Alignment

- Output appears in the same workspace after action (no refresh)
- Guest list and seating chart are linked — changes in one reflect in the other
- Check-in updates are real-time via Supabase Realtime
- Switching between views is instant

---

## Key Output Views

### Guest List Table
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Guest Name           Category    RSVP      Table     Check-in        Actions    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Chioma Okafor        VIP         Yes ✓     Table A   14:30            [...]     │
│ Emeka Nwosu          Regular     Pending   —         —                [...]     │
│ Amina Bello          Family      No ✗      —         —                [...]     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Check-in Dashboard
```
┌──────────────────────────────────────────────────────────┐
│  ✓ 145 / 200 Checked In  ·  ⏳ 35 Pending  ·  ✗ 3 Invalid │
├──────────────────────────────────────────────────────────┤
│  RSVP Breakdown: Yes 150 · No 20 · Maybe 15 · Pending 15 │
│  Check-in Timeline: [━━━━━━━━━━━━━━━━━━━] 14:00–15:00   │
│  Walk-ins: 12  ·  Manual check-ins: 8                   │
└──────────────────────────────────────────────────────────┘
```

### Seating Chart (Canvas)
```
┌──────────────────────────────────────────────┐
│    Table A (VIP)      Table B (Family)       │
│    ┌──────────┐       ┌──────────┐           │
│    │  C. Okafor│       │  A. Bello│           │
│    │  ...      │       │  ...     │           │
│    └──────────┘       └──────────┘           │
│                                              │
│    Table C (Friends)                         │
│    ┌──────────┐                              │
│    │  ...     │                              │
│    └──────────┘                              │
└──────────────────────────────────────────────┘
```

### Aso Ebi Order List
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Order #    Guest            Product     Size   Qty   Amount    Status       │
├─────────────────────────────────────────────────────────────────────────────┤
│ ORD-001    Chioma Okafor    Ankara Gown  XL     2     ₦30,000   Paid ✓      │
│ ORD-002    Emeka Nwosu      Senator Fit  L      1     ₦25,000   Pending     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Scan Result Overlay
```
┌───────────────────────────────────────────┐
│  ✓  Chioma Okafor                         │
│     VIP  ·  Table A  ·  Seat 3            │
│     Checked in at 14:30                   │
└───────────────────────────────────────────┘
```
