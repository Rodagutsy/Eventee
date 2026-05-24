# EvenTee — Empty States

> Empty states tell users what to do when there is no content yet. Every empty state must be actionable — never a dead end.

---

## Principles

- Always include an icon, a heading, a short message, and a CTA
- Use encouraging language — the user may be a first-time event organizer
- Never show a blank page or a raw "null" state
- CTA must directly solve the empty state

---

## Event List — No Events Yet

Shown when the user has not created any events.

```
        [Calendar icon — 40px — #ADB5BD]

        No events yet

        Create your first event to start managing
        guests, seating, and check-in.

        [  Create event  ]
```

| Element | Spec |
|---------|------|
| Icon | `Calendar` · Lucide · 40px · `#ADB5BD` |
| Heading | "No events yet" · `heading-3` · `#212529` |
| Body | `body` (14px) · `#6C757D` · centered · max-width 320px |
| CTA | "Create event" · primary button (md) |

---

## Guest List — No Guests Yet

Shown before any guests have been added to an event.

```
        [Users icon — 40px — #ADB5BD]

        No guests yet

        Add guests via CSV upload, manual entry,
        or share the registration link.

        [  Add guests  ]
```

| Element | Spec |
|---------|------|
| Icon | `Users` · Lucide · 40px · `#ADB5BD` |
| Heading | "No guests yet" · `heading-3` · `#212529` |
| Body | `body` (14px) · `#6C757D` · centered · max-width 320px |
| CTA | "Add guests" · primary button (md) |

---

## Seating — No Tables Yet

Shown when seating is enabled but no tables have been created.

```
        [LayoutGrid icon — 40px — #ADB5BD]

        No tables yet

        Add tables to create your event seating
        layout and assign guests.

        [  Add table  ]
```

| Element | Spec |
|---------|------|
| Icon | `LayoutGrid` · Lucide · 40px · `#ADB5BD` |
| Heading | "No tables yet" · `heading-3` · `#212529` |
| Body | `body` (14px) · `#6C757D` · centered · max-width 320px |
| CTA | "Add table" · primary button (md) |

---

## Check-in — No Check-ins Yet

Shown on the scanner page before any guests have been scanned.

```
        [ScanLine icon — 40px — #ADB5BD]

        No check-ins yet

        Scan a guest's QR code or search manually
        to start checking in guests.

        [  Start scanning  ]
```

| Element | Spec |
|---------|------|
| Icon | `ScanLine` · Lucide · 40px · `#ADB5BD` |
| Heading | "No check-ins yet" · `heading-3` · `#212529` |
| Body | `body` (14px) · `#6C757D` · centered · max-width 320px |
| CTA | None — scanner is already active |

---

## Aso Ebi — No Products Yet

Shown when commerce is enabled but no products have been added.

```
        [ShoppingCart icon — 40px — #ADB5BD]

        No products yet

        Add Aso Ebi products for guests to
        purchase directly from the event page.

        [  Add product  ]
```

| Element | Spec |
|---------|------|
| Icon | `ShoppingCart` · Lucide · 40px · `#ADB5BD` |
| Heading | "No products yet" · `heading-3` · `#212529` |
| Body | `body` (14px) · `#6C757D` · centered · max-width 320px |
| CTA | "Add product" · primary button (md) |

---

## Orders — No Orders Yet

Shown when no Aso Ebi orders have been placed.

```
        [Package icon — 40px — #ADB5BD]

        No orders yet

        Orders will appear here once guests
        start purchasing Aso Ebi products.

        [  View products  ]
```

| Element | Spec |
|---------|------|
| Icon | `Package` · Lucide · 40px · `#ADB5BD` |
| Heading | "No orders yet" · `heading-3` · `#212529` |
| Body | `body` (14px) · `#6C757D` · centered · max-width 320px |
| CTA | "View products" · ghost button (md) |

---

## Guest Search — No Results

Shown when a guest search returns no matches.

```
        [Search icon — 40px — #ADB5BD]

        No results for "{{query}}"

        Try a different name or phone number
        to find the guest.

        [  Clear search  ]
```

| Element | Spec |
|---------|------|
| Icon | `Search` · Lucide · 40px · `#ADB5BD` |
| Heading | "No results for "{{query}}"" · `heading-3` · `#212529` |
| Body | `body` (14px) · `#6C757D` · centered |
| CTA | "Clear search" · ghost button (md) |

---

## Rules

1. Every empty state must have a CTA — never leave the user stranded
2. Use `#ADB5BD` for neutral/informational icons — not primary color
3. Use `#EF4444` for error icons only
4. Message copy should be encouraging — targeted at event organizers of all experience levels
5. Heading: `heading-3` · Body: `body` (14px) · `#6C757D`
6. Max body text width: 320px — keep messages short and centered
