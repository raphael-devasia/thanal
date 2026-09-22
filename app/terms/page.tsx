import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-3xl font-extrabold text-[#044749] mb-2">Terms & Conditions</h1>
          <p className="text-xs text-slate-500">Last updated: August 8, 2026 • Zynthexion Technologies Pvt. Ltd.</p>
        </div>

        <div className="text-sm space-y-6 text-slate-700">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#044749]">1. Introduction & Pilot Scope</h2>
            <p className="leading-relaxed">
              Welcome to Thanal. By placing a refundable deposit of ₹1,000 INR or registering a Guest Account, you agree to these Terms & Conditions. Thanal operates an operational pilot capped at 40 families in Kannur, Kerala.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#044749]">2. Eldercare Escort Services</h2>
            <p className="leading-relaxed">
              Thanal provides non-emergency OPD hospital escorts, medical appointment accompaniment, vitals audits, and pharmacy delivery. Thanal is not a hospital or emergency room substitute; for acute medical emergencies, local emergency services (108) must be dispatched.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#044749]">3. Pilot Deposit & Subscriptions</h2>
            <p className="leading-relaxed">
              The ₹1,000 INR pilot reservation deposit guarantees your family’s priority onboarding spot for the Kannur launch. Full monthly plan billing (Safety Net, Active Care, or Comprehensive Care) commences only upon active service activation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#044749]">4. Governing Law</h2>
            <p className="leading-relaxed">
              These terms are governed by the laws of India, under the jurisdiction of courts in Kannur, Kerala.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
