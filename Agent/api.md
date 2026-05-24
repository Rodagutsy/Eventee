# API.md — EvenTee (DETERMINISTIC EXECUTION INTERFACE)

---

# 1. PURPOSE

Defines API endpoints for:

- event CRUD
- guest management
- RSVP processing
- check-in verification
- seating management
- commerce (Aso Ebi)
- messaging (email/SMS/WhatsApp)
- logistics and analytics

All endpoints MUST enforce:

- authentication via Supabase Auth (except public guest routes)
- data isolation by event_id and user_id
- deterministic verification rules
- input validation before processing

---

# 2. BASE CONFIG

Base URL:
`/api`

Auth:
- Bearer Token (JWT via Supabase) for dashboard routes
- Invite token (query param) for public guest routes

---

# 3. GLOBAL RULES

- All dashboard requests MUST be authenticated
- Guest-facing routes use `invite_token` for identity
- user_id is NEVER accepted from client — derived from auth token or invite token
- Check-in verification is deterministic (no randomness)
- AI endpoints are clearly labeled as AI-assisted

---

# 4. REQUEST VALIDATION

## Field Constraints

- guest name: required, 1-200 chars
- email: valid email format (optional)
- phone: valid Nigerian number (optional)
- event date: must be future date
- capacity: positive integer, ≤ 100000

Reject if:
- empty required fields
- invalid email/phone format
- past event dates for new events

---

# 5. IDEMPOTENCY (CRITICAL)

## Header

`Idempotency-Key: <unique-key>`

## Behavior

- Same key + same payload → return existing result
- Prevent duplicate check-in creation
- Prevent duplicate order creation

---

# 6. RATE LIMITING

- Create event: max 10 requests / minute
- Check-in: max 60 requests / minute
- Guest RSVP: max 30 requests / minute
- AI interpret: max 10 requests / minute

Exceed → 429 error

---

# 7. GUEST RSVP

## Endpoint

POST `/api/rsvp`

## Request

```json
{
  "token": "64-char-invite-token",
  "status": "yes",
  "plus_ones": 0,
  "dietary_notes": ""
}
```

## Flow

1. Validate invite token
2. Check event is published and not past
3. Update guest RSVP status
4. If "yes" and seating enabled → auto-assign seat (optional)
5. Generate QR pass data
6. Return response

## Response

```json
{
  "status": "confirmed",
  "guest": {
    "name": "Chioma Okafor",
    "category": "vip",
    "table": "Table A",
    "seat": 3
  },
  "qr_data_url": "data:image/png;base64,..."
}
```

---

# 8. GUEST CHECK-IN

## Endpoint

POST `/api/checkin`

## Request

```json
{
  "event_id": "uuid",
  "qr_token": "32-char-qr-token",
  "method": "qr",
  "device_id": "optional-offline-device-id"
}
```

## Flow

1. Validate QR token
2. Check guest exists and belongs to event
3. Check not already checked in
4. Create check-in record
5. Return guest details

## Response

```json
{
  "valid": true,
  "guest": {
    "id": "uuid",
    "name": "Chioma Okafor",
    "category": "vip",
    "table": "Table A",
    "seat": 3
  }
}
```

## Errors

```json
{
  "error": {
    "code": "DUPLICATE_CHECKIN",
    "message": "Guest is already checked in",
    "checked_in_at": "2026-05-23T14:30:00Z"
  }
}
```

---

# 9. ORDERS

## Endpoint

POST `/api/orders`

## Request

```json
{
  "token": "invite-token",
  "product_id": "uuid",
  "size": "XL",
  "quantity": 2,
  "delivery_address": "12 Admiralty Way, Lekki",
  "delivery_phone": "+2348012345678"
}
```

## Behavior

- Validates invite token
- Checks product is active and deadline not passed
- Creates pending order
- Returns order ID for payment

---

# 10. PAYMENT VERIFICATION

## Endpoint

POST `/api/verify-payment`

## Request

```json
{
  "reference": "paystack-ref-xyz",
  "order_id": "uuid"
}
```

## Behavior

- Server-to-server verification with Paystack API
- Updates order to 'paid' on success
- Idempotent — safe to call multiple times

---

# 11. EVENTS CRUD

## Create Event

POST `/api/events`

Request body: event name, date, venue, capacity, feature toggles.

## Get Event

GET `/api/events/{id}`

Returns full event with guest count, check-in stats.

## List Events

GET `/api/events`

Query: status, limit (default: 10, max: 50), offset.

## Update Event

PATCH `/api/events/{id}`

## Delete Event

DELETE `/api/events/{id}`

Soft delete only (deleted_at).

---

# 12. WEBHOOKS

## Paystack Webhook

POST `/api/webhooks/paystack`

- Validate HMAC SHA512 signature
- Handle `charge.success` event → update order
- Idempotent: check payment_reference before double-processing
- Return 200 OK immediately (Paystack retries on non-200)

---

# 13. LOGGING (CRITICAL)

Log:
- request payload (sanitized)
- validation failures
- check-in attempts (success + failure)
- payment verification results

---

# 14. PERFORMANCE RULES

- max response time: 2s (check-in)
- max response time: 5s (RSVP)
- fallback if exceeded

---

# 15. FAILURE HANDLING

## Check-in Failure
- return structured error
- never mark guest as checked in on failure

## RSVP Failure
- return clear error
- preserve guest input for retry

## Payment Failure
- order stays pending
- guest can retry payment

---

# FINAL RULE

No endpoint may return:
- partial or incomplete guest data
- unverified check-in status
- unvalidated AI output as deterministic result

All verification responses MUST pass validation before return.
