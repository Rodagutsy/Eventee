# TESTING.md — EvenTee (HARDENED VALIDATION SYSTEM)

---

# 1. PURPOSE

Defines a structured testing system to ensure:

- deterministic QR verification behavior
- strict check-in constraint enforcement
- offline sync reliability
- seating algorithm correctness

---

# 2. TESTING TYPES

---

## 2.1 Unit Tests

Scope:
- QR token validation (format, length, uniqueness)
- RSVP state machine transitions
- Seating algorithm (auto-assign logic)
- Offline sync queue operations
- Currency formatting (kobo → ₦ display)
- Token generation (cryptographic randomness)

---

## 2.2 Integration Tests

Scope:
- Check-in flow: scan → verify → persist
- Seating: add table → assign guest → validate uniqueness
- RSVP: submit → verify → generate QR pass
- Paystack webhook: signature validation, idempotent processing
- API routes: RSVP, order creation, payment verification
- Supabase RLS policies: verify each role can only access permitted data

---

## 2.3 End-to-End (E2E) Tests

Scope:
- Full user flow: create event → add guests → send invites → RSVP → check-in
- Guest flow: receive invite → RSVP → view QR pass → check-in
- Commerce flow: organizer adds product → guest buys → payment → delivery

---

# 3. TEST DATA STRATEGY

---

## 3.1 Standard Inputs

Define fixed test inputs:

- Event with 100 guests (mix of categories)
- Guest with valid invite token and QR token
- Simple seating layout (10 tables × 10 seats)
- Aso Ebi product with sizes and price

---

## 3.2 Edge Dataset

Include:

- Empty event (no guests)
- Event at full capacity
- Guest with missing phone/email
- Duplicate QR token attempt
- Offline check-in followed by online duplicate
- Circular seating constraints
- Payment timeout scenario

---

# 4. ENGINE TESTING STRATEGY

---

## 4.1 Deterministic Validation

Test:

Same input → multiple runs

Expected:

- same QR verification result every time
- same seating assignment
- zero variation (pure functions)

---

## 4.2 QR Verification Tests

| Test | Input | Expected |
|------|-------|----------|
| Valid QR | Known QR token | `VALID` with guest data |
| Invalid QR | Random string | `INVALID` |
| Duplicate QR | Already checked-in token | `DUPLICATE` with timestamp |
| Malformed QR | Short/empty string | `INVALID` with format error |

---

## 4.3 Seating Algorithm Tests

| Test | Input | Expected |
|------|-------|----------|
| Basic auto-assign | 50 RSVP-yes guests, 5 tables x 10 | All 50 assigned, balanced |
| VIP priority | 5 VIP + 45 regular, 5 tables | VIPs assigned first |
| Category preference | Table with vip_preference | Only VIP guests assigned to that table |
| Over capacity | 60 guests, 5 tables x 10 | 50 assigned, 10 unassigned with conflict |
| Manual override | Manually assigned guest + auto-assign | Manual kept, no overwrite |

---

## 4.4 RSVP State Machine Tests

Test:

- pending → yes → confirmed
- pending → no → confirmed (terminal)
- pending → maybe → pending
- yes → no → triggers seating unassign
- yes → yes → idempotent
- completed event → reject RSVP

---

## 4.5 Offline Sync Tests

Test:

- queue check-in offline → sync when online → success
- queue check-in offline → duplicate sync → conflict resolved
- prefetch guest list → store in IndexedDB → lookup by QR token
- process sync queue with network failure → retry

---

## 4.6 Mocking Strategy

- mock Supabase calls for unit/integration tests
- use real QR token generation for crypto tests
- seating algorithm is pure — no mocking needed

---

# 5. CONSTRAINT TESTS (PROGRAMMABLE)

---

## 5.1 Guest Validation

Assert:
- full_name is required and ≤ 200 chars
- email is valid format (if provided)
- phone is valid Nigerian format (if provided)
- invite_token is 64-char hex
- qr_token is 32-char hex

---

## 5.2 Check-in Completeness

Assert:
- guest_id references valid guest
- event_id matches guest's event
- one check-in per guest per event (unique constraint)
- checked_in_at timestamp is populated

---

## 5.3 Seating Validity

Assert:
- no duplicate seat assignments
- seat capacity not exceeded
- all assigned guests have RSVP="yes"
- table references valid event

---

## 5.4 Order Validation

Assert:
- product is active and not past deadline
- total_amount matches quantity × price
- payment_status transitions follow valid path
- payment_reference is unique if provided

---

# 6. API TESTS

---

## 6.1 RSVP Endpoint

- valid token + yes → 200 with QR data
- invalid token → 400/404
- already responded → 200 (idempotent)

## 6.2 Check-in Endpoint

- valid scan → 200 with guest data
- duplicate → 409 with check-in time
- invalid token → 404

## 6.3 Auth

- valid session → 200
- no auth → 401
- wrong event → 403

---

# 7. EDGE CASE TESTS

Include:

- double QR scan (rapid succession)
- check-in during RSVP change
- seating reassignment after RSVP change
- network loss during payment verification
- concurrent check-ins from two devices
- 10,000 guest load test

---

# 8. PERFORMANCE TESTS

Validate:

- QR scan lookup < 500ms (target: < 1ms with IndexedDB)
- RSVP response < 1s
- Seating auto-assign for 1000 guests < 3s
- System stable under 10 concurrent check-ins

---

# 9. FAILURE CLASSIFICATION

## Critical (Block Release)

- invalid check-in allowed
- duplicate check-in not detected
- security breach (cross-event access)
- data loss during sync

## Major

- seating conflict not detected
- RSVP state transition broken
- payment not verified

## Minor

- UI mismatch
- logging gaps
- microcopy issues

---

# 10. CI/CD INTEGRATION

Rules:

- all unit + integration tests must pass before merge
- E2E tests run before release
- failed tests block deployment

---

# 11. COVERAGE REQUIREMENTS

Minimum:

- 100% coverage for QR verification logic
- 95% coverage for seating algorithm
- 100% coverage for RSVP state machine
- 90% coverage for offline sync

---

# 12. FINAL ACCEPTANCE CRITERIA

System is valid only if:

- all tests pass
- QR verification is deterministic and repeatable
- no invalid check-in data stored
- system handles all offline/online edge cases
- no cross-event data access possible

---

# FINAL RULE

No feature is complete unless:

- tested across all layers
- validated against constraints
- stable under repeated runs
- offline mode verified
