# EvenTee — Loading States

> Loading states tell the user something is happening. They prevent confusion, reduce perceived wait time, and protect the user's trust in the product.

---

## Principles

- Always show feedback — never freeze the UI silently
- Give time estimates where possible ("Usually takes a few seconds")
- Preserve user input during loading — never lose what they typed
- Use skeleton loaders for content that has a known shape (guest table)
- Use spinner + label for process-based loading (check-in verification, RSVP)

---

## Check-in Verification Loading

Triggered when a QR code is scanned. Shows briefly while the system verifies.

### Spinner

```
        ◌  Verifying QR code...
```

| Element | Spec |
|---------|------|
| Spinner size | 36px diameter |
| Track color | `#EEF2FF` (primary tint) |
| Active arc color | `#4338CA` (primary) |
| Animation | 1200ms · linear · infinite loop |
| Primary label | "Verifying QR code..." · `body` (14px) · `#212529` |

### Duration

Expected: < 500ms (typically < 1ms with IndexedDB cache).

---

## RSVP Processing Loading

Triggered when the guest clicks an RSVP button.

```
        ◌  Confirming your response...
```

| Element | Spec |
|---------|------|
| Spinner size | 20px (inline in button) |
| Label | "Confirming your response..." · `body-sm` (13px) |
| Button | Disabled during processing |

---

## Event Creation Loading

Triggered when the organizer clicks "Create Event".

### Button Loading State

| Element | Spec |
|---------|------|
| Label | Replaced with "Creating event..." |
| Spinner | Inline · 16px · White · left of label |
| Cursor | `not-allowed` |
| Disabled | Yes — cannot be clicked again |

---

## Guest Import Loading

Triggered when uploading and parsing a CSV file.

### Skeleton Rows

While the CSV is being processed, skeleton rows appear in the guest table.

```
┌─────────────────────────────────────────────────────────────┐
│  ████████████████████  ██████  ██████  ████████████████████ │  ← row 1 (100%)
│  ████████████████████  ██████  ██████  ██████████████████   │  ← row 2 (90%)
│  ████████████████████  ██████  ██████  ████████████████     │  ← row 3 (80%)
│  ████████████████████  ██████  ██████  ██████████████       │  ← row 4 (70%)
└─────────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Skeleton fill color | `#F1F3F5` (`--color-bg-surface`) |
| Animation | pulse · 1.5s · ease-in-out · infinite |
| Line widths | 100% / 90% / 80% / 70% |
| Border radius | `radius-lg` (12px) on card · `radius-sm` (4px) on lines |

---

## Payment Processing Loading

Triggered during Paystack payment verification.

```
        ◌  Processing your payment...
```

- Paystack inline popup handles its own loading state
- After return: spinner on order confirmation card while verifying

---

## Offline Sync Loading

Shown during background sync when connection is restored.

```
        ◌  Syncing 3 pending check-ins...
```

| Element | Spec |
|---------|------|
| Position | Bottom of scanner screen (non-blocking) |
| Label | "Syncing {count} pending check-ins..." |
| Auto-dismiss | On completion or error |

---

## Page / Route Loading

When navigating between Events, Guests, Scanner, and Orders views.

- Duration: fast (under 100ms on Vercel — no loading state needed in most cases)
- If route takes > 200ms: show subtle top progress bar (`#4338CA`, 2px height, full width)

---

## Motion Spec for Loading

| Animation | Duration | Easing |
|-----------|----------|--------|
| Spinner rotation | 1200ms | linear infinite |
| Skeleton pulse | 1500ms | ease-in-out infinite |
| Check-in result slide-in | 300ms | ease-out |
| Scan overlay dismiss | 300ms | ease-out |

See [motion.md](./motion.md) for full motion token reference.

---

## Rules

1. Never leave the UI frozen — always show a spinner or skeleton
2. Preserve the input form values during and after processing
3. Check-in verification must complete in < 500ms
4. Use 4–6 skeleton rows during CSV import processing
5. Respect `prefers-reduced-motion` — skip translate/stagger, use opacity only
6. Offline sync must be non-blocking — never interrupt the scanner flow
