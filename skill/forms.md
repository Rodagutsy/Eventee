# EvenTee — Forms

> The event creation wizard is where the organizer defines their event. Better inputs produce accurate guest management. The form's job is to guide the organizer through structured event decisions.

---

## Event Creation Wizard

Multi-step form: Basic Details → Capacity → Team → Confirmation.

### Step 1: Basic Event Details

| # | Field | Component | Required | Placeholder |
|---|-------|-----------|----------|-------------|
| 1 | Event Name | Input (md) · text | Yes | e.g. Ada's Wedding |
| 2 | Event Type | Select | Yes | Wedding, Birthday, Corporate, Party, Conference, Other |
| 3 | Date | Input (md) · date | Yes | — |
| 4 | Time | Input (md) · time | Yes | — |
| 5 | Venue | Input (md) · text | Yes | e.g. Harbour Point, Lagos |

### Step 2: Event Capacity

| # | Field | Component | Required | Options |
|---|-------|-----------|----------|---------|
| 1 | Expected Guests | Input (md) · number | Yes | e.g. 100 |
| 2 | Seating Type | Select | Yes | Table seating · Open seating |
| 3 | Enable Aso Ebi sales | Toggle | No | Yes / No |

### Step 3: Event Roles

| # | Field | Component | Required | Options |
|---|-------|-----------|----------|---------|
| 1 | Add Planner | Input (md) · phone/email | No | Invite by phone or email |
| 2 | Add Security Staff | Input (md) · phone/email | No | Invite by phone or email |

Can skip entirely.

### Step 4: Confirmation

Summary of all selections with system-generated event ID and QR infrastructure.
CTA: "Create Event" → redirects to event dashboard.

---

### Layout

```
┌──────────────────────────────────────────┐
│  Step 1 of 4: Event Details              │
│                                          │
│  Event Name                              │
│  ┌────────────────────────────────────┐  │
│  │  e.g. Ada's Wedding                │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Event Type                              │
│  ┌────────────────────────────────────┐  │
│  │  Wedding                   ▼      │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Date                                    │
│  ┌────────────────────────────────────┐  │
│  │  12/06/2026                       │  │
│  └────────────────────────────────────┘  │
│                                          │
│     [Back]                    [Next →]   │
└──────────────────────────────────────────┘
```

- Labels: above each field · `label` (12px · Inter 500 · `#212529`)
- Field spacing: `space-4` (16px) between each field
- Bottom spacing: `space-6` (24px) between last field and navigation
- Navigation: Back (ghost) + Next/Confirm (primary)

---

## Guest Entry Form

Optimized for quick addition — used in manual guest entry.

| # | Field | Component | Required |
|---|-------|-----------|----------|
| 1 | Full Name | Input (md) · text | Yes |
| 2 | Phone | Input (md) · tel | No |
| 3 | Email | Input (md) · email | No |
| 4 | Category | Select | No (defaults to Regular) |

CTA: "Add Another" — enables fast repetitive entry flow.

---

## Field States

### Default

```css
border: 0.5px solid #DEE2E6;
background: #FFFFFF;
border-radius: 8px;
padding: 9px 12px;
font-size: 14px;
color: #212529;
```

Placeholder text color: `#ADB5BD`

### Focus

```css
border: 1.5px solid #4338CA;
background: #EEF2FF;
box-shadow: 0 0 0 3px rgba(67,56,202,0.12);
```

### Error

```css
border: 1.5px solid #EF4444;
background: #FEE2E2;
box-shadow: 0 0 0 3px rgba(239,68,68,0.10);
```

Inline error message appears below the field:
```
⚠  This field is required
```
- Text: `caption` (11px) · `#EF4444`

### Disabled

```css
opacity: 0.5;
cursor: not-allowed;
```

---

## Validation Rules

| Rule | Trigger | Response |
|------|---------|----------|
| Empty field | User clicks Next/Confirm with blank field | Error state — "This field is required" |
| Invalid date | Past date entered | "Event date must be in the future" |
| Capacity too large | > 100000 | "Maximum capacity is 100,000 guests" |
| All fields filled | All required fields have content | Next/Confirm button becomes active |

---

## Confirm Button States

| State | Appearance | Condition |
|-------|-----------|-----------|
| Disabled | opacity 0.4 · cursor `not-allowed` | One or more required fields empty |
| Active | Primary (lg) · `#4338CA` | All fields have content |
| Loading | Spinner replaces label — "Creating event..." | After click, during processing |

---

## Auth Forms

### Sign Up

| Field | Component | Notes |
|-------|-----------|-------|
| Phone number or Email | Input (md) | OTP verification |
| Full Name | Input (md) | Required |
| Event Brand (optional) | Input (md) | — |
| Continue | Button — Primary (lg) · full width | Sends OTP |

### Log In

| Field | Component | Notes |
|-------|-----------|-------|
| Phone number or Email | Input (md) | Sends OTP |
| Log in | Button — Primary (lg) · full width | — |

**Auth error state:** bg `#FEE2E2` · text `#991B1B` · `radius-sm` — shown inline below the form

---

## UX Rules

1. Labels always above fields — never floating or inside
2. Placeholder text shows real examples — not generic "Enter value"
3. One primary CTA per screen — never crowded forms
4. Confirm button is full-width on the final step
5. Never clear user input on error — preserve what they typed
6. Wizard preserves state across steps — going back never resets data
7. Phone-first: phone number input prioritized over email
8. OTP login: reduce friction, no password needed on first flow
