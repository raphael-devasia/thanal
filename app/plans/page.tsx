'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Check,
  ArrowRight,
  MessageCircle,
  X,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Stethoscope,
  ChevronDown
} from 'lucide-react';
import {
  PLANS,
  ParentMode,
  COUNTRIES,
  TOP_NRK_COUNTRIES,
  ALL_COUNTRIES,
  detectVisitorCountry
} from '@/types/waitlist';

export default function PlansPage() {
  const [parentMode, setParentMode] = useState<ParentMode>('single');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');

  // Plan Accordion Inclusions State
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

  const togglePlanExpanded = (planId: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  // Companion Waitlist State
  const [showCompanionModal, setShowCompanionModal] = useState<boolean>(false);
  const [companionName, setCompanionName] = useState<string>('');
  const [companionCountryCode, setCompanionCountryCode] = useState<string>('');
  const [companionPhoneDigits, setCompanionPhoneDigits] = useState<string>('');
  const [companionConsent, setCompanionConsent] = useState<boolean>(true);
  const [companionSubmitting, setCompanionSubmitting] = useState<boolean>(false);
  const [companionSubmitted, setCompanionSubmitted] = useState<boolean>(false);
  const [companionError, setCompanionError] = useState<string | null>(null);

  useEffect(() => {
    const detected = detectVisitorCountry();
    if (detected) {
      setCompanionCountryCode(detected);
    }
  }, []);

  const handleCompanionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompanionError(null);

    if (!companionName.trim()) {
      setCompanionError('Please enter your name.');
      return;
    }
    const country = COUNTRIES.find((c) => c.code === companionCountryCode);
    if (!country) {
      setCompanionError('Please choose your country.');
      return;
    }
    const cleanNumber = companionPhoneDigits.replace(/[^0-9]/g, '').replace(/^0+/, '');
    if (!cleanNumber || cleanNumber.length < 6 || cleanNumber.length > 15) {
      setCompanionError('Please enter a valid phone number format.');
      return;
    }
    if (!companionConsent) {
      setCompanionError('Please check the box to allow WhatsApp messaging.');
      return;
    }

    setCompanionSubmitting(true);
    const cleanDialCode = country.dialCode.replace(/[^0-9]/g, '');
    const fullWhatsappNumber = `+${cleanDialCode}${cleanNumber}`;

    try {
      const payload = {
        name: companionName.trim(),
        whatsappNumber: fullWhatsappNumber,
        country: country.name.split(' (')[0],
        source: 'companion_waitlist_plans_page'
      };

      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});

      setCompanionSubmitted(true);
      setCompanionSubmitting(false);
    } catch {
      setCompanionSubmitted(true);
      setCompanionSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#122617] text-[#EBF2E8] font-sans">
      {/* Navigation Header */}
      <header className="border-b border-[#F5D328]/20 bg-[#0E1F13] py-5 px-4 sm:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#F5D328] hover:text-[#FFE342] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Rodasi</span>
          </Link>
          <Link href="/" className="inline-block">
            <img
              src="/images/logo.png"
              alt="Rodasi"
              className="h-8 sm:h-9 w-auto object-contain brightness-110"
            />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="bg-[#183825] text-[#F5D328] border border-[#F5D328]/30 text-xs font-bold px-3.5 py-1.5 rounded-full inline-block uppercase tracking-wider">
            Transparent Membership
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Choose the Right Level of Care
          </h1>
          <p className="text-[#EBF2E8]/85 text-sm sm:text-base leading-relaxed">
            Every plan pairs your family with a named Care Buddy who is background-checked before their first visit. No hospital markups, zero hidden commissions. From single hospital visits to daily presence with our 22-day Companion plan.
          </p>

          {/* Parent Mode & Billing Cycle Toggles */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Single vs Couple */}
            <div className="p-1 rounded-xl bg-[#183825] border border-[#F5D328]/30 flex items-center">
              <button
                type="button"
                onClick={() => setParentMode('single')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  parentMode === 'single' ? 'bg-[#F5D328] text-[#122116] shadow-sm' : 'text-[#EBF2E8] hover:text-white'
                }`}
              >
                Single Parent
              </button>
              <button
                type="button"
                onClick={() => setParentMode('couple')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  parentMode === 'couple' ? 'bg-[#F5D328] text-[#122116] shadow-sm' : 'text-[#EBF2E8] hover:text-white'
                }`}
              >
                <span>Both Parents</span>
                <span className="text-[10px] bg-[#25D366] text-white px-1.5 py-0.2 rounded font-extrabold">25% Off</span>
              </button>
            </div>

            {/* Billing Cycle */}
            <div className="p-1 rounded-xl bg-[#183825] border border-[#F5D328]/30 flex items-center">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  billingCycle === 'monthly' ? 'bg-[#F5D328] text-[#122116] shadow-sm' : 'text-[#EBF2E8] hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('quarterly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'quarterly' ? 'bg-[#F5D328] text-[#122116] shadow-sm' : 'text-[#EBF2E8] hover:text-white'
                }`}
              >
                <span>Quarterly</span>
                <span className="text-[10px] bg-[#25D366] text-white px-1.5 py-0.2 rounded font-extrabold">10% Off</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. Try us first: Single Hospital Visit Card (Above Plans) */}
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-[#F5D328] text-center mb-3">
            New to Rodasi? Start with one visit
          </p>

          <div className="p-6 sm:p-7 rounded-3xl bg-[#F9F8F3] border-2 border-[#183825]/15 text-[#122617] shadow-lg flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#183825] bg-[#E8F0C8] px-3 py-1 rounded-full">
                  Try before you subscribe
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#122617]">
                Try us with one hospital visit
              </h2>
              <p className="text-xs sm:text-sm text-[#374F3E] leading-relaxed">
                Your Care Buddy picks your parent up from home, stays through the visit, and brings them back. You get a voice note, the prescription photo and a summary on WhatsApp.
              </p>
              <div className="space-y-1.5 text-xs text-[#2D4533] pt-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-lg font-black text-[#122617]">From ₹1,500</span>
                  <span className="font-semibold text-[#2D4533]">plus GST</span>
                  <span className="text-[#2D4533]/85">(₹1,770 incl. 18% GST)</span>
                </div>
                <p className="leading-relaxed">
                  Taxi at actuals (typically ₹600 to ₹1,000 depending on distance), shown before you confirm.
                </p>
                <p className="font-semibold text-[#183825]">
                  Free cancellation up to 6 hours before. If you join a monthly plan within 30 days, we credit this visit against your first month.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-2">
              <a
                href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20to%20ask%20about%20the%20Single%20Hospital%20Visit%20for%20my%20parents."
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 rounded-xl bg-[#122617] hover:bg-[#183825] text-white font-extrabold text-xs sm:text-sm transition shadow-md whitespace-nowrap cursor-pointer text-center"
              >
                Ask about Single Hospital Visit on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* 2. All 4 Membership Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {PLANS.map((plan) => {
            const basePrice = parentMode === 'couple' ? plan.pricePerMonthCouple : plan.pricePerMonthSingle;
            const finalPrice = billingCycle === 'quarterly' ? Math.round(basePrice * 0.9) : basePrice;
            const finalPriceWithGst = Math.round(finalPrice * 1.18);
            const finalUsd = Math.round(finalPrice / 83.5);

            // Standard short lists strictly matching across all components
            const shortList: Record<string, string[]> = {
              essential: [
                '1 visit a week',
                '1 hospital escort (up to 4 hours)',
                'Medicine check',
                'WhatsApp update after every visit'
              ],
              care_plus: [
                '2 visits a week',
                '2 escorts (up to 5 hours each)',
                'We book appointments',
                'Weekly medicine check',
                'WhatsApp update after every visit'
              ],
              comfort: [
                '3 visits a week plus weekly companion afternoons',
                '3 escorts (up to 6 hours each)',
                'We book appointments',
                'Full medicine check',
                'WhatsApp update after every visit'
              ],
              companion: [
                '22 days a month (3 hours a day)',
                '2 escorts (up to 6 hours each)',
                'Daily companion time',
                'Medicine check',
                'WhatsApp update after every visit'
              ]
            };

            const items = shortList[plan.id] || plan.features.slice(0, 4);

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 lg:p-7 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'bg-[#183825] border-2 border-[#F5D328] shadow-2xl scale-[1.02] text-white'
                    : plan.comingSoon
                    ? 'bg-[#152B1B] border-2 border-dashed border-[#F5D328]/60 text-white shadow-xl'
                    : 'bg-white border-2 border-[#183825]/15 text-[#122617] shadow-md hover:border-[#183825]/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F5D328] text-[#122116] text-xs uppercase font-black px-3.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                    Recommended
                  </div>
                )}

                {plan.comingSoon && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#183825] text-[#F5D328] border border-[#F5D328]/50 text-xs uppercase font-black px-3.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                    Launching Soon • Waitlist
                  </div>
                )}

                <div>
                  <h3 className={`text-xl sm:text-2xl font-black mb-1 ${plan.popular || plan.comingSoon ? 'text-white' : 'text-[#122617]'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs font-bold mb-3 ${plan.popular || plan.comingSoon ? 'text-[#E8F0C8]' : 'text-[#2D4533]'}`}>
                    {plan.tagline}
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed mb-5 font-normal min-h-[40px] ${plan.popular || plan.comingSoon ? 'text-[#E0EBDC]' : 'text-[#374F3E]'}`}>
                    {plan.description}
                  </p>

                  <div className={`pb-5 mb-5 border-b ${plan.popular || plan.comingSoon ? 'border-white/15' : 'border-[#183825]/15'}`}>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-3xl sm:text-4xl font-black ${plan.popular || plan.comingSoon ? 'text-white' : 'text-[#122617]'}`}>
                        ₹{finalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className={`font-bold text-xs sm:text-sm ${plan.popular || plan.comingSoon ? 'text-[#E8F0C8]' : 'text-[#2D4533]'}`}>
                        / month plus GST
                      </span>
                    </div>
                    <p className={`text-xs mt-1 font-semibold ${plan.popular || plan.comingSoon ? 'text-[#F5D328]' : 'text-[#183825]'}`}>
                      (₹{finalPriceWithGst.toLocaleString('en-IN')} / month incl. 18% GST)
                    </p>
                    <p className={`text-xs mt-1 font-medium ${plan.popular || plan.comingSoon ? 'text-[#E0EBDC]/80' : 'text-[#374F3E]'}`}>
                      (~${finalUsd} USD / month {billingCycle === 'quarterly' ? '• with 10% quarterly prepay' : ''})
                    </p>
                  </div>

                  <div className="space-y-2.5 mb-6">
                    <p className={`text-xs font-bold uppercase tracking-wider ${plan.popular || plan.comingSoon ? 'text-[#F5D328]' : 'text-[#183825]'}`}>
                      What is included:
                    </p>
                    <ul className={`space-y-2 text-xs ${plan.popular || plan.comingSoon ? 'text-[#E0EBDC]' : 'text-[#374F3E]'}`}>
                      {items.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular || plan.comingSoon ? 'text-[#F5D328]' : 'text-[#183825]'}`} />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Progressive Disclosure Toggle */}
                    <div className="pt-1.5">
                      <button
                        type="button"
                        onClick={() => togglePlanExpanded(plan.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold transition cursor-pointer select-none ${
                          plan.popular || plan.comingSoon ? 'text-[#F5D328] hover:text-[#FFE342]' : 'text-[#183825] hover:text-[#122617]'
                        }`}
                      >
                        <span>{expandedPlans[plan.id] ? 'Hide full inclusions' : 'View full inclusions'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedPlans[plan.id] ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Expanded Full Inclusions Box */}
                      {expandedPlans[plan.id] && (
                        <div className={`mt-3 p-3.5 rounded-xl space-y-3 text-xs animate-in fade-in duration-200 ${
                          plan.popular || plan.comingSoon ? 'bg-[#122617] border border-white/10' : 'bg-[#F2EFE6] border border-[#183825]/15'
                        }`}>
                          <div className="space-y-1.5 font-semibold">
                            <div className="flex items-center gap-2">
                              <Clock className={`w-3.5 h-3.5 shrink-0 ${plan.popular || plan.comingSoon ? 'text-[#F5D328]' : 'text-[#183825]'}`} />
                              <span className={plan.popular || plan.comingSoon ? 'text-[#EBF2E8]' : 'text-[#122617]'}>{plan.touchpoints}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Stethoscope className={`w-3.5 h-3.5 shrink-0 ${plan.popular || plan.comingSoon ? 'text-[#F5D328]' : 'text-[#183825]'}`} />
                              <span className={plan.popular || plan.comingSoon ? 'text-[#EBF2E8]' : 'text-[#122617]'}>{plan.hospitalHours}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <HeartHandshake className={`w-3.5 h-3.5 shrink-0 ${plan.popular || plan.comingSoon ? 'text-[#F5D328]' : 'text-[#183825]'}`} />
                              <span className={plan.popular || plan.comingSoon ? 'text-[#EBF2E8]' : 'text-[#122617]'}>{plan.companionTasters}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-current/10">
                            <p className={`font-bold mb-2 uppercase text-[10px] tracking-wider ${plan.popular || plan.comingSoon ? 'text-[#F5D328]' : 'text-[#183825]'}`}>
                              Full Membership Inclusions:
                            </p>
                            <ul className={`space-y-1.5 text-xs ${plan.popular || plan.comingSoon ? 'text-[#E0EBDC]' : 'text-[#374F3E]'}`}>
                              {plan.features.map((feat, fIdx) => (
                                <li key={fIdx} className="flex items-start gap-2">
                                  <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.popular || plan.comingSoon ? 'text-[#F5D328]' : 'text-[#183825]'}`} />
                                  <span className="leading-snug">{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  {plan.comingSoon ? (
                    <button
                      type="button"
                      onClick={() => setShowCompanionModal(true)}
                      className="w-full py-3.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] shadow-md active:scale-[0.98]"
                    >
                      <span>Join the waitlist</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <a
                      href={`https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20to%20ask%20about%20the%20${encodeURIComponent(plan.name)}%20plan%20for%20my%20parents.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer text-center ${
                        plan.popular
                          ? 'bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold shadow-md active:scale-[0.98]'
                          : 'bg-[#122617] hover:bg-[#183825] text-white active:scale-[0.98]'
                      }`}
                    >
                      <span>Ask about {plan.name} on WhatsApp</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Commercial & Operational Rules */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#183825] border border-[#F5D328]/25 max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#F5D328] uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5 text-[#F5D328]" />
            <span>Transparent Commercial Rules & Operational Policies</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#EBF2E8]/85 leading-relaxed">
            <div>
              <p className="font-bold text-[#EBF2E8] mb-1.5 text-sm">3-Month Minimum & Pro-Rata Refund</p>
              <p>Initial enrollment is a 3-month minimum commitment to build medical history and a trusted routine. 15-day notice required, with unused full months refunded pro-rata.</p>
            </div>
            <div>
              <p className="font-bold text-[#EBF2E8] mb-1.5 text-sm">Flexible Plan Pausing</p>
              <p>Heading on an overseas trip or facing a long hospital stay? Pause membership for 14 to 60 days with 7 days notice. Billing is completely frozen during pause.</p>
            </div>
            <div>
              <p className="font-bold text-[#EBF2E8] mb-1.5 text-sm">Overtime Beyond Included Hours</p>
              <p>Care visits include designated accompaniment hours. Overtime beyond included hours is billed at ₹350/hour actuals (in 30-minute blocks), confirmed with you beforehand.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F5D328]/20 text-xs text-[#EBF2E8]/90 leading-relaxed">
            <strong className="text-[#F5D328]">What is Not Included: </strong>
            <span>Doctor consultation fees, nursing procedures, diagnostic lab tests, prescription medicines, taxi fares, buddy overtime beyond included hours, and physical therapy or rehabilitation (therapy comes from licensed providers, paid directly at actuals with zero commission).</span>
          </div>
        </div>

        {/* Quick Help Box */}
        <div className="text-center space-y-3 pt-4">
          <p className="text-xs sm:text-sm text-[#EBF2E8]/80">
            Unsure which plan fits your parents’ situation?
          </p>
          <a
            href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20guidance%20on%20choosing%20the%20right%20care%20plan%20for%20my%20parents."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm transition shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-white text-transparent" />
            <span>Chat with our team on WhatsApp</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A130C] text-[#EBF2E8] py-12 px-4 border-t border-[#F5D328]/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EBF2E8]/60">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#F5D328] font-medium">
              <span>Named Care Buddy</span>
              <span className="text-[#EBF2E8]/30">·</span>
              <span>No hospital commissions</span>
              <span className="text-[#EBF2E8]/30">·</span>
              <span>Pro-rata refund</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
              <Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
              <a href="mailto:care@rodasi.com" className="hover:text-white transition">Contact</a>
            </div>
          </div>

          <p className="text-[11px] text-[#EBF2E8]/40 text-center">
            A product of Zynthexion Technologies Private Limited, Calicut, Kerala.
          </p>
        </div>
      </footer>

      {/* Companion Waitlist Modal */}
      {showCompanionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#183825] border border-[#F5D328]/30 text-[#EBF2E8] rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-4 relative shadow-2xl animate-in fade-in zoom-in duration-150">
            <button
              type="button"
              onClick={() => setShowCompanionModal(false)}
              className="absolute top-4 right-4 text-[#EBF2E8]/70 hover:text-white p-1 rounded-full cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F5D328]">Waitlist</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Join the Companion Waitlist</h3>
              <p className="text-xs sm:text-sm text-[#EBF2E8]/80 leading-relaxed">
                22 days a month of warm daily companionship. We will notify you first when enrollment opens.
              </p>
            </div>

            {companionSubmitted ? (
              <div className="p-5 rounded-xl bg-[#122617] border border-[#F5D328]/40 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#F5D328]/20 border border-[#F5D328] flex items-center justify-center text-[#F5D328] mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-[#F5D328]" />
                </div>
                <h4 className="text-base font-bold text-[#F5D328]">You are on the waitlist!</h4>
                <p className="text-xs text-[#EBF2E8]/85 leading-relaxed">
                  Thank you <strong>{companionName}</strong>. We will message you on WhatsApp as soon as Companion spots open in your parents’ area.
                </p>
                <div className="pt-1">
                  <a
                    href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20have%20joined%20the%20waitlist%20for%20the%2022-day%20Companion%20plan."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#25D366] text-white text-xs font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white text-transparent" />
                    <span>Say hello on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCompanionSubmit} className="space-y-3.5">
                {companionError && (
                  <div className="p-2.5 rounded-lg bg-red-900/60 border border-red-500/50 text-red-200 text-xs">
                    {companionError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Menon"
                    value={companionName}
                    onChange={(e) => setCompanionName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <select
                    required
                    value={companionCountryCode}
                    onChange={(e) => setCompanionCountryCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="">Choose country</option>
                    <optgroup label="Popular Expats & NRK Regions" className="bg-[#122617] text-[#F5D328] font-bold">
                      {TOP_NRK_COUNTRIES.map((c) => (
                        <option key={`plans_top_${c.code}`} value={c.code} className="bg-[#122617] text-white font-normal">
                          {c.name} (+{c.dialCode})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="All Countries (A to Z)" className="bg-[#122617] text-[#F5D328] font-bold">
                      {ALL_COUNTRIES.map((c) => (
                        <option key={`plans_all_${c.code}`} value={c.code} className="bg-[#122617] text-white font-normal">
                          {c.name} (+{c.dialCode})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">
                    WhatsApp Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-bold text-[#F5D328]">
                      {companionCountryCode && COUNTRIES.find((c) => c.code === companionCountryCode)
                        ? `+${COUNTRIES.find((c) => c.code === companionCountryCode)?.dialCode.replace(/[^0-9]/g, '')}`
                        : '+'}
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 50 123 4567"
                      value={companionPhoneDigits}
                      onChange={(e) => setCompanionPhoneDigits(e.target.value)}
                      className="w-full pl-16 pr-3.5 py-2.5 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="pt-0.5">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={companionConsent}
                      onChange={(e) => setCompanionConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-[#F5D328]/40 text-[#F5D328] bg-[#122617] focus:ring-0 cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-[#EBF2E8]/90 leading-snug">
                      OK to message me on WhatsApp.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={companionSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold text-xs sm:text-sm transition cursor-pointer disabled:opacity-50"
                >
                  {companionSubmitting ? 'Joining...' : 'Join Companion Waitlist'}
                </button>

                <p className="text-xs text-[#EBF2E8]/70 text-center font-normal pt-0.5">
                  Your parents don’t need to do anything yet.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
