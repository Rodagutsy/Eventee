# EvenTee — Validation

> Validation in EvenTee serves one goal: help the user provide accurate event data so the system produces correct guest management and check-in results. Every error message must guide the user forward — not just tell them something is wrong.

---

## Principles

1. **No silent failures** — every error must have a visible, clear message
2. **Inline over modal** — show validation errors next to the field, not in a popup
3. **Guide, don't block** — dimension warnings inform but do not prevent calculation
4. **Preserve input always** — never clear what the user typed on error or page reload
5. **Specific messages** — "Event name is required" is better than "Invalid input"

---

## Wizard Form Validation (Event Creation)

### Required Field Rules

All wizard steps have required fields before the user can proceed.

| Step | Field | Required | Validation |
|------|-------|----------|-----------|
| 1 — Details | Event Name | Yes | 1-200 chars |
| 1 — Details | Event Type | Yes | Selected |
| 1 — Details | Date | Yes | Must be future |
| 1 — Details | Time | Yes | Valid time |
| 1 — Details | Venue | Yes | 1-300 chars |
| 2 — Capacity | Expected Guests | Yes | > 0 |
| 2 — Capacity | Seating Type | Yes | Selected |

### Empty Field Error

Triggered when user clicks Next/Confirm with one or more fields empty.

```
┌────────────────────────────────────────────┐
│  Event Name                                │
│  ┌──────────────────────────────────────┐  │
│  │                           ← empty   │  │  ← error border
│  └──────────────────────────────────────┘  │
│  ⚠  This field is required                │  ← inline error message
└────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Field border | `1.5px solid #EF4444` |
| Field background | `#FEE2E2` |
| Field shadow | `0 0 0 3px rgba(239,68,68,0.10)` |
| Message text | "This field is required" · `caption` (11px) · `#EF4444` |
| Message position | Below the field · `space-1` (4px) gap |

**Next/Confirm button behavior:** Disabled (opacity 0.4 · cursor `not-allowed`) until all required fields on the current step have content.

---

### Date Validation

| Rule | Trigger | Error message |
|------|---------|---------------|
| Past date | Date is before today | "Event date must be in the future" |
| Too far in future | Date > 2 years from now | "Please select a date within the next 2 years" |

### Capacity Validation

| Rule | Trigger | Error message |
|------|---------|---------------|
| Zero or negative | Value ≤ 0 | "Enter a number greater than 0" |
| Too large | Value > 100000 | "Maximum capacity is 100,000 guests" |

---

## Guest Entry Validation

| Field | Rule | Error message |
|-------|------|---------------|
| Full Name | Required, 1-200 chars | "Guest name is required" |
| Phone | Valid Nigerian format (optional) | "Enter a valid Nigerian phone number (e.g. 08012345678)" |
| Email | Valid email format (optional) | "Enter a valid email address" |
| Duplicate phone | Phone already in guest list | "A guest with this phone number already exists" |

---

## RSVP Validation

| Rule | Trigger | Response |
|------|---------|----------|
| Invalid token | Invite token not found | "This invite link is invalid or has expired" |
| Event cancelled | Event status = cancelled | "This event has been cancelled" |
| Event past | Event date has passed | "This event has already ended" |
| Event full | Capacity reached | "This event has reached full capacity" |
| Invalid transition | RSVP change not allowed | "This RSVP change is not available" |

---

## Check-in Validation

### QR Code

| Rule | Trigger | Response |
|------|---------|----------|
| Invalid QR | QR token not recognized | "QR Not Recognized" — red overlay |
| Duplicate scan | Guest already checked in | "Already Checked In" — amber overlay with timestamp |
| Guest not found | No guest matches QR | "Guest not found" — red overlay |
| Wrong event | Guest belongs to different event | "This QR is for a different event" |

### Manual Search

| Rule | Trigger | Response |
|------|---------|----------|
| No results | Search returns empty | "No guests found matching "{query}"" |
| Already checked in | Guest already marked | "Already checked in at {time}" — amber warning |

### Walk-in

| Rule | Trigger | Response |
|------|---------|----------|
| Name required | Empty name | "Guest name is required" |
| Event full | Capacity reached | "Cannot add guest — event is at full capacity" |

---

## Aso Ebi Commerce Validation

| Rule | Trigger | Response |
|------|---------|----------|
| Past deadline | Order date > deadline | "Orders closed on {date}" — button disabled |
| Out of stock | stock_quantity ≤ 0 | "Out of stock" — badge shown |
| Invalid size | Size not in available_sizes | Size removed from dropdown |
| Payment failed | Paystack returns error | "Payment failed. You can try again." — order stays pending |

---

## Confirm Button Validation States

| State | Condition | Appearance |
|-------|-----------|-----------|
| Disabled | One or more required fields empty on current step | opacity 0.4 · cursor `not-allowed` |
| Active (all valid) | All fields filled and valid | Primary button active |
| Loading | Confirm clicked — system processing | Spinner + "Processing..." label |

---

## Auth Validation

### Sign-Up Form

| Field | Rule | Error message |
|-------|------|---------------|
| Phone/Email | Valid phone or email format | "Please enter a valid phone number or email" |
| Full Name | Required | "Full name is required" |

### Log-In Form

| Field | Rule | Error message |
|-------|------|---------------|
| Phone/Email + OTP | Wrong OTP | "Incorrect OTP. Please try again." |
| Phone/Email + OTP | Expired OTP | "OTP has expired. Request a new one." |
| OTP Rate Limit | > 5 requests/hour | "Too many OTP requests. Please try again later." |
| Network | Connection fails | "Something went wrong. Please try again." |

**Auth error display:**

```
┌────────────────────────────────────────────┐
│  Incorrect OTP. Please try again.          │
└────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Background | `#FEE2E2` (`--color-danger-tint`) |
| Text | `body-sm` (13px) · `#991B1B` |
| Border radius | `radius-sm` (4px) |
| Padding | `space-2` (8px) `space-3` (12px) |
| Position | Below the form · above the CTA button |

---

## Validation Summary Table

| Context | Type | Blocks action? | Display location |
|---------|------|----------------|-----------------|
| Empty required field | Error | Yes | Below field |
| Past event date | Error | Yes | Below field |
| Invalid phone format | Error | No (optional) | Below field |
| RSVP invalid token | Error | Yes | Full screen |
| RSVP event cancelled | Error | Yes | Full screen |
| RSVP event full | Error | Yes | Inline on RSVP form |
| Check-in invalid QR | Error | Blocks entry | Scan overlay |
| Check-in duplicate | Error | Blocks entry | Scan overlay |
| Auth wrong credentials | Error | Yes | Below form |
| Order past deadline | Error | Blocks purchase | Inline on product |
| Payment failure | Error | No (can retry) | Inline on payment |

---

## Error Message Copy Guidelines

| Type | Template | Example |
|------|----------|---------|
| Required field | "This field is required" | — |
| Invalid format | "Enter a valid [field]" | "Enter a valid email address" |
| Duplicate | "[Entity] already [state]" | "Guest is already checked in" |
| Expired | "[Item] has expired" | "OTP has expired. Request a new one." |
| Payment failure | "[Action] failed. [Next step]" | "Payment failed. You can try again." |

---

## Rules

1. Never clear user input on validation error — preserve everything they typed
2. Never use "Invalid input" as an error message — always say what is wrong and how to fix it
3. Inline errors appear below the relevant field — not at the top of the form
4. Check-in errors must show a clear result overlay — never just a toast
5. Auth errors must not confirm whether a phone/email is registered (security)
6. No silent errors anywhere — if something fails, the user must see a message
7. Offline validation uses local IndexedDB cache — still validates duplicate scans locally
