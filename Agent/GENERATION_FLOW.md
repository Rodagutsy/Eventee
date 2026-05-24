# KEY_FLOWS.md — EvenTee

---

# 1. PURPOSE

Defines the user experience for the three most critical flows in EvenTee:
- Guest RSVP flow
- Check-in scanning flow
- Aso Ebi purchase flow

Covers:
- Loading states
- System feedback messages
- Edge case handling
- Offline behavior

Goal: User must never feel stuck, confused, or unsure if the system is working.

---

# 2. FLOW 1 — GUEST RSVP

---

## Step 1: Guest Opens Invite Link

**What happens immediately:**
- Page loads with event banner, date, venue
- Invite token is validated against database
- Guest name appears in header

**What guest sees:**
- Event cover image with overlay
- Event name, date, venue
- RSVP buttons: Yes / No / Maybe

**Edge cases:**
- Invalid token → "This invite link is invalid or has expired"
- Event cancelled → "This event has been cancelled"
- Event past → "This event has already ended"

---

## Step 2: Guest Selects RSVP

**What happens immediately:**
- Selected button highlights instantly (optimistic UI)
- Other buttons become disabled
- Spinner appears on selected button

**What guest sees:**
- Button states:
  - Yes → Green (`#22C55E`)
  - No → Red (`#EF4444`)
  - Maybe → Amber (`#D4AF37`)

---

## Step 3A: RSVP "Yes"

**What happens:**
- System processes RSVP via POST /api/rsvp
- Generates QR pass data
- If seating enabled and assigned → shows table info

**What guest sees:**
- Success animation: Check icon + "Attendance Confirmed!"
- QR code pass displayed (downloadable/screenshottable)
- Event details summary
- Table/seat assignment (if available)
- "Save Screenshot" option (critical for Nigerian users)
- If Aso Ebi enabled → "Buy Event Aso Ebi" CTA

---

## Step 3B: RSVP "No"

**What guest sees:**
- "Sorry you can't make it!"
- No further actions

---

## Step 3C: RSVP "Maybe"

**What guest sees:**
- "Thanks for letting us know!"
- Option to change later

---

## Step 4: Change RSVP

**What happens:**
- Guest can change RSVP from the same page
- Previous response replaced
- If changing from "Yes" to "No" → QR pass invalidated

---

# 3. FLOW 2 — CHECK-IN SCANNING

---

## Step 1: Open Scanner

**What happens immediately:**
- Camera activates (full-screen on mobile)
- Permission request if first time
- Offline status check

**What security sees:**
- Camera viewport fills screen
- Live attendance counter bar at top
- Offline indicator (green/amber/red dot)
- Tab bar: Scan / Manual Search / Walk-in

---

## Step 2: Scan QR Code

**What happens immediately:**
- QR code detected
- Token extracted
- Lookup performed (IndexedDB first, then network)

**What security sees:**
- Scan overlay appears
- Brief loading state (sub-500ms)

---

## Step 3A: SUCCESSFUL SCAN

**What security sees:**
```
┌─────────────────────────────┐
│  ✓  Chioma Okafor           │
│     VIP  ·  Table A  ·  #3  │
│                             │
│     Checked in at 14:30     │
└─────────────────────────────┘
```
- Green success animation
- Guest name, category badge, table, seat
- Auto-dismisses after 3 seconds
- Scanner ready for next guest

**System actions:**
- Mark guest as checked in
- Update live counter
- Sync to Supabase (or queue if offline)
- Log to audit

---

## Step 3B: DUPLICATE SCAN

**What security sees:**
```
┌─────────────────────────────┐
│  ⚠  Already Checked In     │
│     Chioma Okafor           │
│     Checked in at 14:30     │
└─────────────────────────────┘
```
- Amber warning
- Shows previous check-in time
- Auto-dismisses after 2 seconds

---

## Step 3C: INVALID SCAN

**What security sees:**
```
┌─────────────────────────────┐
│  ✗  QR Not Recognized       │
│                             │
│     Try scanning again or   │
│     use manual search.      │
└─────────────────────────────┘
```
- Red error animation
- Auto-dismisses after 2 seconds
- Logs failed attempt in audit

---

## Step 4: Manual Search (Alternative)

**Trigger:** QR scan fails or guest has no QR

**What security does:**
- Types guest name or phone
- Results filter in real-time (client-side)
- Taps "Check In" on matching guest

**What security sees:**
- Search input with results below
- Each result: name, category, phone, RSVP status
- Check-in button per result
- Shows "Already checked in" if duplicate

---

## Step 5: Walk-in (Alternative)

**Trigger:** Guest is not on the list

**What security does:**
- Taps "Walk-in" tab
- Enters: name, category (optional: phone)
- Taps "Check In"

**What happens:**
- Creates guest record
- Checks them in simultaneously
- Logs as walk-in in audit

---

## Step 6: Offline Mode

**Trigger:** Network drops

**What security sees:**
- Amber dot: "Offline Mode Active"
- Scanner continues working
- Scans stored in IndexedDB
- Queue count: "3 pending sync"

**What happens on reconnect:**
- Auto sync begins (no manual action)
- Synced items removed from queue
- Conflicts logged to audit

---

# 4. FLOW 3 — ASO EBI PURCHASE

---

## Step 1: Guest Views Products

**What guest sees:**
- "Buy Event Aso Ebi" section on invite page
- Product cards: image, name, fabric type, ₦ price
- If multiple products → scrollable list

---

## Step 2: Select Options

**What guest does:**
- Selects size from dropdown
- Adjusts quantity (+/-)
- CTA: "Buy Now"

**Edge cases:**
- Past deadline → "Orders closed on {date}" (button disabled)
- Out of stock → "Out of stock" badge
- Size unavailable → hidden from dropdown

---

## Step 3: Enter Delivery Info

**What guest sees:**
- Delivery address field
- Phone number field
- Optional delivery notes

---

## Step 4: Payment

**What happens:**
- Pending order created (POST /api/orders)
- Paystack inline popup opens (react-paystack)
- Payment options: Card, Bank Transfer, USSD

**What guest sees:**
- Paystack payment modal
- Amount in NGN
- Payment methods: Card, Bank, USSD

---

## Step 5A: PAYMENT SUCCESS

**What guest sees:**
- Receipt card: order number, product, size, quantity, amount paid
- "Delivery Info" section (if delivery selected)
- Confirmation message: "Your order has been confirmed!"

**System actions:**
- POST /api/verify-payment (server-side verification)
- Order marked as 'paid'
- Logistics record created automatically

---

## Step 5B: PAYMENT FAILURE

**What guest sees:**
- "Payment failed. You can try again."
- Order stays in 'pending' status
- "Retry Payment" button available

---

# 5. MICROCOPY — ALL USER-VISIBLE MESSAGES

| Moment | Message |
|--------|---------|
| RSVP clicked | "Confirming your response..." |
| RSVP success | "Attendance Confirmed!" |
| RSVP error | "Could not save your response. Please try again." |
| Scan detected | "Verifying QR code..." |
| Scan success | "Guest checked in successfully" |
| Duplicate scan | "Already Checked In" |
| Invalid scan | "QR Not Recognized" |
| Offline active | "Offline Mode Active" |
| Sync pending | "{count} pending sync" |
| Sync complete | "All data synced" |
| Order created | "Processing your order..." |
| Payment success | "Your order has been confirmed!" |
| Payment failed | "Payment failed. You can try again." |
| Order deadline passed | "Orders closed on {date}" |

---

# 6. STATES

## Loading State
- Inline spinner on action button
- Button disabled
- Inputs preserved

## Success State
- Green check animation
- Confirmation message
- Next action CTA shown

## Error State
- Red/amber warning
- Clear error message
- Retry option provided

---

# DEFINITION OF DONE

- User knows system is working (loading state visible)
- User is never confused during waiting (feedback message shown)
- Errors are always recoverable (retry option always present)
- Offline mode is transparent and automatic
- No dead ends in any flow
