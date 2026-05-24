"use client";

import Link from "next/link";
import { ArrowRight, Check, Calendar, Users, ScanLine, LayoutGrid, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Users, title: "Guest Management", description: "Import guests via CSV, manual entry, or shareable registration links. Track RSVPs in real-time." },
  { icon: ScanLine, title: "QR Check-In", description: "Fast, offline-capable QR scanning for event day. Works even without internet." },
  { icon: LayoutGrid, title: "Smart Seating", description: "Visual drag-and-drop seating editor with AI auto-assignment. Keep families together, VIPs front and center." },
  { icon: ShoppingCart, title: "Aso Ebi Sales", description: "Sell event fabrics directly to guests. Paystack payments with card, bank transfer, and USSD." },
  { icon: Calendar, title: "Multi-Event", description: "Manage multiple events simultaneously. Duplicate successful event formats with one click." },
  { icon: Users, title: "Team Collaboration", description: "Add planners and security staff. Assign roles and control access per event." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-[#DEE2E6] z-40">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <span className="text-[20px] font-bold text-[#4338CA] font-[family-name:var(--font-display)]">EvenTee</span>
          <nav className="hidden sm:flex items-center gap-6">
            <Link href="/features" className="text-[13px] text-[#495057] hover:text-[#4338CA] transition-colors">Features</Link>
            <Link href="/pricing" className="text-[13px] text-[#495057] hover:text-[#4338CA] transition-colors">Pricing</Link>
            <Link href="/contact" className="text-[13px] text-[#495057] hover:text-[#4338CA] transition-colors">Contact</Link>
            <Link href="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
            <Link href="/signup"><Button variant="primary" size="sm">Get Started</Button></Link>
          </nav>
          <div className="flex sm:hidden items-center gap-2">
            <Link href="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
            <Link href="/signup"><Button variant="primary" size="sm">Sign Up</Button></Link>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-[48px] sm:text-[64px] font-bold text-[#212529] font-[family-name:var(--font-display)] tracking-[-3px] leading-[1] mb-4">
              Your Events,<br />Perfectly Managed
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#6C757D] mb-8 max-w-xl mx-auto leading-[1.7]">
              Guest lists, QR check-in, smart seating, Aso Ebi sales, and logistics — all in one mobile-first platform built for Nigerian events.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup">
                <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                  Create Event
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="secondary" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-[36px] font-bold text-center text-[#212529] font-[family-name:var(--font-display)] tracking-[-1.5px] mb-12">
              Everything You Need
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="bg-white border-[0.5px] border-[#DEE2E6] rounded-[12px] p-6 hover:border-[#CED4DA] transition-colors">
                    <div className="w-10 h-10 rounded-[8px] bg-[#EEF2FF] flex items-center justify-center mb-4">
                      <Icon size={20} className="text-[#4338CA]" />
                    </div>
                    <h3 className="text-[18px] font-semibold text-[#212529] font-[family-name:var(--font-display)] mb-2">{feature.title}</h3>
                    <p className="text-[14px] text-[#6C757D] leading-[1.6]">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-[36px] font-bold text-[#212529] font-[family-name:var(--font-display)] tracking-[-1.5px] mb-4">
              Ready to Simplify Your Event?
            </h2>
            <p className="text-[16px] text-[#6C757D] mb-8 leading-[1.7]">
              Join event organizers who have replaced WhatsApp, Excel, and paper guest lists with EvenTee.
            </p>
            <Link href="/signup">
              <Button variant="primary" size="lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#DEE2E6] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[14px] text-[#6C757D]">&copy; 2026 EvenTee. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/features" className="text-[13px] text-[#6C757D] hover:text-[#4338CA]">Features</Link>
            <Link href="/pricing" className="text-[13px] text-[#6C757D] hover:text-[#4338CA]">Pricing</Link>
            <Link href="/contact" className="text-[13px] text-[#6C757D] hover:text-[#4338CA]">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
