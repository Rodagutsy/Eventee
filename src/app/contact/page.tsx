"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, MessageCircle, Smartphone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-[#DEE2E6] z-40">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/"><span className="text-[20px] font-bold text-[#4338CA] font-[family-name:var(--font-display)]">EvenTee</span></Link>
          <nav className="hidden sm:flex items-center gap-6">
            <Link href="/features" className="text-[13px] text-[#495057] hover:text-[#4338CA]">Features</Link>
            <Link href="/pricing" className="text-[13px] text-[#495057] hover:text-[#4338CA]">Pricing</Link>
            <Link href="/contact" className="text-[13px] text-[#4338CA] font-medium">Contact</Link>
            <Link href="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
            <Link href="/signup"><Button variant="primary" size="sm">Get Started</Button></Link>
          </nav>
          <Link href="/signup" className="sm:hidden"><Button variant="primary" size="sm">Sign Up</Button></Link>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-[36px] sm:text-[48px] font-bold text-[#212529] font-[family-name:var(--font-display)] tracking-[-2px] mb-4 text-center">
            Get in Touch
          </h1>
          <p className="text-[16px] text-[#6C757D] text-center mb-12 leading-[1.7]">
            Have a question? We are here to help.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <div className="border border-[#DEE2E6] rounded-[12px] p-4 text-center">
              <Mail size={20} className="mx-auto mb-2 text-[#4338CA]" />
              <p className="text-[13px] font-medium text-[#343A40]">Email</p>
              <p className="text-[12px] text-[#6C757D]">hello@eventee.ng</p>
            </div>
            <div className="border border-[#DEE2E6] rounded-[12px] p-4 text-center">
              <MessageCircle size={20} className="mx-auto mb-2 text-[#4338CA]" />
              <p className="text-[13px] font-medium text-[#343A40]">WhatsApp</p>
              <p className="text-[12px] text-[#6C757D]">+234 800 EVENTEE</p>
            </div>
            <div className="border border-[#DEE2E6] rounded-[12px] p-4 text-center">
              <Smartphone size={20} className="mx-auto mb-2 text-[#4338CA]" />
              <p className="text-[13px] font-medium text-[#343A40]">Phone</p>
              <p className="text-[12px] text-[#6C757D]">+234 800 383 6833</p>
            </div>
          </div>

          {submitted ? (
            <div className="border border-[#BBE8CC] bg-[#EAF7EF] rounded-[12px] p-8 text-center">
              <Send size={32} className="mx-auto mb-3 text-[#22C55E]" />
              <h2 className="text-[20px] font-semibold text-[#166534] font-[family-name:var(--font-display)]">Message Sent!</h2>
              <p className="text-[14px] text-[#166534] mt-1">We will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="Your name" required />
                <Input label="Email" type="email" placeholder="you@example.com" required />
              </div>
              <Input label="Subject" placeholder="How can we help?" required />
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-[#343A40] tracking-[0.2px]">Message</label>
                <textarea
                  className="w-full text-[14px] px-3 py-[9px] rounded-[8px] border-[0.5px] border-[#DEE2E6] bg-white focus:outline-none focus:border-[#4338CA] focus:bg-[#EEF2FF] focus:shadow-[0_0_0_3px_rgba(67,56,202,0.12)] transition-all duration-150 min-h-[120px] resize-y placeholder:text-[#ADB5BD]"
                  placeholder="Tell us about your event..."
                  required
                  rows={4}
                />
              </div>
              <Button variant="primary" size="lg" type="submit">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
