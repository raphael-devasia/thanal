import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="w-4 h-4 text-[#183825]" />
            <span>Membership Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#122617] tracking-tight mb-2">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#2D4533]">
            Last updated: November 2026 • Governed by the laws of India under jurisdiction of courts in Calicut, Kerala.
          </p>
        </div>

        <div className="space-y-8 text-sm text-[#243B2B] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">1</span>
              <span>Scope of Service & Care Buddy Role</span>
            </h2>
            <p>
              Greymatters (a product of Zynthexion Technologies Private Limited, Calicut) provides personalized eldercare concierge and accompaniment services in Kochi, Kerala. Services include doctor visit accompaniment, hospital outpatient department (OPD) queue navigation, vital signs recording (blood pressure, pulse), checking medicines against prescriptions, coordinating doorstep pharmacy refills, and delivering real-time WhatsApp updates to families abroad.
            </p>
            <p>
              <strong>Non-Emergency Disclaimer:</strong> Greymatters is an elder assistance and hospital accompaniment service. Greymatters is not a licensed hospital, ambulance service, or acute emergency room. If your parents can't call, we call 108, and your Care Buddy goes to the hospital. We keep you updated until you arrive or someone you name takes over.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">2</span>
              <span>Zero Upfront Online Payment & Enrollment</span>
            </h2>
            <p>
              Submitting an enrollment request on Greymatters requires ₹0 payment today. Registration initiates a complimentary consultation call with your Care Buddy and coordinator on WhatsApp to review your parents' location, routine, and medical needs before any formal billing occurs.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">3</span>
              <span>No Lock-In, Cancellation & Refund Policy</span>
            </h2>
            <p>
              Start with a single month. No lock-in. Cancel anytime with <strong>15 days notice</strong>.
            </p>
            <p>
              Monthly plans: no refund for the current month, and you stop at the end of it. Quarterly prepaid plans: unused full months are refunded pro-rata within 5 to 7 business days. No cancellation fees.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">4</span>
              <span>Plan Pausing Policy</span>
            </h2>
            <p>
              Families traveling overseas for family visits or facing prolonged hospitalization may pause their active membership. A pause request requires <strong>7 days advance notice</strong> and can range from <strong>14 to 60 calendar days</strong>. All membership billing and visit allocations are completely frozen during the pause period and resume upon the agreed date.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">5</span>
              <span>Pricing, Taxes, and What is Not Included</span>
            </h2>
            <p>
              Membership plan prices cover the dedicated Care Buddy's professional time, coordination, and regular visits. Membership fees are exclusive of applicable 18% GST (added at billing).
            </p>
            <div className="p-4 rounded-xl bg-white border border-[#183825]/15 space-y-1.5 text-xs">
              <p className="font-bold text-[#183825]">What is Not Included in the Monthly Membership Fee:</p>
              <ul className="list-disc pl-5 space-y-1 text-[#2D4533]">
                <li>Doctor and specialist consultation fees.</li>
                <li>Hospital admission, diagnostic lab tests, ECG, and imaging fees.</li>
                <li>Prescription medications and medical supplies.</li>
                <li>Taxi transportation fares (billed directly at partner rate actuals, buddy rides in the same vehicle).</li>
                <li>Buddy overtime beyond the included plan hours (billed at ₹350/hour actuals in 30-minute blocks, confirmed beforehand).</li>
              </ul>
            </div>
            <p className="text-xs text-[#2D4533]">
              Greymatters maintains a strict zero-commission policy: we never accept referral fees or kickbacks from hospitals, pharmacies, or diagnostic labs. Families pay direct actuals.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">6</span>
              <span>Parental Dignity & Safety</span>
            </h2>
            <p>
              Every Care Buddy is background-checked before their first visit. Care Buddies operate with total respect for parental autonomy, religious preferences, and personal dignity. Greymatters reserves the right to suspend services if buddy safety is compromised.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">7</span>
              <span>Governing Law and Dispute Resolution</span>
            </h2>
            <p>
              These terms are governed by the laws of India. Any legal dispute or claim arising out of or related to Greymatters services will be subject to the exclusive jurisdiction of the competent courts in Calicut, Kerala.
            </p>
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
