# DATABASE.schema.md — EvenTee

# 1. OVERVIEW

This schema supports:

- User profiles (organizers, planners, security, admin)
- Events with settings and feature toggles
- Event team members (planners, security)
- Guest lists with RSVP tracking
- Seating layout (tables + seat assignments)
- Check-in records (with offline sync support)
- Aso Ebi commerce (products + orders)
- Messaging (email/SMS/WhatsApp)
- Delivery logistics
- Audit logging

Design goals:
- Strong referential integrity
- Flexible JSONB for event settings
- Secure user isolation via RLS
- Optimized for real-time attendance queries

---

# 2. CORE PRINCIPLES

- Guest verification is handled at engine level
- Invite tokens and QR tokens are cryptographically random
- Events own guest data; check-ins are append-only
- Each event can have multiple concurrent features (seating, commerce, messaging)
- Offline check-ins use an outbox pattern with conflict resolution

---

# 3. TABLES

## 3.1 PROFILES

```sql
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'organizer'
    CHECK (role IN ('organizer', 'planner', 'security', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)
```

Auto-created via trigger on auth.users insert.

## 3.2 EVENTS

```sql
events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  event_type TEXT,
  venue_name TEXT,
  venue_address TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  capacity INTEGER NOT NULL DEFAULT 100,
  seating_type TEXT DEFAULT 'table'
    CHECK (seating_type IN ('table', 'open')),
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
)
```

Indexes: idx_events_organizer ON events(organizer_id)

## 3.3 EVENT MEMBERS

```sql
event_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  role TEXT NOT NULL CHECK (role IN ('planner', 'security')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
)
```

Indexes: idx_event_members_user ON event_members(user_id)

## 3.4 GUESTS

```sql
guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
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
)
```

Indexes:
- idx_guests_event ON guests(event_id)
- idx_guests_invite_token ON guests(invite_token)
- idx_guests_qr_token ON guests(qr_token)
- idx_guests_rsvp ON guests(event_id, rsvp_status)

## 3.5 TABLES (Seating)

```sql
tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  table_number INTEGER NOT NULL,
  label TEXT,
  capacity INTEGER NOT NULL DEFAULT 10,
  category_preference TEXT,
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  shape TEXT DEFAULT 'round'
    CHECK (shape IN ('round', 'rectangle', 'long')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, table_number)
)
```

Indexes: idx_tables_event ON tables(event_id)

## 3.6 SEAT ASSIGNMENTS

```sql
seat_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  seat_number INTEGER,
  assigned_by TEXT DEFAULT 'manual'
    CHECK (assigned_by IN ('manual', 'auto')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(guest_id)
)
```

Indexes: idx_seat_assignments_table ON seat_assignments(table_id)

## 3.7 CHECK-INS

```sql
checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES guests(id),
  checked_in_by UUID REFERENCES profiles(id),
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  method TEXT DEFAULT 'qr'
    CHECK (method IN ('qr', 'manual', 'walk_in')),
  device_id TEXT,
  synced BOOLEAN DEFAULT true,
  offline_created_at TIMESTAMPTZ,
  UNIQUE(event_id, guest_id)
)
```

Indexes: idx_checkins_event ON checkins(event_id)

## 3.8 ASO EBI PRODUCTS

```sql
aso_ebi_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  fabric_type TEXT,
  price INTEGER NOT NULL,
  currency TEXT DEFAULT 'NGN',
  available_sizes TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  order_deadline TIMESTAMPTZ,
  stock_quantity INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

Indexes: idx_products_event ON aso_ebi_products(event_id)

## 3.9 ORDERS

```sql
orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES guests(id),
  product_id UUID NOT NULL REFERENCES aso_ebi_products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  total_amount INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_reference TEXT UNIQUE,
  paystack_transaction_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)
```

Indexes:
- idx_orders_event ON orders(event_id)
- idx_orders_guest ON orders(guest_id)
- idx_orders_payment_ref ON orders(payment_reference)

## 3.10 MESSAGES

```sql
messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  subject TEXT,
  body TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email'
    CHECK (channel IN ('email', 'sms', 'whatsapp')),
  segment_filter JSONB,
  status TEXT DEFAULT 'draft'
    CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  recipient_count INTEGER DEFAULT 0,
  template_key TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

## 3.11 MESSAGE RECIPIENTS

```sql
message_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES guests(id),
  delivery_status TEXT DEFAULT 'pending'
    CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  delivered_at TIMESTAMPTZ,
  error_message TEXT
)
```

## 3.12 DELIVERY ORDERS

```sql
delivery_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id),
  guest_id UUID NOT NULL REFERENCES guests(id),
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
)
```

## 3.13 AUDIT LOGS

```sql
audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

---

# 4. DATA INTEGRITY RULES

- Guest MUST belong to an existing event
- One check-in per guest per event
- One seat assignment per guest (global unique)
- Invite token and QR token are globally unique
- Orders reference valid guests and products
- Status transitions follow defined state machines

---

# 5. SECURITY RULES

## 5.1 Data Access
- All queries MUST be scoped by event + user
- No cross-event data access allowed
- RLS enabled on all tables

## 5.2 RLS Policies
```sql
-- Profiles: user can only view/update own profile
CREATE POLICY user_profiles ON profiles
  USING (auth.uid() = id);

-- Events: organizer full access, team member read access
CREATE POLICY organizer_events ON events
  USING (organizer_id = auth.uid());
CREATE POLICY team_events ON events FOR SELECT
  USING (id IN (SELECT event_id FROM event_members WHERE user_id = auth.uid()));

-- Guests: event team manages guests
CREATE POLICY team_guests ON guests
  USING (event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
    UNION
    SELECT event_id FROM event_members WHERE user_id = auth.uid()
  ));
```

---

# 6. STORAGE BUCKETS

- event-assets (public, 5MB file limit — cover images, documents)
- aso-ebi-images (public, 5MB file limit — product photos)

---

# 7. FINAL GUARANTEE

Database only stores:

- validated event and guest data
- cryptographically secure tokens
- auditable check-in records
- processed order and payment data
- user-isolated data

All business logic validation occurs in the engine layer BEFORE persistence.
