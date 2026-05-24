# EvenTee — Icons

> One icon library. One style. Always outlined.

---

## Library

**Lucide Icons** — [lucide.dev](https://lucide.dev)

| Property | Value |
|----------|-------|
| License | MIT — free for commercial use |
| Install | `npm install lucide-react` |
| Style | Outlined only — never filled |
| Stroke width | 2px on all icons |
| Color | Inherits from parent `color` token |

---

## Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| sm | 16px | Inline UI — inside buttons, form labels, inline text, badge icons |
| md | 20px | Action — primary CTAs, card action buttons, nav icons |
| lg | 24px | Decorative — empty states, section headers, sidebar nav |
| xl | 40px | Empty state illustrations — centred above heading |

---

## Icon Set

Full list of icons used in EvenTee. Import only what you use.

| Key | Lucide Name | Size | Usage |
|-----|------------|------|-------|
| `event` | `Calendar` | md / lg | Events nav, empty state |
| `guest` | `Users` | md / lg | Guest list nav, empty state |
| `scan` | `ScanLine` | md | QR scanner, check-in tab |
| `checkin` | `CheckSquare` | md | Checked-in indicator |
| `seating` | `LayoutGrid` | md | Seating editor nav |
| `commerce` | `ShoppingCart` | md | Aso Ebi shop, orders |
| `message` | `MessageSquare` | md | Messaging, send invites |
| `logistics` | `Truck` | md | Delivery management |
| `analytics` | `BarChart3` | md | Event analytics |
| `search` | `Search` | sm / md | Search guests · inside field |
| `error` | `XCircle` | sm | Error state, invalid QR |
| `warning` | `AlertTriangle` | sm | Duplicate scan warning |
| `success` | `Check` | md | Check-in confirmed, RSVP saved |
| `delete` | `Trash2` | md | Delete event, remove guest |
| `invite` | `Send` | md | Send invites |
| `rsvp` | `ThumbsUp` | md | RSVP response |
| `qrcode` | `QrCode` | md | QR pass generation |
| `settings` | `Settings` | md | Settings nav |
| `account` | `User` | md | Account / profile nav |
| `navigation` | `ChevronRight` | sm | Navigation arrow, breadcrumbs |
| `mobileMenu` | `Menu` | md | Mobile navigation toggle |
| `add` | `Plus` | md | New event, add guest |
| `copy` | `Copy` | md | Copy invite link |
| `refresh` | `RefreshCw` | md | Resync, regenerate |
| `dashboard` | `Grid` | md | Dashboard nav |
| `info` | `Info` | sm | Tooltip / info trigger |
| `close` | `X` | sm | Close / dismiss |
| `download` | `Download` | sm | Save QR pass screenshot |
| `filter` | `Filter` | sm | Filter guest list |
| `export` | `FileText` | md | Export guest list (CSV) |
| `whatsapp` | `MessageCircle` | md | WhatsApp sharing |
| `email` | `Mail` | md | Email channel |
| `sms` | `Smartphone` | md | SMS channel |
| `wallet` | `Wallet` | md | Payment / Paystack |

---

## Usage in React (lucide-react)

```jsx
import { Calendar, Users, ScanLine, QrCode, ShoppingCart } from 'lucide-react';

// Standard usage — inherits color from parent
<ScanLine size={20} />

// Explicit color
<Check size={20} color="#22C55E" />

// Inside a button
<button className="btn-primary">
  <QrCode size={20} />
  Scan QR
</button>
```

---

## Color Behavior

Icons inherit `currentColor` from the parent element — no need to specify color unless overriding.

| Context | Icon color |
|---------|-----------|
| Primary button | `#FFFFFF` (inherits from button text) |
| Ghost button | `#4338CA` (inherits from button text) |
| Danger button | `#EF4444` (inherits from button text) |
| Nav item — default | `#ADB5BD` |
| Nav item — hover | `#495057` |
| Nav item — active | `#4338CA` |
| Empty state | `#ADB5BD` (xl size) |
| Error state | `#EF4444` |
| Warning state | `#854F0B` |
| Success / checked in | `#22C55E` |
| Inline / secondary actions | `#6C757D` |

---

## Rules

1. **Outlined only** — never use filled variants from Lucide. `Folder` not `FolderFilled`.
2. **Stroke width 2px always** — Lucide default is 2px. Do not change it.
3. **No custom SVGs** — all icons must come from Lucide for visual consistency.
4. **Import only what you use** — avoid importing the full Lucide bundle.
5. **Icons do not stand alone** — always pair with a label, tooltip, or `aria-label` for accessibility.
6. **Consistent sizes within context** — all action buttons in a card use the same icon size (md).
7. **Never rotate or flip icons** — use the correct named icon (e.g. `ChevronDown` not rotated `ChevronRight`).
