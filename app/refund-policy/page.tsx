import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CheckCircle2, RotateCcw, PauseCircle, Clock } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F9F8F3] text-[#122617] font-sans">
      {/* Top Header */}
      <header className="border-b border-[#122617]/10 bg-[#122617] text-[#EBF2E8] py-6 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#F1E5C6] hover:text-[#F7EED8] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Greymatters</span>
          </Link>
          <span className="text-xs text-[#EBF2E8]/70">Zynthexion Technologies Pvt. Ltd.</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-10">
        <div className="border-b border-[#122617]/15 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183825]/10 text-[#122617] text-xs font-bold mb-3 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#183825]" />
            <span>Fair Billing Guarantees</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#122617] tracking-tight mb-2">
            Refund, Pause & Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#2D4533]">
            Last updated: November 2026 • Clear, transparent commercial rules for families abroad.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#183825] text-[#EBF2E8] border border-[#F1E5C6]/30 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#F1E5C6]/15 border border-[#F1E5C6]/30 flex items-center justify-center text-[#F1E5C6] mb-1">
              <RotateCcw className="w-4 h-4 text-[#F1E5C6]" />
            </div>
            <h3 className="font-bold text-sm text-[#F1E5C6]">Pro-Rata Full Refund</h3>
            <p className="text-xs text-[#EBF2E8]/80 leading-relaxed">
              Unused full months refunded with 15-day notice. Zero penalty fees.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#183825] text-[#EBF2E8] border border-[#F1E5C6]/30 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#F1E5C6]/15 border border-[#F1E5C6]/30 flex items-center justify-center text-[#F1E5C6] mb-1">
              <PauseCircle className="w-4 h-4 text-[#F1E5C6]" />
            </div>
            <h3 className="font-bold text-sm text-[#F1E5C6]">Flexible Plan Pauses</h3>
            <p className="text-xs text-[#EBF2E8]/80 leading-relaxed">
              Pause for 14 to 60 days for family trips or hospital stays with 7-day notice.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#183825] text-[#EBF2E8] border border-[#F1E5C6]/30 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#F1E5C6]/15 border border-[#F1E5C6]/30 flex items-center justify-center text-[#F1E5C6] mb-1">
              <Clock className="w-4 h-4 text-[#F1E5C6]" />
            </div>
            <h3 className="font-bold text-sm text-[#F1E5C6]">5-7 Day Processing</h3>
            <p className="text-xs text-[#EBF2E8]/80 leading-relaxed">
              Direct refund back to your original payment channel via Razorpay.
            </p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-[#243B2B] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">1</span>
              <span>Zero Upfront Payment & Free Consultation</span>
            </h2>
            <p>
              Registering on Greymatters costs ₹0 today. There are no mandatory upfront deposits or reservation fees. You only begin membership billing after your Care Buddy and coordinator conduct a thorough onboarding discussion on WhatsApp and you approve the care plan.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">2</span>
              <span>3-Month Minimum Commitment & Pro-Rata Refund</span>
            </h2>
            <p>
              Eldercare requires familiarity, trust, and continuity. To ensure your parents receive consistent care from a dedicated buddy rather than rotating faces, all Greymatters care memberships begin with an initial <strong>3-month minimum commitment</strong>.
            </p>
            <p>
              If your family circumstances change or you wish to withdraw for any reason:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide written notice of <strong>15 days</strong> via WhatsApp or email.</li>
              <li>You will receive a <strong>100% pro-rata refund for all unused full calendar months</strong>.</li>
              <li>There are no hidden administrative charges, cancellation penalties, or exit fees.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">3</span>
              <span>Plan Pausing Rules (Family Travel & Hospital Stays)</span>
            </h2>
            <p>
              We understand that families frequently travel or face unexpected health events. You do not need to cancel your membership if care needs to be temporarily suspended:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Eligible Reasons:</strong> Extended family vacations abroad, parents traveling outside Kerala, or prolonged inpatient hospital stays.
              </li>
              <li>
                <strong>Notice Required:</strong> 7 days advance notice before the requested pause start date.
              </li>
              <li>
                <strong>Allowed Duration:</strong> Pause periods can range from 14 calendar days up to 60 calendar days per membership year.
              </li>
              <li>
                <strong>Billing Freeze:</strong> Membership billing and visit countdowns are completely frozen during the active pause window and reactivate seamlessly on your specified resume date.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">4</span>
              <span>Refund Processing & Timeline</span>
            </h2>
            <p>
              Refund requests can be initiated at any time by messaging our Care Operations desk:
            </p>
            <div className="p-4 rounded-xl bg-white border border-[#183825]/15 space-y-1.5 text-xs">
              <p className="font-bold text-[#183825]">How to Submit a Refund or Pause Request:</p>
              <p>• Official WhatsApp Support: <a href="https://wa.me/919496097611" className="font-bold text-[#183825] underline">+91 94960 97611</a></p>
              <p>• Email Support: <a href="mailto:care@greymatters.com" className="font-bold text-[#183825] underline">care@greymatters.com</a></p>
              <p className="text-[#2D4533] pt-1">
                Approved refunds are processed within <strong>5 to 7 business days</strong> back to the original bank account, debit/credit card, or international payment method used during billing.
              </p>
            </div>
          </section>
        </div>

        {/* Footer Link */}
        <div className="pt-8 border-t border-[#122617]/15 flex items-center justify-between text-xs text-[#2D4533]">
          <Link href="/" className="font-bold text-[#183825] hover:underline flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Greymatters Home</span>
          </Link>
          <span>Greymatters • A Zynthexion Product</span>
        </div>
      </main>
    </div>
  );
}
