'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import {
  KERALA_DISTRICTS,
  POPULAR_NRK_LOCATIONS
} from '@/types/waitlist';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HeartHandshake,
  Users,
  Lock,
  ArrowRight,
  Check,
  Stethoscope,
  Ambulance,
  Mic,
  Activity,
  PhoneCall,
  AlertCircle,
  Menu,
  X,
  MessageCircle
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function LandingPage() {
  // Lead Form State
  const [fullName, setFullName] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [nrkLocation, setNrkLocation] = useState<string>('Dubai, UAE');
  const [parentTown, setParentTown] = useState<string>('Kannur');

  // UI & Workflow State
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: string;
    orderId: string;
    isCallback?: boolean;
  } | null>(null);

  // Form Validation Helper
  const validateInputs = () => {
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    if (!whatsappNumber.trim()) {
      setErrorMessage('Please enter your WhatsApp number with country code.');
      return false;
    }
    if (!nrkLocation.trim()) {
      setErrorMessage('Please enter your current expat location (e.g. Dubai, UAE).');
      return false;
    }
    return true;
  };

  // Primary Action: Paid ₹1,000 Deposit Checkout Flow via Razorpay
  const handleDepositPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      // 1. Generate Order ID
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 })
      });

      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.message || 'Could not initiate payment order.');
      }

      const { orderId, amount, key } = orderData;

      // 2. Persist Lead to Database FIRST (status: 'Initiated') before launching checkout
      await recordLeadInDatabase(`PENDING_${Date.now().toString(36)}`, orderId, 'Initiated', 1000, false, true);

      // 3. Launch Razorpay Payment Modal
      const options = {
        key: key || 'rzp_test_mock12345',
        amount: amount,
        currency: 'INR',
        name: 'Thanal Eldercare',
        description: 'Kannur Pilot Deposit - Inaugural Spot Lock',
        order_id: orderId.startsWith('order_mock_') ? undefined : orderId,
        prefill: {
          name: fullName,
          contact: whatsappNumber
        },
        theme: {
          color: '#E66323'
        },
        handler: async function (response: any) {
          const payId = response.razorpay_payment_id || `pay_mock_${Date.now().toString(36)}`;
          await recordLeadInDatabase(payId, orderId, 'paid', 1000, false);
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      if (typeof window !== 'undefined' && window.Razorpay && !orderId.startsWith('order_mock_')) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setTimeout(async () => {
          const mockPaymentId = `pay_simulated_${Date.now().toString(36)}`;
          await recordLeadInDatabase(mockPaymentId, orderId, 'paid', 1000, false);
        }, 1200);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMessage(err?.message || 'Payment initiation failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Secondary Action: Care Manager Callback Request Flow
  const handleCallbackRequest = async () => {
    setErrorMessage(null);
    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      const mockPayId = `CALLBACK_${Date.now().toString(36)}`;
      const mockOrderId = `req_${Date.now().toString(36)}`;

      await recordLeadInDatabase(mockPayId, mockOrderId, 'Callback_Requested', 0, true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit call request. Please try again.');
      setIsSubmitting(false);
    }
  };

  const recordLeadInDatabase = async (
    paymentId: string,
    orderId: string,
    status: 'paid' | 'Callback_Requested' | 'Initiated',
    depositAmount: number,
    isCallback: boolean = false,
    isInitialSaveOnly: boolean = false
  ) => {
    try {
      const payload = {
        fullName,
        whatsappNumber,
        nrkLocation,
        parentDistrict: parentTown || 'Kannur',
        parentMode: 'single',
        selectedPlan: isCallback ? 'callback_request' : 'active_care',
        selectedPlanName: isCallback
          ? 'Inaugural Pilot Lead (Callback Requested)'
          : 'Inaugural Pilot Plan (₹7,000/mo)',
        selectedAddOns: [],
        paymentId,
        orderId,
        paymentStatus: status,
        depositAmount
      };

      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Lead registration failed.');
      }

      if (!isInitialSaveOnly) {
        setPaymentDetails({ paymentId, orderId, isCallback });
        setSuccessModal(true);
      }
    } catch (err: any) {
      if (!isInitialSaveOnly) {
        setErrorMessage(err?.message || 'Registration failed. Please contact Thanal support.');
      }
    } finally {
      if (!isInitialSaveOnly) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#E66323] selection:text-white">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* 1. HEADER (Logo + Direct 'Reserve Spot' Action) */}
      <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-24 sm:h-28 flex items-center justify-between relative">

          {/* Centered Logo on Mobile, Left-aligned on Desktop */}
          <div className="flex-1 md:flex-initial flex justify-center md:justify-start md:mr-auto -ml-0 md:-ml-6 lg:-ml-8">
            <Link href="/" className="inline-block hover:opacity-90 transition">
              <img
                src="/images/logo.png"
                alt="Thanal Eldercare Concierge"
                className="h-16 sm:h-20 lg:h-24 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right Navigation & Mobile Hamburger Button */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#everything-you-get"
                className="inline-flex items-center text-sm font-bold text-[#E66323] hover:text-[#d55516] transition"
              >
                What You Get
              </a>
              <a
                href="#pricing-section"
                className="inline-flex items-center text-sm font-bold text-[#E66323] hover:text-[#d55516] transition"
              >
                Pilot Pricing
              </a>
              <a
                href="#checkout-section"
                className="text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white transition flex items-center gap-2 shadow-lg shadow-[#E66323]/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Reserve Your Spot</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </a>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/90 shadow-md border border-slate-200 text-[#044749] hover:text-[#E66323] transition focus:outline-none z-50 absolute right-4"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#E66323]" /> : <Menu className="w-6 h-6 text-[#044749]" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-24 z-50 bg-white/98 backdrop-blur-xl border-b border-slate-200 px-6 py-8 flex flex-col justify-between shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col space-y-4 text-center">
              <a
                href="#everything-you-get"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-[#044749] hover:text-[#E66323] py-2.5 border-b border-slate-100 transition"
              >
                What You Get
              </a>
              <a
                href="#pricing-section"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-[#044749] hover:text-[#E66323] py-2.5 border-b border-slate-100 transition"
              >
                Pilot Pricing
              </a>
              <a
                href="#checkout-section"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 w-full py-3.5 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-extrabold text-base transition flex items-center justify-center gap-2 shadow-lg shadow-[#E66323]/25"
              >
                <span>Reserve Your Spot</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION (Emotional Hook + 40-Family Scarcity Pill) */}
      <section className="relative overflow-hidden bg-white min-h-screen flex items-center pt-24 pb-12 lg:pt-28 lg:pb-16">
        {/* Sweeping Orange Background Image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <img
            src="/images/hero_thanal.png"
            alt="Hero background curve"
            className="w-full h-full object-cover object-right"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column: 3 Regular Hexagons with Equal Spacing & All Sides Equal */}
            <div className="hidden lg:flex lg:col-span-6 justify-center lg:justify-start relative py-6">
              <div className="relative w-[544px] h-[546px]">
                {/* Regular Hexagon 1 (Top Left) */}
                <div
                  className="absolute top-0 left-0 w-[260px] h-[300px] shadow-2xl transition-transform hover:scale-105 overflow-hidden"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <img
                    src="/images/hero1.png"
                    alt="Thanal Eldercare Companion 1"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Regular Hexagon 2 (Top Right) */}
                <div
                  className="absolute top-0 left-[284px] w-[260px] h-[300px] shadow-2xl transition-transform hover:scale-105 overflow-hidden"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <img
                    src="/images/hero2.png"
                    alt="Thanal Eldercare Companion 2"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Regular Hexagon 3 (Bottom Center - Equal Spacing from Both) */}
                <div
                  className="absolute top-[246px] left-[142px] w-[260px] h-[300px] shadow-2xl transition-transform hover:scale-105 overflow-hidden"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <img
                    src="/images/hero3.jpg"
                    alt="Thanal Eldercare Companion 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Scarcity Pill, Headline & Copy */}
            <div className="lg:col-span-6 text-left text-white space-y-6 pt-4 lg:pt-0">
              {/* Scarcity Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF3EB] border border-[#E66323]/25 text-[#E66323] text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-4 h-4 text-[#E66323]" />
                <span>Exclusive Pilot Launch • First 40 Families Only</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.18]">
                When your parents need help back home, who is standing beside them?
              </h1>

              <p className="text-white/95 text-base sm:text-lg leading-relaxed font-normal max-w-xl">
                You are building a future across oceans, but home never leaves your mind. When unexpected hospital lines, complicated prescriptions, or sudden emergencies arise, frantic long-distance phone calls simply aren’t enough. Thanal steps in as your trusted family proxy on the ground—handling doctor visits, daily care, and hospital runs with real-time updates sent straight to your phone.
              </p>

              <div className="pt-2">
                <a
                  href="#checkout-section"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#044749] hover:bg-[#033436] text-white font-extrabold text-base sm:text-lg shadow-2xl transition-all hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>Reserve Your Spot</span>
                  <ArrowRight className="w-5 h-5 text-[#E66323]" />
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. WHAT YOU GET (4 Visual Care Cards) */}
      <section id="everything-you-get" className="py-20 lg:py-26 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-[#044749]/10 text-[#044749] border border-[#044749]/20 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-4 inline-block uppercase tracking-wider">
            Full Service Breakdown
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#044749] tracking-tight mb-5">
            Everything Your Family Receives with Thanal
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            4 core pillars of complete end-to-end operational care so you never have to guess about your parent's health again.
          </p>
        </div>

        {/* 4 Care Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-[#E66323]/50 transition flex flex-col justify-between shadow-md group">
            <div>
              <div className="w-14 h-14 rounded-xl bg-[#E66323]/10 border border-[#E66323]/20 flex items-center justify-center text-[#E66323] mb-5 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#044749] mb-3">1. Door-to-Door Hospital Escort</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                AC pickup from home in Kannur, token queue navigation, waiting beside them during doctor consults, and safe return home.
              </p>
            </div>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2.5 pt-4 border-t border-slate-200 font-semibold">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E66323] shrink-0" /> AC Vehicle Pickup & Drop</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E66323] shrink-0" /> Token & Billing Queue Support</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-[#E66323]/50 transition flex flex-col justify-between shadow-md group">
            <div>
              <div className="w-14 h-14 rounded-xl bg-[#044749]/10 border border-[#044749]/20 flex items-center justify-center text-[#044749] mb-5 group-hover:scale-110 transition-transform">
                <Mic className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#044749] mb-3">2. Instant Voice & WhatsApp Updates</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                60-second Malayalam/English audio summaries recorded immediately after doctor consults + clear prescription photos sent directly to your phone.
              </p>
            </div>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2.5 pt-4 border-t border-slate-200 font-semibold">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E66323] shrink-0" /> 60-Sec Post-Consult Voice Briefing</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E66323] shrink-0" /> Instant Scanned Prescription Upload</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-[#E66323]/50 transition flex flex-col justify-between shadow-md group">
            <div>
              <div className="w-14 h-14 rounded-xl bg-[#E66323]/10 border border-[#E66323]/20 flex items-center justify-center text-[#E66323] mb-5 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#044749] mb-3">3. At-Home Care & Vitals Audits</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                Routine home health checks (BP, Sugar, SpO2) by trained care professionals + chronic medicine refills delivered straight to their door.
              </p>
            </div>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2.5 pt-4 border-t border-slate-200 font-semibold">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E66323] shrink-0" /> In-Home Vitals & Wellness Checks</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E66323] shrink-0" /> Monthly Chronic Medicine Refills</li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-[#E66323]/50 transition flex flex-col justify-between shadow-md group">
            <div>
              <div className="w-14 h-14 rounded-xl bg-[#044749]/10 border border-[#044749]/20 flex items-center justify-center text-[#044749] mb-5 group-hover:scale-110 transition-transform">
                <Ambulance className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#044749] mb-3">4. 24/7 Rapid SOS Support</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                Dedicated Kannur emergency helpline with fast ambulance dispatch and instant hospital admission coordination for children abroad.
              </p>
            </div>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2.5 pt-4 border-t border-slate-200 font-semibold">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E66323] shrink-0" /> Dedicated 24/7 Emergency Helpline</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E66323] shrink-0" /> Hospital Admission Coordination</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. THE 3-STEP PILOT JOURNEY & PILOT PRICING */}
      <section id="pricing-section" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 3-Step Journey Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#044749] mb-4">
              How Thanal Works in 3 Simple Steps
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Simple, transparent, and built specifically for NRK families abroad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-16">
            <div className="relative p-7 rounded-2xl bg-white border border-slate-200 shadow-md">
              <div className="w-12 h-12 rounded-full bg-[#E66323] text-white font-black flex items-center justify-center text-xl mb-5 shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-[#044749] mb-2">Reserve Pilot Spot</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pay a ₹1,000 INR fully refundable deposit to secure 1 of 40 Phase 1 pilot spots in Kannur.
              </p>
            </div>

            <div className="relative p-7 rounded-2xl bg-white border border-slate-200 shadow-md">
              <div className="w-12 h-12 rounded-full bg-[#044749] text-white font-black flex items-center justify-center text-xl mb-5 shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-[#044749] mb-2">Parent Onboarding Visit</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our local Care Manager visits your parents in Kannur to complete medical history mapping and introduce their dedicated companion.
              </p>
            </div>

            <div className="relative p-7 rounded-2xl bg-white border border-slate-200 shadow-md">
              <div className="w-12 h-12 rounded-full bg-[#E66323] text-white font-black flex items-center justify-center text-xl mb-5 shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-[#044749] mb-2">Total Peace of Mind</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive instant WhatsApp voice briefings after every hospital visit while your parents receive royal treatment back home.
              </p>
            </div>
          </div>

          {/* Single Pilot Spotlight Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-[#E66323] shadow-2xl shadow-[#E66323]/15 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#E66323] text-white text-xs uppercase font-extrabold tracking-wider px-5 py-2 rounded-bl-2xl shadow-md">
              Phase 1 Inaugural Offer
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <span className="text-xs sm:text-sm font-bold text-[#E66323] uppercase tracking-wider block">
                  Kannur Operations Pilot
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#044749]">
                  Inaugural Pilot Pricing
                </h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-[#044749]">₹7,000</span>
                  <span className="text-slate-500 font-bold text-lg">/ month</span>
                  <span className="text-xs sm:text-sm text-slate-500 font-semibold">(~$85 USD / month)</span>
                </div>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                  Includes complete hospital escorts, monthly vitals audits, medicine delivery, and 24/7 emergency dispatch.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <Check className="w-4 h-4 text-[#E66323] shrink-0" />
                    <span>Door-to-Door AC Escorts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <Check className="w-4 h-4 text-[#E66323] shrink-0" />
                    <span>60-Sec WhatsApp Voice Notes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <Check className="w-4 h-4 text-[#E66323] shrink-0" />
                    <span>Monthly Medicine Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <Check className="w-4 h-4 text-[#E66323] shrink-0" />
                    <span>24/7 SOS Emergency Response</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-end justify-center gap-4 text-center lg:text-right pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                <a
                  href="#checkout-section"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-extrabold text-base sm:text-lg shadow-xl shadow-[#E66323]/25 transition hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2"
                >
                  <span>Lock In Spot #12 of 40</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </a>
                <p className="text-xs text-slate-500 max-w-xs font-medium leading-relaxed">
                  (Couple coverage available during onboarding. Fully refundable ₹1,000 deposit locks in launch pricing).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STREAMLINED WAITLIST FORM (Name, WhatsApp, Location, Parent Town) */}
      <section id="checkout-section" className="w-full bg-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E66323]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="inline-block bg-[#E66323]/10 text-[#E66323] border border-[#E66323]/20 text-xs sm:text-sm font-bold px-4 py-1 rounded-full mb-3 uppercase tracking-wider">
                Phase 1 Pilot Registration
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#044749] mb-3">
                Reserve Your Spot for the Inaugural Launch
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Lock in 1 of 40 pilot spots with a 100% refundable ₹1,000 deposit, or request a call from our Care Manager.
              </p>
            </div>

            <form onSubmit={handleDepositPayment} className="space-y-6 max-w-2xl mx-auto">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#044749] uppercase tracking-wider mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E66323] focus:ring-1 focus:ring-[#E66323] text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#044749] uppercase tracking-wider mb-2">
                    WhatsApp Number (with Country Code) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +971 50 123 4567"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E66323] focus:ring-1 focus:ring-[#E66323] text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#044749] uppercase tracking-wider mb-2">
                    Current Expat Location (City / Country) *
                  </label>
                  <input
                    type="text"
                    required
                    list="nrk-locations"
                    placeholder="e.g. Dubai, London, Dallas"
                    value={nrkLocation}
                    onChange={(e) => setNrkLocation(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E66323] focus:ring-1 focus:ring-[#E66323] text-base"
                  />
                  <datalist id="nrk-locations">
                    {POPULAR_NRK_LOCATIONS.map((loc, idx) => (
                      <option key={idx} value={loc} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#044749] uppercase tracking-wider mb-2">
                    Parent's Town / Area in Kannur *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Payyannur, Taliparamba, Kannur City"
                    value={parentTown}
                    onChange={(e) => setParentTown(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E66323] focus:ring-1 focus:ring-[#E66323] text-base"
                  />
                  <p className="text-xs text-slate-500 font-medium pt-1.5 leading-tight">
                    Initial pilot launch limited to families within a 5 km radius of partner hospital facilities.
                  </p>
                </div>
              </div>

              {/* Plan Summary Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm space-y-3">
                <div className="flex justify-between items-center text-slate-700 font-medium">
                  <span>Selected Coverage:</span>
                  <span className="font-bold text-[#044749]">Thanal Inaugural Pilot Plan (₹7,000/mo at Launch)</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base">
                  <span className="font-bold text-[#044749]">Deposit Amount Due Today:</span>
                  <span className="font-extrabold text-xl text-[#E66323]">₹1,000 INR (100% Refundable Deposit)</span>
                </div>
              </div>

              {/* Submission Actions */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4.5 px-6 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-extrabold text-lg shadow-xl shadow-[#E66323]/25 transition flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Lock className="w-5 h-5 text-white" />
                  {isSubmitting ? (
                    <span>Processing Registration...</span>
                  ) : (
                    <span>Pay ₹1,000 Deposit & Lock Spot #12 of 40</span>
                  )}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleCallbackRequest}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#044749] hover:text-[#E66323] transition underline underline-offset-4"
                  >
                    <PhoneCall className="w-4 h-4 text-[#E66323]" />
                    <span>Talk to a Care Manager First</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <p className="text-sm text-[#044749] font-bold flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#E66323] shrink-0" />
                    <span>100% Fully Refundable if you change your mind before launch.</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Secured by Razorpay • 256-bit Encrypted Payment • Instant Electronic Receipt
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER & LEGAL (2-Column Layout) */}
      <footer className="relative bg-[#044749] text-white pt-36 pb-12 sm:pb-16 lg:pt-48 lg:pb-20 min-h-[480px] lg:min-h-[580px] flex flex-col justify-end items-center overflow-hidden">
        {/* Footer SVG Wave Background */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden pointer-events-none leading-none z-10">
          <svg
            viewBox="0 0 1320 241"
            className="w-full h-16 sm:h-24 lg:h-32 block fill-white"
            preserveAspectRatio="none"
          >
            <path d="M0,0 H1320 s-742.122,227.93 -923.3,237.008 S0,21.994 0,21.994 Z" />
          </svg>
        </div>

        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center md:items-start">
            {/* Left Column: Brand & Company Description */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
              <Link href="/" className="inline-block hover:opacity-90 transition">
                <img
                  src="/images/logo.png"
                  alt="Thanal Eldercare Concierge"
                  className="h-16 sm:h-20 lg:h-24 w-auto object-contain mx-auto md:mx-0"
                />
              </Link>
              <p className="text-white font-bold text-base sm:text-lg">
                Thanal is a product of{' '}
                <a 
                  href="https://zynthexion.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#E66323] hover:underline"
                >
                  Zynthexion Technologies Pvt. Ltd.
                </a>
              </p>
              <p className="max-w-lg text-teal-100 leading-relaxed text-sm sm:text-base">
                Dedicated eldercare accompaniment across Kerala. Bridging the distance for families abroad with ethical, zero-commission healthcare logistics and complete peace of mind.
              </p>
              <div className="text-xs text-teal-200/90 space-y-1 pt-2 font-normal border-t border-teal-800/60 w-full">
                <p className="font-bold text-teal-100">Registered Office:</p>
                <p className="font-semibold text-white">Zynthexion Technologies Private Limited</p>
                <p>Suite No. A96, Door No. 63/700, D Space, 6th Floor, Sky Tower,</p>
                <p>Mavoor Road Junction, Bank Road, Kozhikode - 673001, Kerala</p>
              </div>
            </div>

            {/* Right Column: WhatsApp Contact, Legal Links & Copyright */}
            <div className="flex flex-col items-center md:items-end justify-between h-full space-y-6 text-center md:text-right pt-4 md:pt-0">
              
              {/* WhatsApp Contact Section */}
              <a
                href="https://wa.me/919496097611?text=Hi%20Thanal%20Team%2C%20I%20would%20like%20to%20know%20more%20about%20your%20care%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center md:items-end gap-1.5 hover:opacity-90 transition text-center md:text-right"
              >
                <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#25D366] shrink-0" />
                  <span>Message us on WhatsApp</span>
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#E66323] tracking-tight group-hover:underline">
                  +91 9496097611
                </span>
              </a>

              {/* Policy Links */}
              <div className="flex flex-col items-center md:items-end gap-3 text-sm sm:text-base text-teal-100 font-bold">
                <Link href="/terms" className="hover:text-[#E66323] transition">
                  Terms & Conditions
                </Link>
                <Link href="/privacy" className="hover:text-[#E66323] transition">
                  Privacy Policy
                </Link>
                <Link href="/refund-policy" className="hover:text-[#E66323] transition">
                  Refund & Cancellation Policy
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-teal-300 pt-4 border-t border-teal-800/80 w-full md:w-auto text-center md:text-right">
                © {new Date().getFullYear()} Thanal. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* SUCCESS CONFIRMATION MODAL */}
      {successModal && paymentDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-7 sm:p-9 max-w-lg w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="w-18 h-18 rounded-full bg-[#E66323]/10 border border-[#E66323] flex items-center justify-center text-[#E66323] mx-auto mb-5">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h3 className="text-3xl font-extrabold text-[#044749] mb-2">
              {paymentDetails.isCallback ? 'Call Request Received!' : 'Spot Secured!'}
            </h3>
            <p className="text-slate-600 text-base mb-6 leading-relaxed">
              {paymentDetails.isCallback ? (
                <>Thank you <strong>{fullName}</strong>. Our local Kannur Care Manager will reach out to your WhatsApp number (<strong>{whatsappNumber}</strong>) shortly to answer all your questions.</>
              ) : (
                <>Thank you <strong>{fullName}</strong>. Your deposit of <strong>₹1,000 INR</strong> has been received and your spot is locked.</>
              )}
            </p>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-sm text-slate-700 space-y-2.5 mb-7">
              <div className="flex justify-between">
                <span>Reference Code:</span>
                <span className="font-mono text-[#E66323] font-bold">{paymentDetails.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span>Parent's Location:</span>
                <span className="text-[#044749] font-bold">{parentTown}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-[#E66323] font-bold">
                  {paymentDetails.isCallback ? 'Care Manager Call Pending' : 'Paid & Confirmed'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              <Link
                href="/admin"
                className="w-full py-3.5 rounded-xl bg-[#E66323] text-white font-bold text-base hover:bg-[#d55516] transition block shadow-md"
              >
                View Lead on Admin Dashboard
              </Link>
              <button
                type="button"
                onClick={() => setSuccessModal(false)}
                className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
