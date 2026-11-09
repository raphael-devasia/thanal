'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { COUNTRIES, detectVisitorCountry } from '@/types/waitlist';
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
  Users
} from 'lucide-react';

export default function MobileHome() {
  // Navigation & Bottom Bar State
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedWorry, setSelectedWorry] = useState<'hospital' | 'medicines' | 'afternoons'>('hospital');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showHowWeChooseModal, setShowHowWeChooseModal] = useState<boolean>(false);
  const [showCompareAllModal, setShowCompareAllModal] = useState<boolean>(false);

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

    const fullWhatsappNumber = `+${country.dialCode}${cleanNumber}`;

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
                  Want to try us first? One visit from ₹1,500 plus GST. See the card in the Plans section below.
                </p>
              </div>
            )}
            {selectedWorry === 'medicines' && (
              <p className="text-sm text-[#243B2B] leading-relaxed">
                We check medicines against the prescription, tell the doctor if something does not match, and arrange doorstep refills.
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

      {/* SCREEN 7: PLANS */}
      <section id="plans-mobile" className="py-12 px-4 bg-[#122617] text-white border-b border-[#183825]">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-[#F5D328] uppercase tracking-wider">Clear Membership</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Plans
            </h2>
          </div>

          {/* Two Stacked Cards */}
          <div className="space-y-4">
            {/* Plan 1: Care Essential */}
            <div className="p-5 rounded-2xl bg-[#183825] border border-[#F5D328]/30 text-white space-y-3">
              <div>
                <h3 className="text-lg font-bold text-white">Care Essential</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-[#F5D328]">₹6,000</span>
                  <span className="text-xs text-[#EBF2E8]/80">a month plus GST</span>
                </div>
                <p className="text-xs text-[#EBF2E8]/90 mt-2 leading-relaxed">
                  1 visit a week, 1 hospital escort.
                </p>
              </div>
              <a
                href={sampleWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#F2EFE6] text-[#122116] font-bold text-xs text-center block transition"
              >
                Inquire on WhatsApp
              </a>
            </div>

            {/* Plan 2: Care Plus */}
            <div className="p-5 rounded-2xl bg-[#162D1D] border-2 border-[#F5D328] text-white space-y-3 relative shadow-xl">
              <span className="absolute -top-2.5 right-4 bg-[#F5D328] text-[#122116] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                Recommended
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Care Plus</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-[#F5D328]">₹11,000</span>
                  <span className="text-xs text-[#EBF2E8]/80">a month plus GST</span>
                </div>
                <p className="text-xs text-[#EBF2E8]/90 mt-2 leading-relaxed">
                  2 visits a week, 2 hospital escorts.
                </p>
              </div>
              <a
                href={sampleWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold text-xs text-center block transition"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>

          {/* Single Hospital Visit Card */}
          <div className="p-5 rounded-2xl bg-[#F9F8F3] border border-[#183825]/20 text-[#122617] space-y-3 mt-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#183825]/60 bg-[#E8F0C8] px-2 py-0.5 rounded-full">Try before you subscribe</span>
              <h3 className="text-base font-bold text-[#122617] mt-2">Try us with one hospital visit</h3>
              <p className="text-xs text-[#374F3E] leading-relaxed mt-1.5">
                Your Care Buddy picks your parent up from home, stays through the visit, and brings them back. You get a voice note, the prescription photo and a summary on WhatsApp.
              </p>
              <div className="mt-2 space-y-1 text-xs text-[#2D4533]">
                <p>From ₹1,500 plus GST. Taxi at actuals, shown before you confirm. Up to 3 hours; ₹350 an hour after that, in 30-minute blocks.</p>
                <p>Free cancellation up to 12 hours before.</p>
              </div>
            </div>
            <a
              href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20a%20quote%20for%20a%20single%20hospital%20visit%20for%20my%20parent."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-[#122617] hover:bg-[#183825] text-white font-bold text-xs text-center block transition"
            >
              Ask for a quote on WhatsApp
            </a>
            <p className="text-[10px] text-[#374F3E]/80 text-center leading-relaxed">
              If you join a monthly plan within 30 days, we credit this visit against your first month.
            </p>
          </div>

          {/* Under Cards Terms & Link */}
          <div className="text-center space-y-2 pt-2">
            <p className="text-xs text-[#EBF2E8]/85 leading-relaxed font-normal">
              3-month minimum. Pause for 14 to 60 days. Unused full months refunded.
            </p>
            <div>
              <button
                type="button"
                onClick={() => setShowCompareAllModal(true)}
                className="text-xs text-[#F5D328] hover:underline font-bold cursor-pointer"
              >
                Compare all plans (Care Complete and the 22-day Companion plan live there)
              </button>
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
                  className="w-full px-3.5 py-3 rounded-xl bg-[#183825] border border-[#F5D328]/30 text-white focus:outline-none focus:border-[#F5D328] text-xs"
                >
                  <option value="">Choose country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#183825] text-white">
                      {c.name}
                    </option>
                  ))}
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
                      ? `+${COUNTRIES.find((c) => c.code === countryCode)?.dialCode}`
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
            A product of Zynthexion Technologies Private Limited, Kochi.
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
          <div className="bg-[#183825] border border-[#F5D328]/30 text-[#EBF2E8] rounded-2xl max-w-md w-full p-5 space-y-4 relative shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
            <button
              type="button"
              onClick={() => setShowCompareAllModal(false)}
              className="absolute top-4 right-4 text-[#EBF2E8]/70 hover:text-white p-1 rounded-full cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5D328]">Comprehensive Tiers</span>
              <h3 className="text-lg font-bold text-white">Compare All Care Plans</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#122617] border border-[#F5D328]/20 space-y-1">
                <div className="flex justify-between items-baseline font-bold text-[#F5D328]">
                  <span>Care Essential</span>
                  <span>₹6,000 / mo + GST</span>
                </div>
                <p className="text-[#EBF2E8]/80">1 visit a week, 1 hospital escort (up to 4 hours), weekly summary.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#122617] border border-[#F5D328] space-y-1">
                <div className="flex justify-between items-baseline font-bold text-[#F5D328]">
                  <span>Care Plus (Recommended)</span>
                  <span>₹11,000 / mo + GST</span>
                </div>
                <p className="text-[#EBF2E8]/80">2 visits a week, 2 hospital escorts (up to 5 hours each), full medicine checks.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#122617] border border-[#F5D328]/20 space-y-1">
                <div className="flex justify-between items-baseline font-bold text-[#F5D328]">
                  <span>Care Complete</span>
                  <span>₹18,000 / mo + GST</span>
                </div>
                <p className="text-[#EBF2E8]/80">3 visits a week, 3 hospital escorts (up to 6 hours each), weekly companion afternoons.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#122617] border border-dashed border-[#F5D328]/40 space-y-1">
                <div className="flex justify-between items-baseline font-bold text-[#F5D328]">
                  <span>Companion (Launching Soon)</span>
                  <span>₹20,000 / mo + GST</span>
                </div>
                <p className="text-[#EBF2E8]/80">22 days a month, 3 hours a day (66 companion hours/mo) for parents living alone. Join the waitlist.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#122617]/70 text-[11px] text-[#EBF2E8]/80 leading-relaxed">
              All plans include our 3-month minimum commitment, 14 to 60 day pause policy, and pro-rata refund for unused full months.
            </div>

            <div className="pt-2">
              <a
                href={sampleWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#F5D328] text-[#122116] font-extrabold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-[#122116] text-[#122116]" />
                <span>Discuss Plans on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
