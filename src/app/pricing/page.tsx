"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "₦0",
    description: "For testing and small events",
    features: ["1 active event", "Up to 50 guests", "Basic RSVP tracking", "QR check-in (online only)"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Starter",
    price: "₦5,000",
    description: "Per event — for growing events",
    features: ["1 event", "Up to 500 guests", "CSV import & export", "QR check-in with offline mode", "Seating editor", "Email & SMS messaging"],
    cta: "Choose Starter",
    popular: true,
  },
  {
    name: "Premium",
    price: "₦15,000",
    description: "Per event — full features",
    features: ["1 event", "Up to 2,000 guests", "Everything in Starter", "Aso Ebi commerce with Paystack", "Logistics tracking", "WhatsApp messaging", "Team members (planners + security)", "Priority support"],
    cta: "Choose Premium",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-[#DEE2E6] z-40">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/"><span className="text-[20px] font-bold text-[#4338CA] font-[family-name:var(--font-display)]">EvenTee</span></Link>
          <nav className="hidden sm:flex items-center gap-6">
            <Link href="/features" className="text-[13px] text-[#495057] hover:text-[#4338CA]">Features</Link>
            <Link href="/pricing" className="text-[13px] text-[#4338CA] font-medium">Pricing</Link>
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
            Simple Pricing
          </h1>
          <p className="text-[16px] text-[#6C757D] text-center max-w-2xl mx-auto mb-12 leading-[1.7]">
            Pay per event. No hidden fees. Cancel anytime.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-[12px] p-6 flex flex-col ${
                  plan.popular
                    ? "border-[#4338CA] bg-[#EEF2FF]"
                    : "border-[#DEE2E6] bg-white"
                }`}
              >
                {plan.popular && (
                  <span className="text-[11px] font-semibold text-[#4338CA] bg-white px-2 py-1 rounded-full self-start mb-3">
                    Most Popular
                  </span>
                )}
                <h2 className="text-[20px] font-semibold text-[#212529] font-[family-name:var(--font-display)]">{plan.name}</h2>
                <p className="text-[36px] font-bold text-[#212529] font-[family-name:var(--font-display)] mt-2">{plan.price}</p>
                <p className="text-[13px] text-[#6C757D] mt-1 mb-6">{plan.description}</p>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-[13px] text-[#495057]">
                      <Check size={14} className="text-[#22C55E] mt-0.5 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant={plan.popular ? "primary" : "secondary"} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
