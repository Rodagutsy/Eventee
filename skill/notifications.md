# EvenTee — Notifications

> Notifications confirm actions, surface errors, and provide feedback. EvenTee uses inline feedback wherever possible — toasts are reserved for global or persistent events.

---

## Notification Types

| Type | When to use | Pattern |
|------|-------------|---------|
| Inline confirmation | Immediate result of a UI action | Inline — inside the component |
| Toast | Global event, success after async action | Bottom-right toast |
| Inline alert | Validation warning, scan result, error state | Below the relevant element |
| Scan overlay | QR scan result on scanner page | Full-width overlay card |

---

## Inline Confirmations

### Copy Invite Link Confirmation

Triggered when the user copies the invite link. No toast — feedback happens on the button itself.

```
[Copy icon]  →  [Check icon ✓]  →  [Copy icon]
   0ms           150ms              1950ms
```

| Step | Spec |
|------|------|
| 0ms | `Copy` icon (Lucide · 16px · `#6C757D`) |
| 150ms | Swaps to `Check` icon · color `#22C55E` (success) |
| 1800ms hold | Check icon stays visible |
| 1950ms | Fades back to `Copy` icon at 150ms |

---

## Scan Result Overlay

Appears on the scanner page after a QR code is scanned. This is the most important feedback moment in EvenTee.

```
┌─────────────────────────────┐
│  ✓  Chioma Okafor           │
│     VIP  ·  Table A  ·  #3  │
│                             │
│     Checked in at 14:30     │
└─────────────────────────────┘
```

| Severity | Background | Border | Icon |
|----------|-----------|--------|------|
| Success | `#EAF7EF` | `0.5px solid #BBE8CC` | `Check` · `#22C55E` |
| Duplicate | `#FEF3C7` | `0.5px solid #FDE68A` | `AlertTriangle` · `#F59E0B` |
| Invalid | `#FEE2E2` | `0.5px solid #FECACA` | `XCircle` · `#EF4444` |

| Element | Spec |
|---------|------|
| Background | Matches severity |
| Border radius | `radius-lg` (12px) |
| Padding | `space-5` (20px) |
| Auto-dismiss | 3000ms (success) / 2000ms (error) |

---

## Toast Notifications

Position: **bottom-right** · Elevation: level 3 · Auto-dismiss: 3000ms

### Toast Structure

```
┌───────────────────────────────────────────────┐
│  ●  Message text                   [Action?]  │
└───────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Background | `#FFFFFF` |
| Border | `1.5px solid #ADB5BD` (elevation level 3) |
| Border radius | `radius-lg` (12px) |
| Padding | `space-4` (16px) horizontal · `space-3` (12px) vertical |
| Status dot | 8px circle · color matches type |
| Message | `body-sm` (13px) · `#212529` |
| Action button | Ghost (sm) · `#4338CA` · optional |

### Toast Variants

| Variant | Dot color | Example message |
|---------|-----------|----------------|
| Success | `#22C55E` | "Guests imported" · "Invites sent" · "Order confirmed" |
| Error | `#EF4444` | "Failed to send invites — please try again" |
| Info | `#4338CA` | "Offline sync complete · 3 items synced" |

---

## Save Confirmation Toast

```
┌───────────────────────────────────────────────┐
│  ●  Event saved                               │
└───────────────────────────────────────────────┘
```

- Dot: `#22C55E` (success)
- Auto-dismiss: 3000ms
- No action button needed

---

## Inline Alerts

Used for form validation and status messages. Appear directly below the relevant field or component.

### Validation Error

```
⚠  This field is required
```

- `caption` (11px) · `#EF4444` · shown below empty field on Next/Confirm attempt

### Duplicate Guest Warning

```
⚠  A guest with this phone number already exists
   [Merge] [Skip] [Replace]
```

- `body-sm` (13px) · `#92400E` · bg `#FEF3C7` · border `0.5px solid #FDE68A`

---

## Offline Status Indicator

Shown on the scanner page when the device is offline.

```
●  Offline Mode Active  |  3 pending sync
```

| State | Dot color | Message |
|-------|-----------|---------|
| Online | `#22C55E` | "Online" |
| Offline | `#F59E0B` | "Offline Mode Active · {count} pending sync" |
| Syncing | `#4338CA` | "Syncing {count} items..." |

- Position: Top bar of scanner page (non-blocking)
- Font: `caption` (11px) · Inter 500

---

## Rules

1. Single invite link copy → inline icon swap only — no toast
2. Scan result → overlay card — never a toast
3. Save event → success toast
4. Import guests → success toast with summary ("24 guests imported")
5. Failed operation → error toast with retry option
6. Never show two toasts simultaneously — queue them
7. Always pair notification with a message — no silent dots or spinners
8. Offline indicator must be visible but non-blocking — scanner remains active
9. Offline sync must be automatic — no manual sync button needed
