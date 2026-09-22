import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#E66323] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Thanal
        </Link>

        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-extrabold text-[#044749] mb-2">Refund & Cancellation Policy</h1>
          <p className="text-xs text-slate-500">Last updated: August 8, 2026 • Zynthexion Technologies Pvt. Ltd.</p>
        </div>

        <div className="text-sm space-y-6 text-slate-700">
          <div className="p-4 rounded-xl bg-orange-50 border border-[#E66323]/30 text-[#E66323] text-xs font-bold flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#E66323] shrink-0" />
            <span>100% Fully Refundable Deposit Guarantee prior to service activation.</span>
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#044749]">1. Waitlist Deposit Refund</h2>
            <p className="leading-relaxed">
              The ₹1,000 INR pilot deposit is 100% fully refundable. If you change your mind for any reason before service activation in Kannur, you may request a complete refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#044749]">2. Refund Processing Time</h2>
            <p className="leading-relaxed">
              Refund requests initiated via WhatsApp support (+91 94960 97611) or email (info@zynthexion.com) will be processed back to your original Razorpay payment method within 5–7 business days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#044749]">3. Monthly Subscription Cancellation</h2>
            <p className="leading-relaxed">
              Once active subscriptions begin, plans may be paused or cancelled with 7 days' advance notice before the next billing cycle.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
