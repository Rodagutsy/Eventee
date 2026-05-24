# EvenTee — MVP Implementation Plan

> **Goal**: Build a mobile-first web application for secure invite-only event management with integrated guest verification, seating, commerce (Aso Ebi), and logistics coordination — replacing WhatsApp, Excel, and paper-based guest lists.

---

## Resolved Decisions

| Decision | Resolution |
|---|---|
| **Branding** | EvenTee |
| **TailwindCSS** | v4 (CSS-first configuration) |
| **Authentication** | Password-only (no magic link) |
| **Currency** | NGN only |
| **Multi-event** | Yes — one organizer can run multiple concurrent events |
| **Invite forwarding** | Allowed — invite links are not locked to the original recipient |
| **Aso Ebi images** | Yes — organizers upload product photos via Supabase Storage |
| **Email provider** | Resend |
| **SMS/WhatsApp** | Termii |
| **Offline sync** | DIY with IndexedDB + Service Worker (Option 1) |
| **Supabase** | Set up from scratch (guide included below) |
| **Paystack** | No keys yet — setup guide included below |

---

## Phase 0 — External Service Setup (Pre-Development)

Before writing any code, these accounts and projects must be created.

---

### Supabase Project Setup (From Scratch)

1. **Create account** at [supabase.com](https://supabase.com) → Sign up with GitHub or email
2. **Create new project**:
   - Organization: Create one (e.g., "EvenTee")
   - Project name: `eventee-mvp`
   - Database password: Generate a strong password → **save it securely**
   - Region: Choose closest to Nigeria — **West Europe (London)** or **Africa (South Africa)** if available
3. **Collect credentials** (Settings → API):
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL (e.g., `https://xxxx.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Public anon key (safe for browser)
   - `SUPABASE_SERVICE_ROLE_KEY` — Secret service-role key (**server-only, never expose**)
4. **Enable features**:
   - Auth → Providers: Enable **Email** provider (disable "Confirm email" for dev, enable for production)
   - Auth → Settings: Disable magic link (password-only)
   - Storage → Create bucket: `event-assets` (public, 5MB file limit)
   - Storage → Create bucket: `aso-ebi-images` (public, 5MB file limit)
5. **Install Supabase CLI** (optional, for local development):
   ```bash
   npx supabase init
   npx supabase start
   ```

### Paystack Account Setup

1. **Create account** at [paystack.com](https://paystack.com) → Sign up with email
2. **Complete business verification** (required for live keys, test keys available immediately)
3. **Collect test credentials** (Settings → API Keys & Webhooks):
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` — Test public key (`pk_test_...`)
   - `PAYSTACK_SECRET_KEY` — Test secret key (`sk_test_...`)
4. **Configure webhook**:
   - URL: `https://your-domain.com/api/webhooks/paystack` (set after deployment)
   - Events: `charge.success`, `transfer.success`, `transfer.failed`
5. **Test card numbers** (for development):
   - Success: `4084 0840 8408 4081` (any future date, any CVV)
   - Failed: `4084 0840 8408 4085`

### Resend Setup (Email)

1. **Create account** at [resend.com](https://resend.com)
2. **Add domain** (or use sandbox `onboarding@resend.dev` for dev)
3. **Get API key**: `RESEND_API_KEY`

### Termii Setup (SMS/WhatsApp)

1. **Create account** at [termii.com](https://termii.com)
2. **Get API key**: `TERMII_API_KEY`
3. **Register sender ID** for SMS (required in Nigeria)
4. **Configure WhatsApp** channel if using WhatsApp messaging

---

## Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR, API routes, mobile-first, PRD requirement |
| **Styling** | TailwindCSS v4 (CSS-first) | Latest, CSS native config, no JS config file needed |
| **State/Data** | TanStack Query v5 | Cache, sync, optimistic updates |
| **Backend** | Supabase (PostgreSQL + Auth + RLS + Realtime + Storage) | PRD requirement, all-in-one BaaS |
| **Auth** | Supabase Auth (`@supabase/ssr`) | Cookie-based SSR auth, password-only |
| **Payments** | Paystack (`react-paystack`) | Nigerian market, NGN currency |
| **QR Scanning** | `html5-qrcode` | Cross-browser, built-in camera UI, offline-capable |
| **QR Generation** | `qrcode` (npm) | Lightweight SVG/canvas QR generation |
| **Drag & Drop** | `dnd-kit` | Modern React DnD, best for custom seating editor |
| **Seating Canvas** | `react-konva` | Canvas-based rendering for 10K+ seat performance |
| **Offline Storage** | IndexedDB via `idb` | Lightweight wrapper, offline check-in queue |
| **Email** | Resend + React Email | Modern API, React-based email templates |
| **SMS/WhatsApp** | Termii | Nigerian-optimized, affordable, sender ID support |
| **Icons** | Lucide React | Consistent, tree-shakable icon set |
| **Fonts** | Inter (Google Fonts) | Clean, modern, excellent readability |

---

## Proposed Changes

### Phase 1 — Project Foundation & Auth (Week 1)

Set up the Next.js project, Supabase integration, authentication, and the design system.

---

#### [NEW] Project Initialization

Initialize Next.js 15 with TypeScript and TailwindCSS v4:

```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Install core dependencies:

```bash
npm install @supabase/supabase-js @supabase/ssr @tanstack/react-query lucide-react
```

#### Full Project Structure

```
EvenTee/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx                # Landing page
│   │   ├── globals.css             # TailwindCSS v4 imports + design tokens
│   │   ├── (auth)/                 # Auth route group (no layout nesting)
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── callback/route.ts   # Supabase auth callback
│   │   ├── (dashboard)/            # Authenticated route group
│   │   │   ├── layout.tsx          # Dashboard shell (sidebar, topbar, mobile nav)
│   │   │   ├── events/
│   │   │   │   ├── page.tsx                        # Events list
│   │   │   │   ├── new/page.tsx                    # Create event wizard
│   │   │   │   └── [eventId]/
│   │   │   │       ├── page.tsx                    # Event dashboard/overview
│   │   │   │       ├── settings/page.tsx           # Event config
│   │   │   │       ├── guests/
│   │   │   │       │   ├── page.tsx                # Guest list
│   │   │   │       │   └── import/page.tsx         # CSV import
│   │   │   │       ├── seating/page.tsx            # Seating editor
│   │   │   │       ├── checkin/page.tsx            # Check-in scanner
│   │   │   │       ├── messages/
│   │   │   │       │   ├── page.tsx                # Message history
│   │   │   │       │   └── compose/page.tsx        # Compose message
│   │   │   │       ├── commerce/
│   │   │   │       │   ├── page.tsx                # Aso Ebi products
│   │   │   │       │   ├── products/new/page.tsx   # Add product
│   │   │   │       │   └── orders/
│   │   │   │       │       ├── page.tsx            # Orders list
│   │   │   │       │       └── [orderId]/page.tsx  # Order detail
│   │   │   │       ├── logistics/page.tsx          # Delivery management
│   │   │   │       └── analytics/page.tsx          # Event analytics
│   │   │   ├── settings/page.tsx                   # User settings
│   │   │   └── admin/page.tsx                      # Admin panel
│   │   ├── (public)/               # Public-facing routes (no auth required)
│   │   │   └── invite/[token]/page.tsx  # Guest invite page
│   │   └── api/                    # API routes
│   │       ├── webhooks/
│   │       │   └── paystack/route.ts    # Paystack webhook handler
│   │       ├── rsvp/route.ts            # Guest RSVP endpoint
│   │       ├── orders/route.ts          # Guest order creation
│   │       └── verify-payment/route.ts  # Server-side payment verification
│   ├── components/                 # Shared UI components
│   │   ├── ui/                     # Design system primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── dropdown.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── file-upload.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── empty-state.tsx
│   │   ├── layout/                 # Shell components
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   └── page-header.tsx
│   │   ├── events/
│   │   │   ├── event-card.tsx
│   │   │   ├── event-form.tsx
│   │   │   └── event-status-badge.tsx
│   │   ├── guests/
│   │   │   ├── guest-table.tsx
│   │   │   ├── guest-importer.tsx
│   │   │   ├── guest-form.tsx
│   │   │   ├── guest-category-badge.tsx
│   │   │   ├── rsvp-status-badge.tsx
│   │   │   └── bulk-action-bar.tsx
│   │   ├── seating/
│   │   │   ├── seating-canvas.tsx
│   │   │   ├── table-shape.tsx
│   │   │   ├── guest-sidebar.tsx
│   │   │   ├── seating-toolbar.tsx
│   │   │   └── conflict-warning-modal.tsx
│   │   ├── checkin/
│   │   │   ├── qr-scanner.tsx
│   │   │   ├── scan-result.tsx
│   │   │   ├── checkin-stats.tsx
│   │   │   ├── manual-search.tsx
│   │   │   ├── walk-in-form.tsx
│   │   │   └── offline-indicator.tsx
│   │   ├── commerce/
│   │   │   ├── product-card.tsx
│   │   │   ├── product-form.tsx
│   │   │   ├── order-table.tsx
│   │   │   ├── purchase-flow.tsx
│   │   │   └── payment-button.tsx
│   │   ├── messaging/
│   │   │   ├── message-composer.tsx
│   │   │   ├── audience-builder.tsx
│   │   │   ├── template-selector.tsx
│   │   │   ├── message-preview.tsx
│   │   │   └── delivery-status-table.tsx
│   │   ├── logistics/
│   │   │   ├── delivery-table.tsx
│   │   │   └── status-pipeline.tsx
│   │   └── analytics/
│   │       ├── metric-card.tsx
│   │       ├── rsvp-chart.tsx
│   │       ├── attendance-chart.tsx
│   │       ├── checkin-timeline.tsx
│   │       └── sales-breakdown.tsx
│   ├── lib/                        # Utilities & config
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client
│   │   │   ├── server.ts           # Server Supabase client (async cookies)
│   │   │   ├── middleware.ts       # Auth middleware helper
│   │   │   └── admin.ts           # Service-role client (server-only)
│   │   ├── utils/
│   │   │   ├── qr.ts              # QR generation utilities
│   │   │   ├── csv.ts             # CSV parsing with validation
│   │   │   ├── tokens.ts          # Secure token generation
│   │   │   └── formatting.ts     # Date, currency (NGN), number formatting
│   │   ├── hooks/
│   │   │   ├── use-event.ts       # Event CRUD queries
│   │   │   ├── use-guests.ts      # Guest list queries
│   │   │   ├── use-realtime.ts    # Supabase Realtime subscriptions
│   │   │   └── use-offline-sync.ts # IndexedDB sync logic
│   │   ├── offline/
│   │   │   ├── db.ts              # IndexedDB schema & connection (idb)
│   │   │   └── sync-queue.ts      # Outbox pattern for offline check-ins
│   │   ├── constants.ts           # App-wide constants (categories, statuses)
│   │   └── types.ts               # TypeScript type definitions
│   ├── services/                   # Business logic layer
│   │   ├── event-service.ts
│   │   ├── guest-service.ts
│   │   ├── seating-service.ts     # Includes deterministic auto-assign algorithm
│   │   ├── checkin-service.ts
│   │   ├── commerce-service.ts    # Paystack integration
│   │   ├── messaging-service.ts   # Resend + Termii integration
│   │   └── analytics-service.ts   # SQL aggregation queries
│   └── middleware.ts               # Next.js middleware (route protection)
├── supabase/
│   ├── migrations/                 # SQL migration files (run in order)
│   │   ├── 001_create_profiles.sql
│   │   ├── 002_create_events.sql
│   │   ├── 003_create_guests.sql
│   │   ├── 004_create_seating.sql
│   │   ├── 005_create_checkins.sql
│   │   ├── 006_create_messages.sql
│   │   ├── 007_create_commerce.sql
│   │   ├── 008_create_logistics.sql
│   │   ├── 009_create_audit_logs.sql
│   │   └── 010_create_rls_policies.sql
│   └── seed.sql                    # Development seed data
├── emails/                         # React Email templates
│   ├── invite.tsx
│   ├── rsvp-confirmation.tsx
│   ├── order-confirmation.tsx
│   ├── reminder.tsx
│   └── thank-you.tsx
├── public/
│   ├── icons/                      # PWA icons (192x192, 512x512)
│   ├── sw.js                       # Service Worker for offline check-in
│   └── manifest.json               # PWA manifest
├── .env.local                      # Environment variables (never commit)
├── next.config.ts
├── tsconfig.json
└── package.json
```

#### [NEW] [globals.css](file:///c:/Users/USER/Desktop/Antigravity%20projects/EvenTee/src/app/globals.css) — Design System

TailwindCSS v4 uses CSS-first configuration (no `tailwind.config.ts`):

```css
@import "tailwindcss";

@theme {
  /* === Color Palette === */
  --color-brand-50: #f3f0ff;
  --color-brand-100: #e9e2ff;
  --color-brand-200: #d5c8ff;
  --color-brand-300: #b69eff;
  --color-brand-400: #9366ff;
  --color-brand-500: #7c3aed;    /* Primary — electric violet */
  --color-brand-600: #6d28d9;
  --color-brand-700: #5b21b6;
  --color-brand-800: #4c1d95;
  --color-brand-900: #3b0f7a;

  --color-surface-50: #f8fafc;
  --color-surface-100: #f1f5f9;
  --color-surface-800: #1e293b;
  --color-surface-900: #0f172a;
  --color-surface-950: #0a1628;   /* Deep navy background */

  --color-accent: #f59e0b;        /* Warm gold */
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;

  /* === Typography === */
  --font-sans: 'Inter', system-ui, sans-serif;

  /* === Spacing & Radii === */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
}
```

- Premium dark mode defaults with glassmorphism card styles
- Smooth `transition-all duration-200` as base defaults
- Custom scrollbar styling for Nigerian mobile browsers
- Focus ring styles using brand color

#### [NEW] [layout.tsx](file:///c:/Users/USER/Desktop/Antigravity%20projects/EvenTee/src/app/layout.tsx) — Root Layout
- Inter font via `next/font/google`
- SEO metadata: title "EvenTee — Smart Event Management", OG tags
- `QueryClientProvider` (TanStack Query)
- `AuthProvider` context wrapper
- Viewport meta: `width=device-width, initial-scale=1, maximum-scale=1` for mobile

#### [NEW] Supabase Client Setup (`src/lib/supabase/`)

| File | Purpose |
|---|---|
| `client.ts` | Browser client via `createBrowserClient` from `@supabase/ssr` |
| `server.ts` | Server client with async `cookies()` (Next.js 15 pattern) |
| `middleware.ts` | Session refresh helper called from root middleware |
| `admin.ts` | `service_role` client for API routes (guest RSVP, orders — since guests have no auth) |

#### [NEW] [middleware.ts](file:///c:/Users/USER/Desktop/Antigravity%20projects/EvenTee/src/middleware.ts)
- Refresh Supabase auth session on every request
- Protect `/(dashboard)/*` → redirect to `/login` if unauthenticated
- Protect `/admin/*` → check user profile `role === 'admin'`
- Allow public routes: `/`, `/invite/*`, `/login`, `/signup`, `/api/webhooks/*`

#### [NEW] Auth Pages (`src/app/(auth)/`)

| Page | Features |
|---|---|
| `login/page.tsx` | Email + password form, link to signup, error handling |
| `signup/page.tsx` | Full name, email, password, confirm password. Default role: organizer |
| `callback/route.ts` | Handle Supabase auth redirects after email confirmation |

- Dark-themed premium UI: gradient background, glassmorphism card, brand colors
- Form validation with inline error messages
- Loading states with skeleton shimmer

#### [NEW] Landing Page (`src/app/page.tsx`)
- Hero section with tagline: "Your Events, Perfectly Managed"
- Feature highlights (guest control, QR check-in, seating, Aso Ebi)
- CTA buttons: "Get Started" → `/signup`, "Login" → `/login`
- Mobile-first responsive design with scroll animations
- Premium dark theme with gradient overlays

#### [NEW] `.env.local` template

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=

# Resend (Email)
RESEND_API_KEY=

# Termii (SMS/WhatsApp)
TERMII_API_KEY=
TERMII_SENDER_ID=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### Phase 2 — Core Event & Guest System (Week 2–3)

Event CRUD, guest management, CSV import, invite generation, and RSVP.

---

#### [NEW] Database Migrations — Profiles, Events, Guests

##### `001_create_profiles.sql`
```sql
-- Extends Supabase auth.users with app-specific profile data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'organizer'
    CHECK (role IN ('organizer', 'planner', 'security', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), 'organizer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

##### `002_create_events.sql`
```sql
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  venue_name TEXT,
  venue_address TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  capacity INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')),
  settings JSONB DEFAULT '{
    "seating_enabled": false,
    "commerce_enabled": false,
    "messaging_enabled": true
  }',
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Event team members (planners, security assigned to an event)
CREATE TABLE public.event_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  role TEXT NOT NULL CHECK (role IN ('planner', 'security')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_event_members_user ON public.event_members(user_id);
```

##### `003_create_guests.sql`
```sql
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  category TEXT NOT NULL DEFAULT 'regular'
    CHECK (category IN ('vip', 'regular', 'family', 'friends', 'corporate', 'media', 'other')),
  rsvp_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (rsvp_status IN ('pending', 'yes', 'no', 'maybe', 'waitlist')),
  invite_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  qr_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  plus_ones INTEGER DEFAULT 0,
  dietary_notes TEXT,
  notes TEXT,
  invite_sent_at TIMESTAMPTZ,
  rsvp_responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_guests_event ON public.guests(event_id);
CREATE INDEX idx_guests_invite_token ON public.guests(invite_token);
CREATE INDEX idx_guests_qr_token ON public.guests(qr_token);
CREATE INDEX idx_guests_rsvp ON public.guests(event_id, rsvp_status);
```

#### [NEW] Event Pages (`src/app/(dashboard)/events/`)

| Page | Description |
|---|---|
| `page.tsx` | Events list — cards with status badge, guest count, date, cover image thumbnail. "Create Event" CTA. |
| `new/page.tsx` | Multi-step creation wizard: (1) Basic info → (2) Capacity & feature toggles → (3) Cover image upload |
| `[eventId]/page.tsx` | Event dashboard — overview metrics (invited, RSVP'd, checked in), quick action cards, recent activity |
| `[eventId]/settings/page.tsx` | Edit event details, toggle features, danger zone (cancel/delete) |

#### [NEW] Guest Management (`src/app/(dashboard)/events/[eventId]/guests/`)

| Page | Description |
|---|---|
| `page.tsx` | Guest data table: sortable, filterable by category & RSVP status, searchable, with bulk action bar |
| `import/page.tsx` | CSV upload with drag-drop, column auto-mapping preview, validation report, bulk paste textarea |

#### [NEW] Guest Components (`src/components/guests/`)

| Component | Purpose |
|---|---|
| `guest-table.tsx` | Sortable data table with row selection for bulk operations |
| `guest-importer.tsx` | CSV drop zone → parse → column mapping → preview → validate → import |
| `guest-form.tsx` | Add/edit single guest (name, email, phone, category, notes) |
| `guest-category-badge.tsx` | Color-coded pills: VIP=gold, Family=blue, Corporate=slate, etc. |
| `rsvp-status-badge.tsx` | Yes=green, No=red, Maybe=amber, Pending=gray, Waitlist=purple |
| `bulk-action-bar.tsx` | Floating bar: delete selected, change category, send invites, export |

#### [NEW] CSV Parser (`src/lib/utils/csv.ts`)
- Parse CSV/TSV files with automatic header detection
- Column auto-mapping: `name`/`full_name` → `full_name`, `email`, `phone`, `category`
- Validation: required `full_name`, optional email format check, duplicate detection
- Returns `{ rows: ParsedGuest[], errors: ValidationError[] }`

#### [NEW] Public Invite Page (`src/app/(public)/invite/[token]/page.tsx`)

This is the guest-facing page — no authentication required. The `invite_token` in the URL identifies the guest.

**Layout (single scrollable page)**:
1. **Hero**: Event cover image with overlay, event name, date, venue
2. **RSVP Section**: Yes / No / Maybe buttons (disabled after response, with "Change RSVP" option)
3. **QR Pass**: Displayed after RSVP "Yes" — downloadable QR code with guest name
4. **Seat Assignment**: Table/seat info if seating is enabled and assigned
5. **Aso Ebi Shop**: Product cards with images, price (₦), size selector, purchase button (if commerce enabled)

- Invite links are **forwardable** — anyone with the link can view and RSVP
- Mobile-first: designed for WhatsApp sharing (OG image, compact layout)
- The page uses **API routes** (`/api/rsvp`) with the Supabase service-role client since guests don't have auth accounts

#### [NEW] Guest-Facing API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/rsvp` | `POST` | Submit/update RSVP. Body: `{ token, status }`. Validates token, updates guest. |
| `/api/orders` | `POST` | Create Aso Ebi order. Body: `{ token, productId, size, quantity }`. Creates pending order. |
| `/api/verify-payment` | `POST` | Verify Paystack payment. Body: `{ reference, orderId }`. Server verifies with Paystack API. |

All routes validate the `invite_token` against the database before performing any operation.

#### [NEW] Token & QR Utilities (`src/lib/utils/`)

| Utility | Function |
|---|---|
| `tokens.ts` | `generateInviteToken()` (32-byte hex), `generateQRToken()` (16-byte hex) |
| `qr.ts` | `generateQRDataURL(data)` — Creates QR code as data URL using `qrcode` lib |

---

### Phase 3 — Seating System (Week 4–5)

Visual drag-and-drop seating editor with deterministic auto-assignment.

---

#### [NEW] Database Migration — Seating

##### `004_create_seating.sql`
```sql
CREATE TABLE public.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  table_number INTEGER NOT NULL,
  label TEXT,                    -- e.g., "Head Table", "Table A"
  capacity INTEGER NOT NULL DEFAULT 10,
  category_preference TEXT,      -- optional: prefer VIP guests
  position_x FLOAT DEFAULT 0,   -- canvas X coordinate
  position_y FLOAT DEFAULT 0,   -- canvas Y coordinate
  shape TEXT DEFAULT 'round'
    CHECK (shape IN ('round', 'rectangle', 'long')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, table_number)
);

CREATE TABLE public.seat_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  seat_number INTEGER,
  assigned_by TEXT DEFAULT 'manual'
    CHECK (assigned_by IN ('manual', 'auto')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(guest_id)  -- one seat per guest across all tables
);

CREATE INDEX idx_tables_event ON public.tables(event_id);
CREATE INDEX idx_seat_assignments_table ON public.seat_assignments(table_id);
```

#### [NEW] Seating Editor Page (`src/app/(dashboard)/events/[eventId]/seating/page.tsx`)
- **Split layout**: Canvas area (left/center) + Guest sidebar (right)
- Canvas renders tables using `react-konva` — zoom, pan, grid snap
- Sidebar shows unassigned guests with search and category filter
- Drag guests from sidebar onto table seats via `dnd-kit`
- Table CRUD: add table (shape, capacity, label), delete, resize
- Color coding: seats filled by category color, empty seats grayed
- Auto-assign button triggers the seating algorithm
- Export seating chart as image

#### [NEW] Seating Components (`src/components/seating/`)

| Component | Purpose |
|---|---|
| `seating-canvas.tsx` | `react-konva` Stage: renders tables, handles zoom/pan, click-to-select |
| `table-shape.tsx` | Konva Group: round/rectangle table with seat circles around perimeter |
| `guest-sidebar.tsx` | Scrollable list of unassigned guests, draggable, filterable |
| `seating-toolbar.tsx` | Add table, shape selector, auto-assign, reset, export buttons |
| `conflict-warning-modal.tsx` | Shows warnings from auto-assign (unassigned guests, conflicts) |

#### [NEW] Deterministic Auto-Seating Algorithm (`src/services/seating-service.ts`)

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
│       (balanced distribution across tables)
├── 6. PHASE 4: Conflict Check
│   └── Apply separation rules if any → swap guests between tables to resolve
└── RETURN { assignments[], unassigned[], conflicts[] }
```

- All auto-assignments tagged `assigned_by: 'auto'` — can be bulk-reset
- Manual assignments are never overwritten by auto-assign
- Edge case: RSVP changes to "No" after seating → auto-unassign, log warning

---

### Phase 4 — Check-In System with Offline Support (Week 5–6)

QR scanning, real-time attendance, and offline-first architecture.

---

#### [NEW] Database Migration — Check-Ins

##### `005_create_checkins.sql`
```sql
CREATE TABLE public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guests(id),
  checked_in_by UUID REFERENCES public.profiles(id),
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  method TEXT DEFAULT 'qr'
    CHECK (method IN ('qr', 'manual', 'walk_in')),
  device_id TEXT,                  -- identifies offline device
  synced BOOLEAN DEFAULT true,     -- false = created offline, pending sync
  offline_created_at TIMESTAMPTZ,  -- actual scan time if offline
  UNIQUE(event_id, guest_id)       -- one check-in per guest
);

CREATE INDEX idx_checkins_event ON public.checkins(event_id);
```

#### [NEW] Check-In Page (`src/app/(dashboard)/events/[eventId]/checkin/page.tsx`)
- Full-screen QR scanner (camera fills viewport on mobile)
- Scan result overlay: guest name, category badge, seat assignment, status
- Success: green check animation + haptic vibration
- Duplicate: amber warning "Already checked in at {time}"
- Invalid: red X animation "QR code not recognized"
- Manual search tab: search guests by name → one-tap check-in
- Walk-in tab: quick-add form (name, category) → creates guest + checks in
- Live attendance counter bar at top
- Offline status indicator (connection badge + pending sync count)

#### [NEW] Check-In Components (`src/components/checkin/`)

| Component | Purpose |
|---|---|
| `qr-scanner.tsx` | `html5-qrcode` wrapper — camera permissions, scan callbacks |
| `scan-result.tsx` | Guest card overlay after scan (name, category, seat, status animation) |
| `checkin-stats.tsx` | Live counter: ✓ Checked In / Total RSVP'd / No-Shows |
| `manual-search.tsx` | Search input + results list with check-in button per guest |
| `walk-in-form.tsx` | Quick form: name + category → create guest + check in |
| `offline-indicator.tsx` | Green/amber/red dot + "X pending sync" label |

#### [NEW] Offline Sync Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    SECURITY DEVICE                        │
│                                                           │
│  ┌───────────┐     ┌──────────────────┐    ┌───────────┐ │
│  │ QR Scan / │────▶│    IndexedDB     │───▶│   Sync    │ │
│  │ Manual    │     │ ┌──────────────┐ │    │   Queue   │ │
│  │ Check-In  │     │ │ guest_cache  │ │    │  (Outbox) │ │
│  └───────────┘     │ │ qr_token     │ │    └─────┬─────┘ │
│                    │ │ guest_id     │ │          │       │
│                    │ │ full_name    │ │          │       │
│                    │ │ category     │ │          │       │
│                    │ │ checked_in   │ │          │       │
│                    │ └──────────────┘ │          │       │
│                    └──────────────────┘          │       │
└─────────────────────────────────────────────────┼───────┘
                                                  │
                                    ┌─────────────▼────────────┐
                                    │   navigator.onLine?       │
                                    │   YES → Push to Supabase  │
                                    │   Validate duplicates     │
                                    │   Clear synced items      │
                                    │   Refresh local cache     │
                                    └──────────────────────────┘
```

##### `src/lib/offline/db.ts` — IndexedDB Schema
```typescript
// Using 'idb' library
const DB_NAME = 'eventee-checkin';
const DB_VERSION = 1;

// Object stores:
// 1. 'guests' — keyed by qr_token, cached guest data for current event
// 2. 'sync_queue' — keyed by auto-increment, pending check-in operations
// 3. 'meta' — keyed by name, stores last sync timestamp, event_id
```

##### `src/lib/offline/sync-queue.ts` — Outbox Pattern
- `prefetchGuestList(eventId)` — Fetch all guests from Supabase → store in IndexedDB
- `lookupByQRToken(token)` — Local IndexedDB lookup (~1ms)
- `queueCheckIn(guestId, timestamp)` — Add to sync queue
- `processSyncQueue()` — Batch POST to Supabase, handle conflicts, clear synced
- `getQueueCount()` — Number of pending items (for UI indicator)

##### `src/lib/hooks/use-offline-sync.ts` — React Hook
- Calls `prefetchGuestList` on mount
- Listens to `window.addEventListener('online', processSyncQueue)`
- Exposes: `{ isOnline, queueCount, syncNow, lastSynced }`

##### `public/sw.js` — Service Worker
- Cache check-in page assets (HTML, CSS, JS) for offline operation
- Cache `html5-qrcode` WASM/worker files
- Background Sync API registration for check-in queue
- Strategy: cache-first for static assets, network-first for API calls

##### `public/manifest.json` — PWA
- `name: "EvenTee Check-In"`, `short_name: "EvenTee"`
- `display: "standalone"`, `theme_color: "#7c3aed"`
- Icons: 192x192, 512x512
- `start_url: "/events"` (for security staff installing as app)

---

### Phase 5 — Messaging System (Week 7–8)

Bulk email/SMS/WhatsApp with segmentation, templates, and scheduling.

---

#### [NEW] Database Migration — Messages

##### `006_create_messages.sql`
```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  subject TEXT,
  body TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email'
    CHECK (channel IN ('email', 'sms', 'whatsapp')),
  segment_filter JSONB,     -- e.g., {"rsvp_status": ["yes"], "category": ["vip","family"]}
  status TEXT DEFAULT 'draft'
    CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  recipient_count INTEGER DEFAULT 0,
  template_key TEXT,         -- 'invite', 'reminder', 'thank_you', null=custom
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.message_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guests(id),
  delivery_status TEXT DEFAULT 'pending'
    CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  delivered_at TIMESTAMPTZ,
  error_message TEXT
);

CREATE INDEX idx_messages_event ON public.messages(event_id);
CREATE INDEX idx_message_recipients_message ON public.message_recipients(message_id);
```

#### [NEW] Messaging Pages (`src/app/(dashboard)/events/[eventId]/messages/`)

| Page | Description |
|---|---|
| `page.tsx` | Message history — list of sent/scheduled/draft messages with status |
| `compose/page.tsx` | Rich composer: channel picker, audience builder (filters), template selector, body editor, schedule picker, preview modal |

#### [NEW] Messaging Components (`src/components/messaging/`)

| Component | Purpose |
|---|---|
| `message-composer.tsx` | Full compose form with all sections |
| `audience-builder.tsx` | Visual filter: RSVP status checkboxes + category multi-select → live count |
| `template-selector.tsx` | Pre-built templates: Invite, Reminder, Thank You, Custom |
| `message-preview.tsx` | Modal showing rendered message (email preview / SMS preview) |
| `delivery-status-table.tsx` | Per-recipient: name, channel, status badge, timestamp |

#### [NEW] Messaging Service (`src/services/messaging-service.ts`)

**Email (Resend)**:
- `sendEmail(to, subject, reactEmailTemplate)` — Single send via Resend API
- `sendBulkEmail(recipients[], template)` — Batch send with rate limiting (Resend batch endpoint)
- React Email templates in `/emails/` directory for beautiful, branded emails

**SMS/WhatsApp (Termii)**:
- `sendSMS(to, message)` — Single SMS via Termii API
- `sendBulkSMS(recipients[], message)` — Batch SMS
- `sendWhatsApp(to, message)` — WhatsApp message via Termii channel
- Nigerian phone number formatting (+234 prefix)

**Scheduling**:
- Scheduled messages stored with `scheduled_for` timestamp
- Cron job or Supabase Edge Function polls for due messages
- MVP alternative: manual "Send Now" only, scheduling as stretch goal

---

### Phase 6 — Aso Ebi Commerce System (Week 8–10)

Product catalog with images, Paystack payments, order management.

---

#### [NEW] Database Migration — Commerce

##### `007_create_commerce.sql`
```sql
CREATE TABLE public.aso_ebi_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  fabric_type TEXT,
  price INTEGER NOT NULL,          -- stored in kobo (₦1 = 100 kobo)
  currency TEXT DEFAULT 'NGN',
  available_sizes TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',  -- array of Supabase Storage URLs
  order_deadline TIMESTAMPTZ,
  stock_quantity INTEGER,          -- null = unlimited
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guests(id),
  product_id UUID NOT NULL REFERENCES public.aso_ebi_products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  total_amount INTEGER NOT NULL,   -- in kobo
  payment_status TEXT DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_reference TEXT UNIQUE,   -- Paystack transaction reference
  paystack_transaction_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_event ON public.aso_ebi_products(event_id);
CREATE INDEX idx_orders_event ON public.orders(event_id);
CREATE INDEX idx_orders_guest ON public.orders(guest_id);
CREATE INDEX idx_orders_payment_ref ON public.orders(payment_reference);
```

#### [NEW] Commerce — Organizer Pages (`src/app/(dashboard)/events/[eventId]/commerce/`)

| Page | Description |
|---|---|
| `page.tsx` | Product list with sales stats per product (orders, revenue) |
| `products/new/page.tsx` | Add product form: name, fabric type, price (₦), sizes, deadline, **image upload** (multi-image, Supabase Storage `aso-ebi-images` bucket) |
| `orders/page.tsx` | Orders table: guest name, product, size, quantity, amount, payment status. Filters by status. |
| `orders/[orderId]/page.tsx` | Order detail: full info, payment verification status, delivery link |

#### [NEW] Commerce — Guest Side (in invite page)

Integrated into `src/app/(public)/invite/[token]/page.tsx`:
- **Product cards**: Image carousel (if multiple images), name, fabric type, ₦ price
- **Size selector**: Dropdown from `available_sizes`
- **Quantity selector**: +/- counter
- **Deadline enforcement**: "Orders close on {date}" banner, disabled after deadline
- **Purchase button**: Opens Paystack inline payment via `react-paystack`
- **Order confirmation**: Receipt card with order number, amount paid

#### [NEW] Paystack Payment Flow

```
Guest clicks "Buy" → Create pending order (API route)
       ↓
Paystack inline popup (react-paystack, frontend)
       ↓
On success → Send reference to /api/verify-payment
       ↓
Server verifies via GET https://api.paystack.co/transaction/verify/{ref}
       ↓
If verified → Update order to 'paid', record transaction ID
       ↓
Webhook /api/webhooks/paystack → async confirmation backup
```

##### `/api/webhooks/paystack/route.ts`
- Validate HMAC SHA512 signature using `PAYSTACK_SECRET_KEY`
- Handle `charge.success` event → update order if not already processed
- Idempotent: check `payment_reference` before double-processing
- Return 200 OK immediately (Paystack retries on non-200)

#### [NEW] Image Upload (`src/components/ui/file-upload.tsx`)
- Drag-and-drop zone for product images
- Preview thumbnails before upload
- Upload to Supabase Storage `aso-ebi-images` bucket
- Max 5 images per product, 5MB per image
- Returns array of public URLs stored in `image_urls`

---

### Phase 7 — Logistics, Analytics & Polish (Week 10–12)

Delivery tracking, event analytics, audit logging, and final polish.

---

#### [NEW] Database Migrations — Logistics & Audit

##### `008_create_logistics.sql`
```sql
CREATE TABLE public.delivery_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id),
  guest_id UUID NOT NULL REFERENCES public.guests(id),
  delivery_address TEXT NOT NULL,
  delivery_phone TEXT NOT NULL,
  delivery_notes TEXT,
  logistics_partner TEXT,
  tracking_number TEXT,
  status TEXT DEFAULT 'pending_pickup'
    CHECK (status IN ('pending_pickup', 'in_transit', 'delivered', 'failed_delivery')),
  status_updated_at TIMESTAMPTZ DEFAULT now(),
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_delivery_orders_event ON public.delivery_orders(event_id);
CREATE INDEX idx_delivery_orders_order ON public.delivery_orders(order_id);
```

##### `009_create_audit_logs.sql`
```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,       -- 'guest.checkin', 'order.paid', 'seating.auto_assign'
  target_type TEXT,           -- 'guest', 'order', 'checkin'
  target_id UUID,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_event ON public.audit_logs(event_id);
CREATE INDEX idx_audit_action ON public.audit_logs(action);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at);
```

#### [NEW] RLS Policies (`supabase/migrations/010_create_rls_policies.sql`)

```sql
-- === PROFILES ===
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (id = auth.uid());

-- === EVENTS ===
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Organizer full access"
  ON public.events FOR ALL USING (organizer_id = auth.uid());
CREATE POLICY "Team member read access"
  ON public.events FOR SELECT USING (
    id IN (SELECT event_id FROM public.event_members WHERE user_id = auth.uid())
  );

-- === GUESTS ===
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Event team manages guests"
  ON public.guests FOR ALL USING (
    event_id IN (
      SELECT id FROM public.events WHERE organizer_id = auth.uid()
      UNION
      SELECT event_id FROM public.event_members WHERE user_id = auth.uid()
    )
  );

-- === TABLES & SEATS ===
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Event team manages tables"
  ON public.tables FOR ALL USING (
    event_id IN (
      SELECT id FROM public.events WHERE organizer_id = auth.uid()
      UNION
      SELECT event_id FROM public.event_members WHERE user_id = auth.uid()
    )
  );

ALTER TABLE public.seat_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Event team manages seating"
  ON public.seat_assignments FOR ALL USING (
    table_id IN (
      SELECT t.id FROM public.tables t
      JOIN public.events e ON e.id = t.event_id
      LEFT JOIN public.event_members em ON em.event_id = e.id
      WHERE e.organizer_id = auth.uid() OR em.user_id = auth.uid()
    )
  );

-- === CHECK-INS ===
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Security staff can insert check-ins"
  ON public.checkins FOR INSERT WITH CHECK (
    event_id IN (
      SELECT event_id FROM public.event_members
      WHERE user_id = auth.uid() AND role = 'security'
      UNION
      SELECT id FROM public.events WHERE organizer_id = auth.uid()
    )
  );
CREATE POLICY "Event team can view check-ins"
  ON public.checkins FOR SELECT USING (
    event_id IN (
      SELECT id FROM public.events WHERE organizer_id = auth.uid()
      UNION
      SELECT event_id FROM public.event_members WHERE user_id = auth.uid()
    )
  );

-- === COMMERCE (orders, products) ===
-- Guest-facing operations use API routes with service_role client
-- Organizer manages via RLS
ALTER TABLE public.aso_ebi_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Organizer manages products"
  ON public.aso_ebi_products FOR ALL USING (
    event_id IN (SELECT id FROM public.events WHERE organizer_id = auth.uid())
  );

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Organizer views orders"
  ON public.orders FOR SELECT USING (
    event_id IN (SELECT id FROM public.events WHERE organizer_id = auth.uid())
  );

-- === MESSAGES ===
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Event team manages messages"
  ON public.messages FOR ALL USING (
    event_id IN (
      SELECT id FROM public.events WHERE organizer_id = auth.uid()
      UNION
      SELECT event_id FROM public.event_members WHERE user_id = auth.uid()
    )
  );
```

> [!NOTE]
> Guest-facing operations (RSVP, Aso Ebi purchases, order creation) are handled through **API routes using the `service_role` client**. The API route validates the guest's `invite_token` before performing any database operation. This is necessary because guests don't have Supabase auth accounts.

#### [NEW] Logistics Page (`src/app/(dashboard)/events/[eventId]/logistics/page.tsx`)
- Delivery orders table with visual status pipeline (pending → in transit → delivered)
- Status update dropdown per delivery
- Assign logistics partner per event (text field)
- Bulk CSV export for logistics partners
- Filter by delivery status

#### [NEW] Analytics Dashboard (`src/app/(dashboard)/events/[eventId]/analytics/page.tsx`)

| Metric | Visualization |
|---|---|
| Total Invited / RSVP'd / Attended | Animated metric cards with icons |
| RSVP Breakdown | Donut chart (Yes/No/Maybe/Pending) |
| Attendance Funnel | Bar chart (invited → RSVP'd → attended → no-shows) |
| Check-In Timeline | Line chart (check-ins over time during event) |
| Aso Ebi Revenue | Total ₦ revenue, order count, popular sizes |
| Guest Categories | Distribution pie chart |

Built with lightweight SVG/Canvas — **no heavy chart library dependency**. Custom chart components in `src/components/analytics/`.

#### [NEW] Real-Time Subscriptions (`src/lib/hooks/use-realtime.ts`)

| Channel | Subscribes To | Updates |
|---|---|---|
| `guests:{eventId}` | `guests` table changes | RSVP dashboard, guest count |
| `checkins:{eventId}` | `checkins` table inserts | Attendance counter, timeline |
| `orders:{eventId}` | `orders` table changes | Order notifications, sales metrics |

---

### Cross-Cutting: Edge Cases & Error Handling (per PRD §7)

| Scenario | Handling |
|---|---|
| Duplicate QR scan | Reject + audit log + show "Already checked in at {time}" |
| Invalid QR | Flag + red error animation + log in audit |
| Walk-in guest | Manual creation flow: name + category → guest created + checked in |
| RSVP change after seating | Auto-unassign seat if "No", warning if "Maybe", log |
| Offline sync conflict | Server override (authoritative), conflict logged in audit |
| Payment failure | Order stays `pending`, guest can retry payment |
| Past order deadline | Disable purchase UI, show "Orders closed" |
| Forwarded invite | Works by design — invite links are public and shareable |
| 10,000 guests | Paginated lists, indexed queries, canvas-based seating |

### Cross-Cutting: Performance Targets (per PRD §6)

| Metric | Target | Implementation |
|---|---|---|
| QR scan validation | < 500ms | IndexedDB local lookup (~1ms), no network needed |
| RSVP update latency | < 1s | Optimistic UI via TanStack Query + server mutation |
| Dashboard sync | < 2s | Supabase Realtime subscriptions |
| 10,000 guests | MVP ceiling | Indexed DB queries, paginated UI, Konva canvas |

---

## Verification Plan

### Automated Tests

```bash
# Type checking
npx tsc --noEmit

# Lint
npx next lint

# Build verification (catches SSR/hydration errors)
npm run build
```

**Unit tests** (Vitest):
- Seating auto-assign algorithm with various inputs (constraints, edge cases)
- CSV parser (valid files, malformed data, missing columns)
- Token generation (uniqueness, length)
- Currency formatting (kobo → ₦ display)
- Offline sync queue operations

**Integration tests**:
- Supabase RLS policies: verify each role can only access permitted data
- Paystack webhook handler: signature validation, idempotent processing
- API routes: RSVP, order creation, payment verification

### Manual Verification Checklist

1. **Auth**: Sign up → login → protected routes → logout → redirect
2. **Events**: Create event → edit → upload cover image → publish → list view
3. **Guests**: Manual add → CSV import (100+ guests) → category assignment → bulk actions
4. **Invites**: Open invite link on mobile → RSVP "Yes" → view QR pass → forward link to another device
5. **Seating**: Create tables → drag guests → auto-assign → verify constraints → manual override
6. **Check-in (Online)**: Scan QR → verify success/duplicate/invalid states
7. **Check-in (Offline)**: Disable network → scan QR → verify local validation → re-enable → verify sync
8. **Commerce**: Add Aso Ebi product with images → guest purchases → Paystack test payment → verify order
9. **Messaging**: Compose email → select audience → preview → send → verify delivery (Resend)
10. **Logistics**: Create delivery order → update status → verify pipeline
11. **Analytics**: Run full event simulation → verify all metrics match
12. **PWA**: Install as app on Android → verify offline check-in works

### Browser Testing

| Browser | Priority | Reason |
|---|---|---|
| Chrome Mobile | **Primary** | Dominant in Nigeria |
| Samsung Internet | High | Common on Samsung devices (large Nigerian market share) |
| Safari iOS | High | iPhone users |
| Firefox Mobile | Medium | Cross-browser validation |
| Chrome Desktop | Medium | Organizer dashboard usage |

---

## Development Timeline

| Phase | Focus | Duration | Key Deliverables |
|---|---|---|---|
| **0** | Service Setup | Day 1 | Supabase project, Paystack account, Resend, Termii |
| **1** | Foundation & Auth | Week 1 | Next.js scaffold, design system, auth flow, landing page |
| **2** | Events & Guests | Week 2–3 | Event CRUD, guest management, CSV import, invite pages, RSVP |
| **3** | Seating | Week 4–5 | Canvas editor, drag-and-drop, auto-seating algorithm |
| **4** | Check-In | Week 5–6 | QR scanning, offline IndexedDB sync, PWA, attendance tracking |
| **5** | Messaging | Week 7–8 | Resend email, Termii SMS/WhatsApp, templates, scheduling |
| **6** | Commerce | Week 8–10 | Aso Ebi catalog with images, Paystack payments, order management |
| **7** | Logistics & Analytics | Week 10–12 | Delivery tracking, analytics dashboard, audit logs, polish |
