
# FULL PRODUCT IMPLEMENTATION SPECIFICATION

## Eventee – Event Management Platform (MVP)

---

# 1. SYSTEM ARCHITECTURE OVERVIEW

## 1.1 Frontend

* Framework: Next.js (App Router)
* Styling: TailwindCSS
* State Management: React Query
* Auth: Supabase Auth
* Realtime: Supabase Realtime subscriptions
* QR Scanner: `html5-qrcode` or `zxing-js`

### Design Principle

Mobile-first, operational UI, minimal navigation depth.

---

## 1.2 Backend (Supabase)

* PostgreSQL database
* Row Level Security (RLS) for all tables
* Auth (OTP email/phone login)
* Edge Functions for:

  * QR validation
  * RSVP processing
  * bulk guest import
  * message dispatch

---

## 1.3 Offline System (Security Layer)

* IndexedDB/localStorage caching for guest list
* Local QR validation dataset
* Queue-based check-in sync system
* Automatic reconciliation when online

---

## 1.4 Realtime System

* Supabase Realtime used for:

  * check-in updates
  * RSVP updates
  * dashboard metrics

---

# 2. ROLE MODEL

## 2.1 Roles

### Event Admin (Organizer)

* Full control of event lifecycle

### Security Staff

* QR scanning only
* manual search
* check-in operations

### Guest

* RSVP
* view invite
* view QR pass
* optionally purchase Aso Ebi

---

## 2.2 Access Model

No traditional multi-account setup for guests or security.

Instead:

* Guest = signed token link
* Security = event-scoped access link
* Admin = authenticated user

---

# 3. NAVIGATION ARCHITECTURE

## 3.1 MOBILE NAVIGATION (PRIMARY)

### Bottom Navigation (fixed)

Only 4 items:

#### 1. HOME

Route: `/home`

Contains:

* Event summary
* RSVP stats
* Check-in stats
* Quick actions:

  * Add guest
  * Send message
  * View seating
  * Start scanner (shortcut)

---

#### 2. GUESTS

Route: `/guests`

Contains:

* full guest list
* filters:

  * All
  * RSVP Yes
  * Pending
  * Declined
  * Checked-in
  * VIP
* search bar
* bulk actions:

  * send message
  * resend invite
  * export list

---

#### 3. SCANNER (SECURITY MODE)

Route: `/scanner/:eventId?token=`

Default behavior:

* fullscreen camera QR scanner
* instant validation feedback

Secondary actions:

* manual search
* check-in override (admin permission only)

Offline mode:

* auto switches to cached dataset

---

#### 4. MORE

Route: `/more`

Opens drawer-style menu:

---

## 3.2 MORE MENU (SECONDARY NAVIGATION)

### EVENT MANAGEMENT

* Seating
* Event Settings

---

### COMMUNICATION

* Messages
* Templates

---

### COMMERCE

* Aso Ebi Products
* Orders
* Delivery Tracking

---

### REPORTING

* Event Reports
* Export Data

---

### SECURITY

* Generate Security Link
* Revoke Security Access

---

### SYSTEM

* Settings
* Logout

---

# 3.3 DESKTOP NAVIGATION (OPTIONAL RESPONSIVE LAYER)

Sidebar:

* Dashboard
* Guests
* Scanner
* Seating
* Messages
* Aso Ebi
* Orders
* Reports
* Settings

---

# 4. CORE MODULE SPECIFICATIONS

---

# 4.1 EVENT MODULE

## Functions

* create event
* edit event
* delete event
* set capacity
* define seating type

## Data Model

* events table (Supabase)

---

# 4.2 GUEST MODULE

## Functions

* upload guests (CSV)
* manual entry
* edit guest
* categorize guest
* assign RSVP status

## Key Logic

* deduplicate by phone/email
* generate qr_token per guest

---

# 4.3 INVITE SYSTEM

## Flow

* system generates invite link:
  `/invite/{secure_token}`

## Features

* RSVP form
* event details view
* QR generation after RSVP YES

---

# 4.4 CHECK-IN SYSTEM

## Scanner Behavior

* open camera
* scan QR
* validate token

## Validation Rules

IF:

* token exists
* event_id matches
* not already checked in

THEN:

* mark attendance
* push realtime update

ELSE:

* return error state

---

## Offline Mode

* preload guest dataset
* validate locally
* queue check-in logs
* sync when online

---

# 4.5 SEATING SYSTEM

## Manual Mode

* drag & drop table UI
* assign guests

## AI Mode (rule-based)

Inputs:

* guest categories
* table capacity
* constraints

Logic:

1. group VIP first
2. group families
3. distribute evenly
4. resolve overflow

Output:

* table assignments

---

# 4.6 MESSAGING SYSTEM

## Channels

* WhatsApp (primary)
* SMS
* Email

## Features

* bulk send
* segmentation
* scheduled messages

Segments:

* RSVP yes
* RSVP no
* pending
* VIP

---

# 4.7 ASO EBI MODULE

## Product System

* create product per event
* price, size, deadline

## Guest Flow

* view product inside invite page
* select size
* place order

---

## Payment

* Paystack integration
* single payment flow

---

# 4.8 ORDER SYSTEM

Statuses:

* pending
* paid
* processing
* delivered

---

# 4.9 LOGISTICS MODULE

## Features

* assign delivery partner
* track delivery status

Statuses:

* pending pickup
* in transit
* delivered
* failed

---

# 4.10 ANALYTICS MODULE

Metrics:

* total invited
* RSVP breakdown
* attendance rate
* no-shows
* Aso Ebi sales

---

# 5. SECURITY MODEL

## QR Security

* signed token per guest
* event-bound validation
* one-time check-in enforcement

---

## RLS RULES

* guests: read-only own record
* security: check-in only
* admin: full event access

---

# 6. KEY DATA TABLES

## events

## guests

## checkins

## tables

## seats

## messages

## aso_ebi_products

## aso_ebi_orders

## delivery_orders

## audit_logs

---

# 7. PERFORMANCE REQUIREMENTS

* QR scan response < 500ms
* RSVP update < 1s
* realtime sync < 2s
* support up to 10,000 guests per event

---

# 8. CRITICAL UX RULES

## MUST FOLLOW

* one primary action per screen
* WhatsApp-style simplicity
* large tap targets
* minimal typing
* instant feedback states

---

## MUST AVOID

* enterprise dashboards on mobile
* multi-step onboarding
* unnecessary login walls
* complex nested menus

---

# 9. CORE USER FLOWS

## Organizer

Create event → upload guests → send invites → manage seating → monitor RSVP → monitor check-in → manage Aso Ebi → view reports

---

## Guest

Open invite → RSVP → receive QR → optionally buy Aso Ebi → attend event → get checked in

---

## Security

Open link → scan QR → validate → check-in → sync offline logs

---

# 10. SYSTEM PRINCIPLE

This system is designed as:

> “Link-first event infrastructure”

Not:

* app-first
* login-heavy
* enterprise SaaS

Everything must function through:

* links
* QR codes
* WhatsApp sharing
* minimal friction entry points

