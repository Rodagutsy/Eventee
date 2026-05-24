export type ProfileRole = 'organizer' | 'planner' | 'security' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: ProfileRole;
  created_at: string;
  updated_at: string;
}

export type EventStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';

export interface EventSettings {
  seating_enabled: boolean;
  commerce_enabled: boolean;
  messaging_enabled: boolean;
}

export interface Event {
  id: string;
  organizer_id: string;
  name: string;
  description?: string;
  venue_name?: string;
  venue_address?: string;
  event_date: string;
  end_date?: string;
  capacity: number;
  status: EventStatus;
  settings: EventSettings;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EventMember {
  id: string;
  event_id: string;
  user_id: string;
  role: 'planner' | 'security';
  created_at: string;
}

export type GuestCategory = 'vip' | 'regular' | 'family' | 'friends' | 'corporate' | 'media' | 'other';

export type RSVPStatus = 'pending' | 'yes' | 'no' | 'maybe' | 'waitlist';

export interface Guest {
  id: string;
  event_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  category: GuestCategory;
  rsvp_status: RSVPStatus;
  invite_token: string;
  qr_token: string;
  plus_ones: number;
  dietary_notes?: string;
  notes?: string;
  invite_sent_at?: string;
  rsvp_responded_at?: string;
  created_at: string;
  updated_at: string;
}

export type TableShape = 'round' | 'rectangle' | 'long';

export interface Table {
  id: string;
  event_id: string;
  table_number: number;
  label?: string;
  capacity: number;
  category_preference?: GuestCategory;
  position_x: number;
  position_y: number;
  shape: TableShape;
  created_at: string;
}

export interface SeatAssignment {
  id: string;
  table_id: string;
  guest_id: string;
  seat_number?: number;
  assigned_by: 'manual' | 'auto';
  created_at: string;
}

export interface CheckIn {
  id: string;
  event_id: string;
  guest_id: string;
  checked_in_by?: string;
  checked_in_at: string;
  method: 'qr' | 'manual' | 'walk_in';
  device_id?: string;
  synced: boolean;
  offline_created_at?: string;
}

export interface AsoEbiProduct {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  fabric_type?: string;
  price: number;
  currency: string;
  available_sizes: string[];
  image_urls: string[];
  order_deadline?: string;
  stock_quantity?: number;
  is_active: boolean;
  created_at: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  event_id: string;
  guest_id: string;
  product_id: string;
  quantity: number;
  size?: string;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_reference?: string;
  paystack_transaction_id?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  event_id: string;
  sender_id: string;
  subject?: string;
  body: string;
  channel: 'email' | 'sms' | 'whatsapp';
  segment_filter?: Record<string, string[]>;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduled_for?: string;
  sent_at?: string;
  recipient_count: number;
  template_key?: string;
  created_at: string;
}

export interface MessageRecipient {
  id: string;
  message_id: string;
  guest_id: string;
  delivery_status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  delivered_at?: string;
  error_message?: string;
}

export type DeliveryStatus = 'pending_pickup' | 'in_transit' | 'delivered' | 'failed_delivery';

export interface DeliveryOrder {
  id: string;
  order_id: string;
  event_id: string;
  guest_id: string;
  delivery_address: string;
  delivery_phone: string;
  delivery_notes?: string;
  logistics_partner?: string;
  tracking_number?: string;
  status: DeliveryStatus;
  status_updated_at: string;
  delivered_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  event_id?: string;
  actor_id?: string;
  action: string;
  target_type: string;
  target_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}
