export const GUEST_CATEGORIES = ['vip', 'regular', 'family', 'friends', 'corporate', 'media', 'other'] as const;

export const RSVP_STATUSES = ['pending', 'yes', 'no', 'maybe', 'waitlist'] as const;

export const EVENT_STATUSES = ['draft', 'published', 'ongoing', 'completed', 'cancelled'] as const;

export const TABLE_SHAPES = ['round', 'rectangle', 'long'] as const;

export const CHECKIN_METHODS = ['qr', 'manual', 'walk_in'] as const;

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;

export const MESSAGE_CHANNELS = ['email', 'sms', 'whatsapp'] as const;

export const MESSAGE_STATUSES = ['draft', 'scheduled', 'sending', 'sent', 'failed'] as const;

export const DELIVERY_STATUSES = ['pending_pickup', 'in_transit', 'delivered', 'failed_delivery'] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  vip: '#D4AF37',
  regular: '#94A3B8',
  family: '#3B82F6',
  friends: '#22C55E',
  corporate: '#818CF8',
  media: '#A855F7',
  other: '#9CA3AF',
};

export const RSVP_STATUS_COLORS: Record<string, string> = {
  pending: '#ADB5BD',
  yes: '#22C55E',
  no: '#EF4444',
  maybe: '#F59E0B',
  waitlist: '#A855F7',
};

export const NGN_FORMATTER = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
});
