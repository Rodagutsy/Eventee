# USER_FLOW.md — EvenTee (HARDENED & MOBILE-FIRST)

---

# 1. PURPOSE

Defines user interaction flows aligned with:
- API.md (endpoints)
- AI_SYSTEM.md (engine behavior)
- ARCHITECTURE.md (system design)

Ensures:
- No invalid system states
- No broken UX scenarios
- Mobile-first behavior (no complex desktop-style navigation)

---

# 2. MOBILE-FIRST UX CONSTRAINT (CRITICAL)

All user interactions MUST follow mobile-first behavior:
- No full page reloads during wizard, check-in, or navigation
- All updates MUST occur dynamically via reactive state updates
- One primary CTA per screen — never crowded dashboards
- Bottom navigation, large tap targets, progressive disclosure

---

# 3. CORE USER GOAL

## Organizer wants to:
→ Create an event with date, venue, capacity
→ Add guests (CSV, manual, registration link)
→ Send invitations (WhatsApp, SMS, Email)
→ Monitor RSVPs in real-time
→ Set up seating layout
→ Check in guests on event day
→ Sell Aso Ebi and manage orders
→ Send messages to guests
→ View analytics after event

## Guest wants to:
→ Open invite link
→ RSVP (Yes/No/Maybe)
→ Get QR pass (screenshot-friendly)
→ See table assignment
→ Buy Aso Ebi (if available)
→ Get checked in at event

---

# 4. PRIMARY FLOW — ORGANIZER ONBOARDING

## Step 1: Landing
User lands on page. Primary CTA: "Create Event". Secondary: "Join Existing Team".

## Step 2: Authentication
Enter phone number or email → receive OTP → verify → continue.
No long passwords during onboarding.

## Step 3: Quick Profile
Full Name. Optional: Event Brand/Company Name.

## Step 4: First Event Prompt
Large CTA: "Create Your First Event" — avoid dashboard-first experience.

---

# 5. CREATE EVENT FLOW

## Step 1: Basic Details
Fields: Event Name, Event Type, Date, Time, Venue.

## Step 2: Capacity
Expected guests, seating type (Table seating / Open seating).
Toggle: Enable Aso Ebi sales.

## Step 3: Event Roles (Optional)
Add Planner, Add Security Staff — invite by phone/email.

## Step 4: Confirmation
System creates event dashboard + Event ID + initial QR infrastructure.
CTA: "Add Guests"

---

# 6. GUEST MANAGEMENT FLOWS

## Flow A — CSV Upload
1. Upload CSV → 2. Preview fields (Name, Phone, Email, Category) → 3. Auto-detect duplicates (Merge/Skip/Replace) → 4. Import success summary → CTA: "Send Invites"

## Flow B — Manual Entry
Fields: Name, Phone. Optional: Email, Category.
CTA: "Add Another" (fast repetitive flow).

## Flow C — Registration Link
Organizer generates public RSVP form link. Share via WhatsApp, Instagram, SMS.

---

# 7. INVITATION SENDING FLOW

Step 1: Select audience (All guests / Pending only / VIPs)
Step 2: Choose channel (WhatsApp primary / SMS / Email)
Step 3: Preview invite message
Step 4: Send invites — system generates QR pass, RSVP link, event reminder metadata

---

# 8. RSVP MONITORING

Dashboard cards: Total Guests, RSVP Yes, Pending, Declined, Checked In.
Actions: filter guests, resend invites, message pending guests, export lists.

---

# 9. SEATING SETUP FLOW

Step 1: Choose layout (Round tables / Rectangular / Mixed)
Step 2: Add tables (name, capacity)
Step 3: "Auto Arrange Guests" — system asks preferences (keep families together, prioritize VIP front seating, separate conflicting guests)
Step 4: Manual adjustment — drag guest between tables (simple mobile gestures)
Step 5: Publish seating — guests can see table number, seat number

---

# 10. MESSAGING FLOW

Step 1: Select audience (Pending RSVP / Confirmed / VIP / Checked in / Aso Ebi buyers)
Step 2: Choose message type (Reminder / Announcement / Thank-you / Custom)
Step 3: Write/edit message
Step 4: Send immediately or schedule

---

# 11. ASO EBI PRODUCT SETUP

Step 1: Enable Aso Ebi sales
Step 2: Create product (Fabric Name, Price, Sizes, Deadline, Images)
Step 3: Set delivery options (Pickup / Delivery)
Step 4: Publish — guests now see "Aso Ebi Available" inside event page

---

# 12. EVENT DAY MONITORING

Live stats: Checked in, Pending arrival, Rejected scans, Walk-ins.
Realtime updates via Supabase Realtime.

---

# 13. POST EVENT FLOW

Step 1: View analytics
Step 2: Send thank-you messages
Step 3: Export guest list
Step 4: Duplicate previous event (important Nigerian workflow optimization)

---

# 14. GUEST FLOW

## Receive Invite
Primary: WhatsApp. Secondary: SMS, Email.

## Open Invite Link
Page shows: event banner, date, venue, RSVP CTA.

## RSVP
Options: Yes / No / Maybe.
If YES: Optional plus-one count, dietary requests.
CTA: "Confirm Attendance"

## QR Pass
After RSVP YES: System instantly generates QR code + event details + table assignment.
"Save Screenshot" enabled (critical for Nigerian users).

## Reminders
Automated: 3 days before, 1 day before, event morning.

## Buy Aso Ebi
Select size, quantity → Enter delivery address, phone → Pay (Card/Bank Transfer/USSD) → Receive confirmation.

## Arrival
Guest opens QR pass → Security scans → System responds: Valid / Already checked in / Invalid.
If valid: Welcome confirmation + table direction.

---

# 15. SECURITY STAFF FLOW

## Login
OTP login or assigned invite link — avoid password friction.

## Event Selection
Security sees only assigned events. Tap to enter scanner mode.

## Scanner
Default screen: Camera scanner fullscreen.
Success: Guest name, category, table, status — green state.
Duplicate: Red warning "Already Checked In".
Invalid: Red warning "QR Not Recognized".

## Offline Check-in
"Offline Mode Active" — scanner still works, scans stored locally.
Auto sync on reconnect — no manual action required.

## Manual Search
If QR fails: search by name or phone → tap "Check In".

---

# 16. SYSTEM STATES

- **Empty State**: "No events yet" with "Create Event" CTA
- **Loading State**: Inline spinner with dynamic progress messages
- **Success State**: Confirmation with next-action CTA
- **Error State**: Inline message with "Try Again" retry option

---

# 17. UX PRINCIPLES

- No full reloads — dynamic updates only
- One primary action per screen
- Maintain state continuity throughout the flow
- Always provide feedback for long-running operations
- Every error must be recoverable via a Retry action
- WhatsApp-like interaction patterns: direct CTAs, short forms, visible confirmations
- Screenshot-friendly passes — no forced wallet integrations
- Offline-first: never require stable internet for check-in
