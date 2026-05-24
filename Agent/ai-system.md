# AI_SYSTEM.md — EvenTee (DETERMINISTIC ENGINE + AI ASSISTANCE)

---

# 1. PURPOSE

Defines the core deterministic engine and the bounded AI assistance layer for transforming event data into structured guest verification, seating arrangements, RSVP processing, and offline-sync check-in logic.

This system MUST:
- produce exact, auditable QR verification results
- resolve seating assignments via deterministic rules
- enforce check-in validation via binary condition evaluators
- keep AI strictly in the suggestion layer, never modifying core event data

---

# 2. SYSTEM ARCHITECTURE: DETERMINISTIC vs AI

## 2.1 Deterministic Core (Source of Truth)

The following are ALWAYS calculated by rules, never by AI:

| Concern | Implementation |
|---------|---------------|
| QR token validation | Hash-based token comparison against database |
| Check-in duplicate detection | Single-guest constraint per event |
| Seating auto-assignment | Priority-sorted DAG of guest categories |
| RSVP status transitions | State machine (pending → yes/no/maybe) |
| Sync conflict resolution | Server-authoritative timestamp comparison |
| Payment verification | HMAC signature validation + Paystack API check |
| Invite token generation | Cryptographically random 32-byte hex |
| Audience segmentation | Rule-based filter (RSVP status, category, checked-in) |

## 2.2 AI Assistance Layer (Suggestions Only)

The following are OPTIONAL AI enhancements:

| Concern | Implementation |
|---------|---------------|
| Guest list extraction from WhatsApp chat | LLM parses chat export → structured guest list |
| Suggested seating preferences | AI suggests table groupings from guest notes |
| Message template generation | AI drafts event reminders from context |
| Event description enhancement | AI suggests descriptions from event name/type |

## 2.3 The Hard Boundary

AI outputs never directly modify guest data, seating assignments, or check-in records. AI can suggest a configuration, but the rules engine independently validates and applies. The user always sees deterministic outputs with AI suggestions clearly labeled.

---

# 3. QR VERIFICATION ENGINE (DETERMINISTIC)

## 3.1 Core Verification

All QR verification is a pure function — no side effects, no randomness.

```
token = decode(qrData)               // Extract QR token from scan
guest = lookupByToken(token)         // IndexedDB or Supabase lookup
if (!guest) → return INVALID
if (guest.checked_in) → return DUPLICATE
return VALID { guest_id, name, category, table, seat }
```

## 3.2 Offline Verification

```
guest = indexedDB.guests.get(token)  // Local lookup (~1ms)
if (!guest) → queue network retry
if (guest.checked_in_locally) → return DUPLICATE
return VALID
```

## 3.3 Token Structure

```
qrToken = encode(gen_random_bytes(16), 'hex')  // 32-char hex string
inviteToken = encode(gen_random_bytes(32), 'hex') // 64-char hex string
```

---

# 4. SEATING ASSIGNMENT ALGORITHM (DETERMINISTIC)

## 4.1 Auto-Assign Flow

```
autoAssignSeats(guests[], tables[], constraints?)
├── 1. FILTER → RSVP="yes" AND unassigned only
├── 2. SORT by priority → VIP > family > corporate > friends > regular > other
├── 3. PHASE 1: Category-Preferred Tables
│   └── For each table with category_preference → fill with matching guests first
├── 4. PHASE 2: Grouping Constraints
│   └── Apply constraints from event settings (e.g., "seat family together")
├── 5. PHASE 3: Balanced Fill
│   └── For remaining guests → assign to table with most available capacity
├── 6. PHASE 4: Conflict Check
│   └── Apply separation rules if any → swap guests between tables to resolve
└── RETURN { assignments[], unassigned[], conflicts[] }
```

## 4.2 Assignment Rules

- Manual assignments are never overwritten by auto-assign
- All auto-assignments tagged `assigned_by: 'auto'`
- RSVP changes to "No" after seating → auto-unassign, log warning

---

# 5. RSVP STATE MACHINE

```
                 ┌─── yes ───┐
pending ─────┬───┤─── no ────├───→ confirmed (terminal for no)
             │   └─── maybe ─┘
             │
             └─── waitlist (override)

Transitions:
  pending  → yes     (allowed)
  pending  → no      (allowed)
  pending  → maybe   (allowed)
  yes      → no      (allowed — triggers seating unassign)
  no       → yes     (allowed — re-assigns if seating enabled)
  yes      → maybe   (allowed)
  maybe    → yes     (allowed)
  maybe    → no      (allowed)
```

---

# 6. OFFLINE SYNC ENGINE

## 6.1 Sync Queue (Outbox Pattern)

```
checkIn(guestId, timestamp):
  1. Write to indexedDB.sync_queue (optimistic)
  2. Show success to user instantly
  3. When online: processSyncQueue()
     a. POST to Supabase
     b. Validate no duplicates on server
     c. Clear synced items
     d. Refresh local cache
```

## 6.2 Conflict Resolution

| Scenario | Resolution |
|----------|-----------|
| Duplicate scan (both offline) | First sync wins; second logged as duplicate |
| Guest deleted after cache | Server returns 404; remove from local cache |
| Network failure during sync | Queue persists; retry on next online event |

---

# 7. COMPLIANCE & VALIDATION RULES

## 7.1 Rule Structure

```
rule {
  id: 'duplicate-scan',
  severity: 'error',
  condition: (guestId, eventId) => alreadyCheckedIn(guestId, eventId),
  message: 'Guest is already checked in',
  action: 'log_audit'
}
```

## 7.2 Core Rules

- Duplicate QR scan → reject + audit log + show "Already checked in at {time}"
- Invalid QR → reject + red animation + log in audit
- Walk-in guest → create guest + check in (requires name, category)
- RSVP change after seating → auto-unassign if "No"
- Payment failure → order stays pending, guest can retry
- Past order deadline → disable purchase UI, show "Orders closed"

---

# 8. PAYMENT VERIFICATION (DETERMINISTIC)

```
verifyPayment(reference):
  1. Validate HMAC SHA512 signature from Paystack webhook
  2. GET https://api.paystack.co/transaction/verify/{reference}
  3. Check status === 'success'
  4. Verify amount matches order total
  5. Update order status to 'paid'
  6. Return verification result
```

---

# 9. AI INTERPRETATION SERVICE (OPTIONAL)

## 9.1 Purpose

Only for interpreting ambiguous natural language input for guest imports and message drafting.

## 9.2 Contract

AI must return data conforming to Zod schemas:
```typescript
const GuestListFromAI = z.object({
  guests: z.array(z.object({
    fullName: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    category: z.enum(['vip', 'regular', 'family', 'friends', 'corporate', 'media', 'other']).optional(),
  }))
});
```

## 9.3 Fallback

If AI parsing fails, the system falls back to manual CSV upload or manual entry — the wizard always works without AI.

---

# 10. FINAL RULE

All check-in verifications, seating assignments, and payment validations are deterministic. AI never modifies guest data, seating maps, or check-in records directly. The engine is the single source of truth.
