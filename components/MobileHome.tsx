'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  COUNTRIES,
  TOP_NRK_COUNTRIES,
  ALL_COUNTRIES,
  detectVisitorCountry,
  PLANS,
  PlanOption
} from '@/types/waitlist';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Check,
  Play,
  Pause,
  ChevronDown,
  MessageCircle,
  FileText,
  Clock,
  HeartHandshake,
  X,
  Menu,
  Stethoscope,
  Users,
  Home,
  Sparkles
} from 'lucide-react';

export default function MobileHome() {
  // Navigation & Bottom Bar State
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedWorry, setSelectedWorry] = useState<'hospital' | 'medicines' | 'afternoons'>('hospital');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showHowWeChooseModal, setShowHowWeChooseModal] = useState<boolean>(false);
  const [showCompareAllModal, setShowCompareAllModal] = useState<boolean>(false);
  const [showCompanionWaitlistModal, setShowCompanionWaitlistModal] = useState<boolean>(false);

  // Three Pillars Drawer State
  const [showPillarDrawer, setShowPillarDrawer] = useState<boolean>(false);
  const [mobileDrawerPillar, setMobileDrawerPillar] = useState<'vitality' | 'joy' | 'ease'>('vitality');

  const openPillarDrawer = (pillar: 'vitality' | 'joy' | 'ease') => {
    setMobileDrawerPillar(pillar);
    setShowPillarDrawer(true);
  };

  // Plan Full Inclusions Popup Modal State
  const [selectedInclusionPlan, setSelectedInclusionPlan] = useState<PlanOption | null>(null);

  // Companion Waitlist State
  const [companionName, setCompanionName] = useState<string>('');
  const [companionCountryCode, setCompanionCountryCode] = useState<string>('');
  const [companionPhoneDigits, setCompanionPhoneDigits] = useState<string>('');
  const [companionConsent, setCompanionConsent] = useState<boolean>(true);
  const [companionSubmitting, setCompanionSubmitting] = useState<boolean>(false);
  const [companionSubmitted, setCompanionSubmitted] = useState<boolean>(false);
  const [companionError, setCompanionError] = useState<string | null>(null);

  // Close modals on phone back button tap
  useEffect(() => {
    if (showCompareAllModal || showCompanionWaitlistModal || showHowWeChooseModal || showPillarDrawer) {
      window.history.pushState({ modalOpen: true }, '');
      const handlePopState = () => {
        setShowCompareAllModal(false);
        setShowCompanionWaitlistModal(false);
        setShowHowWeChooseModal(false);
        setShowPillarDrawer(false);
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [showCompareAllModal, showCompanionWaitlistModal, showHowWeChooseModal, showPillarDrawer]);

  // Audio Playback Simulation (8-second clip)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSeconds, setAudioSeconds] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioSeconds((prev) => {
          if (prev >= 8) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setAudioSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  // Lead Form State
  const [name, setName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [phoneDigits, setPhoneDigits] = useState<string>('');
  const [consentGiven, setConsentGiven] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const detected = detectVisitorCountry();
    if (detected) {
      setCountryCode(detected);
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    const country = COUNTRIES.find((c) => c.code === countryCode);
    if (!country) {
      setFormError('Please choose your country.');
      return;
    }
    const cleanNumber = phoneDigits.replace(/[^0-9]/g, '').replace(/^0+/, '');
    if (!cleanNumber || cleanNumber.length < 6 || cleanNumber.length > 15) {
      setFormError('Please enter a valid phone number format.');
      return;
    }
    if (!consentGiven) {
      setFormError('Please check the box to allow WhatsApp messaging.');
      return;
    }

    setIsSubmitting(true);

    const cleanDialCode = country.dialCode.replace(/[^0-9]/g, '');
    const fullWhatsappNumber = `+${cleanDialCode}${cleanNumber}`;

    try {
      const payload = {
        name: name.trim(),
        whatsappNumber: fullWhatsappNumber,
        country: country.name.split(' (')[0],
        source: 'website_sample_form_mobile'
      };

      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});

      setFormSubmitted(true);
      setIsSubmitting(false);

      const waText = encodeURIComponent(
        'Hi Rodasi Team, please send me the sample WhatsApp update and voice note.'
      );
      if (typeof window !== 'undefined') {
        window.open(`https://wa.me/919496097611?text=${waText}`, '_blank');
      }
    } catch {
      setFormSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const handleCompanionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompanionError(null);

    if (!companionName.trim()) {
      setCompanionError('Please enter your name.');
      return;
    }
    const country = COUNTRIES.find((c) => c.code === (companionCountryCode || countryCode));
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
        source: 'companion_waitlist_mobile'
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

  const sampleWhatsAppUrl =
    'https://wa.me/919496097611?text=' +
    encodeURIComponent(
      'Hi Rodasi Team, please send me a sample WhatsApp update and voice note that families receive for their parents in Kerala.'
    );

  return (
    <div className="min-h-screen bg-[#F9F8F3] text-[#122617] font-sans pb-24 selection:bg-[#F5D328] selection:text-[#122116]">
      {/* ALWAYS ON SCREEN: TOP BAR */}
      <header className="sticky top-0 z-40 bg-[#122617] text-white border-b border-[#F5D328]/20 shadow-md">
        <div className="max-w-xl mx-auto px-3.5 py-2.5 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <img
              src="/images/logo.png"
              alt="Rodasi"
              className="h-8 w-auto object-contain brightness-110"
            />
          </Link>

          <div className="flex items-center gap-2">
            {/* Chat on WhatsApp */}
            <a
              href={sampleWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition shadow-sm active:scale-95"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-transparent shrink-0" />
              <span>Chat</span>
            </a>

            {/* Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-[#183825] border border-[#F5D328]/25 text-[#EBF2E8] hover:text-[#F5D328] transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="bg-[#122617] border-t border-b border-[#F5D328]/30 shadow-2xl p-4 space-y-3 animate-in slide-in-from-top-1 duration-150">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#F5D328]">Menu Navigation</p>
              <p className="text-xs text-[#EBF2E8]/70">Explore eldercare services and plans</p>
            </div>

            <div className="space-y-2 pt-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#183825] text-white font-bold text-xs hover:bg-[#1f452e] transition"
              >
                <span>At-Home Eldercare in Kochi</span>
                <span className="text-[10px] bg-[#F5D328] text-[#122116] px-2 py-0.5 rounded font-black uppercase">Home</span>
              </Link>

              <a
                href="#three-pillars"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#183825]/60 text-white font-medium text-xs hover:bg-[#183825] transition"
              >
                <span>The Three Pillars of Care</span>
                <span className="text-[#EBF2E8]/60 text-[11px]">Health · Joy · Ease</span>
              </a>

              <a
                href="#plans-mobile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#183825]/60 text-white font-medium text-xs hover:bg-[#183825] transition"
              >
                <span>Care Plans & Pricing</span>
                <span className="text-[#EBF2E8]/60 text-[11px]">From ₹6,000/mo</span>
              </a>

              <a
                href="#sample-request-mobile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#183825]/60 text-white font-medium text-xs hover:bg-[#183825] transition"
              >
                <span>Request Sample WhatsApp Update</span>
                <span className="text-[#EBF2E8]/60 text-[11px]">Free</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ALWAYS ON SCREEN: BOTTOM BAR */}
      <aside aria-label="Quick action" className="fixed bottom-0 left-0 right-0 z-40 bg-[#122617] border-t border-[#F5D328]/30 p-3 shadow-2xl backdrop-blur-md">
        <div className="max-w-md mx-auto">
          <a
            href={sampleWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-5 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#F5D328]/30 transition active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-[#122116] text-[#122116] shrink-0" />
            <span>Send me a sample update</span>
          </a>
        </div>
      </aside>

      {/* SCREEN 1: HERO */}
      <section className="bg-[#122617] text-[#EBF2E8] pt-8 pb-12 px-4 border-b border-[#183825]">
        <div className="max-w-md mx-auto text-center space-y-5">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183825] border border-[#F5D328]/30 text-[#EBF2E8] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Now enrolling founding families in Kochi</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-[1.2]">
            When your parents need help back home, who is{' '}
            <span className="font-courgette italic text-[#E8F0C8] font-normal tracking-wide">beside them?</span>
          </h1>

          {/* Text */}
          <p className="text-[#EBF2E8]/90 text-sm leading-relaxed max-w-lg mx-auto font-normal">
            A named Care Buddy visits your parents, goes with them to the hospital, and sends you a voice note on WhatsApp.
          </p>

          {/* Button & Link */}
          <div className="pt-2 flex flex-col items-center justify-center gap-2.5">
            <a
              href={sampleWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold text-sm shadow-md transition active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-[#122116] text-[#122116]" />
              <span>Send me a sample update</span>
            </a>
            <a
              href="#plans-mobile"
              className="text-xs text-[#EBF2E8]/75 hover:text-[#F5D328] underline underline-offset-4 font-semibold transition py-1"
            >
              See plans
            </a>
          </div>

          {/* Transparent Hero Image Blending into Section */}
          <div className="pt-3 relative max-w-sm mx-auto">
            {/* Ambient soft glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#F5D328]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <img
                src="/images/hero1.png"
                alt="Care Buddy accompanying elderly parent in Kochi"
                className="w-full h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] select-none"
              />

              {/* Background-checked badge */}
              <div className="absolute top-2 left-2 bg-[#122617]/90 backdrop-blur-md border border-[#F5D328]/40 text-[#F5D328] px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F5D328]" />
                <span>Background-checked</span>
              </div>

              {/* Sample card */}
              <div className="mt-3 bg-[#183825]/95 backdrop-blur-md border border-[#F5D328]/30 rounded-xl p-3 text-left text-white shadow-xl space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#F5D328] font-bold">
                  <span>Sample update to Dubai</span>
                  <span className="font-mono bg-[#122617] px-2 py-0.5 rounded text-[#EBF2E8]">0:48</span>
                </div>
                <p className="text-xs text-[#EBF2E8]/95 leading-snug">
                  BP recorded 120/80. Appa finished lunch and his walk.
                </p>
              </div>
            </div>
          </div>

          {/* Three small trust lines */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-[#F5D328] font-medium">
            <span>Named Care Buddy</span>
            <span className="text-[#EBF2E8]/40">·</span>
            <span>No hospital commissions</span>
            <span className="text-[#EBF2E8]/40">·</span>
            <span>Pro-rata refund</span>
          </div>
        </div>
      </section>

      {/* SCREEN 2: WHAT WORRIES YOU MOST? */}
      <section className="py-12 px-4 bg-[#F9F8F3] border-b border-[#122617]/10">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-[#183825] uppercase tracking-wider">Common Concerns</span>
            <h2 className="text-2xl font-extrabold text-[#122617] tracking-tight">
              What worries you most?
            </h2>
          </div>

          {/* Three Tappable Chips */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedWorry('hospital')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                selectedWorry === 'hospital'
                  ? 'bg-[#122617] text-[#F5D328] shadow-md ring-2 ring-[#F5D328]/30'
                  : 'bg-white text-[#122617] border border-[#183825]/15 hover:bg-[#F2EFE6]'
              }`}
            >
              Hospital visits
            </button>
            <button
              type="button"
              onClick={() => setSelectedWorry('medicines')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                selectedWorry === 'medicines'
                  ? 'bg-[#122617] text-[#F5D328] shadow-md ring-2 ring-[#F5D328]/30'
                  : 'bg-white text-[#122617] border border-[#183825]/15 hover:bg-[#F2EFE6]'
              }`}
            >
              Medicines
            </button>
            <button
              type="button"
              onClick={() => setSelectedWorry('afternoons')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                selectedWorry === 'afternoons'
                  ? 'bg-[#122617] text-[#F5D328] shadow-md ring-2 ring-[#F5D328]/30'
                  : 'bg-white text-[#122617] border border-[#183825]/15 hover:bg-[#F2EFE6]'
              }`}
            >
              Quiet afternoons
            </button>
          </div>

          {/* Card Content based on selection */}
          <div className="p-5 rounded-2xl bg-white border border-[#183825]/15 shadow-sm space-y-4 text-left">
            {selectedWorry === 'hospital' && (
              <div className="space-y-2">
                <p className="text-sm text-[#243B2B] leading-relaxed">
                  Your Care Buddy books the slot, goes with Amma by taxi, sits with her in the queue, and sends you a voice summary afterwards.
                </p>
                <p className="text-xs text-[#2D4533] font-medium">
                  Want to try us first? One visit at ₹1,500 trial, ₹2,000 after (plus GST). See the card in the Plans section below.
                </p>
              </div>
            )}
            {selectedWorry === 'medicines' && (
              <p className="text-sm text-[#243B2B] leading-relaxed">
                We check medicines against the prescription, check with the doctor or pharmacist if something does not match, and arrange doorstep refills.
              </p>
            )}
            {selectedWorry === 'afternoons' && (
              <p className="text-sm text-[#243B2B] leading-relaxed">
                A familiar face for tea, the news in Malayalam, a short walk, and a Sunday video call with you.
              </p>
            )}

            <div className="pt-2">
              <a
                href={sampleWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-[#122116] text-[#122116]" />
                <span>Send me a sample update</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SCREEN 3: A SAMPLE TUESDAY IN KOCHI */}
      <section className="py-12 px-4 bg-[#F2EFE6] border-b border-[#122617]/10">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#183825]/10 text-[#122617]">
              Sample
            </span>
            <h2 className="text-2xl font-extrabold text-[#122617] tracking-tight">
              A sample Tuesday in Kochi
            </h2>
            <p className="text-xs text-[#2D4533]">What a typical day of care looks like for your parents.</p>
          </div>

          <div className="space-y-3">
            {[
              { time: '8:45', text: 'Your Care Buddy arrives. Tea first.' },
              { time: '10:15', text: 'Taxi to the clinic. Token number sent to you.' },
              { time: '11:45', text: 'A voice note: what the doctor said.' },
              { time: '1:30', text: 'Medicines checked. Refill ordered.' },
              { time: '4:00', text: 'A short walk and a chat.' }
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-[#183825]/10 shadow-xs flex items-start gap-3.5"
              >
                <span className="text-xs font-mono font-bold text-[#183825] bg-[#F5D328]/25 border border-[#F5D328]/40 px-2 py-0.5 rounded shrink-0">
                  {step.time}
                </span>
                <p className="text-xs text-[#243B2B] font-medium leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCREEN 4: WHAT LANDS ON YOUR PHONE */}
      <section className="py-12 px-4 bg-[#F9F8F3] border-b border-[#122617]/10">
        <div className="max-w-md mx-auto space-y-5">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-[#183825] uppercase tracking-wider">Direct Updates</span>
            <h2 className="text-2xl font-extrabold text-[#122617] tracking-tight">
              What lands on your phone
            </h2>
          </div>

          {/* Mockup Chat Card */}
          <div className="bg-white rounded-2xl border border-[#183825]/15 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-[#122617] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#183825] border border-[#F5D328] flex items-center justify-center text-xs font-bold text-[#F5D328]">
                  CB
                </div>
                <div>
                  <h4 className="text-xs font-bold flex items-center gap-1.5 text-white">
                    <span>Care Buddy Anjali</span>
                    <span className="text-[9px] bg-[#F5D328] text-[#122116] px-1 py-0.2 rounded font-extrabold uppercase">Sample</span>
                  </h4>
                  <p className="text-[10px] text-[#F5D328]">Rodasi Care Team</p>
                </div>
              </div>
              <span className="text-[10px] text-[#EBF2E8]/70">WhatsApp</span>
            </div>

            {/* Chat Body */}
            <div className="p-3.5 space-y-3 bg-[#F8F5EE]">
              {/* Message 1 */}
              <div className="bg-white p-3 rounded-xl rounded-tl-none border border-[#183825]/10 text-xs text-[#243B2B] shadow-xs space-y-1">
                <p className="leading-relaxed">
                  Namaskaram Ramesh! I picked up Amma from home on time. We have arrived at City Care Clinic for her 11 AM check-up with Dr. Varma. Token #14.
                </p>
                <span className="text-[9px] text-[#183825]/60 block text-right">10:48 AM</span>
              </div>

              {/* Message 2 */}
              <div className="bg-white p-3 rounded-xl rounded-tl-none border border-[#183825]/10 text-xs text-[#243B2B] shadow-xs space-y-1">
                <p className="leading-relaxed">
                  Dr. Varma reviewed Amma's ECG and recorded BP at 120/80. Everything looks stable! He slightly adjusted the morning tablet timing.
                </p>
                <span className="text-[9px] text-[#183825]/60 block text-right">11:32 AM</span>
              </div>

              {/* Interactive 8-Second Voice Note Preview */}
              <div className="bg-white p-3 rounded-xl rounded-tl-none border border-[#183825]/10 shadow-xs space-y-2">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-8 h-8 rounded-full bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] flex items-center justify-center shrink-0 transition active:scale-95 cursor-pointer shadow-xs"
                    aria-label={isPlayingAudio ? 'Pause sample' : 'Play sample'}
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-3.5 h-3.5 fill-[#122116] text-[#122116]" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-[#122116] text-[#122116] ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 h-4">
                      <div className={`w-1 rounded-full bg-[#183825] ${isPlayingAudio ? 'animate-pulse h-3' : 'h-1.5'}`} />
                      <div className={`w-1 rounded-full bg-[#183825] ${isPlayingAudio ? 'animate-pulse h-4' : 'h-2.5'}`} />
                      <div className={`w-1 rounded-full bg-[#183825] ${isPlayingAudio ? 'animate-pulse h-3' : 'h-2'}`} />
                      <div className={`w-1 rounded-full bg-[#183825] ${isPlayingAudio ? 'animate-pulse h-4' : 'h-3'}`} />
                      <div className={`w-1 rounded-full bg-[#183825] ${isPlayingAudio ? 'animate-pulse h-2' : 'h-1.5'}`} />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#183825] mt-1 font-semibold">
                      <span>{isPlayingAudio ? `Playing (0:0${audioSeconds} / 0:08)` : 'Voice Note (Sample)'}</span>
                      <span>0:08</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hear full update */}
            <div className="p-4 bg-[#F1ECE1] border-t border-[#183825]/10 text-center space-y-2.5">
              <p className="text-xs text-[#2D4533] font-medium">Hear the full update on WhatsApp.</p>
              <a
                href={sampleWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#122617] hover:bg-[#183825] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Play the full sample</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SCREEN 5: HOW IT WORKS */}
      <section className="py-12 px-4 bg-[#F2EFE6] border-b border-[#122617]/10">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-[#183825] uppercase tracking-wider">Simple Process</span>
            <h2 className="text-2xl font-extrabold text-[#122617] tracking-tight">
              How it works
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white border border-[#183825]/10 shadow-xs flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#122617] text-[#F5D328] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <p className="text-xs text-[#243B2B] leading-relaxed">
                Tell us about your parents. Two minutes on WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#183825]/10 shadow-xs flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#122617] text-[#F5D328] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <p className="text-xs text-[#243B2B] leading-relaxed">
                Meet your Care Buddy on a video call before the first visit.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#183825]/10 shadow-xs flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#122617] text-[#F5D328] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <p className="text-xs text-[#243B2B] leading-relaxed">
                Get an update after every visit.
              </p>
            </div>
          </div>

          <p className="text-xs text-[#2D4533] text-center italic">
            Small note: We ask your parents for their own consent at the first visit.
          </p>
        </div>
      </section>

      {/* SCREEN 6: MEET YOUR CARE BUDDY */}
      <section className="py-12 px-4 bg-[#F9F8F3] border-b border-[#122617]/10">
        <div className="max-w-md mx-auto space-y-5 text-center">
          <span className="text-xs font-bold text-[#183825] uppercase tracking-wider">The Face on the Ground</span>
          <h2 className="text-2xl font-extrabold text-[#122617] tracking-tight">
            More than an agency. More than an app.
          </h2>

          <div className="p-5 rounded-2xl bg-white border border-[#183825]/15 shadow-sm space-y-3 text-left">
            <div className="flex items-start gap-2.5 text-xs text-[#243B2B]">
              <Check className="w-4 h-4 text-[#183825] shrink-0 mt-0.5" />
              <span>One named Care Buddy, with a backup you meet in advance.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#243B2B]">
              <Check className="w-4 h-4 text-[#183825] shrink-0 mt-0.5" />
              <span>Every Care Buddy is background-checked before their first visit.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#243B2B]">
              <Check className="w-4 h-4 text-[#183825] shrink-0 mt-0.5" />
              <span>Initial Care &amp; Personality Assessment to document health history, diet, and hobbies.</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowHowWeChooseModal(true)}
              className="text-xs text-[#183825] hover:text-[#122617] font-bold underline underline-offset-4 cursor-pointer"
            >
              How we choose Care Buddies
            </button>
          </div>
        </div>
      </section>

      {/* SCREEN 6B: THE THREE PILLARS OF RODASI CARE */}
      <section id="three-pillars" className="py-12 px-4 bg-[#142D1C] text-[#EBF2E8] border-b border-[#F5D328]/20">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-[#F5D328] uppercase tracking-wider">
              Comprehensive Service Scope
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              The Three Pillars of Care
            </h2>
            <p className="text-xs text-[#EBF2E8]/80 leading-relaxed">
              Tap any pillar to explore capabilities and live care notes.
            </p>
          </div>

          <div className="space-y-3.5">
            {/* Card 1: Vitality & Care */}
            <div
              onClick={() => openPillarDrawer('vitality')}
              className="p-4 rounded-2xl bg-[#183825] border border-[#F5D328]/30 shadow-md active:scale-[0.98] transition cursor-pointer text-left space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5D328] text-[#122116]">
                  Pillar 01 : Health
                </span>
                <Stethoscope className="w-5 h-5 text-[#F5D328]" />
              </div>
              <h3 className="text-base font-bold text-white">Vitality & Care</h3>
              <p className="text-xs text-[#E0EBDC] leading-relaxed">
                24/7 emergency mobilization support, hospital OPD escorting, doctor consultation notes, medicine refills, and home diagnostic visits.
              </p>
              <div className="pt-1 flex items-center justify-between text-xs text-[#F5D328] font-bold">
                <span>View full scope & live log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: Joy & Connection */}
            <div
              onClick={() => openPillarDrawer('joy')}
              className="p-4 rounded-2xl bg-[#183825] border border-[#F5D328]/30 shadow-md active:scale-[0.98] transition cursor-pointer text-left space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5D328] text-[#122116]">
                  Pillar 02 : Social & Mental
                </span>
                <HeartHandshake className="w-5 h-5 text-[#F5D328]" />
              </div>
              <h3 className="text-base font-bold text-white">Joy & Connection</h3>
              <p className="text-xs text-[#E0EBDC] leading-relaxed">
                Unhurried companion tea chats, reading Malayalam news, tech coaching on WhatsApp video calls, and temple visits.
              </p>
              <div className="pt-1 flex items-center justify-between text-xs text-[#F5D328] font-bold">
                <span>View full scope & visit note</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: Ease & Daily Living */}
            <div
              onClick={() => openPillarDrawer('ease')}
              className="p-4 rounded-2xl bg-[#183825] border border-[#F5D328]/30 shadow-md active:scale-[0.98] transition cursor-pointer text-left space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5D328] text-[#122116]">
                  Pillar 03 : Home, Chores & Govt
                </span>
                <Home className="w-5 h-5 text-[#F5D328]" />
              </div>
              <h3 className="text-base font-bold text-white">Ease & Daily Living</h3>
              <p className="text-xs text-[#E0EBDC] leading-relaxed">
                Home safety fall audits, Jeevan Pramaan biometric pension certificates, utility bills, and verified handyman visits.
              </p>
              <div className="pt-1 flex items-center justify-between text-xs text-[#F5D328] font-bold">
                <span>View full scope & audit card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCREEN 7: PLANS */}
      <section id="plans-mobile" className="py-12 px-4 bg-[#122617] text-white border-b border-[#183825]">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-[#F5D328] uppercase tracking-wider">Clear Membership</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Plans
            </h2>
          </div>

          {/* 1. Introductory Line and Single Hospital Visit Card (Moved Above Plans) */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#F5D328] uppercase tracking-wider text-center">
              New to Rodasi? Start with one visit
            </p>

            <div className="p-5 rounded-2xl bg-[#F9F8F3] border border-[#183825]/20 text-[#122617] space-y-3 shadow-md">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#183825] bg-[#E8F0C8] px-2.5 py-0.5 rounded-full inline-block">
                  Try before you subscribe
                </span>
                <h3 className="text-base font-bold text-[#122617] mt-2">
                  Try us with one hospital visit
                </h3>
                <p className="text-xs text-[#374F3E] leading-relaxed mt-1.5">
                  Your Care Buddy picks your parent up from home, stays through the visit, and brings them back. You get a voice note, the prescription photo and a summary on WhatsApp.
                </p>
                <div className="mt-2.5 space-y-1.5 text-xs text-[#2D4533]">
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-[#122617]">₹1,500 trial, ₹2,000 after</span>
                    <span className="text-xs font-semibold text-[#2D4533]">(plus GST)</span>
                  </div>
                  <p className="leading-relaxed">
                    Transport customized to your needs (Standard Cab, SUV, Wheelchair Van, or your Own Car). We send a transparent, all-inclusive quote on WhatsApp before the visit.
                  </p>
                  <p className="font-medium text-[#183825]">
                    Free cancellation up to 6 hours before.
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20to%20ask%20about%20the%20Single%20Hospital%20Visit%20for%20my%20parents."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-3 rounded-xl bg-[#122617] hover:bg-[#183825] text-white font-bold text-xs text-center block transition shadow-sm cursor-pointer"
              >
                Ask about Single Hospital Visit on WhatsApp
              </a>

              <p className="text-xs text-[#374F3E]/90 text-center leading-relaxed">
                If you join a monthly plan within 30 days, we credit this visit against your first month.
              </p>
            </div>
          </div>

          {/* Second Parent Discount Note */}
          <div className="p-3 rounded-xl bg-[#183825]/80 border border-[#F5D328]/30 text-center">
            <p className="text-[11px] text-[#EBF2E8]/90 font-medium">
              Covering both parents? Add a second parent for just 75% of the base fee (25% discount on the second parent&apos;s fee).
            </p>
          </div>

          {/* 2. Monthly Plan Cards */}
          <div className="space-y-4 pt-1">
            {/* Plan 1: Care Essential */}
            <div className="p-5 rounded-2xl bg-[#183825] border border-[#F5D328]/30 text-white space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Care Essential</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-[#F5D328]">₹6,000</span>
                  <span className="text-xs font-bold text-[#EBF2E8]">a month plus GST</span>
                </div>
                <p className="text-xs text-[#EBF2E8]/80 font-medium mt-0.5">
                  (₹7,080 / month incl. 18% GST)
                </p>

                <ul className="mt-3 space-y-1.5 text-xs text-[#EBF2E8]/90">
                  <li className="flex items-start gap-2">
                    <span className="text-[#F5D328] font-bold">•</span>
                    <span>1 visit a week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F5D328] font-bold">•</span>
                    <span>1 hospital escort (up to 4 hours)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F5D328] font-bold">•</span>
                    <span>Medicine check</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F5D328] font-bold">•</span>
                    <span>WhatsApp update after every visit</span>
                  </li>
                </ul>

                {/* View Full Inclusions Popup Trigger */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInclusionPlan(PLANS.find((p) => p.id === 'essential') || null)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F5D328] hover:underline cursor-pointer"
                  >
                    <span>View full inclusions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <a
                href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20to%20ask%20about%20the%20Care%20Essential%20plan%20for%20my%20parents."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-3 rounded-xl bg-white hover:bg-[#F2EFE6] text-[#122116] font-bold text-xs text-center block transition cursor-pointer"
              >
                Ask about Care Essential on WhatsApp
              </a>
            </div>

            {/* Plan 2: Care Plus (Recommended) */}
            <div className="p-5 rounded-2xl bg-[#162D1D] border-2 border-[#F5D328] text-white space-y-4 relative shadow-xl">
              <span className="absolute -top-2.5 right-4 bg-[#F5D328] text-[#122116] text-xs font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                Recommended
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Care Plus</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-[#F5D328]">₹11,000</span>
                  <span className="text-xs font-bold text-[#EBF2E8]">a month plus GST</span>
                </div>
                <p className="text-xs text-[#EBF2E8]/80 font-medium mt-0.5">
                  (₹12,980 / month incl. 18% GST)
                </p>

                <ul className="mt-3 space-y-1.5 text-xs text-[#EBF2E8]/90">
                  <li className="flex items-start gap-2">
                    <span className="text-[#F5D328] font-bold">•</span>
                    <span>2 visits a week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F5D328] font-bold">•</span>
                    <span>2 escorts (up to 5 hours each)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F5D328] font-bold">•</span>
                    <span>We book appointments for you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F5D328] font-bold">•</span>
                    <span>Weekly medicine check</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F5D328] font-bold">•</span>
                    <span>24/7 Emergency mobilization support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F5D328] font-bold">•</span>
                    <span>WhatsApp update after every visit</span>
                  </li>
                </ul>

                {/* View Full Inclusions Popup Trigger */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInclusionPlan(PLANS.find((p) => p.id === 'care_plus') || null)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F5D328] hover:underline cursor-pointer"
                  >
                    <span>View full inclusions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <a
                href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20to%20ask%20about%20the%20Care%20Plus%20plan%20for%20my%20parents."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-3 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold text-xs text-center block transition cursor-pointer"
              >
                Ask about Care Plus on WhatsApp
              </a>
            </div>
          </div>

          {/* Under Cards Terms & Clear Visible Button */}
          <div className="text-center space-y-3 pt-2">
            <p className="text-xs text-[#EBF2E8]/90 leading-relaxed font-medium">
              3-month minimum. Pause for 14 to 60 days. Unused full months refunded pro-rata.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/plans"
                className="w-full py-3.5 px-4 rounded-xl bg-[#183825] hover:bg-[#1e452e] border border-[#F5D328]/40 text-[#F5D328] font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <span>See all plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SCREEN 8: MONEY, PLAINLY */}
      <section className="py-10 px-4 bg-[#F9F8F3] border-b border-[#122617]/10">
        <div className="max-w-md mx-auto text-center space-y-2">
          <h2 className="text-xl font-extrabold text-[#122617]">
            Money, plainly
          </h2>
          <p className="text-xs text-[#2D4533] leading-relaxed max-w-md mx-auto">
            No commissions from hospitals. You pay doctors, labs, medicines and taxis directly, at actuals. Therapy comes from licensed providers, paid directly.
          </p>
        </div>
      </section>

      {/* SCREEN 9: THREE QUESTIONS (ACCORDIONS) */}
      <section className="py-12 px-4 bg-[#F2EFE6] border-b border-[#122617]/10">
        <div className="max-w-md mx-auto space-y-5">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-[#183825] uppercase tracking-wider">FAQs</span>
            <h2 className="text-2xl font-extrabold text-[#122617] tracking-tight">
              Three questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {[
              {
                q: 'What happens in an emergency?',
                a: 'If your parents can\'t call, we call 108, and your Care Buddy goes to the hospital. We keep you updated until you arrive or someone you name takes over.'
              },
              {
                q: 'Can my parents keep their family doctor?',
                a: 'Any hospital or doctor your family chooses. We don\'t have preferred hospitals, so our advice is never tied to one.'
              },
              {
                q: 'How will I get updates across time zones?',
                a: 'Your Care Buddy sends direct WhatsApp voice notes, photos, and visit summaries right after every visit. You receive them wherever you are without logging into any app.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-white border border-[#183825]/15 overflow-hidden shadow-xs transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs text-[#122617] flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#183825] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#243B2B] leading-relaxed border-t border-[#183825]/10 bg-[#FAF8F3]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SCREEN 10: FINAL STEP */}
      <section id="sample-request-mobile" className="py-12 px-4 bg-[#122617] text-white border-b border-[#183825]">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-[#F5D328] uppercase tracking-wider">Final Step</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              See a sample update for your parents’ town.
            </h2>
          </div>

          {formSubmitted ? (
            <div className="p-6 rounded-2xl bg-[#183825] border border-[#F5D328]/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F5D328]/20 border border-[#F5D328] flex items-center justify-center text-[#F5D328] mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#F5D328]" />
              </div>
              <h3 className="text-lg font-bold text-[#F5D328]">
                Thank you. Your sample update is on its way to WhatsApp.
              </h3>
              <p className="text-xs text-[#EBF2E8]/85 leading-relaxed">
                We will send you a sample voice note and visit summary directly on WhatsApp.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/919496097611?text=${encodeURIComponent(
                    'Hi Rodasi Team, please send me the sample WhatsApp update and voice note.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#F5D328] text-[#122116] font-extrabold text-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-[#122116] text-[#122116]" />
                  <span>Open WhatsApp Now</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-900/60 border border-red-500/50 text-red-200 text-xs">
                  {formError}
                </div>
              )}

              {/* 1. Name field */}
              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Menon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#183825] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs"
                />
              </div>

              {/* 2. Country dropdown */}
              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">
                  Country
                </label>
                <select
                  required
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#183825] border border-[#F5D328]/30 text-white focus:outline-none focus:border-[#F5D328] text-xs cursor-pointer"
                >
                  <option value="">Choose country</option>
                  <optgroup label="Popular Expats & NRK Regions" className="bg-[#183825] text-[#F5D328] font-bold">
                    {TOP_NRK_COUNTRIES.map((c) => (
                      <option key={`top_${c.code}`} value={c.code} className="bg-[#183825] text-white font-normal">
                        {c.name} (+{c.dialCode})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="All Countries (A to Z)" className="bg-[#183825] text-[#F5D328] font-bold">
                    {ALL_COUNTRIES.map((c) => (
                      <option key={`all_${c.code}`} value={c.code} className="bg-[#183825] text-white font-normal">
                        {c.name} (+{c.dialCode})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* 3. WhatsApp number */}
              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">
                  WhatsApp Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-[#F5D328]">
                    {countryCode && COUNTRIES.find((c) => c.code === countryCode)
                      ? `+${COUNTRIES.find((c) => c.code === countryCode)?.dialCode.replace(/[^0-9]/g, '')}`
                      : '+'}
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 50 123 4567"
                    value={phoneDigits}
                    onChange={(e) => setPhoneDigits(e.target.value)}
                    className="w-full pl-16 pr-3.5 py-3 rounded-xl bg-[#183825] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs"
                  />
                </div>
              </div>

              {/* 4. One Consent Box: OK to message me on WhatsApp */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#F5D328]/40 text-[#F5D328] bg-[#183825] focus:ring-0 cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-[#EBF2E8]/90 leading-snug">
                    OK to message me on WhatsApp.
                  </span>
                </label>
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4 fill-[#122116] text-[#122116]" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Send me a sample update'}</span>
                </button>
              </div>

              {/* Note under the form */}
              <div className="text-center space-y-1 pt-1">
                <p className="text-xs font-medium text-[#F5D328]">
                  Your parents don’t need to do anything yet.
                </p>
                <p className="text-[11px] text-[#EBF2E8]/70 font-normal">
                  Zero payment today. We reply on WhatsApp within one working day.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0D1C11] text-[#EBF2E8] py-10 px-4 border-t border-[#F5D328]/20">
        <div className="max-w-md mx-auto text-center space-y-6">
          <Link href="/" className="inline-block">
            <img
              src="/images/logo.png"
              alt="Rodasi"
              className="h-10 w-auto object-contain mx-auto brightness-110"
            />
          </Link>

          {/* Three Trust Lines */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#F5D328] font-medium">
            <span>Named Care Buddy</span>
            <span className="text-[#EBF2E8]/40">·</span>
            <span>No hospital commissions</span>
            <span className="text-[#EBF2E8]/40">·</span>
            <span>Pro-rata refund</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#EBF2E8]/75">
            <Link href="/privacy" className="hover:text-[#F5D328] transition">
              Privacy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-[#F5D328] transition">
              Terms
            </Link>
            <span>·</span>
            <Link href="/refund-policy" className="hover:text-[#F5D328] transition">
              Refund
            </Link>
            <span>·</span>
            <a href="mailto:care@rodasi.com" className="hover:text-[#F5D328] transition">
              Contact
            </a>
          </div>

          <p className="text-[11px] text-[#EBF2E8]/50">
            A product of Zynthexion Technologies Private Limited, Calicut.
          </p>
        </div>
      </footer>

      {/* MODAL: HOW WE CHOOSE CARE BUDDIES */}
      {showHowWeChooseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#183825] border border-[#F5D328]/30 text-[#EBF2E8] rounded-2xl max-w-md w-full p-5 space-y-4 relative shadow-2xl animate-in fade-in zoom-in duration-150">
            <button
              type="button"
              onClick={() => setShowHowWeChooseModal(false)}
              className="absolute top-4 right-4 text-[#EBF2E8]/70 hover:text-white p-1 rounded-full cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#F5D328] font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-[#F5D328]" />
              <span>How We Choose Care Buddies</span>
            </div>

            <div className="space-y-3 text-xs text-[#EBF2E8]/90 leading-relaxed">
              <div className="p-3 rounded-xl bg-[#122617] border border-[#F5D328]/20 space-y-1">
                <p className="font-bold text-[#F5D328]">1. Background Verification</p>
                <p>Every Care Buddy is background-checked before their first visit, including ID and reference verification.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#122617] border border-[#F5D328]/20 space-y-1">
                <p className="font-bold text-[#F5D328]">2. Introduction Video Call</p>
                <p>You and your parents meet your primary Care Buddy and named backup on a video call before the inaugural home visit.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#122617] border border-[#F5D328]/20 space-y-1">
                <p className="font-bold text-[#F5D328]">3. Initial Care &amp; Personality Assessment</p>
                <p>Comprehensive initial profiling to document your parents&apos; medical history, allergies, dietary preferences, and daily hobbies before the first official visit.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHowWeChooseModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#F5D328] text-[#122116] font-bold text-xs hover:bg-[#FFE342] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL: COMPARE ALL PLANS */}
      {showCompareAllModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#183825] border border-[#F5D328]/30 text-[#EBF2E8] rounded-2xl max-w-md w-full p-5 space-y-4 relative shadow-2xl max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
            <button
              type="button"
              onClick={() => setShowCompareAllModal(false)}
              className="absolute top-4 right-4 text-[#EBF2E8]/70 hover:text-white p-1 rounded-full cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F5D328]">Comprehensive Tiers</span>
              <h3 className="text-lg font-bold text-white">Compare All Care Plans</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Care Essential */}
              <div className="p-3.5 rounded-xl bg-[#122617] border border-[#F5D328]/20 space-y-2">
                <div className="flex justify-between items-baseline font-bold text-[#F5D328]">
                  <span>Care Essential</span>
                  <span>₹6,000 / mo + GST</span>
                </div>
                <p className="text-xs text-[#EBF2E8]/70 font-medium">
                  (₹7,080 / month incl. 18% GST)
                </p>
                <p className="text-[#EBF2E8]/90 leading-relaxed">
                  1 visit a week, 1 hospital escort (up to 4 hours), medicine check, WhatsApp update after every visit.
                </p>
                <a
                  href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20to%20ask%20about%20the%20Care%20Essential%20plan%20for%20my%20parents."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center block transition"
                >
                  Ask about Care Essential on WhatsApp
                </a>
              </div>

              {/* Care Plus */}
              <div className="p-3.5 rounded-xl bg-[#122617] border border-[#F5D328] space-y-2">
                <div className="flex justify-between items-baseline font-bold text-[#F5D328]">
                  <span>Care Plus (Recommended)</span>
                  <span>₹11,000 / mo + GST</span>
                </div>
                <p className="text-xs text-[#EBF2E8]/70 font-medium">
                  (₹12,980 / month incl. 18% GST)
                </p>
                <p className="text-[#EBF2E8]/90 leading-relaxed">
                  2 visits a week, 2 escorts (up to 5 hours each), we book appointments, weekly medicine check, 24/7 emergency mobilization support, WhatsApp update after every visit.
                </p>
                <a
                  href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20to%20ask%20about%20the%20Care%20Plus%20plan%20for%20my%20parents."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-lg bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-bold text-xs text-center block transition"
                >
                  Ask about Care Plus on WhatsApp
                </a>
              </div>

              {/* Care Complete */}
              <div className="p-3.5 rounded-xl bg-[#122617] border border-[#F5D328]/20 space-y-2">
                <div className="flex justify-between items-baseline font-bold text-[#F5D328]">
                  <span>Care Complete</span>
                  <span>₹18,000 / mo + GST</span>
                </div>
                <p className="text-xs text-[#EBF2E8]/70 font-medium">
                  (₹21,240 / month incl. 18% GST)
                </p>
                <p className="text-[#EBF2E8]/90 leading-relaxed">
                  3 visits a week, 3 escorts (up to 6 hours each), weekly companion afternoons, we book appointments, full medicine check, 24/7 emergency mobilization support, WhatsApp update after every visit.
                </p>
                <a
                  href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20to%20ask%20about%20the%20Care%20Complete%20plan%20for%20my%20parents."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center block transition"
                >
                  Ask about Care Complete on WhatsApp
                </a>
              </div>

              {/* Companion */}
              <div className="p-3.5 rounded-xl bg-[#122617] border border-dashed border-[#F5D328]/50 space-y-2">
                <div className="flex justify-between items-baseline font-bold text-[#F5D328]">
                  <span>Companion (Launching Soon)</span>
                  <span>₹20,000 / mo + GST</span>
                </div>
                <p className="text-xs text-[#EBF2E8]/70 font-medium">
                  (₹23,600 / month incl. 18% GST)
                </p>
                <p className="text-[#EBF2E8]/90 leading-relaxed">
                  22 days a month (3 hours a day), 2 escorts (up to 6 hours each), daily companion time, medicine check, WhatsApp update after every visit.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowCompareAllModal(false);
                    setShowCompanionWaitlistModal(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-bold text-xs text-center block transition cursor-pointer"
                >
                  Join the Companion waitlist
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#122617]/70 text-xs text-[#EBF2E8]/80 leading-relaxed">
              All plans include our 3-month minimum commitment, 14 to 60 day pause policy, and pro-rata refund for unused full months.
            </div>

            <div className="pt-1">
              <Link
                href="/plans"
                onClick={() => setShowCompareAllModal(false)}
                className="w-full py-3 rounded-xl bg-[#122617] border border-[#F5D328]/40 text-[#F5D328] font-bold text-xs text-center block transition"
              >
                Open Full Plans Page →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: COMPANION WAITLIST */}
      {showCompanionWaitlistModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#183825] border border-[#F5D328]/30 text-[#EBF2E8] rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-2xl animate-in fade-in zoom-in duration-150">
            <button
              type="button"
              onClick={() => setShowCompanionWaitlistModal(false)}
              className="absolute top-4 right-4 text-[#EBF2E8]/70 hover:text-white p-1 rounded-full cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F5D328]">Waitlist</span>
              <h3 className="text-xl font-bold text-white">Join the Companion Waitlist</h3>
              <p className="text-xs text-[#EBF2E8]/80">
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
                  Thank you <strong>{companionName}</strong>. We will message you on WhatsApp as soon as Companion spots open.
                </p>
                <div className="pt-1">
                  <a
                    href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20have%20joined%20the%20waitlist%20for%20the%2022-day%20Companion%20plan."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#25D366] text-white text-xs font-bold"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <select
                    required
                    value={companionCountryCode || countryCode}
                    onChange={(e) => setCompanionCountryCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white focus:outline-none focus:border-[#F5D328] text-xs cursor-pointer"
                  >
                    <option value="">Choose country</option>
                    <optgroup label="Popular Expats & NRK Regions" className="bg-[#122617] text-[#F5D328] font-bold">
                      {TOP_NRK_COUNTRIES.map((c) => (
                        <option key={`top_comp_${c.code}`} value={c.code} className="bg-[#122617] text-white font-normal">
                          {c.name} (+{c.dialCode})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="All Countries (A to Z)" className="bg-[#122617] text-[#F5D328] font-bold">
                      {ALL_COUNTRIES.map((c) => (
                        <option key={`all_comp_${c.code}`} value={c.code} className="bg-[#122617] text-white font-normal">
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
                      {(companionCountryCode || countryCode) && COUNTRIES.find((c) => c.code === (companionCountryCode || countryCode))
                        ? `+${COUNTRIES.find((c) => c.code === (companionCountryCode || countryCode))?.dialCode.replace(/[^0-9]/g, '')}`
                        : '+'}
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 50 123 4567"
                      value={companionPhoneDigits}
                      onChange={(e) => setCompanionPhoneDigits(e.target.value)}
                      className="w-full pl-16 pr-3.5 py-2.5 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs"
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
                  className="w-full py-3 px-4 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold text-xs transition cursor-pointer disabled:opacity-50"
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
      {/* MODAL: THREE PILLARS MOBILE BOTTOM DRAWER */}
      {showPillarDrawer && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-0"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-h-[90vh] bg-[#15301E] text-[#EBF2E8] rounded-t-3xl border-t border-[#F5D328]/35 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Top Drag Indicator & Switcher Tabs */}
            <div className="pt-3 pb-3 px-4 border-b border-[#F5D328]/20 bg-[#122617] sticky top-0 z-20 space-y-2.5">
              <div
                className="w-10 h-1 rounded-full bg-[#F5D328]/40 mx-auto cursor-pointer"
                onClick={() => setShowPillarDrawer(false)}
              />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[#183825] border border-[#F5D328]/25 text-xs font-bold overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setMobileDrawerPillar('vitality')}
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition ${
                      mobileDrawerPillar === 'vitality'
                        ? 'bg-[#F5D328] text-[#122116] shadow-xs font-bold'
                        : 'text-[#EBF2E8]/70 hover:text-[#F5D328]'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Vitality</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerPillar('joy')}
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition ${
                      mobileDrawerPillar === 'joy'
                        ? 'bg-[#F5D328] text-[#122116] shadow-xs font-bold'
                        : 'text-[#EBF2E8]/70 hover:text-[#F5D328]'
                    }`}
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Joy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerPillar('ease')}
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition ${
                      mobileDrawerPillar === 'ease'
                        ? 'bg-[#F5D328] text-[#122116] shadow-xs font-bold'
                        : 'text-[#EBF2E8]/70 hover:text-[#F5D328]'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Ease</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPillarDrawer(false)}
                  className="w-8 h-8 rounded-full bg-[#183825] border border-[#F5D328]/30 hover:bg-[#1f452e] text-[#F5D328] flex items-center justify-center shrink-0 transition"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="overflow-y-auto p-5 space-y-5">
              {mobileDrawerPillar === 'vitality' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5D328]">
                      Pillar 01 : Health
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      Vitality & Care
                    </h3>
                    <p className="text-xs text-[#EBF2E8]/85 leading-relaxed">
                      Door-to-door AC transport, doctor consultation notes, medicine refills, and hospital OPD accompaniment across Kochi.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-[#183825] border border-[#F5D328]/20 space-y-0.5">
                      <p className="font-bold text-[#F5D328]">Doctor of Choice</p>
                      <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Aster Medcity, Amrita, Lakeshore, Rajagiri, or your family doctor.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#183825] border border-[#F5D328]/20 space-y-0.5">
                      <p className="font-bold text-[#F5D328]">Medicine Checks & Refills</p>
                      <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Checked against prescription, verified with doctor or pharmacist, and coordinated refills.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#183825] border border-[#F5D328]/20 space-y-0.5">
                      <p className="font-bold text-[#F5D328]">24/7 Emergency Mobilization Support</p>
                      <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Call 108 first for acute trauma; our emergency coordination mobilizes your Care Buddy directly to the hospital bedside.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#183825] border border-[#F5D328]/20 space-y-0.5">
                      <p className="font-bold text-[#F5D328]">Home Lab & ECG Visits</p>
                      <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Doorstep blood draws and tests with reports uploaded to Care Passport.</p>
                    </div>
                  </div>

                  {/* Simulated OPD Log */}
                  <div className="p-4 rounded-xl bg-[#122116] border border-[#F5D328]/30 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#F5D328]/20 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                        <span className="text-xs font-bold text-[#F5D328]">Live OPD Escort Log</span>
                      </div>
                      <span className="text-[10px] text-[#EBF2E8]/60 font-mono">Aster Medcity</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2 text-[11px]">
                        <span className="font-mono text-[#F5D328] font-bold shrink-0">08:30 AM</span>
                        <p className="text-[#EBF2E8]/90">Doorstep AC Taxi Pickup by Care Buddy</p>
                      </div>
                      <div className="flex items-start gap-2 text-[11px]">
                        <span className="font-mono text-[#F5D328] font-bold shrink-0">09:15 AM</span>
                        <p className="text-[#EBF2E8]/90">Fast-Track Registration Token Handled</p>
                      </div>
                      <div className="flex items-start gap-2 text-[11px]">
                        <span className="font-mono text-[#F5D328] font-bold shrink-0">10:00 AM</span>
                        <p className="text-[#EBF2E8]/90">Doctor Consultation Notes Recorded</p>
                      </div>
                      <div className="flex items-start gap-2 text-[11px]">
                        <span className="font-mono text-[#F5D328] font-bold shrink-0">10:45 AM</span>
                        <p className="text-[#EBF2E8]/90">Pharmacy Pickup & Prescription Photo Sent</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {mobileDrawerPillar === 'joy' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5D328]">
                      Pillar 02 : Social & Mental
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      Joy & Connection
                    </h3>
                    <p className="text-xs text-[#EBF2E8]/85 leading-relaxed">
                      Unhurried companion tea chats, reading Malayalam news, tech coaching on WhatsApp video calls, and temple visits.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-[#183825] border border-[#F5D328]/20 space-y-0.5">
                      <p className="font-bold text-[#F5D328]">Companion Afternoon Tasters</p>
                      <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Dedicated 2 to 3 hour unhurried visits to read, chat, and relax.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#183825] border border-[#F5D328]/20 space-y-0.5">
                      <p className="font-bold text-[#F5D328]">Personal Shopper Service</p>
                      <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Accompanied trips for local grocery or textile shopping and online ordering.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#183825] border border-[#F5D328]/20 space-y-0.5">
                      <p className="font-bold text-[#F5D328]">Technology Mentorship</p>
                      <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Friendly coaching on WhatsApp video calls, iPad, YouTube, and digital payments.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#183825] border border-[#F5D328]/20 space-y-0.5">
                      <p className="font-bold text-[#F5D328]">Celebrations & Faith Outings</p>
                      <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Birthday surprises, festival treats, and visits to temple, church, or clubs.</p>
                    </div>
                  </div>

                  {/* Simulated Companion Visit */}
                  <div className="p-4 rounded-xl bg-[#122116] border border-[#F5D328]/30 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#F5D328]/20 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#F5D328] animate-pulse" />
                        <span className="text-xs font-bold text-[#F5D328]">Companion Afternoon Visit</span>
                      </div>
                      <span className="text-[10px] text-[#EBF2E8]/60 font-mono">2.5 Hour Session</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="text-[11px] text-[#EBF2E8]/90">• Tea & Mathrubhumi editorial discussion</p>
                      <p className="text-[11px] text-[#EBF2E8]/90">• WhatsApp video call hosted with family in Dubai</p>
                      <p className="text-[11px] text-[#EBF2E8]/90">• Accompanied peaceful temple darshan</p>
                    </div>
                  </div>
                </div>
              )}

              {mobileDrawerPillar === 'ease' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5D328]">
                      Pillar 03 : Home, Chores & Govt
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      Ease & Daily Living
                    </h3>
                    <p className="text-xs text-[#EBF2E8]/85 leading-relaxed">
                      Home safety fall audits, Jeevan Pramaan biometric pension certificates, utility bills, and verified handyman visits.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-[#183825] border border-[#F5D328]/20 space-y-0.5">
                      <p className="font-bold text-[#F5D328]">Errands & Bill Payments</p>
                      <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">KSEB electricity bills, municipal water taxes, and courier pickups.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#183825] border border-[#F5D328]/20 space-y-0.5">
                      <p className="font-bold text-[#F5D328]">Jeevan Pramaan (Pension)</p>
                      <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Biometric digital Life Certificate verification for central/state pension.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#183825] border border-[#F5D328]/20 space-y-0.5">
                      <p className="font-bold text-[#F5D328]">Home Safety Fall Audit</p>
                      <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">In-home audit checking grab bars, anti-slip mats, night lights, and fall prevention.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#183825] border border-[#F5D328]/20 space-y-0.5">
                      <p className="font-bold text-[#F5D328]">Verified Handyman Pool</p>
                      <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Electricians, plumbers, AC technicians, and deep-cleaning referrals.</p>
                    </div>
                  </div>

                  {/* Simulated Safety Card */}
                  <div className="p-4 rounded-xl bg-[#122116] border border-[#F5D328]/30 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#F5D328]/20 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                        <span className="text-xs font-bold text-[#F5D328]">Home Safety Audit Card</span>
                      </div>
                      <span className="text-[10px] text-[#EBF2E8]/60 font-mono">Score: 96 / 100</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-[#EBF2E8]/80">Bathroom Grab Bars:</span>
                        <span className="font-bold text-[#F5D328]">Installed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#EBF2E8]/80">Shower Non-Slip Mats:</span>
                        <span className="font-bold text-[#F5D328]">Placed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#EBF2E8]/80">Jeevan Pramaan (Pension):</span>
                        <span className="font-bold text-[#F5D328]">Biometric Done</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowPillarDrawer(false)}
                className="w-full py-3 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-bold text-xs text-center transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL: FULL PLAN INCLUSIONS POPUP */}
      {selectedInclusionPlan && (() => {
        const finalPrice = selectedInclusionPlan.pricePerMonthSingle;
        const finalPriceWithGst = Math.round(finalPrice * 1.18);
        const finalUsd = Math.round(finalPrice / 83.5);

        return (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedInclusionPlan(null)}
          >
            <div
              className="bg-[#142D1C] border-t sm:border border-[#F5D328]/30 text-[#EBF2E8] rounded-t-3xl sm:rounded-3xl w-full max-h-[85vh] flex flex-col relative shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-[#F5D328]/20 relative bg-[#183825]/90">
                <button
                  type="button"
                  onClick={() => setSelectedInclusionPlan(null)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#122617] border border-[#F5D328]/30 text-[#F5D328] hover:text-white flex items-center justify-center cursor-pointer transition"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1 pr-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5D328] bg-[#F5D328]/15 px-2 py-0.5 rounded-full inline-block">
                    Full Plan Scope &amp; Inclusions
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {selectedInclusionPlan.name}
                  </h3>
                  <p className="text-xs font-bold text-[#E8F0C8]">
                    {selectedInclusionPlan.tagline}
                  </p>
                  <div className="pt-2 flex flex-wrap items-baseline gap-1.5">
                    <span className="text-2xl font-black text-[#F5D328]">
                      ₹{finalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-[#EBF2E8]">
                      / month plus GST
                    </span>
                    <span className="text-[11px] text-[#EBF2E8]/70">
                      (₹{finalPriceWithGst.toLocaleString('en-IN')} incl. GST • ~${finalUsd} USD)
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto p-5 space-y-4 text-xs">
                {/* Touchpoint Highlights */}
                <div className="p-3.5 rounded-xl bg-[#122617] border border-[#F5D328]/25 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#F5D328]">
                    Care Metrics
                  </p>
                  <div className="space-y-1.5 text-xs font-semibold text-[#EBF2E8]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#F5D328] shrink-0" />
                      <span>{selectedInclusionPlan.touchpoints}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5 text-[#F5D328] shrink-0" />
                      <span>{selectedInclusionPlan.hospitalHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="w-3.5 h-3.5 text-[#F5D328] shrink-0" />
                      <span>{selectedInclusionPlan.companionTasters}</span>
                    </div>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#F5D328]">
                    Inclusions Checklist
                  </p>
                  <ul className="space-y-2 text-xs text-[#E0EBDC]">
                    {selectedInclusionPlan.features.map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-[#F5D328] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-[#183825]/60 border border-[#F5D328]/20 text-[11px] text-[#EBF2E8]/85 leading-relaxed">
                  Doctor consults, medicines, lab tests, and taxi rides paid directly at actuals with zero commission.
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[#F5D328]/20 bg-[#122617] flex items-center gap-2">
                <a
                  href={`https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20to%20ask%20about%20the%20${encodeURIComponent(selectedInclusionPlan.name)}%20plan%20for%20my%20parents.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs text-center bg-[#F5D328] text-[#122116] shadow-sm"
                >
                  Ask about {selectedInclusionPlan.name} on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedInclusionPlan(null)}
                  className="py-2.5 px-4 rounded-xl border border-white/20 text-[#EBF2E8] font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
