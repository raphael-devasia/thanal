import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Mail, MessageCircle, FileText } from 'lucide-react';
import BrandName from '@/components/BrandName';

export default function PrivacyPage() {
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
            <span>Return to <BrandName /></span>
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
            Last updated: November 2026 • Operated by Zynthexion Technologies Private Limited, Calicut, Kerala.
          </p>
        </div>

        {/* Highlight Callout */}
        <div className="p-5 rounded-2xl bg-[#183825] text-[#EBF2E8] border border-[#F1E5C6]/30 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#F1E5C6] font-bold text-sm">
            <Lock className="w-4 h-4 text-[#F1E5C6]" />
            <span>Our Privacy Commitment to Families Across Oceans</span>
          </div>
          <p className="text-xs sm:text-sm text-[#EBF2E8]/85 leading-relaxed">
            Greymatters is built for overseas families who entrust us with their elderly parents in Kerala. We collect only what is needed, protect it carefully, and never sell or monetize personal or health information.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#EBF2E8]/90">
            <div className="p-3 rounded-xl bg-[#122617]/70 border border-[#F1E5C6]/20">
              <span className="font-bold text-[#F1E5C6] block mb-1">Why We Collect Data</span>
              To send sample WhatsApp updates, answer your questions, and coordinate verified Care Buddy visits.
            </div>
            <div className="p-3 rounded-xl bg-[#122617]/70 border border-[#F1E5C6]/20">
              <span className="font-bold text-[#F1E5C6] block mb-1">Who Sees It</span>
              Only the Greymatters care coordination team behind login. Zero contact details or health data in URL links or email alerts.
            </div>
            <div className="p-3 rounded-xl bg-[#122617]/70 border border-[#F1E5C6]/20">
              <span className="font-bold text-[#F1E5C6] block mb-1">How to Delete It</span>
              Message "Delete my data" on WhatsApp or email info@zynthexion.com to purge your records within 24 hours.
            </div>
            <div className="p-3 rounded-xl bg-[#122617]/70 border border-[#F1E5C6]/20">
              <span className="font-bold text-[#F1E5C6] block mb-1">Who to Contact</span>
              Email: info@zynthexion.com | WhatsApp: +91 94960 97611 | Zynthexion Technologies, Calicut.
            </div>
          </div>
        </div>

        <div className="space-y-8 text-sm text-[#243B2B] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">1</span>
              <span>Who Holds and Controls Your Data</span>
            </h2>
            <p>
              The data controller responsible for all personal information collected through Greymatters is <strong>Zynthexion Technologies Private Limited</strong>, an incorporated company registered in Kerala, India (referred to as "Greymatters", "we", "us", or "our").
            </p>
            <p>
              If you have any questions regarding how your family's data is gathered, stored, or processed, you can reach our dedicated team directly at <a href="mailto:info@zynthexion.com" className="text-[#183825] font-bold underline">info@zynthexion.com</a>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">2</span>
              <span>What We Collect and Why</span>
            </h2>
            <p>
              We believe in collecting only what is strictly necessary at each stage of your journey:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>At Initial Sample & Inquiry Stage (Now):</strong> We collect only your <strong>Name</strong>, <strong>WhatsApp phone number</strong>, <strong>Country</strong>, <strong>source</strong>, and <strong>timestamp</strong>. No health notes, medical records, or parents' names are asked or stored at this stage. We collect this solely to answer your questions and send you real sample WhatsApp updates and voice notes.
              </li>
              <li>
                <strong>Team Email Alerts:</strong> When you submit a sample request, automated team email alerts receive only your lead ID, first name, and country. Full contact details remain strictly in the admin portal behind authenticated login.
              </li>
              <li>
                <strong>WhatsApp Links:</strong> Prefilled WhatsApp links on our website contain no personal or health details in the URL.
              </li>
              <li>
                <strong>At Formal Sign-up (Later):</strong> Only once you choose to start a membership do we collect parent home address, local emergency contacts, and doctor details needed to perform home visits safely.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">3</span>
              <span>Consent at Two Stages</span>
            </h2>
            <p>
              We keep parental consent clear and separate from introductory inquiries:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-white border border-[#183825]/15 space-y-2">
                <span className="text-xs font-bold text-[#183825] uppercase tracking-wider block">Stage 1: Sample Form (Now)</span>
                <p className="text-xs text-[#2D4533] leading-relaxed">
                  You provide only your name, country, and WhatsApp number, with a single box: <strong>"OK to message me on WhatsApp."</strong> No parent consent is asked here. Your parents do not need to do anything yet.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#183825]/15 space-y-2">
                <span className="text-xs font-bold text-[#183825] uppercase tracking-wider block">Stage 2: Sign-up & First Visit (Later)</span>
                <p className="text-xs text-[#2D4533] leading-relaxed">
                  When you activate a care plan, you confirm: <em>"I confirm my parents know about this service and are happy for us to visit."</em> Then we speak with them directly, in Malayalam, before their first visit, with signed or recorded consent.
                </p>
              </div>
            </div>
            <p className="text-xs text-[#2D4533] pt-1">
              Every Care Buddy is background-checked before their first visit, and we always introduce ourselves respectfully to verify parent comfort and dignity.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">4</span>
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
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">5</span>
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
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">6</span>
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
                <a href="mailto:info@zynthexion.com" className="text-[#183825] underline">info@zynthexion.com</a>
              </div>
              <div className="flex items-center gap-2 font-bold text-[#183825]">
                <MessageCircle className="w-4 h-4 text-[#183825]" />
                <span>WhatsApp Deletion Request:</span>
                <a href="https://wa.me/919496097611" className="text-[#183825] underline">+91 94960 97611</a>
              </div>
              <p className="text-[#2D4533] pt-1">
                All deletion requests are verified and fulfilled within 24 hours, with written confirmation delivered to your WhatsApp number.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-extrabold text-[#122617] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#183825] text-[#F1E5C6] text-xs font-black inline-flex items-center justify-center">7</span>
              <span>Grievance Officer & Complaints Contact</span>
            </h2>
            <p>
              In compliance with the Information Technology Act, 2000, and the Digital Personal Data Protection (DPDP) standards of India, the designated Grievance Officer for Greymatters is:
            </p>
            <div className="p-4 rounded-xl bg-[#183825]/5 border border-[#183825]/15 space-y-1.5 text-xs">
              <p className="font-bold text-[#122617]">Care Operations Grievance Directorate</p>
              <p className="text-[#2D4533]">Zynthexion Technologies Private Limited</p>
              <p className="text-[#2D4533]">Calicut, Kerala, India</p>
              <p className="text-[#2D4533]">
                Direct Grievance Email: <a href="mailto:grievance@zynthexion.com" className="font-bold text-[#183825] underline">grievance@zynthexion.com</a>
              </p>
              <p className="text-[#2D4533]">
                General Support: <a href="mailto:info@zynthexion.com" className="font-bold text-[#183825] underline">info@zynthexion.com</a>
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
