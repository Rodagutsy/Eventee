# EvenTee — Skills & Capabilities

> What EvenTee does — the core deterministic engine and product capabilities from the user's perspective. Based on the implementation plan.

---

## 1. Event Creation Wizard  *(Must Have)*

Multi-step guided form that captures the organizer's event details before guest management.

**Steps:**
- Basic Details (event name, type, date, time, venue)
- Capacity & Seating (expected guests, seating type, feature toggles)
- Event Roles (add planners, security staff — optional)
- Confirmation (summary with event ID)

**Validation:**
- Required fields must be non-empty before Confirm is enabled
- Event date must be in the future
- User input is preserved across steps and on error — never lost

---

## 2. Guest Management  *(Must Have)*

Add, import, and manage guests for an event.

**Import methods:**
- **CSV Upload** — drag-and-drop file, auto-detect fields, preview, duplicate handling
- **Manual Entry** — fast repetitive flow with "Add Another" CTA
- **Registration Link** — public RSVP form link, shareable via WhatsApp, Instagram, SMS
- **WhatsApp Chat Import** — paste chat export, AI extracts names/phones (optional)

**Features:**
- Sortable, filterable guest table (by name, category, RSVP status)
- Bulk actions: delete, change category, send invites, export
- Duplicate detection and merge on import

---

## 3. Invitation & Messaging  *(Must Have)*

Send event invitations and messages via WhatsApp, SMS, and Email.

**Capabilities:**
- Select audience: All guests, Pending only, VIPs, Checked in, Aso Ebi buyers
- Choose channel: WhatsApp (primary), SMS, Email
- Pre-built templates: Invite, Reminder, Thank You, Custom
- Preview message before sending
- Send immediately or schedule
- Delivery status tracking per recipient

**Integrations:**
- WhatsApp/SMS: Termii (Nigerian-optimized)
- Email: Resend + React Email templates

---

## 4. RSVP Management  *(Must Have)*

Guest-facing RSVP with real-time organizer dashboard.

**Guest flow:**
- Open invite link → view event details → select Yes/No/Maybe
- Optional: plus-one count, dietary requests
- Instant QR pass generation on "Yes"

**Organizer view:**
- Live RSVP dashboard (Total, Yes, No, Maybe, Pending)
- Filter guests by RSVP status
- Resend invites to pending guests
- Export RSVP list

**RSVP state machine:**
- pending → yes/no/maybe (all allowed)
- yes → no (triggers seating unassign)
- Guests can change response from the same link

---

## 5. QR Check-in System  *(Must Have)*

Mobile-first QR scanner for event day attendance tracking.

**Capabilities:**
- Full-screen camera scanner (mobile-optimized)
- Instant verification: Valid / Duplicate / Invalid
- Manual search fallback (by name or phone)
- Walk-in quick-add (create guest + check in)
- Live attendance counter
- Offline mode: scans stored locally, auto-sync on reconnect
- Haptic vibration feedback on scan

**Performance:**
- QR scan validation < 500ms
- IndexedDB local lookup (~1ms), no network needed
- Offline-first: never require stable internet for check-in

---

## 6. Seating Manager  *(Must Have)*

Visual seating layout editor with auto-assignment algorithm.

**Capabilities:**
- Add tables (round, rectangular, long) with capacity
- Drag guests between tables (mobile-friendly gestures)
- Auto-arrange guests: prioritizes VIP, keeps families together, separates conflicts
- Color-coded by guest category
- Export seating chart as image
- Publish seating → guests see their table on invite page

**Algorithm:**
- Filter RSVP="yes" and unassigned
- Sort by priority (VIP → family → corporate → friends → regular)
- Category-preferred tables first
- Balanced fill for remaining guests
- Manual assignments never overwritten

---

## 7. Aso Ebi Commerce  *(Must Have)*

Event-specific product catalog with integrated payments.

**Organizer flow:**
- Enable Aso Ebi sales in event settings
- Add products: name, fabric type, price (₦), sizes, deadline, images
- Set delivery options: pickup or delivery
- View orders with payment status

**Guest flow:**
- Browse products on invite page
- Select size, quantity
- Enter delivery address and phone
- Pay via Paystack (Card, Bank Transfer, USSD)
- Receive order confirmation

**Payment flow:**
- Guest clicks Buy → pending order created
- Paystack inline popup
- Server-side payment verification via Paystack API
- Webhook backup for async confirmation
- Idempotent: safe to retry

---

## 8. Logistics Management  *(Must Have)*

Track delivery of Aso Ebi orders.

**Capabilities:**
- View orders dashboard (Paid, Pending, Ready for delivery)
- Assign logistics partner per event
- Update delivery status: Picked Up → In Transit → Delivered
- Bulk CSV export for logistics partners
- Automatic logistics record creation on purchase

---

## 9. Event Analytics  *(Must Have)*

Post-event analytics and reporting.

**Metrics:**
- Total Invited / RSVP'd / Attended
- RSVP breakdown (Yes/No/Maybe/Pending)
- Attendance funnel (invited → RSVP'd → attended → no-shows)
- Check-in timeline (check-ins over time)
- Aso Ebi revenue (total ₦, order count, popular sizes)
- Guest category distribution

---

## 10. Event Day Dashboard  *(Must Have)*

Real-time monitoring during the event.

**Live stats:**
- Checked in count
- Pending arrival
- Rejected scans
- Walk-ins
- Real-time updates via Supabase Realtime

---

## 11. Offline Sync  *(Must Have)*

Check-in works without internet.

**Architecture:**
- IndexedDB local storage for guest cache
- Outbox pattern: scans queued locally, synced when online
- Auto-sync on reconnect — no manual action required
- Conflict resolution: server-authoritative
- PWA: installable as standalone app for security staff

---

## 12. Post-Event Tools  *(Must Have)*

- View analytics
- Send thank-you messages
- Export guest list
- Duplicate previous event (important Nigerian workflow optimization)

---

## 13. Error Handling  *(Must Have)*

- Feature toggle for Aso Ebi blocking when deadline passed
- Calculation failure: full error state with "Try again" CTA — user input preserved
- No silent failures — every error must have a visible message
- Auth errors: shown inline on the form
- Duplicate check-in: clear amber warning with timestamp

---

## Rules

1. All QR verifications are deterministic — formulas, not AI guesses
2. AI never modifies guest data, seating, or check-in records directly
3. Input is never lost on error or during loading
4. Every action must give clear feedback — no silent success or silent failure
5. Offline mode must be transparent and automatic
6. Security staff must never need to troubleshoot — scanner just works
