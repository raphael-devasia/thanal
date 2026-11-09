import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Mail, MessageCircle, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F9F8F3] text-[#122617] font-sans">
      {/* Top Header */}
      <header className="border-b border-[#122617]/10 bg-[#122617] text-[#EBF2E8] py-6 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#F5D328] hover:text-[#FFE342] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Rodasi</span>
          </Link>
          <span className="text-xs text-[#EBF2E8]/70">Zynthexion Technologies Pvt. Ltd.</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-10">
        <div className="border-b border-[#122617]/15 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183825]/10 text-[#122617] text-xs font-bold mb-3 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#183825]" />
            <span>Data Protection & Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#122617] tracking-tight mb-2">
            Privacy Policy & Parental Consent
          </h1>
          <p className="text-xs sm:text-sm text-[#2D4533]">
            Last updated: November 2026 • Operated by Zynthexion Technologies Private Limited, Kochi, Kerala.
          </p>
        </div>

        {/* Highlight Callout */}
        <div className="p-5 rounded-2xl bg-[#183825] text-[#EBF2E8] border border-[#F5D328]/30 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-[#F5D328] font-bold text-sm">
            <Lock className="w-4 h-4 text-[#F5D328]" />
            <span>Our Privacy Commitment to Families Across Oceans</span>
          </div>
          <p className="text-xs sm:text-sm text-[#EBF2E8]/85 leading-relaxed">
            Rodasi is built for NRK children living abroad who entrust us with their elderly parents' wellbeing in Kerala. We never sell, monetize, or distribute sensitive health information. All care briefings, audio summaries, and prescription scans are handled strictly for direct care coordination.
          </p>
        </div>

        <div className="space-y-8 text-sm text-[#243B2B] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F5D328] text-xs font-black inline-flex items-center justify-center">1</span>
              <span>Who Holds and Controls Your Data</span>
            </h2>
            <p>
              The data controller responsible for all personal and health information collected through Rodasi is <strong>Zynthexion Technologies Private Limited</strong>, an incorporated company registered in Kerala, India (referred to as "Rodasi", "we", "us", or "our").
            </p>
            <p>
              If you have any questions regarding how your family's data is gathered, encrypted, or processed, you can reach our dedicated data compliance desk directly at <a href="mailto:care@rodasi.com" className="text-[#183825] font-bold underline">care@rodasi.com</a>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F5D328] text-xs font-black inline-flex items-center justify-center">2</span>
              <span>Information We Collect</span>
            </h2>
            <p>We collect only the minimum necessary information required to safely coordinate eldercare:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Overseas Child / Family Member Details:</strong> Full name, country of residence (e.g. UAE, UK, USA, Singapore), WhatsApp phone number, and billing contact email.
              </li>
              <li>
                <strong>Parent Residential Details:</strong> Parents' names, home address in Kochi or surrounding districts, contact phone numbers, and emergency local relatives.
              </li>
              <li>
                <strong>Care & Medical Information:</strong> Name of preferred family doctor or preferred hospital, existing chronic condition history (e.g. hypertension, diabetes, cardiac status), doctor prescription slips, and vital sign logs recorded during buddy checkups (such as blood pressure or blood sugar).
              </li>
              <li>
                <strong>Care Interaction Logs:</strong> 60-second voice briefings, visit summary notes, and photo confirmations taken by the assigned Care Buddy during home visits or hospital appointments.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F5D328] text-xs font-black inline-flex items-center justify-center">3</span>
              <span>Parental Consent Confirmation</span>
            </h2>
            <p>
              Because the child abroad is generally the party initiating registration, <strong>you expressly confirm that your parents in Kerala have given their full and informed consent</strong> to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Receive regular home visits and hospital accompaniment from their dedicated Care Buddy, who is background-checked before their first visit.</li>
              <li>Have basic vital sign readings (such as blood pressure and pulse) recorded for routine wellness monitoring.</li>
              <li>Have visit update photographs, doctor prescription slips, and audio voice briefings shared directly with you over secure WhatsApp communication.</li>
              <li>Store emergency contact and physician contact details within Rodasi's confidential Care Passport.</li>
            </ul>
            <p className="text-xs text-[#2D4533] italic">
              Care Buddies will always introduce themselves in person during the inaugural Welcome Visit, verify parent comfort, and honor parent dignity and preferences at all times.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F5D328] text-xs font-black inline-flex items-center justify-center">4</span>
              <span>How We Use Your Data</span>
            </h2>
            <p>We process collected data solely for the following legitimate care purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Pairing your family with a dedicated Care Buddy in Kochi who is background-checked before their first visit.</li>
              <li>Escorting parents to scheduled doctor consultations and facilitating outpatient clinic registration.</li>
              <li>Checking medications against prescriptions to inform doctors of discrepancies and coordinating doorstep pharmacy refills.</li>
              <li>Transmitting timely voice notes, appointment summaries, and visit photos directly to family members over WhatsApp.</li>
              <li>Dispatching rapid ambulance coordination and notifying family during medical emergencies.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F5D328] text-xs font-black inline-flex items-center justify-center">5</span>
              <span>Data Retention Period</span>
            </h2>
            <p>
              We maintain your family's care records for the active duration of your membership, plus a standard retention window of <strong>90 calendar days</strong> after membership ends.
            </p>
            <p>
              This 90-day window ensures continuity if your family reactivates service or requires previous medical checkup notes. Following the conclusion of 90 days, all sensitive medical slips, prescription images, and audio voice files are permanently and irreversibly purged from our active databases.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F5D328] text-xs font-black inline-flex items-center justify-center">6</span>
              <span>How to Delete Your Data (Right to Erasure)</span>
            </h2>
            <p>
              You maintain full ownership of your family's personal data. You may request the immediate deletion of all parent profiles, medical records, and WhatsApp conversation history at any time.
            </p>
            <p>
              To initiate data deletion:
            </p>
            <div className="p-4 rounded-xl bg-white border border-[#183825]/15 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#183825]">
                <Mail className="w-4 h-4 text-[#183825]" />
                <span>Email Deletion Request:</span>
                <a href="mailto:care@rodasi.com" className="text-[#183825] underline">care@rodasi.com</a>
              </div>
              <div className="flex items-center gap-2 font-bold text-[#183825]">
                <MessageCircle className="w-4 h-4 text-[#183825]" />
                <span>WhatsApp Deletion Request:</span>
                <a href="https://wa.me/919496097611" className="text-[#183825] underline">+91 94960 97611</a>
              </div>
              <p className="text-[#2D4533] pt-1">
                All deletion requests are verified and fulfilled within 7 business days, with written confirmation delivered to your WhatsApp number.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F5D328] text-xs font-black inline-flex items-center justify-center">7</span>
              <span>Grievance Officer & Complaints Contact</span>
            </h2>
            <p>
              In compliance with the Information Technology Act, 2000, and the Digital Personal Data Protection (DPDP) standards of India, the designated Grievance Officer for Rodasi is:
            </p>
            <div className="p-4 rounded-xl bg-[#183825]/5 border border-[#183825]/15 space-y-1.5 text-xs">
              <p className="font-bold text-[#122617]">Care Operations Grievance Directorate</p>
              <p className="text-[#2D4533]">Zynthexion Technologies Private Limited</p>
              <p className="text-[#2D4533]">Kochi, Ernakulam District, Kerala, India</p>
              <p className="text-[#2D4533]">
                Direct Grievance Email: <a href="mailto:grievance@zynthexion.com" className="font-bold text-[#183825] underline">grievance@zynthexion.com</a>
              </p>
              <p className="text-[#2D4533]">
                General Support: <a href="mailto:care@rodasi.com" className="font-bold text-[#183825] underline">care@rodasi.com</a>
              </p>
            </div>
          </section>
        </div>

        {/* Footer Link */}
        <div className="pt-8 border-t border-[#122617]/15 flex items-center justify-between text-xs text-[#2D4533]">
          <Link href="/" className="font-bold text-[#183825] hover:underline flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Rodasi Home</span>
          </Link>
          <span>Rodasi • A Zynthexion Product</span>
        </div>
      </main>
    </div>
  );
}
