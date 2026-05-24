# EvenTee Error Handling System (AI-Agent Ready)

Stack: Next.js · Supabase · TypeScript · Vercel
Purpose: Deterministic, enforceable error handling system for AI-assisted development

---

# 1. Core Principles (Enforced)

RULES:

- NEVER throw raw errors in API routes
- ALWAYS return structured error responses
- NEVER show backend error messages directly in UI
- ALL errors must map to a defined ErrorCode
- NO duplicate error logic across files

---

# 2. Error Code System (Single Source of Truth)

```ts
export type ErrorCode =
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_EMAIL_NOT_CONFIRMED'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_REQUIRED'
  | 'AUTH_OTP_EXPIRED'
  | 'AUTH_OTP_RATE_LIMITED'
  | 'INVALID_INVITE_TOKEN'
  | 'INVALID_QR_TOKEN'
  | 'DUPLICATE_CHECKIN'
  | 'GUEST_NOT_FOUND'
  | 'EVENT_NOT_FOUND'
  | 'EVENT_FULL'
  | 'EVENT_PAST'
  | 'RSVP_INVALID_TRANSITION'
  | 'SEATING_CONFLICT'
  | 'PAYMENT_VERIFICATION_FAILED'
  | 'ORDER_DEADLINE_PASSED'
  | 'PRODUCT_UNAVAILABLE'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_DIMENSION'
  | 'VALIDATION_FAILED'
  | 'DB_SAVE_FAILED'
  | 'DB_FETCH_FAILED'
  | 'DB_PERMISSION_DENIED'
  | 'NETWORK_OFFLINE'
  | 'NETWORK_TIMEOUT'
  | 'MESSAGE_SEND_FAILED'
  | 'SYNC_CONFLICT'
  | 'UNKNOWN_ERROR'
```

❗ RULE: No new error codes may be introduced without updating this list.

---

# 3. Standard API Error Response

```ts
export type ApiErrorResponse = {
  error: {
    code: ErrorCode
    message: string
    field?: string
    details?: Record<string, unknown>
  }
}
```

---

# 4. Error Factory (MANDATORY)

```ts
export function createError(code: ErrorCode, message?: string, field?: string, details?: Record<string, unknown>) {
  return {
    error: {
      code,
      message: message || ERROR_MESSAGES[code],
      ...(field && { field }),
      ...(details && { details })
    }
  }
}
```

❗ RULE: All API routes must use `createError()`

---

# 5. Frontend Error Mapping

```ts
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  AUTH_INVALID_CREDENTIALS: 'Incorrect email, phone, or password',
  AUTH_EMAIL_NOT_CONFIRMED: 'Please confirm your email',
  AUTH_SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  AUTH_REQUIRED: 'Please log in to continue',
  AUTH_OTP_EXPIRED: 'Your OTP has expired. Request a new one.',
  AUTH_OTP_RATE_LIMITED: 'Too many OTP requests. Please try again later.',

  INVALID_INVITE_TOKEN: 'This invite link is invalid or has expired.',
  INVALID_QR_TOKEN: 'This QR code is not recognized.',
  DUPLICATE_CHECKIN: 'This guest has already checked in.',
  GUEST_NOT_FOUND: 'Guest not found.',
  EVENT_NOT_FOUND: 'Event not found.',
  EVENT_FULL: 'This event has reached full capacity.',
  EVENT_PAST: 'This event has already ended.',
  RSVP_INVALID_TRANSITION: 'This RSVP change is not allowed.',
  SEATING_CONFLICT: 'A seating conflict was detected.',
  PAYMENT_VERIFICATION_FAILED: 'Payment could not be verified.',
  ORDER_DEADLINE_PASSED: 'Orders are closed for this product.',
  PRODUCT_UNAVAILABLE: 'This product is no longer available.',

  MISSING_REQUIRED_FIELD: 'Please fill in all required fields.',
  INVALID_DIMENSION: 'Please enter a valid value.',
  VALIDATION_FAILED: 'Please check your input fields.',

  DB_SAVE_FAILED: 'We could not save your data. Try again.',
  DB_FETCH_FAILED: 'We could not load your data.',
  DB_PERMISSION_DENIED: 'You do not have permission to perform this action.',

  NETWORK_OFFLINE: 'You appear to be offline.',
  NETWORK_TIMEOUT: 'The request timed out. Please try again.',

  MESSAGE_SEND_FAILED: 'Message could not be sent.',
  SYNC_CONFLICT: 'A sync conflict was detected and resolved.',

  UNKNOWN_ERROR: 'Something went wrong. Please try again.'
}
```

❗ RULE: UI must ONLY use messages from this map.

---

# 6. Shared Async State Model

```ts
export type AsyncState<T> = {
  data?: T
  loading: boolean
  error?: ErrorCode
}
```

---

# 7. Retry Utility (Global)

```ts
export async function withRetry<T>(fn: () => Promise<T>, retries = 2) {
  let attempt = 0

  while (attempt <= retries) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === retries) throw error
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
      attempt++
    }
  }
}
```

❗ RULE: All network + check-in calls must use withRetry()

---

# 8. File Ownership (STRICT)

- `/lib/errors.ts` → ErrorCode + ERROR_MESSAGES + createError
- `/lib/retry.ts` → withRetry
- `/hooks/useAsync.ts` → Async state logic
- `/components/ErrorBoundary.tsx` → React error boundary

❗ RULE: Do not duplicate logic outside these files

---

# 9. API Route Rules

Every API route MUST:

- Wrap logic in try/catch
- Use createError()
- Return typed response

```ts
try {
  const data = await doSomething()
  return Response.json({ data })
} catch (err) {
  console.error(err)
  return Response.json(createError('UNKNOWN_ERROR'), { status: 500 })
}
```

---

# 10. UI Error Display Rules

- Inline errors → form validation
- Toast → non-blocking (check-in success, RSVP confirmed)
- Banner → global issues (offline, rate limit)
- Full page → fatal errors (auth required, invalid invite)

---

# 11. Enforcement Checklist (MANDATORY)

Before merging any feature:

- Uses ErrorCode
- Uses createError
- Uses withRetry for async
- No raw errors exposed
- UI uses ERROR_MESSAGES
- No duplicate error logic
