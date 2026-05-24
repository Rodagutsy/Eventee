# ARCHITECTURE.md — EvenTee SYSTEM DESIGN

---

# 1. SYSTEM OVERVIEW

EvenTee is a mobile-first event management platform built around a **deterministic verification engine** with an optional AI assistance layer.

The system is composed of:

- Frontend (Next.js App Router + React + Tailwind)
- Backend (Next.js Route Handlers — API Layer)
- Core Engine (Deterministic — QR verification, Seating, RSVP, Offline Sync)
- AI Layer (Optional — Interpretation, Recommendations, Narration)
- Data Layer (Supabase / PostgreSQL)

---

# 2. HIGH-LEVEL ARCHITECTURE

```
Organizer → Dashboard → API → Engine → Guest List + Seating + Check-in → Event Day
                                                ↓
                                          AI Layer (optional suggestions)

Guest → Invite Link → RSVP → QR Pass → Check-in → Event Entry
```

---

# 3. CORE SYSTEM COMPONENTS

## 3.1 Frontend (Client Layer)

### Application Architecture

EvenTee is built on Next.js App Router with server components and client-side interactivity where needed.

### Key Views

- Landing Page
- Auth (Login / Signup)
- Events List (Dashboard)
- Event Creation Wizard
- Guest Manager
- Seating Editor (react-konva canvas)
- Check-in Scanner (mobile-first, offline-capable)
- Aso Ebi Commerce
- Messaging Center
- Logistics Dashboard
- Analytics
- Public Invite Page (guest-facing)

### Responsibilities

- Collect event data via wizard
- Display guest lists, seating charts, check-in stats
- Handle offline-first check-in with IndexedDB
- Show real-time attendance updates

---

## 3.2 API Layer (Next.js Route Handlers)

### Endpoints

| Endpoint | Purpose |
|----------|---------|
| POST /api/events | Create event |
| GET /api/events | List user events |
| GET /api/events/:id | Get event detail |
| PATCH /api/events/:id | Update event config |
| DELETE /api/events/:id | Delete event |
| POST /api/rsvp | Guest RSVP (public) |
| POST /api/checkin | QR check-in |
| POST /api/orders | Create Aso Ebi order |
| POST /api/verify-payment | Verify Paystack payment |
| POST /api/webhooks/paystack | Paystack webhook |
| POST /api/messages | Send messages |
| GET /api/guests | List/filter guests |

### Responsibilities

- Receive and validate input
- Call deterministic verification engine
- Manage AI interpretation (optional)
- Enforce authentication and data isolation

---

## 3.3 Core Engine (Deterministic — No AI)

This is the most critical system. All QR verifications, seating assignments, and RSVP transitions are deterministic.

### Engine Modules

```
engine/
├── verification/
│   ├── index.ts           # Main verification orchestrator
│   ├── qr.ts              # QR token validation
│   ├── duplicate.ts       # Duplicate check-in detection
│   └── offline.ts         # Offline sync conflict resolution
├── seating/
│   ├── index.ts           # Seating assignment orchestrator
│   ├── algorithm.ts       # Auto-assign algorithm
│   ├── constraints.ts     # Category preferences, groupings
│   └── conflicts.ts       # Conflict detection & resolution
├── rsvp/
│   ├── index.ts           # RSVP state machine
│   └── transitions.ts     # Valid transition rules
├── payments/
│   ├── index.ts           # Payment verification
│   └── paystack.ts        # Paystack API integration
├── sync/
│   ├── index.ts           # Offline sync processor
│   └── queue.ts           # Outbox pattern queue
├── analytics/
│   ├── index.ts           # Analytics aggregation
│   └── queries.ts         # SQL aggregation queries
└── types.ts               # All engine type definitions
```

### Pipeline Flow:

1. Receive input (scan, RSVP, order)
2. Validate input against rules
3. Run deterministic verification
4. Apply state transitions
5. Persist result
6. Return response

---

## 3.4 AI Layer (Optional — Suggestions Only)

### AI Modules

```
ai/
├── interpreter.ts     # NL → structured guest list
├── recommender.ts     # Seating recommendations
├── narrator.ts        # Event description generation
├── prompts/           # Prompt templates
└── schemas.ts         # Zod schemas for AI output
```

### Boundary Rules

- AI never modifies guest data, seating, or check-in records
- All AI output is validated through Zod schemas
- AI suggestions are clearly labeled in the UI
- Manual configuration always available as fallback

---

## 3.5 Data Layer (Supabase / PostgreSQL)

### Core Entities

- profiles (extends auth.users)
- events (with settings, capacity, status)
- event_members (planners, security staff)
- guests (with invite token, QR token, RSVP status)
- tables (seating layout)
- seat_assignments (guest-to-seat mapping)
- checkins (attendance records)
- aso_ebi_products (commerce catalog)
- orders (purchase records)
- messages and message_recipients
- delivery_orders (logistics)
- audit_logs

### Security

- Row Level Security (RLS) on all tables
- Data isolated by auth.uid() and event membership
- Guest-facing operations use service_role client with invite token validation

---

# 4. VERIFICATION PIPELINE (DETAILED)

## Step 1: Input Processing

- Validate QR token format
- Check event is active/ongoing
- Verify guest belongs to event

## Step 2: Duplicate Check

- Query check-ins for guest_id + event_id
- If exists → return DUPLICATE with timestamp
- If not → proceed

## Step 3: Status Validation

- Check RSVP status is "yes" (optional config)
- Check event capacity not exceeded

## Step 4: Persist

- Create check-in record
- Update guest status
- Log to audit

## Step 5: Response

- Return guest details + welcome message
- Trigger real-time update via Supabase Realtime

---

# 5. STATE MANAGEMENT

Each event maintains:

- event_config (settings, feature toggles)
- guest list (with RSVP statuses)
- seating layout (tables + assignments)
- check-in records (attendance)
- commerce data (products + orders)
- message history

Real-time updates via Supabase Realtime subscriptions:

| Channel | Subscribes To | Updates |
|---------|--------------|---------|
| guests:{eventId} | guests table changes | RSVP dashboard, guest count |
| checkins:{eventId} | checkins table inserts | Attendance counter, timeline |
| orders:{eventId} | orders table changes | Order notifications, sales metrics |

---

# 6. ERROR HANDLING FLOW

## Input Errors
- Missing required fields → block operation
- Invalid token format → clear error

## Verification Errors
- Duplicate scan → return DUPLICATE with timestamp
- Invalid QR → return INVALID
- Guest not found → return NOT_FOUND

## Network Errors
- Offline mode → queue to IndexedDB
- Sync on reconnect

---

# 7. PERFORMANCE REQUIREMENTS

- QR scan validation < 500ms ( < 1ms with IndexedDB cache)
- RSVP update < 1s (optimistic UI)
- Dashboard sync < 2s (Realtime subscriptions)
- UI feedback < 200ms

---

# 8. SECURITY LAYER

- Supabase Auth required for organizer/security
- RLS on all tables
- Guest routes use invite_token validation
- Protected API endpoints
- HMAC signature validation for Paystack webhooks

---

# 9. SYSTEM BOUNDARIES

The system MUST NOT:

- store payment card details
- send unverified check-in data
- expose invite tokens in URLs/logs
- allow cross-event guest access

Focus:
→ event management, guest verification, and attendance tracking

---

# 10. SCALABILITY CONSIDERATIONS

- Engine calls are stateless (pure functions)
- Offline-first reduces server load
- IndexedDB lookups are instant
- Supabase Realtime handles concurrent updates
- 10,000 guest ceiling per event (MVP)

---

# 11. FINAL SYSTEM RULE

No check-in should be returned unless:

- QR token is validated
- Duplicate status is confirmed
- Guest belongs to the event

Otherwise:
→ system must reject with structured error
