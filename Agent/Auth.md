# EvenTee Authentication Spec

Stack: Next.js · Supabase Auth · Vercel
Purpose: Clear, secure, and consistent authentication system for organizers, security staff, and admin roles

---

# 1. How to Use This Document

This is a specification, not implementation code.

- Code blocks define patterns and contracts, not copy-paste code
- Humans should understand the flows
- AI agents must follow the rules strictly

---

# 2. Core Principles

- Supabase Auth is the single source of truth
- **Phone number OR email** login (Nigerian-friendly)
- **OTP verification** as primary auth method (reduces password friction)
- Password option available as fallback
- All sessions handled via secure HttpOnly cookies
- All protected data must rely on RLS (Row Level Security)
- Server is the source of truth — never trust the client

---

# 3. Agent Rules (MANDATORY)

- NEVER use `getSession()` on the server
- ALWAYS use `getUser()` for authentication checks
- NEVER trust client-provided user_id
- ALWAYS protect routes via middleware
- NEVER expose `SUPABASE_SERVICE_ROLE_KEY`
- NEVER store tokens in localStorage
- ALL auth errors must map to global ErrorCode system

---

# 4. File Ownership (STRICT)

- `/lib/supabase/client.ts` → browser client
- `/lib/supabase/server.ts` → server client
- `/lib/supabase/admin.ts` → service-role client (server-only)
- `/lib/auth.ts` → shared auth helpers
- `/hooks/useUser.ts` → client auth state
- `/middleware.ts` → route protection

❗ Do not duplicate logic outside these files

---

# 5. Auth State Model (Frontend)

```ts
type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: User }
  | { status: 'unauthenticated' }
```

---

# 6. Shared Auth Utility

```ts
// lib/auth.ts
export async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('AUTH_REQUIRED')
  }

  return user
}
```

Used in all protected server logic and API routes.

---

# 7. Authentication Flows

## 7.1 Sign Up — Phone or Email

**Primary (Nigerian-friendly):**
- Enter phone number → receive OTP → verify → set profile name
- No password needed during onboarding

**Secondary (Email):**
- Enter email + password
- Validate: email format, password ≥ 8 chars
- Call `signUp`
- Show: "Check your email to confirm your account"

## 7.2 OTP Login

Preferred method for Nigerian users.

- Enter phone number → receive OTP (via Termii SMS)
- Enter OTP → verify → redirect to dashboard
- If no account exists → auto-create profile

**Security:**
- OTP expires after 10 minutes
- Max 5 OTP requests per phone per hour
- Rate limit → cooldown message

## 7.3 Email/Password Login

- Call `signInWithPassword`
- On success → `/events`
- Errors: Invalid credentials → generic message

## 7.4 Logout

- Call `signOut()`
- Redirect to `/login`
- Clear client state

## 7.5 Password Reset

### Request
- User submits email
- Always show same success message (prevents enumeration)

### Reset
- Exchange code from email
- Set new password
- Redirect to dashboard

---

# 8. Session Management

- JWT expires ~1 hour
- Refresh handled automatically by Supabase
- Stored in HttpOnly cookies

Server access:
```ts
const { data: { user } } = await supabase.auth.getUser()
```

❗ Never use `getSession()` on server

---

# 9. Middleware Protection

Responsibilities:

- Refresh session
- Protect dashboard routes
- Redirect unauthenticated users
- Redirect authenticated users away from auth pages

Protected routes:

- /events
- /events/new
- /events/:id
- /events/:id/guests
- /events/:id/seating
- /events/:id/checkin
- /events/:id/messages
- /events/:id/commerce
- /events/:id/logistics
- /events/:id/analytics
- /settings
- /admin

Public routes:

- / (landing)
- /login, /signup
- /invite/:token (guest page)
- /api/webhooks/*

---

# 10. Security Staff Login

Minimal friction — OTP only.

- Security staff receive assigned event link
- OTP login using phone number
- Sees only assigned events
- Default screen: camera scanner

---

# 11. API Route Auth Pattern

All protected routes MUST:
1. Call `requireUser()`
2. Use `user.id` from server
3. Never accept user_id from client

Guest-facing routes validate `invite_token` instead of auth.

---

# 12. User Object

```ts
{
  id: string,
  email?: string,
  phone?: string,
  created_at: string
}
```

Use `id` as foreign key everywhere.

---

# 13. RLS (Row Level Security)

All tables must:
- Enable RLS
- Use `auth.uid()` for access control

Example:
```sql
USING (auth.uid() = organizer_id)
```

❗ Never disable RLS

---

# 14. Error Handling Integration

All auth errors must map to global ErrorCode system:

- AUTH_INVALID_CREDENTIALS
- AUTH_EMAIL_NOT_CONFIRMED
- AUTH_REQUIRED
- AUTH_SESSION_EXPIRED
- AUTH_OTP_EXPIRED
- AUTH_OTP_RATE_LIMITED

UI must use centralized error messages.

---

# 15. Security Rules

- Always validate user on server
- Never expose sensitive keys
- Never trust client input
- Always enforce RLS
- Prevent user enumeration in errors
- OTP codes: never log, never expose

---

# 16. Checklist (MANDATORY)

Before shipping any feature:

- Uses requireUser() for protected logic
- No getSession() on server
- Middleware protects routes
- RLS enabled on all tables
- No sensitive data exposed
- Errors use ErrorCode system
- OTP rate limiting in place
- Security staff sees only assigned events
