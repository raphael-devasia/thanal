import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-extrabold text-[#044749] mb-2">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Last updated: August 8, 2026 • Zynthexion Technologies Pvt. Ltd.</p>
        </div>

        <div className="text-sm space-y-6 text-slate-700">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#044749]">1. Data Collection</h2>
            <p className="leading-relaxed">
              We collect customer name, WhatsApp contact details, NRK residence location, parent's Kerala district, and medical audit notes necessary to coordinate care services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#044749]">2. Health Records (EMR) & Security</h2>
            <p className="leading-relaxed">
              All parent medical records and vitals audits stored in the Digital EMR Vault are encrypted using 256-bit AES encryption. We never sell or share patient data with third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#044749]">3. Communication & WhatsApp Updates</h2>
            <p className="leading-relaxed">
              By providing your WhatsApp number, you consent to receive direct care coordination updates, escort appointment reports, and deposit receipts from Thanal.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
