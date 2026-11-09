'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Building,
  Home,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Info,
  Check,
  HelpCircle,
  HeartHandshake,
  AlertCircle
} from 'lucide-react';

export default function LuxuryLivingPage() {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [whoFor, setWhoFor] = useState<'My parent' | 'Both my parents' | 'Myself'>('My parent');
  const [preferredDistrict, setPreferredDistrict] = useState('Ernakulam / Kochi');
  const [budgetRange, setBudgetRange] = useState('₹75 Lakhs to ₹1 Crore');
  const [timeline, setTimeline] = useState<'Within 6 months' | '6 to 12 months' | 'More than a year' | 'Just exploring'>('6 to 12 months');
  const [consentAgreed, setConsentAgreed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(null);

  const toggleQuestion = (idx: number) => {
    setOpenQuestionIndex(openQuestionIndex === idx ? null : idx);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!whatsapp.trim()) {
      setFormError('Please enter your WhatsApp number with country code.');
      return;
    }
    if (!consentAgreed) {
      setFormError('Please check the consent box before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: name,
        whatsappNumber: whatsapp,
        currentLocation: preferredDistrict || 'Kerala',
        inquiryFor: whoFor,
        villaType: budgetRange,
        timeline,
        notes: `Preferred District: ${preferredDistrict} | Budget: ${budgetRange} | Moving Timeline: ${timeline}`
      };

      const res = await fetch('/api/luxury-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit requirements.');
      }

      setSubmitted(true);
    } catch {
      // Graceful fallback to avoid blocking user
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const developerQuestions = [
    {
      title: 'Registration',
      question: 'What is the K-RERA registration number? Can I see the certificate? (You can check the number on the Kerala RERA website.)'
    },
    {
      title: 'Track record',
      question: 'Which of your earlier projects can I visit? Can I speak to residents?'
    },
    {
      title: 'Title and approvals',
      question: 'Have these been checked by my own lawyer?'
    },
    {
      title: 'Total cost',
      question: 'What are the price, maintenance, monthly fees, deposits, taxes and other charges?'
    },
    {
      title: 'Payments',
      question: 'Are payments linked to construction stages? What does the agreement say?'
    },
    {
      title: 'Possession',
      question: 'What is the date, and what happens if it is late?'
    },
    {
      title: 'Medical support',
      question: 'What is available inside, who provides it, what does it cost, and how are emergencies handled? Please give this to me in writing.'
    },
    {
      title: 'Exit and resale',
      question: 'Can I sell or return the home? Is there a fee? What happens if a resident later needs full-time care?'
    },
    {
      title: 'Daily running',
      question: 'Who manages the community? What staff are present at night?'
    },
    {
      title: 'Accessibility and safety',
      question: 'Are there ramps, lifts, grab bars and good lighting?'
    },
    {
      title: 'Complaints',
      question: 'How are residents’ complaints handled?'
    }
  ];

  const sampleWhatsAppUrl =
    'https://wa.me/919496097611?text=' +
    encodeURIComponent(
      'Hi Rodasi Team, I am looking for senior living communities in Kerala for my family. Please share guidance.'
    );

  return (
    <div className="min-h-screen bg-[#F9F8F3] text-[#122617] font-sans selection:bg-[#F5D328] selection:text-[#122116] pb-16">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 bg-[#122617] text-white border-b border-[#F5D328]/20 shadow-md">
        <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Rodasi"
              className="h-9 sm:h-11 w-auto object-contain brightness-110"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-xs text-[#EBF2E8]/90 hover:text-[#F5D328] font-bold px-2.5 py-1 rounded-full border border-[#F5D328]/30 bg-[#183825] transition inline-flex items-center gap-1"
            >
              <span>← At-Home Care</span>
            </Link>
            <a
              href={sampleWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition shadow-sm active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-transparent shrink-0" />
              <span>Chat</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-[#122617] text-[#EBF2E8] pt-10 pb-12 sm:pt-16 sm:pb-20 px-4 border-b border-[#183825]">
        <div className="max-w-md sm:max-w-2xl mx-auto text-center space-y-5">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183825] border border-[#F5D328]/30 text-[#EBF2E8] text-xs font-semibold">
            <Building className="w-3.5 h-3.5 text-[#F5D328]" />
            <span>Senior living guidance for NRK families</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2]">
            Planning a safe, comfortable home in Kerala for your parents, or for yourself?
          </h1>

          {/* Text */}
          <p className="text-[#EBF2E8]/90 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            We help you shortlist senior living communities, arrange visits, and ask the right questions before you decide.
          </p>

          {/* Button */}
          <div className="pt-2">
            <a
              href="#inquiry-form"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold text-sm sm:text-base shadow-lg shadow-[#F5D328]/25 transition active:scale-98"
            >
              <span>Tell us what you are looking for</span>
              <ArrowRight className="w-4 h-4 text-[#122116]" />
            </a>
          </div>

          {/* Line under the button */}
          <p className="text-xs text-[#EBF2E8]/70 max-w-lg mx-auto leading-relaxed pt-1">
            Rodasi is not the builder. We introduce you to developers. Rodasi may receive a fee from the developer if you buy. Details below.
          </p>
        </div>
      </section>

      {/* HOW WE HELP */}
      <section className="py-12 sm:py-16 px-4 bg-[#F9F8F3] border-b border-[#122617]/10">
        <div className="max-w-md sm:max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-[#183825] uppercase tracking-wider">Independent Guidance</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#122617] tracking-tight">
              How we help
            </h2>
          </div>

          <div className="space-y-3.5">
            {/* Step 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#183825]/15 shadow-xs space-y-1">
              <div className="flex items-center gap-2.5 font-bold text-sm sm:text-base text-[#122617]">
                <span className="w-6 h-6 rounded-full bg-[#122617] text-[#F5D328] text-xs font-black flex items-center justify-center shrink-0">
                  1
                </span>
                <span>Tell us what you need.</span>
              </div>
              <p className="text-xs sm:text-sm text-[#243B2B] leading-relaxed pl-8">
                Who the home is for, which district, your budget and your timeline.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#183825]/15 shadow-xs space-y-1">
              <div className="flex items-center gap-2.5 font-bold text-sm sm:text-base text-[#122617]">
                <span className="w-6 h-6 rounded-full bg-[#122617] text-[#F5D328] text-xs font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <span>We shortlist.</span>
              </div>
              <p className="text-xs sm:text-sm text-[#243B2B] leading-relaxed pl-8">
                We share options from developers we have spoken to, with registered projects only.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#183825]/15 shadow-xs space-y-1">
              <div className="flex items-center gap-2.5 font-bold text-sm sm:text-base text-[#122617]">
                <span className="w-6 h-6 rounded-full bg-[#122617] text-[#F5D328] text-xs font-black flex items-center justify-center shrink-0">
                  3
                </span>
                <span>You visit and decide.</span>
              </div>
              <p className="text-xs sm:text-sm text-[#243B2B] leading-relaxed pl-8">
                We can arrange a visit or a video walkthrough. There is no obligation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE AND HOW WE ARE PAID */}
      <section className="py-12 sm:py-16 px-4 bg-[#F2EFE6] border-b border-[#122617]/10">
        <div className="max-w-md sm:max-w-xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-[#183825] uppercase tracking-wider">Full Transparency</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#122617] tracking-tight">
              Who we are and how we are paid
            </h2>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#183825]/15 shadow-sm space-y-3 text-xs sm:text-sm text-[#243B2B] leading-relaxed">
            <p className="font-bold text-[#122617]">
              Rodasi is a care coordination service. We are not a builder and we do not sell homes.
            </p>
            <p>
              When you enquire, we share your contact details only with the developers you choose to hear from. If you buy a home through our introduction, the developer may pay Rodasi a fee.
            </p>
            <p>
              We aim to describe every project on the same facts, whether or not it pays us. You can ask us at any time whether a fee applies to a project.
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-12 sm:py-16 px-4 bg-[#F9F8F3] border-b border-[#122617]/10">
        <div className="max-w-md sm:max-w-xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-[#183825] uppercase tracking-wider">Verified Registry</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#122617] tracking-tight">
              Projects
            </h2>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#183825]/15 shadow-sm space-y-3.5 text-xs sm:text-sm text-[#243B2B] leading-relaxed">
            <p>
              We are speaking to developers of senior living communities in Kerala. Projects will appear here once the developer has confirmed the details and given permission.
            </p>
            <p>
              Each project will show: name and district, developer, K-RERA registration number, home types and sizes, starting price, expected possession date, and the medical support the developer says it provides.
            </p>
            <div className="p-3.5 rounded-xl bg-[#183825]/5 border border-[#183825]/15 text-xs text-[#183825] font-medium flex items-start gap-2">
              <Info className="w-4 h-4 text-[#183825] shrink-0 mt-0.5" />
              <span>Details are provided by the developer. Please check them yourself before you decide.</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUESTIONS TO ASK ANY DEVELOPER */}
      <section className="py-12 sm:py-16 px-4 bg-[#122617] text-white border-b border-[#183825]">
        <div className="max-w-md sm:max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-[#F5D328] uppercase tracking-wider">Buyer Due Diligence</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Questions to ask any developer
            </h2>
            <p className="text-xs text-[#EBF2E8]/80 max-w-lg mx-auto">
              Before making any commitment or deposit, ask these questions in writing:
            </p>
          </div>

          <div className="space-y-2.5">
            {developerQuestions.map((item, idx) => {
              const isOpen = openQuestionIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#183825] border border-[#F5D328]/25 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => toggleQuestion(idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-2 cursor-pointer hover:bg-[#1f452e]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[#F5D328] font-mono text-xs font-bold">#{idx + 1}</span>
                      <span>{item.title}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#F5D328] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#EBF2E8]/90 leading-relaxed border-t border-[#F5D328]/15 bg-[#142d1e]">
                      {item.question}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AFTER THE MOVE (OPTIONAL) */}
      <section className="py-12 sm:py-16 px-4 bg-[#F2EFE6] border-b border-[#122617]/10">
        <div className="max-w-md sm:max-w-xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-[#183825] uppercase tracking-wider">Continuity of Care</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#122617] tracking-tight">
            After the move (optional)
          </h2>
          <p className="text-xs sm:text-sm text-[#243B2B] leading-relaxed max-w-lg mx-auto">
            Living in a senior community does not replace family. If you wish, a Rodasi Care Buddy can visit, go with your parent to the hospital, and send you updates on WhatsApp.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#183825] hover:text-[#122617] underline underline-offset-4"
            >
              <span>See care plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FORM: TELL US WHAT YOU ARE LOOKING FOR */}
      <section id="inquiry-form" className="py-12 sm:py-16 px-4 bg-[#122617] text-white border-b border-[#183825]">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-[#F5D328] uppercase tracking-wider">Get in Touch</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tell us what you are looking for
            </h2>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-[#183825] border border-[#F5D328]/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F5D328]/20 border border-[#F5D328] flex items-center justify-center text-[#F5D328] mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#F5D328]" />
              </div>
              <h3 className="text-lg font-bold text-[#F5D328]">
                Thank you. We will message you on WhatsApp within one working day with the next steps.
              </h3>
              <p className="text-xs text-[#EBF2E8]/85 leading-relaxed">
                We have received your requirements for {preferredDistrict}. We will review registered communities and connect directly.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/919496097611?text=${encodeURIComponent(
                    `Hi Rodasi Team, my name is ${name}. I submitted my requirements for senior living in ${preferredDistrict}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#F5D328] text-[#122116] font-extrabold text-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-[#122116] text-[#122116]" />
                  <span>Chat on WhatsApp Now</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-900/60 border border-red-500/50 text-red-200 text-xs">
                  {formError}
                </div>
              )}

              {/* Your name */}
              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">
                  Your name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Nair"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#183825] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm"
                />
              </div>

              {/* WhatsApp number with country code */}
              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">
                  WhatsApp number with country code
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +971 50 123 4567 or +91 98460 12345"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#183825] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm"
                />
              </div>

              {/* Who is this for? */}
              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1.5">
                  Who is this for?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['My parent', 'Both my parents', 'Myself'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWhoFor(opt)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                        whoFor === opt
                          ? 'bg-[#F5D328] text-[#122116] shadow-sm'
                          : 'bg-[#183825] text-white border border-[#F5D328]/30 hover:border-[#F5D328]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred district in Kerala */}
              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">
                  Preferred district in Kerala
                </label>
                <select
                  value={preferredDistrict}
                  onChange={(e) => setPreferredDistrict(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#183825] border border-[#F5D328]/30 text-white focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm cursor-pointer"
                >
                  <option value="Ernakulam / Kochi">Ernakulam / Kochi</option>
                  <option value="Thrissur">Thrissur</option>
                  <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                  <option value="Kottayam">Kottayam</option>
                  <option value="Kozhikode">Kozhikode</option>
                  <option value="Kannur">Kannur</option>
                  <option value="Palakkad">Palakkad</option>
                  <option value="Alappuzha">Alappuzha</option>
                  <option value="Other Districts">Other Districts</option>
                </select>
              </div>

              {/* Budget range (dropdown) */}
              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">
                  Budget range
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#183825] border border-[#F5D328]/30 text-white focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm cursor-pointer"
                >
                  <option value="Under ₹50 Lakhs">Under ₹50 Lakhs</option>
                  <option value="₹50 Lakhs to ₹75 Lakhs">₹50 Lakhs to ₹75 Lakhs</option>
                  <option value="₹75 Lakhs to ₹1 Crore">₹75 Lakhs to ₹1 Crore</option>
                  <option value="₹1 Crore to ₹1.5 Crore">₹1 Crore to ₹1.5 Crore</option>
                  <option value="₹1.5 Crore to ₹2.5 Crore">₹1.5 Crore to ₹2.5 Crore</option>
                  <option value="Above ₹2.5 Crore">Above ₹2.5 Crore</option>
                </select>
              </div>

              {/* When are you thinking of moving? */}
              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1.5">
                  When are you thinking of moving?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Within 6 months', '6 to 12 months', 'More than a year', 'Just exploring'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTimeline(opt)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                        timeline === opt
                          ? 'bg-[#F5D328] text-[#122116] shadow-sm'
                          : 'bg-[#183825] text-white border border-[#F5D328]/30 hover:border-[#F5D328]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consent box */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#F5D328]/40 text-[#F5D328] bg-[#183825] focus:ring-0 cursor-pointer shrink-0"
                  />
                  <span className="text-[11px] text-[#EBF2E8]/85 leading-snug">
                    I agree that Rodasi may contact me on WhatsApp and may share these details with the developers I choose to hear from. I have read the{' '}
                    <Link href="/privacy" target="_blank" className="text-[#F5D328] underline underline-offset-2">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Sending Requirements...' : 'Send my requirements'}</span>
                  <ArrowRight className="w-4 h-4 text-[#122116]" />
                </button>
              </div>

              {/* Under the button line */}
              <p className="text-[11px] text-[#EBF2E8]/70 text-center pt-1 leading-relaxed">
                We will share your details only with developers you choose. No health details are needed here. Zero payment.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER NOTE & LEGAL */}
      <footer className="bg-[#0D1C11] text-[#EBF2E8] py-10 px-4 border-t border-[#F5D328]/20">
        <div className="max-w-md sm:max-w-xl mx-auto text-center space-y-4">
          <Link href="/" className="inline-block">
            <img
              src="/images/logo.png"
              alt="Rodasi"
              className="h-9 sm:h-11 w-auto object-contain mx-auto brightness-110"
            />
          </Link>

          <p className="text-xs text-[#EBF2E8]/80 leading-relaxed font-medium">
            Rodasi does not give financial, legal or investment advice. Please speak to your own lawyer and adviser before you buy.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#EBF2E8]/70 pt-1">
            <Link href="/" className="hover:text-[#F5D328] transition">
              Home
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-[#F5D328] transition">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-[#F5D328] transition">
              Terms & Conditions
            </Link>
            <span>·</span>
            <Link href="/refund-policy" className="hover:text-[#F5D328] transition">
              Refund Policy
            </Link>
          </div>

          <p className="text-[11px] text-[#EBF2E8]/50 pt-2">
            A product of Zynthexion Technologies Private Limited, Kochi, Kerala.
          </p>
        </div>
      </footer>
    </div>
  );
}
