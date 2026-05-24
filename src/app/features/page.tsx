"use client";

import Link from "next/link";
import { Check, Users, ScanLine, LayoutGrid, ShoppingCart, MessageSquare, Truck, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const featureDetails = [
  {
    icon: Users,
    title: "Guest Management",
    description: "Import guests from CSV files, add manually, or share a registration link. Track RSVPs in real-time and send targeted reminders.",
    points: ["CSV import with auto-column mapping", "Manual entry optimized for quick addition", "Shareable registration link for WhatsApp", "Real-time RSVP tracking", "Guest categories: VIP, Family, Friends, Corporate, Media"],
  },
  {
    icon: ScanLine,
    title: "QR Check-In",
    description: "Fast, reliable QR scanning that works even when the internet drops. Perfect for Nigerian event venues with variable connectivity.",
    points: ["Offline-first: scans stored locally, sync later", "Sub-500ms verification with local IndexedDB", "Manual search fallback for failed scans", "Walk-in guest creation on the spot", "Duplicate scan detection with audit log"],
  },
  {
    icon: LayoutGrid,
    title: "Smart Seating",
    description: "Visual drag-and-drop seating editor. Auto-assign guests to tables with our intelligent algorithm.",
    points: ["Round, rectangular, and long table shapes", "Drag guests from sidebar onto seats", "Auto-assign: keep families together, VIPs front", "Color-coded seats by guest category", "Export seating chart as image"],
  },
  {
    icon: ShoppingCart,
    title: "Aso Ebi Commerce",
    description: "Let guests order and pay for event fabrics directly through their invite page.",
    points: ["Multi-image product uploads via Supabase Storage", "Size and quantity selection", "Paystack payments: Card, Bank Transfer, USSD", "Order management dashboard", "Automatic logistics record on purchase"],
  },
  {
    icon: MessageSquare,
    title: "Messaging",
    description: "Broadcast messages to your guests via email, SMS, or WhatsApp. Segment your audience for targeted communication.",
    points: ["Channel picker: Email, SMS, WhatsApp", "Audience builder with RSVP & category filters", "Pre-built templates: Invite, Reminder, Thank You", "Delivery status tracking per recipient", "Schedule messages for later"],
  },
  {
    icon: Truck,
    title: "Logistics",
    description: "Track Aso Ebi deliveries from pickup to doorstep. Assign logistics partners and update statuses.",
    points: ["Visual delivery status pipeline", "Assign logistics partners per delivery", "Status updates: Pending → In Transit → Delivered", "Bulk CSV export for logistics partners", "Auto-notify guests on delivery updates"],
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Understand your event performance with real-time metrics and visual reports.",
    points: ["Live attendance counter during event", "RSVP breakdown: Yes/No/Maybe/Pending", "Check-in timeline over time", "Aso Ebi revenue and popular sizes", "Guest category distribution"],
  },
  {
    icon: Shield,
    title: "Security & Control",
    description: "Assign security staff with limited scanner-only access. Full audit trail for all check-in activity.",
    points: ["Role-based access: Organizer, Planner, Security", "Audit log for all check-in and payment activity", "RLS policies ensure data isolation", "Admin panel for platform oversight"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-[#DEE2E6] z-40">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/"><span className="text-[20px] font-bold text-[#4338CA] font-[family-name:var(--font-display)]">EvenTee</span></Link>
          <nav className="hidden sm:flex items-center gap-6">
            <Link href="/features" className="text-[13px] text-[#4338CA] font-medium">Features</Link>
            <Link href="/pricing" className="text-[13px] text-[#495057] hover:text-[#4338CA]">Pricing</Link>
            <Link href="/contact" className="text-[13px] text-[#495057] hover:text-[#4338CA]">Contact</Link>
            <Link href="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
            <Link href="/signup"><Button variant="primary" size="sm">Get Started</Button></Link>
          </nav>
          <Link href="/signup" className="sm:hidden"><Button variant="primary" size="sm">Sign Up</Button></Link>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[36px] sm:text-[48px] font-bold text-[#212529] font-[family-name:var(--font-display)] tracking-[-2px] mb-4 text-center">
            Features
          </h1>
          <p className="text-[16px] text-[#6C757D] text-center max-w-2xl mx-auto mb-12 leading-[1.7]">
            Everything you need to manage your event from guest list to check-in, seating, Aso Ebi sales, and delivery.
          </p>

          <div className="flex flex-col gap-12">
            {featureDetails.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-[#F8F9FA] border-[0.5px] border-[#DEE2E6] rounded-[12px] p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[8px] bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-[#4338CA]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-[22px] font-semibold text-[#212529] font-[family-name:var(--font-display)] mb-2">{feature.title}</h2>
                      <p className="text-[14px] text-[#6C757D] mb-4 leading-[1.6]">{feature.description}</p>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {feature.points.map((point) => (
                          <li key={point} className="flex items-start gap-2 text-[13px] text-[#495057]">
                            <Check size={14} className="text-[#22C55E] mt-0.5 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/signup">
              <Button variant="primary" size="lg">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
