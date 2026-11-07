'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
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
  MessageCircle,
  FileText,
  ChevronDown,
  Clock,
  ShoppingBag,
  Smartphone,
  Home,
  Award,
  HelpCircle,
  Calendar,
  Building2,
  Play,
  Volume2,
  CheckCheck,
  MapPin,
  Car,
  Heart,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import {
  PLANS,
  ParentMode,
  POPULAR_NRK_LOCATIONS,
  KERALA_DISTRICTS
} from '@/types/waitlist';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';

export default function LandingPage() {
  // Plan Toggle & Selection State
  const [parentMode, setParentMode] = useState<ParentMode>('single');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('care_plus');

  // Interactive Pillars Tab State
  const [activePillarTab, setActivePillarTab] = useState<'vitality' | 'joy' | 'ease'>('vitality');

  // Matrix Collapsible Drawer State
  const [showCompareMatrix, setShowCompareMatrix] = useState<boolean>(false);

  // Quick Plan Recommender State
  const [recommenderChoice, setRecommenderChoice] = useState<'routine' | 'chronic' | 'intensive' | null>(null);

  // Lead Form State
  const [fullName, setFullName] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [nrkLocation, setNrkLocation] = useState<string>('');
  const [parentTown, setParentTown] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // UI & Workflow State
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [isPlayingAudioDemo, setIsPlayingAudioDemo] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: string;
    orderId: string;
    isCallback?: boolean;
  } | null>(null);

  // FAQ Accordion State (open question indices)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

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
    if (!parentTown.trim()) {
      setErrorMessage("Please enter your parent's city or town in Kerala (e.g. Kochi, Ernakulam, Thrissur).");
      return false;
    }
    return true;
  };

  const getActivePlanName = () => {
    const plan = PLANS.find((p) => p.id === selectedPlanId);
    return plan ? plan.name : 'Thanal Care Plus Plan';
  };

  // Scroll to Form and select plan
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    const elem = document.getElementById('checkout-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mobile horizontal snap carousel scroll helper
  const scrollToPlanCard = (planId: string) => {
    setSelectedPlanId(planId);
    if (typeof window !== 'undefined') {
      const card = document.getElementById(`plan-card-${planId}`);
      if (card && window.innerWidth < 768) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  // Primary Action: Submit Care Spot Registration (Zero online payment today)
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      const leadId = `THANAL_${Date.now().toString(36)}`;
      const orderId = `ord_${Date.now().toString(36)}`;

      await recordLeadInDatabase(leadId, orderId, 'Lead_Submitted', 0, false);
    } catch (err: any) {
      console.error('Lead submission error:', err);
      setErrorMessage(err?.message || 'Reservation failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Secondary Action: Talk to Care Manager First on WhatsApp
  const handleCallbackRequest = async () => {
    setErrorMessage(null);
    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      const leadId = `WA_CARE_${Date.now().toString(36)}`;
      const orderId = `wa_ord_${Date.now().toString(36)}`;

      await recordLeadInDatabase(leadId, orderId, 'Callback_Requested', 0, true);

      const planName = getActivePlanName();
      const messageText = `Hi Thanal Care Team,\n\nI would like to inquire about Thanal eldercare for my parents in Kerala.\n\n• Name: ${fullName}\n• WhatsApp: ${whatsappNumber}\n• Expat Location: ${nrkLocation}\n• Parents' Location: ${parentTown}\n• Interested Plan: ${planName} (${parentMode === 'couple' ? 'Couple Plan' : 'Single Parent'})\n• Billing Preference: ${billingCycle === 'quarterly' ? 'Quarterly (10% Off)' : 'Monthly'}\n${additionalNotes ? `• Notes: ${additionalNotes}\n` : ''}\nPlease let me know when we can connect.`;

      const waUrl = `https://wa.me/919496097611?text=${encodeURIComponent(messageText)}`;

      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit request. Please try again.');
      setIsSubmitting(false);
    }
  };

  const recordLeadInDatabase = async (
    paymentId: string,
    orderId: string,
    status: 'paid' | 'Callback_Requested' | 'Initiated' | 'Lead_Submitted',
    depositAmount: number = 0,
    isCallback: boolean = false
  ) => {
    try {
      const payload = {
        fullName,
        whatsappNumber,
        nrkLocation,
        parentDistrict: parentTown,
        parentMode,
        selectedPlan: selectedPlanId,
        selectedPlanName: `${getActivePlanName()} (${parentMode === 'couple' ? 'Couple' : 'Single'}, ${billingCycle})`,
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
        throw new Error(data.message || 'Registration failed.');
      }

      setPaymentDetails({ paymentId, orderId, isCallback });
      setSuccessModal(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed. Please contact Thanal support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'What is a Care Buddy, and how is Thanal different from a home nurse or agency maid?',
      a: "A Care Buddy is not an impersonal agency nurse or domestic helper. Think of them as your dedicated proxy: the child on the ground in Kerala. Your Care Buddy is an educated, background-verified professional (MSW graduates, retired nurses, or trained care specialists) assigned personally to your parents. They visit regularly, get to know your parent's unique medical routine and personality, escort them to doctor appointments, coordinate hospital visits, run essential errands, and provide warm companionship. You receive direct WhatsApp voice briefings and photos after every single visit."
    },
    {
      q: 'What happens during a medical emergency?',
      a: 'In an acute emergency, our protocol is immediate and swift: the ambulance is dispatched first, while your dedicated Care Buddy rushes directly to the hospital or your parents’ home. The Buddy assists with admission formalities, communicates with the emergency room doctors, keeps you immediately informed via phone and WhatsApp, and helps determine whether you need to book a flight home. Backup support is maintained 24/7 by our founder and care operations team.'
    },
    {
      q: 'Can our parents consult their existing family doctor or preferred hospital in Kerala?',
      a: 'Absolutely yes. While we partner with anchor hospitals in Kochi (such as Aster Medcity, Amrita, Lakeshore, Rajagiri, Medical Trust, and Lourdes) for priority access and OPD coordination, your parents’ trusted family doctor of choice is always respected and prioritized. Your Care Buddy will escort them to their preferred clinic or hospital anywhere in the service area.'
    },
    {
      q: 'How do you keep children abroad updated across different time zones (Gulf, UK, US, Australia)?',
      a: "Unlike generic apps that require logging into an unfamiliar portal, Thanal is WhatsApp-first. After every visit or hospital consult, your Care Buddy sends a 60-second Malayalam or English voice note and high-resolution photos of prescriptions or test slips. In addition, we schedule regular parent-and-child video calls hosted by the Care Buddy at a fixed day and time tailored to your international time zone."
    },
    {
      q: 'How does the couple discount work for both parents?',
      a: 'We offer a straightforward, transparent 25% discount on the second parent for all plans. For example, on the Care Plus plan (₹11,000/month for a single parent), coverage for both parents is ₹19,250/month (₹11,000 + ₹8,250). Both parents receive comprehensive wellness monitoring, hospital accompaniment, and companionship.'
    },
    {
      q: 'What is your refund and cancellation policy?',
      a: 'We operate on a 3-month initial commitment to establish a meaningful, dependable relationship with your parents and build their complete Care Passport. If your family wishes to withdraw for any reason, we provide a 100% pro-rata refund for all unused full months. There are zero cancellation penalties.'
    },
    {
      q: 'How are hospital bills, pharmacy refills, and taxi fares billed?',
      a: 'With 100% financial transparency. Thanal never charges commissions or hidden markups on medical services. Doctor consultation fees, lab tests, medications, and taxi fares are paid directly at actuals to the service providers. For transport, your Care Buddy rides in the same vehicle so there is never a second fare. For overseas children who prefer not to deal in local cash, we offer an optional prepaid travel and pharmacy wallet reconciled monthly with receipts.'
    },
    {
      q: 'How are Care Buddies vetted and trained?',
      a: 'Every Thanal team member undergoes mandatory local police verification, government identity validation, and caregiver credential checks. Before their first solo visit, they complete a 2 to 3 week intensive training curriculum covering elder psychology, dementia basics, vital signs monitoring, safe physical transfers, first aid & CPR, data privacy, and emergency drills.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 font-sans selection:bg-[#E66323] selection:text-white overflow-x-hidden w-full max-w-full pb-24 sm:pb-0">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* 1. COMPACT RESPONSIVE HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="inline-block hover:opacity-90 transition">
            <img
              src="/images/logo.png"
              alt="Thanal Eldercare Concierge"
              className="h-10 sm:h-14 lg:h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <a
              href="#care-buddy-concept"
              className="text-sm font-semibold text-slate-700 hover:text-[#044749] transition"
            >
              The Care Buddy
            </a>
            <a
              href="#whatsapp-experience"
              className="text-sm font-semibold text-slate-700 hover:text-[#044749] transition flex items-center gap-1.5"
            >
              <span>Live Updates</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </a>
            <a
              href="#three-pillars"
              className="text-sm font-semibold text-slate-700 hover:text-[#044749] transition"
            >
              Our 3 Pillars
            </a>
            <a
              href="#pricing-section"
              className="text-sm font-semibold text-slate-700 hover:text-[#044749] transition"
            >
              Care Plans
            </a>
            <Link
              href="/luxury-living"
              className="text-xs sm:text-sm font-bold text-[#E66323] hover:text-[#d55516] transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200/80 hover:bg-orange-100/70 shadow-xs"
            >
              <span>Luxury Living</span>
            </Link>
            <a
              href="#faqs-section"
              className="text-sm font-semibold text-slate-700 hover:text-[#044749] transition"
            >
              FAQs
            </a>
            <a
              href="#checkout-section"
              className="text-xs sm:text-sm font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white transition flex items-center gap-2 shadow-md shadow-[#E66323]/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Reserve Spot</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </a>
          </nav>

          {/* Mobile Right Controls: WhatsApp Quick Icon + Hamburger */}
          <div className="flex items-center gap-2.5 md:hidden">
            <a
              href="https://wa.me/919496097611?text=Hi%20Thanal%20Team%2C%20I%20live%20abroad%20and%20would%20like%20to%20learn%20more%20about%20your%20care%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-[#044749] hover:text-[#E66323] transition focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#E66323]" /> : <Menu className="w-5 h-5 text-[#044749]" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Backdrop */}
        {mobileMenuOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="md:hidden fixed inset-x-0 top-16 z-50 bg-white border-b border-slate-200 px-5 py-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex flex-col space-y-2.5">
                <a
                  href="#care-buddy-concept"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-800 hover:text-[#044749] py-2 px-3 rounded-lg hover:bg-slate-50 transition"
                >
                  The Care Buddy
                </a>
                <a
                  href="#whatsapp-experience"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-800 hover:text-[#044749] py-2 px-3 rounded-lg hover:bg-slate-50 transition flex items-center justify-between"
                >
                  <span>Live WhatsApp Updates</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Demo</span>
                </a>
                <a
                  href="#three-pillars"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-800 hover:text-[#044749] py-2 px-3 rounded-lg hover:bg-slate-50 transition"
                >
                  Our 3 Pillars
                </a>
                <a
                  href="#pricing-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-800 hover:text-[#044749] py-2 px-3 rounded-lg hover:bg-slate-50 transition"
                >
                  Care Plans & Pricing
                </a>
                <Link
                  href="/luxury-living"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-[#E66323] hover:text-[#d55516] py-2 px-3 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-between transition"
                >
                  <span>Luxury Living</span>
                </Link>
                <a
                  href="#faqs-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-800 hover:text-[#044749] py-2 px-3 rounded-lg hover:bg-slate-50 transition"
                >
                  Frequently Asked Questions
                </a>
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <a
                    href="#checkout-section"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl bg-[#E66323] text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-[#E66323]/25"
                  >
                    <span>Reserve Spot</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="https://wa.me/919496097611?text=Hi%20Thanal%20Team%2C%20I%20would%20like%20to%20learn%20more%20about%20care%20for%20my%20parents%20in%20Kerala."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 text-[#044749] font-bold text-xs text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Talk to Care Manager on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* 2. HERO SECTION (Clean, Responsive, Mobile-First) */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Column: Typography & Action on Desktop / Top on Mobile */}
            <div className="col-span-12 lg:col-span-6 text-left">
              {/* DESKTOP HERO VIEW (hidden on mobile, visible on lg) */}
              <div className="hidden lg:block space-y-6">
                {/* Badges: Location & Executive Social Proof Stack */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-[#E66323]/30 text-[#E66323] text-xs font-bold tracking-tight">
                    <MapPin className="w-3.5 h-3.5 text-[#E66323] shrink-0" />
                    <span>Available in Kochi</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                    <span className="text-amber-500 font-bold">★ 4.9/5</span>
                    <span className="text-slate-400">•</span>
                    <span>200+ NRK Families in UAE, UK, US</span>
                  </div>
                </div>

                <h1 className="text-4xl lg:text-5xl font-extrabold text-[#044749] tracking-tight leading-[1.2] text-balance">
                  When your parents need help back home, who is standing beside them?
                </h1>

                <p className="text-slate-600 text-base lg:text-lg leading-relaxed max-w-xl font-normal">
                  You are building a future across oceans, but home never leaves your mind. When unexpected hospital OPD queues, confusing prescriptions, banking paperwork, or quiet afternoons arise, long-distance phone calls aren’t enough.
                </p>

                <div className="bg-emerald-50/80 border border-emerald-200/80 p-4 rounded-2xl">
                  <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                    <strong className="text-[#044749]">Thanal</strong> pairs your parents with a dedicated <strong className="text-[#044749]">Care Buddy</strong> on the ground in Kerala, who acts like a devoted child: accompanying them to doctor visits, managing medication refills, running essential errands, and sharing real-time WhatsApp voice updates with you abroad.
                  </p>
                </div>

                {/* CTAs */}
                <div className="pt-1 flex flex-row items-center gap-4">
                  <a
                    href="#pricing-section"
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-extrabold text-base shadow-lg shadow-[#E66323]/25 transition hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Explore Care Plans</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="https://wa.me/919496097611?text=Hi%20Thanal%20Team%2C%20I%20live%20abroad%20and%20would%20like%20to%20learn%20more%20about%20your%20care%20services%20for%20my%20parents%20in%20Kerala."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-white hover:bg-slate-50 text-[#044749] border border-slate-300 font-bold text-base transition shadow-xs hover:border-[#044749]/40"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Named Care Buddy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero Medical Kickbacks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pro-Rata Refund Guarantee</span>
                  </div>
                </div>
              </div>

              {/* MOBILE HERO VIEW WITH REACT BITS SCROLLSTACK (visible on mobile, hidden on lg) */}
              <div className="block lg:hidden w-full">
                {/* Mobile Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#E66323] text-xs font-bold tracking-tight">
                    <MapPin className="w-3.5 h-3.5 text-[#E66323] shrink-0" />
                    <span>Available in Kochi</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    <span className="text-amber-500 font-bold">★ 4.9/5</span>
                    <span className="text-slate-400">•</span>
                    <span>200+ Families</span>
                  </div>
                </div>

                {/* Contained Mobile ScrollStack - Seamless & Borderless */}
                <div className="h-[400px] sm:h-[430px] w-full relative">
                  <ScrollStack
                    itemDistance={80}
                    itemStackDistance={16}
                    stackPosition="6%"
                    itemScale={0.035}
                    baseScale={0.92}
                    dimAmount={0.06}
                    smoothScroll={true}
                    snap={true}
                    className="h-full"
                  >
                    {/* Section 1: The Dilemma */}
                    <ScrollStackItem itemClassName="!h-[310px] flex flex-col justify-center bg-white text-left px-5 sm:px-6">
                      <div>
                        <h2 className="text-lg sm:text-xl font-black text-[#044749] tracking-tight leading-snug mb-3">
                          When your parents need help back home, who is standing beside them?
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                          You are building a future across oceans, but home never leaves your mind. When unexpected hospital OPD queues, confusing prescriptions, banking paperwork, or quiet afternoons arise, long-distance phone calls aren’t enough.
                        </p>
                      </div>
                    </ScrollStackItem>

                    {/* Section 2: The Ground Solution (Clean, High-Contrast & Effortlessly Legible) */}
                    <ScrollStackItem itemClassName="!h-[310px] flex flex-col justify-center bg-white text-left px-5 sm:px-6">
                      <div>
                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium mb-3.5">
                          <strong className="text-[#044749] font-black">Thanal</strong> pairs your parents with a dedicated <strong className="text-[#044749] font-black">Care Buddy</strong> on the ground in Kerala, who acts like a devoted child: accompanying them to doctor visits, managing medication refills, running essential errands, and sharing real-time WhatsApp voice updates with you abroad.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#044749]">
                          <div className="bg-emerald-50 text-emerald-900 px-3 py-2 rounded-xl flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>OPD Escorts</span>
                          </div>
                          <div className="bg-emerald-50 text-emerald-900 px-3 py-2 rounded-xl flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Medicine Refills</span>
                          </div>
                          <div className="bg-emerald-50 text-emerald-900 px-3 py-2 rounded-xl flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Daily Errands</span>
                          </div>
                          <div className="bg-emerald-50 text-emerald-900 px-3 py-2 rounded-xl flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>WhatsApp Audio</span>
                          </div>
                        </div>
                      </div>
                    </ScrollStackItem>

                    {/* Section 3: The 3 Commitments */}
                    <ScrollStackItem itemClassName="!h-[310px] flex flex-col justify-center bg-white text-left px-5 sm:px-6">
                      <div className="space-y-2.5">
                        <div className="bg-slate-50 p-2.5 rounded-2xl flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs sm:text-sm font-black text-[#044749]">Named Care Buddy</p>
                            <p className="text-[11px] text-slate-500 leading-tight">One verified person assigned personally, building real trust.</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-2xl flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs sm:text-sm font-black text-[#044749]">Zero Medical Kickbacks</p>
                            <p className="text-[11px] text-slate-500 leading-tight">Hospital bills, labs & taxis paid at actuals with zero markup.</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-2xl flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs sm:text-sm font-black text-[#044749]">Pro-Rata Refund Guarantee</p>
                            <p className="text-[11px] text-slate-500 leading-tight">100% refund on unused full months if your family withdraws.</p>
                          </div>
                        </div>
                      </div>
                    </ScrollStackItem>

                    {/* Section 4: Action & CTAs */}
                    <ScrollStackItem itemClassName="!h-[310px] flex flex-col justify-center bg-white text-left px-5 sm:px-6">
                      <div className="space-y-3">
                        <h2 className="text-lg sm:text-xl font-black text-[#044749] tracking-tight leading-snug">
                          Give Your Parents Complete Peace of Mind
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          Choose a tailored care plan or chat with our Care Manager right now over WhatsApp. Zero upfront payment required.
                        </p>

                        <div className="pt-1 flex flex-col gap-2">
                          <a
                            href="#pricing-section"
                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-extrabold text-xs shadow-md shadow-[#E66323]/25 transition active:scale-95"
                          >
                            <span>Explore Care Plans</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href="https://wa.me/919496097611?text=Hi%20Thanal%20Team%2C%20I%20live%20abroad%20and%20would%20like%20to%20learn%20more%20about%20your%20care%20services%20for%20my%20parents%20in%20Kerala."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#044749] border border-emerald-300 font-bold text-xs transition active:scale-95"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            <span>Chat on WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </ScrollStackItem>
                  </ScrollStack>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Showcase (Both Desktop Hexagons & Mobile Interactive Card) */}
            <div className="col-span-12 lg:col-span-6 flex flex-col items-center lg:items-end">
              {/* Desktop Hexagon Composition */}
              <div className="hidden lg:block relative w-[500px] h-[500px]">
                <div className="absolute inset-0 bg-[#E66323]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Hexagon 1 */}
                <div
                  className="absolute top-0 left-0 w-[240px] h-[275px] shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden border border-white/60"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <img src="/images/hero1.png" alt="Care Buddy visiting" className="w-full h-full object-cover" />
                </div>

                {/* Hexagon 2 */}
                <div
                  className="absolute top-0 left-[250px] w-[240px] h-[275px] shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden border border-white/60"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <img src="/images/hero2.png" alt="Senior companionship" className="w-full h-full object-cover" />
                </div>

                {/* Hexagon 3 */}
                <div
                  className="absolute top-[225px] left-[125px] w-[240px] h-[275px] shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden border border-white/60"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <img src="/images/hero3.jpg" alt="OPD accompaniment" className="w-full h-full object-cover" />
                </div>

                {/* Floating Live Badge */}
                <div className="absolute -bottom-2 -left-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3.5 shadow-xl animate-float-gentle flex items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-xs font-bold text-slate-800">Care Buddy on Ground • Kochi</p>
                    </div>
                    <p className="text-[11px] text-slate-500">OPD Queues handled • Meds verified</p>
                  </div>
                </div>
              </div>

              {/* Mobile / Tablet Friendly Live Card */}
              <div className="w-full max-w-sm sm:max-w-md lg:hidden bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#E66323] shrink-0">
                    <img src="/images/hero2.png" alt="Care Buddy Anjali" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#044749] text-xs sm:text-sm">Care Buddy Anjali</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#E66323]" />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">Visiting parents in Kakkanad, Kochi</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                    Active
                  </span>
                </div>

                {/* Interactive Simulated Audio Note */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudioDemo(!isPlayingAudioDemo)}
                    className="w-9 h-9 rounded-full bg-[#044749] text-white flex items-center justify-center shrink-0 shadow-xs"
                    aria-label="Play audio briefing"
                  >
                    {isPlayingAudioDemo ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium mb-1">
                      <span className="truncate">Post-Consult Voice Briefing</span>
                      <span className="text-slate-400 shrink-0 ml-1">0:48</span>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1 h-4">
                      {[40, 75, 50, 90, 60, 30, 85, 45, 95, 70, 35, 80, 50, 65].map((val, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full ${
                            isPlayingAudioDemo ? 'bg-[#E66323] animate-pulse' : 'bg-slate-300'
                          }`}
                          style={{ height: `${val}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 mt-2 text-center">
                  Instant Malayalam/English audio notes sent directly to your WhatsApp abroad.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. LIVE WHATSAPP EXPERIENCE (Mobile Friendly Timeline) */}
      <section id="whatsapp-experience" className="py-14 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full mb-2.5 inline-block uppercase tracking-wider">
              No Complex Portals • Just WhatsApp
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#044749] mb-3">
              Here is What You Receive on Your Phone
            </h2>
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
              Whether you are at work in Dubai, London, or Dallas, you receive timely voice briefings, verified prescription scans, and photo updates directly from your parents’ Care Buddy.
            </p>
          </div>

          {/* Interactive Chat Mockup with Responsive Padding */}
          <div className="max-w-xl mx-auto bg-slate-100 rounded-2xl sm:rounded-3xl border border-slate-300 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#075E54] text-white p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 overflow-hidden border border-white/40 shrink-0">
                  <img src="/images/hero2.png" alt="Care Buddy Anjali" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1 truncate">
                    <span>Thanal Care Buddy</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  </h4>
                  <p className="text-[10px] text-emerald-200 truncate">Assigned to Amma & Achan (Kochi)</p>
                </div>
              </div>
              <span className="text-[10px] bg-black/25 px-2 py-0.5 rounded-full text-white/90 shrink-0">
                11:45 AM IST
              </span>
            </div>

            {/* Chat Messages */}
            <div className="p-3 sm:p-5 space-y-3 bg-[#EFEAE2] min-h-[300px]">
              {/* Message 1 */}
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-none p-3 max-w-[92%] sm:max-w-[85%] shadow-xs text-xs text-slate-800 space-y-1">
                  <p className="font-bold text-[#044749]">Care Buddy Anjali:</p>
                  <p className="leading-relaxed">Namaskaram Ramesh! I picked up Amma from home on time. We have arrived at Aster Medcity for her 11 AM cardiology check-up. Queue token is #14.</p>
                  <span className="text-[10px] text-slate-400 block text-right">10:48 AM</span>
                </div>
              </div>

              {/* Message 2: Voice Note */}
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-none p-3 max-w-[95%] sm:max-w-[88%] shadow-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudioDemo(!isPlayingAudioDemo)}
                      className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition"
                    >
                      {isPlayingAudioDemo ? <Volume2 className="w-4 h-4 text-emerald-200" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 h-5">
                        <div className={`w-1 rounded-full bg-emerald-600 ${isPlayingAudioDemo ? 'animate-wave-1' : 'h-2'}`} />
                        <div className={`w-1 rounded-full bg-emerald-600 ${isPlayingAudioDemo ? 'animate-wave-2' : 'h-3'}`} />
                        <div className={`w-1 rounded-full bg-emerald-600 ${isPlayingAudioDemo ? 'animate-wave-3' : 'h-5'}`} />
                        <div className={`w-1 rounded-full bg-emerald-600 ${isPlayingAudioDemo ? 'animate-wave-4' : 'h-3'}`} />
                        <div className={`w-1 rounded-full bg-emerald-600 ${isPlayingAudioDemo ? 'animate-wave-5' : 'h-4'}`} />
                        <div className={`w-1 rounded-full bg-emerald-600 ${isPlayingAudioDemo ? 'animate-wave-2' : 'h-2'}`} />
                        <div className={`w-1 rounded-full bg-emerald-600 ${isPlayingAudioDemo ? 'animate-wave-4' : 'h-3'}`} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                        <span>🎙️ 0:58 Voice Note</span>
                        <span>11:32 AM</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "Dr. Menon reviewed Amma's ECG and BP (125/82). All clear! He slightly adjusted the morning tablet timing. Full audio summary above."
                  </p>
                </div>
              </div>

              {/* Message 3: Prescription */}
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-none p-3 max-w-[92%] sm:max-w-[85%] shadow-xs text-xs space-y-1.5">
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-100 font-medium text-xs">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Prescription_Aster_Nov06.pdf</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">Uploaded to your Care Passport. Monthly medicine refills ordered for home delivery.</p>
                  <span className="text-[10px] text-slate-400 block text-right">11:40 AM</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 text-center border-t border-slate-200">
              <p className="text-xs text-slate-600 font-medium">
                No passwords to remember. You stay informed where you already spend your day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE CARE BUDDY CONCEPT */}
      <section id="care-buddy-concept" className="py-14 sm:py-20 lg:py-26 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="bg-[#044749]/10 text-[#044749] border border-[#044749]/20 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wider">
              The Heart of Thanal
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-[#044749] tracking-tight mb-3 sm:mb-5">
              Not an Agency Maid. Not a Distant Call Center.<br className="hidden sm:inline" />
              Meet Your Parents' <span className="text-[#E66323]">Care Buddy</span>.
            </h2>
            <p className="text-slate-600 text-xs sm:text-base lg:text-lg leading-relaxed">
              At Thanal, peace of mind rests on one person: the Care Buddy. Someone who steps into your shoes on the ground, knowing your parents’ health, quirks, favorite routines, and doctors by heart.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#E66323]/10 text-[#E66323] flex items-center justify-center mb-4">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#044749] mb-1.5">1. A Dedicated Family Face</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                No rotating strangers. A single named Care Buddy is assigned to your parents, building genuine trust, warmth, and continuity of care visit after visit.
              </p>
            </div>

            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#044749]/10 text-[#044749] flex items-center justify-center mb-4">
                <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#044749] mb-1.5">2. WhatsApp-First Updates</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                A 60-second Malayalam or English voice note and prescription photo sent to your phone right after every doctor consult. No confusing portals to log into.
              </p>
            </div>

            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#E66323]/10 text-[#E66323] flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#044749] mb-1.5">3. Digital Care Passport</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                One secure digital folder with ID copies, medication histories, insurance files, allergy notes, and doctor contacts, always accessible to you abroad.
              </p>
            </div>

            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#044749]/10 text-[#044749] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#044749] mb-1.5">4. Rigorously Vetted & Trained</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Police-verified, identity-authenticated, and trained in elder communication, vital signs, first aid, safe transfers, and strict data privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THREE PILLARS (Interactive Visual Life Showcase) */}
      <section id="three-pillars" className="py-14 sm:py-20 lg:py-26 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="bg-[#E66323]/10 text-[#E66323] border border-[#E66323]/20 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wider">
            Comprehensive Service Scope
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-[#044749] tracking-tight mb-3 sm:mb-4">
            The Three Pillars of Thanal Care
          </h2>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            A comprehensive, personalized eldercare framework tailored specifically for Kerala households and NRK families abroad.
          </p>

          {/* Interactive Pillar Selector Tabs */}
          <div className="mt-6 sm:mt-8 inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 max-w-full overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActivePillarTab('vitality')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePillarTab === 'vitality'
                  ? 'bg-[#044749] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>Vitality & Care</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePillarTab('joy')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePillarTab === 'joy'
                  ? 'bg-[#E66323] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              <span>Joy & Connection</span>
              <span className="hidden sm:inline text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-white/20 text-white font-extrabold">Core</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePillarTab('ease')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePillarTab === 'ease'
                  ? 'bg-[#044749] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4 text-teal-300" />
              <span>Ease & Security</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Stage Card */}
        <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl overflow-hidden">
          {activePillarTab === 'vitality' && (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12 items-center animate-in fade-in duration-200">
              {/* Left Column: Narrative & Key Features */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#044749] text-xs font-bold">
                  <Stethoscope className="w-4 h-4 text-[#044749]" />
                  <span>Pillar 01 : Healthcare Coordination & Hospital Escorts</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#044749] leading-tight">
                  Proactive Healthcare Coordination & Door-to-Door Hospital Accompaniment
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed">
                  Never worry about long OPD queues, medicine delays, or lonely hospital visits. Your Care Buddy picks up your parents from home in an AC taxi, navigates hospital registration, stays beside the doctor during consultation, records audio notes, and safely escorts them home.
                </p>

                <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-xs text-[#044749] mb-1">Doctor of Choice</p>
                    <p className="text-[11px] text-slate-600">Anchor Kochi partners (Aster Medcity, Amrita, Lakeshore, Rajagiri) or your family doctor.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-xs text-[#044749] mb-1">Medicine Checks & Refills</p>
                    <p className="text-[11px] text-slate-600">Proactive stock auditing and doorstep refills for chronic prescriptions.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-xs text-[#044749] mb-1">24/7 Rapid SOS Emergency</p>
                    <p className="text-[11px] text-slate-600">Immediate ambulance dispatch and Care Buddy presence at hospital beside parents.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-xs text-[#044749] mb-1">Home Lab & Nursing</p>
                    <p className="text-[11px] text-slate-600">Verified partner referrals for at-home blood tests, ECG, and physiotherapy.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-orange-50/80 border border-[#E66323]/25 text-[11px] text-slate-700 font-medium flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#E66323] shrink-0" />
                  <span>Medical expenses, diagnostic labs, and taxi fares paid directly at actuals with zero commission markup.</span>
                </div>
              </div>

              {/* Right Column: Simulated Live Hospital Escort Slip */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl sm:rounded-3xl bg-slate-900 text-white p-6 sm:p-7 shadow-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-400">Live Hospital Escort</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Aster Medcity, Kochi</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="text-[11px] font-mono text-[#E66323] font-bold w-16 shrink-0">08:30 AM</span>
                      <div>
                        <p className="font-bold text-white">Home Pickup in AC Taxi</p>
                        <p className="text-[11px] text-slate-400">Morning BP checked: 126/82. Car AC set to parent preference.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[11px] font-mono text-[#E66323] font-bold w-16 shrink-0">09:15 AM</span>
                      <div>
                        <p className="font-bold text-white">Fast-Track Registration</p>
                        <p className="text-[11px] text-slate-400">Queue token handled by Buddy while parents seated in lounge.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[11px] font-mono text-[#E66323] font-bold w-16 shrink-0">10:00 AM</span>
                      <div>
                        <p className="font-bold text-white">Doctor Consultation</p>
                        <p className="text-[11px] text-slate-400">Care Buddy beside parents taking detailed consultation notes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[11px] font-mono text-[#E66323] font-bold w-16 shrink-0">10:45 AM</span>
                      <div>
                        <p className="font-bold text-white">Pharmacy Pickup & WhatsApp Report</p>
                        <p className="text-[11px] text-slate-400">New prescription photos sent to family group on WhatsApp.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Care Buddy:</span>
                    <span className="text-amber-300 font-bold">Anoop K. (Assigned Escort)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePillarTab === 'joy' && (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12 items-center animate-in fade-in duration-200">
              {/* Left Column: Narrative & Key Features */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#E66323] text-xs font-bold">
                  <HeartHandshake className="w-4 h-4 text-[#E66323]" />
                  <span>Pillar 02 : Signature Companionship Core</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#044749] leading-tight">
                  Combating Loneliness Through Genuine Warmth, Conversation & Community
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed">
                  Medical logistics is only half the battle. Thanal provides intellectual engagement, unhurried conversations, memory games, and accompanied outings so your parents feel loved, active, and socially connected every week.
                </p>

                <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-xs text-[#044749] mb-1">Companion Afternoon Tasters</p>
                    <p className="text-[11px] text-slate-600">Dedicated 2 to 3 hour unhurried visits included in every plan to read, chat, and relax.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-xs text-[#044749] mb-1">Personal Shopper Service</p>
                    <p className="text-[11px] text-slate-600">Accompanied trips for local grocery/textile shopping or online ordering assistance.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-xs text-[#044749] mb-1">Technology Mentorship</p>
                    <p className="text-[11px] text-slate-600">Friendly coaching on WhatsApp, international video calls, YouTube, and UPI payments.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-xs text-[#044749] mb-1">Celebrations & Faith Links</p>
                    <p className="text-[11px] text-slate-600">Birthday surprises, festival treats, and visits to temple, church, mosque, or clubs.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-orange-50/80 border border-[#E66323]/25 text-[11px] text-slate-700 font-medium flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#E66323] shrink-0" />
                  <span>Full 22-Day Daily Companion Plan launching soon for parents living alone.</span>
                </div>
              </div>

              {/* Right Column: Simulated Live Companion Snapshot */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl sm:rounded-3xl bg-[#044749] text-white p-6 sm:p-7 shadow-2xl border border-teal-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-teal-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs font-bold text-amber-300">Companion Afternoon Visit</span>
                    </div>
                    <span className="text-[10px] text-teal-200 font-mono">2.5 Hour Session</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-1">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-300" />
                        <span>Afternoon Tea & Mathrubhumi Editorial</span>
                      </p>
                      <p className="text-[11px] text-teal-100">Care Buddy Lakshmi shared unhurried tea and discussed world news.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-1">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-300" />
                        <span>Grandchildren Video Call Hosted</span>
                      </p>
                      <p className="text-[11px] text-teal-100">Set up WhatsApp video call with grandchildren in Dubai on iPad.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-1">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-300" />
                        <span>Gentle Garden Walk & Temple Visit</span>
                      </p>
                      <p className="text-[11px] text-teal-100">Accompanied evening walk and peaceful local temple darshan.</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-teal-800 flex items-center justify-between text-[11px]">
                    <span className="text-teal-200">Audio Voice Note:</span>
                    <span className="text-amber-300 font-bold">Sent to Rahul (Dubai)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePillarTab === 'ease' && (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12 items-center animate-in fade-in duration-200">
              {/* Left Column: Narrative & Key Features */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#044749] text-xs font-bold">
                  <Home className="w-4 h-4 text-[#044749]" />
                  <span>Pillar 03 : Daily Chores, Home Safety & Paperwork</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#044749] leading-tight">
                  Zero Chores Burden, Home Safety Fall Audits & Bureaucracy Handled
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed">
                  Taking care of tedious bureaucracy and physical home maintenance so your parents can live in security and ease without stress, slippery bathroom risks, or endless government office queues.
                </p>

                <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-xs text-[#044749] mb-1">Errands & Bill Payments</p>
                    <p className="text-[11px] text-slate-600">Utility bills, local government paperwork, courier pickups, and bank errands.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-xs text-[#044749] mb-1">Pension & NRI Paperwork</p>
                    <p className="text-[11px] text-slate-600">Life Certificate (Jeevan Pramaan) verification, Aadhaar updates, and NRO/NRE banking.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-xs text-[#044749] mb-1">Home Safety & Fall Audit</p>
                    <p className="text-[11px] text-slate-600">In-home audit advising on grab bars, non-slip mats, night lights, and clear pathways.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="font-bold text-xs text-[#044749] mb-1">Trusted Handyman Pool</p>
                    <p className="text-[11px] text-slate-600">Verified electricians, plumbers, AC technicians, and deep-cleaning referrals.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-orange-50/80 border border-[#E66323]/25 text-[11px] text-slate-700 font-medium flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#E66323] shrink-0" />
                  <span>Handyman, repair, and specialist services paid directly to verified local vendors.</span>
                </div>
              </div>

              {/* Right Column: Simulated Live Home Safety Audit Card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl sm:rounded-3xl bg-slate-900 text-white p-6 sm:p-7 shadow-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-400">Home Safety & Audit Card</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Score: 96 / 100</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <span className="text-slate-300">Bathroom Grab Bars:</span>
                      <span className="font-bold text-emerald-400">Installed & Verified</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <span className="text-slate-300">Non-Slip Wet Mats:</span>
                      <span className="font-bold text-emerald-400">Placed in Shower Area</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <span className="text-slate-300">Jeevan Pramaan (Pension):</span>
                      <span className="font-bold text-emerald-400">Digital Biometric Done</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <span className="text-slate-300">Inverter & AC Servicing:</span>
                      <span className="font-bold text-amber-300">Completed by Handyman</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Next Review:</span>
                    <span className="text-emerald-400 font-bold">Scheduled in 6 Months</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. CARE PLANS & PRICING (Mobile Friendly Toggles & Cards) */}
      <section id="pricing-section" className="py-14 sm:py-20 lg:py-26 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="bg-[#044749]/10 text-[#044749] border border-[#044749]/20 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wider">
              Transparent Care Membership
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-[#044749] tracking-tight mb-2 sm:mb-4">
              Care Plans Built Around Your Parents' Needs
            </h2>
            <p className="text-slate-600 text-xs sm:text-base mb-6 sm:mb-8">
              No hidden fees. Zero medical commissions. 3-month minimum commitment with a 100% pro-rata refund for unused full months.
            </p>

            {/* Mobile-Adaptive Controls: Full-width clean grid on small screens, centered flex on desktop */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto">
              {/* Parent Mode Toggle */}
              <div className="w-full sm:w-auto grid grid-cols-2 p-1 rounded-xl bg-white border border-slate-300 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setParentMode('single')}
                  className={`py-2 px-3 sm:px-5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer text-center ${
                    parentMode === 'single'
                      ? 'bg-[#044749] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Single Parent
                </button>
                <button
                  type="button"
                  onClick={() => setParentMode('couple')}
                  className={`py-2 px-3 sm:px-5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer text-center flex items-center justify-center gap-1 ${
                    parentMode === 'couple'
                      ? 'bg-[#E66323] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Both Parents</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                    25% Off
                  </span>
                </button>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="w-full sm:w-auto grid grid-cols-2 p-1 rounded-xl bg-white border border-slate-300 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer text-center ${
                    billingCycle === 'monthly'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('quarterly')}
                  className={`py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer text-center flex items-center justify-center gap-1 ${
                    billingCycle === 'quarterly'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Quarterly</span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-100 font-extrabold px-1.5 py-0.2 rounded-full">
                    -10%
                  </span>
                </button>
              </div>
            </div>

            {/* 15-Second Plan Recommender Widget */}
            <div className="mt-8 mb-6 p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-sm max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#E66323] text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>15-Second Plan Finder</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#044749] mb-1">
                Not sure which plan matches your parents' needs?
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Click your parents' primary situation to highlight the recommended care tier:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-3xl mx-auto text-left">
                <button
                  type="button"
                  onClick={() => {
                    scrollToPlanCard('essential');
                    setRecommenderChoice('routine');
                  }}
                  className={`p-3.5 rounded-xl border text-xs font-bold transition flex flex-col justify-between cursor-pointer ${
                    selectedPlanId === 'essential'
                      ? 'bg-[#044749] text-white border-[#044749] shadow-md ring-2 ring-[#044749]/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-extrabold">Emergency Safety Net</span>
                    {selectedPlanId === 'essential' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-[11px] font-normal opacity-85 leading-relaxed">
                    Independent parents who need 24/7 SOS backup, weekly check-in, and 1 hospital OPD escort per month.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    scrollToPlanCard('care_plus');
                    setRecommenderChoice('chronic');
                  }}
                  className={`p-3.5 rounded-xl border text-xs font-bold transition flex flex-col justify-between cursor-pointer relative ${
                    selectedPlanId === 'care_plus'
                      ? 'bg-[#E66323] text-white border-[#E66323] shadow-md ring-2 ring-[#E66323]/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-extrabold flex items-center gap-1.5">
                      <span>Active Health Support</span>
                      <span className="text-[9px] bg-white text-[#E66323] px-1.5 py-0.2 rounded-full uppercase font-black">Most NRKs</span>
                    </span>
                    {selectedPlanId === 'care_plus' && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-[11px] font-normal opacity-85 leading-relaxed">
                    Chronic conditions (BP, diabetes, cardiac) needing 2 visits/week, medicine refills & WhatsApp updates.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    scrollToPlanCard('comfort');
                    setRecommenderChoice('intensive');
                  }}
                  className={`p-3.5 rounded-xl border text-xs font-bold transition flex flex-col justify-between cursor-pointer ${
                    selectedPlanId === 'comfort'
                      ? 'bg-[#044749] text-white border-[#044749] shadow-md ring-2 ring-[#044749]/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-extrabold">High Attention & Warmth</span>
                    {selectedPlanId === 'comfort' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-[11px] font-normal opacity-85 leading-relaxed">
                    Parents needing 3 visits/week, intensive hospital visits, weekly companion afternoons, and bank paperwork.
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Plans Grid (Mobile Snap-Scroll Carousel with Snap Points & Desktop 3-Col Grid) */}
          <div className="flex md:grid md:grid-cols-3 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar gap-4 sm:gap-8 -mx-4 px-4 sm:mx-0 sm:px-0 mb-4 md:mb-16 items-stretch">
            {PLANS.filter((p) => !p.comingSoon).map((plan) => {
              const basePrice = parentMode === 'couple' ? plan.pricePerMonthCouple : plan.pricePerMonthSingle;
              const finalPrice = billingCycle === 'quarterly' ? Math.round(basePrice * 0.9) : basePrice;
              const baseUsd = parentMode === 'couple' ? plan.usdPriceCouple : plan.usdPriceSingle;
              const finalUsd = billingCycle === 'quarterly' ? Math.round(baseUsd * 0.9) : baseUsd;

              return (
                <div
                  key={plan.id}
                  id={`plan-card-${plan.id}`}
                  className={`snap-center w-[85vw] max-w-[360px] md:w-auto md:max-w-none shrink-0 md:shrink rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 flex flex-col justify-between transition-all bg-white relative ${
                    plan.popular
                      ? 'border-2 border-[#E66323] shadow-xl md:scale-[1.02]'
                      : 'border border-slate-200 shadow-sm hover:border-slate-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E66323] text-white text-[11px] uppercase font-extrabold px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
                      Most Popular for NRKs
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#044749] mb-1">{plan.name}</h3>
                    <p className="text-xs text-[#E66323] font-bold mb-3">{plan.tagline}</p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 font-normal min-h-[40px]">
                      {plan.description}
                    </p>

                    <div className="pb-5 mb-5 border-b border-slate-100">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-black text-[#044749]">₹{finalPrice.toLocaleString('en-IN')}</span>
                        <span className="text-slate-500 font-bold text-xs sm:text-sm">/ month</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                        (~${finalUsd} USD / month {billingCycle === 'quarterly' ? '• with 10% quarterly prepay' : ''})
                      </p>
                    </div>

                    <div className="space-y-2 mb-5 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center gap-2 font-bold text-[#044749]">
                        <Clock className="w-3.5 h-3.5 text-[#E66323] shrink-0" />
                        <span>{plan.touchpoints}</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-[#044749]">
                        <Stethoscope className="w-3.5 h-3.5 text-[#E66323] shrink-0" />
                        <span>{plan.hospitalHours}</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-[#044749]">
                        <HeartHandshake className="w-3.5 h-3.5 text-[#E66323] shrink-0" />
                        <span>{plan.companionTasters}</span>
                      </div>
                    </div>

                    {/* Key Tier Highlights */}
                    <ul className="space-y-2 text-xs text-slate-700 mb-6">
                      {plan.features.slice(3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#E66323] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                        plan.popular
                          ? 'bg-[#E66323] hover:bg-[#d55516] text-white shadow-md shadow-[#E66323]/25 active:scale-[0.98]'
                          : 'bg-[#044749] hover:bg-[#033436] text-white active:scale-[0.98]'
                      }`}
                    >
                      <span>Choose {plan.name.split(':')[0]}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Snap Carousel Indicators */}
          <div className="flex md:hidden flex-col items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-2">
              {PLANS.filter((p) => !p.comingSoon).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrollToPlanCard(p.id)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    selectedPlanId === p.id ? 'w-6 bg-[#E66323]' : 'w-2 bg-slate-300'
                  }`}
                  aria-label={`View ${p.name}`}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <span>Swipe sideways to compare all 3 plans</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </span>
          </div>

          {/* Phase 2 Companion Preview Card */}
          <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-dashed border-[#044749]/40 shadow-xs max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-[#044749] text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#E66323]" />
                <span>Launching Soon</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#044749]">
                Plan 4: The 22-Day Signature Companion Plan
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl">
                For parents living alone who need daily conversation, companionship, and stimulation. 22 days a month × 3 hours daily (66 companion hours/mo). ₹20,000/mo. Early member families get priority enrollment.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('companion')}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#044749] font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer"
            >
              Join Waitlist
            </button>
          </div>

          {/* Commercial & Operational Rules */}
          <div className="mt-8 sm:mt-12 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 max-w-5xl mx-auto">
            <h4 className="text-xs sm:text-sm font-bold text-[#044749] uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E66323]" />
              <span>Transparent Commercial Rules & Overtime Policy</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-xs text-slate-600">
              <div>
                <p className="font-bold text-slate-800 mb-1">3-Month Minimum & Pro-Rata Refund</p>
                <p>Initial enrollment is 3 months to map medical history and build a routine. 100% pro-rata refund on unused full months if your family withdraws.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 mb-1">Taxi Transport at Actuals</p>
                <p>Plan fee covers the Care Buddy’s time. Taxi fares are paid at partner rate card actuals. Your Care Buddy rides in the same car with zero double fare.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 mb-1">Hospital Overtime Policy</p>
                <p>Trips include 4 to 6 hrs of Care Buddy accompaniment. Beyond that, buddy time is billed at a modest ₹200/hr (in 30-min blocks), communicated beforehand.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COMPARISON MATRIX (Modern Interactive Collapsible Drawer) */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="bg-[#044749]/10 text-[#044749] border border-[#044749]/20 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wider">
              Transparent Membership Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#044749] tracking-tight mb-2">
              Compare Care Plans Side-by-Side
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto mb-6">
              Every plan includes our 3-month commitment with a 100% pro-rata refund guarantee. Click below to inspect all 20+ granular features.
            </p>

            {/* Collapsible Trigger Button */}
            <button
              type="button"
              onClick={() => setShowCompareMatrix(!showCompareMatrix)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white border-2 border-[#044749] text-[#044749] hover:bg-[#044749] hover:text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{showCompareMatrix ? 'Hide Side-by-Side Comparison Matrix' : 'View Full Side-by-Side Comparison Matrix (All 20+ Features)'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showCompareMatrix ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expandable Table Content */}
          {showCompareMatrix && (
            <div className="mt-10 animate-in fade-in zoom-in-95 duration-300">
              {/* Mobile Swipe Hint */}
              <div className="sm:hidden mb-4 text-center">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#E66323] bg-orange-50 px-3 py-1 rounded-full border border-[#E66323]/20">
                  <span>Swipe horizontally to compare tiers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
                  {/* Table Header */}
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <th className="py-5 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs w-1/4 align-top">
                        <div className="h-6 mb-2" />
                        Care Features
                      </th>
                      <th className="py-5 px-6 w-1/4 align-top">
                        <div className="h-6 mb-2" />
                        <div className="space-y-1">
                          <p className="font-extrabold text-base text-[#044749]">Plan 1: Essential</p>
                          <p className="text-xs text-slate-500">For independent parents</p>
                          <div className="pt-2">
                            <span className="text-2xl font-black text-[#044749]">₹7,000</span>
                            <span className="text-slate-500 text-xs font-medium"> / mo</span>
                          </div>
                        </div>
                      </th>
                      <th className="py-5 px-6 w-1/4 bg-orange-50/50 border-x-2 border-[#E66323]/50 align-top">
                        <div className="h-6 mb-2 flex items-center">
                          <span className="inline-flex items-center gap-1 bg-[#E66323] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                            <Sparkles className="w-3 h-3 text-white" />
                            <span>Most Chosen</span>
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-extrabold text-base text-[#E66323]">Plan 2: Care Plus</p>
                          <p className="text-xs text-slate-600">Active health support</p>
                          <div className="pt-2">
                            <span className="text-2xl font-black text-[#044749]">₹11,000</span>
                            <span className="text-slate-500 text-xs font-medium"> / mo</span>
                          </div>
                        </div>
                      </th>
                      <th className="py-5 px-6 w-1/4 align-top">
                        <div className="h-6 mb-2" />
                        <div className="space-y-1">
                          <p className="font-extrabold text-base text-[#044749]">Plan 3: Comfort</p>
                          <p className="text-xs text-slate-500">High-attention coordination</p>
                          <div className="pt-2">
                            <span className="text-2xl font-black text-[#044749]">₹15,000</span>
                            <span className="text-slate-500 text-xs font-medium"> / mo</span>
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body Categorized */}
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {/* Category 1: Healthcare & Hospital */}
                    <tr className="bg-slate-50/50">
                      <td colSpan={4} className="py-3 px-6 text-xs font-extrabold text-[#044749] uppercase tracking-wider flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4 text-[#E66323]" />
                        <span>Healthcare & Hospital OPD Accompaniment</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900">Hospital OPD Escort Trips</td>
                      <td className="py-4 px-6">1 trip / month (up to 4 hrs)</td>
                      <td className="py-4 px-6 font-bold text-[#044749] bg-orange-50/20 border-x border-[#E66323]/20">2 trips / month (up to 5 hrs each)</td>
                      <td className="py-4 px-6">3 trips / month (up to 6 hrs each)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900">24/7 Rapid SOS Emergency</td>
                      <td className="py-4 px-6 text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Buddy rushes to hospital</span>
                      </td>
                      <td className="py-4 px-6 text-emerald-700 font-bold bg-orange-50/20 border-x border-[#E66323]/20">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Buddy rushes to hospital</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Buddy rushes to hospital</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900">Doctor Consult / Tele-Consult</td>
                      <td className="py-4 px-6 text-slate-500">Facilitated on request</td>
                      <td className="py-4 px-6 font-bold text-[#044749] bg-orange-50/20 border-x border-[#E66323]/20">1 planned consult / quarter</td>
                      <td className="py-4 px-6">2 planned consults / quarter</td>
                    </tr>

                    {/* Category 2: Companionship */}
                    <tr className="bg-slate-50/50">
                      <td colSpan={4} className="py-3 px-6 text-xs font-extrabold text-[#044749] uppercase tracking-wider flex items-center gap-1.5">
                        <HeartHandshake className="w-4 h-4 text-[#E66323]" />
                        <span>Companionship & Touchpoints</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900">Care Buddy In-Person Visits</td>
                      <td className="py-4 px-6">1 visit / week (~1.5 hrs)</td>
                      <td className="py-4 px-6 font-bold text-[#044749] bg-orange-50/20 border-x border-[#E66323]/20">2 visits / week (~1.5 hrs each)</td>
                      <td className="py-4 px-6">3 visits / week (~1.5 hrs each)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900">Companion Afternoon Tasters</td>
                      <td className="py-4 px-6">1 afternoon / month</td>
                      <td className="py-4 px-6 font-bold text-[#044749] bg-orange-50/20 border-x border-[#E66323]/20">2 afternoons / month</td>
                      <td className="py-4 px-6">4 afternoons / month (weekly)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900">Phone Wellness Calls</td>
                      <td className="py-4 px-6">1 call / week</td>
                      <td className="py-4 px-6 font-bold text-[#044749] bg-orange-50/20 border-x border-[#E66323]/20">2 calls / week</td>
                      <td className="py-4 px-6">3 calls / week</td>
                    </tr>

                    {/* Category 3: Family Reporting & Transparency */}
                    <tr className="bg-slate-50/50">
                      <td colSpan={4} className="py-3 px-6 text-xs font-extrabold text-[#044749] uppercase tracking-wider flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-[#E66323]" />
                        <span>Family Updates & Reporting</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900">Family WhatsApp Reporting</td>
                      <td className="py-4 px-6">Monthly report & emergency alerts</td>
                      <td className="py-4 px-6 font-bold text-[#044749] bg-orange-50/20 border-x border-[#E66323]/20">Voice note & photos after each visit</td>
                      <td className="py-4 px-6">Voice note after each visit + weekly summary</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900">Digital Care Passport</td>
                      <td className="py-4 px-6 text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Included</span>
                      </td>
                      <td className="py-4 px-6 text-emerald-700 font-bold bg-orange-50/20 border-x border-[#E66323]/20">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Included</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Included</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900">Home Safety & Fall Audit</td>
                      <td className="py-4 px-6">At enrollment</td>
                      <td className="py-4 px-6 font-bold text-[#044749] bg-orange-50/20 border-x border-[#E66323]/20">At enrollment, then yearly</td>
                      <td className="py-4 px-6">At enrollment, then every 6 months</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900">Errands & Pension Paperwork</td>
                      <td className="py-4 px-6">2 errands / month</td>
                      <td className="py-4 px-6 font-bold text-[#044749] bg-orange-50/20 border-x border-[#E66323]/20">Included (reasonable use)</td>
                      <td className="py-4 px-6">Included (reasonable use)</td>
                    </tr>

                    {/* Bottom Action Row */}
                    <tr className="bg-slate-50/70">
                      <td className="py-5 px-6 font-bold text-slate-500">Select Tier</td>
                      <td className="py-5 px-6">
                        <button
                          type="button"
                          onClick={() => handleSelectPlan('essential')}
                          className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:border-[#044749] text-[#044749] font-bold text-xs transition cursor-pointer shadow-2xs"
                        >
                          Choose Plan 1
                        </button>
                      </td>
                      <td className="py-5 px-6 bg-orange-50/40 border-x border-[#E66323]/30">
                        <button
                          type="button"
                          onClick={() => handleSelectPlan('care_plus')}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-bold text-xs transition cursor-pointer shadow-md shadow-[#E66323]/25"
                        >
                          Choose Plan 2
                        </button>
                      </td>
                      <td className="py-5 px-6">
                        <button
                          type="button"
                          onClick={() => handleSelectPlan('comfort')}
                          className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:border-[#044749] text-[#044749] font-bold text-xs transition cursor-pointer shadow-2xs"
                        >
                          Choose Plan 3
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Close Button at bottom */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowCompareMatrix(false)}
                  className="text-xs font-bold text-slate-500 hover:text-[#044749] transition inline-flex items-center gap-1.5 cursor-pointer py-1.5 px-4 rounded-lg hover:bg-slate-100"
                >
                  <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                  <span>Hide Comparison Table</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faqs-section" className="py-14 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <span className="bg-[#044749]/10 text-[#044749] border border-[#044749]/20 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wider">
            Clear Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#044749] tracking-tight mb-2 sm:mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-xs sm:text-base">
            Everything you need to know about Thanal care operations, pricing, and emergency procedures.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-sm sm:text-base text-[#044749] hover:text-[#E66323] transition focus:outline-none cursor-pointer"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#E66323]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. LUXURY CONCIERGE RESERVATION FORM */}
      <section id="checkout-section" className="w-full bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-50 py-16 sm:py-24 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E66323]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#044749]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-[#E66323]/10 text-[#E66323] border border-[#E66323]/25 text-xs font-bold px-3.5 py-1 rounded-full mb-3 uppercase tracking-wider shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E66323]" />
                <span>Available in Kochi</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#044749] mb-2 tracking-tight">
                Reserve Your Parents' Care Spot
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Zero upfront payment required today. Submit your family details below or chat with our Care Manager over WhatsApp to review your parents' unique needs.
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-6 max-w-2xl mx-auto relative z-10">
              {errorMessage && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Section 1: Child Living Abroad */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#044749] uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-[#044749] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Your Details (Child Abroad)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E66323] focus:ring-2 focus:ring-[#E66323]/15 text-base transition"
                      />
                      <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      WhatsApp Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +971 50 123 4567"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E66323] focus:ring-2 focus:ring-[#E66323]/15 text-base transition"
                      />
                      <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Overseas Location *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        list="nrk-locations"
                        placeholder="e.g. Dubai, London, Dallas"
                        value={nrkLocation}
                        onChange={(e) => setNrkLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E66323] focus:ring-2 focus:ring-[#E66323]/15 text-base transition"
                      />
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <datalist id="nrk-locations">
                      {POPULAR_NRK_LOCATIONS.map((loc, idx) => (
                        <option key={idx} value={loc} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Parents' Town in Kerala *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kochi, Ernakulam, Kakkanad"
                        value={parentTown}
                        onChange={(e) => setParentTown(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E66323] focus:ring-2 focus:ring-[#E66323]/15 text-base transition"
                      />
                      <MapPin className="w-4 h-4 text-[#E66323] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Interactive Plan & Scope Selection */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#044749] uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-[#044749] text-white flex items-center justify-center text-[10px]">2</span>
                    <span>Select Care Tier & Coverage</span>
                  </div>

                  {/* Coverage Pill Switcher */}
                  <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setParentMode('single')}
                      className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                        parentMode === 'single' ? 'bg-white text-[#044749] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Single
                    </button>
                    <button
                      type="button"
                      onClick={() => setParentMode('couple')}
                      className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                        parentMode === 'couple' ? 'bg-[#E66323] text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <span>Couple</span>
                      <span className="text-[10px] bg-white/20 px-1 rounded-full font-bold">25% Off</span>
                    </button>
                  </div>
                </div>

                {/* Visual Interactive Plan Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PLANS.filter((p) => !p.comingSoon).map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const price = parentMode === 'couple' ? plan.pricePerMonthCouple : plan.pricePerMonthSingle;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-[#E66323] bg-orange-50/40 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2.5 right-3 bg-[#E66323] text-white text-[9px] font-black uppercase px-2 py-0.2 rounded-full">
                            Popular
                          </span>
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-xs text-[#044749]">{plan.name.split(':')[1] || plan.name}</span>
                          {isSelected ? (
                            <CheckCircle2 className="w-4 h-4 text-[#E66323]" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300" />
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-[#044749]">₹{price.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-500 font-medium">/ mo</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{plan.tagline}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Special Requirements / Medical Context (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mother needs diabetic OPD accompaniment; Father needs regular BP checks."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E66323] focus:ring-2 focus:ring-[#E66323]/15 text-sm transition"
                />
              </div>

              {/* Bespoke Reservation Slip Summary */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50/70 via-slate-50 to-orange-50/50 border border-slate-200 text-xs sm:text-sm space-y-2.5 relative">
                <div className="flex justify-between items-center text-slate-700 font-medium">
                  <span className="text-slate-500">Selected Tier:</span>
                  <span className="font-extrabold text-[#044749] text-right truncate ml-2">
                    {getActivePlanName()} ({parentMode === 'couple' ? 'Couple Plan' : 'Single Parent'})
                  </span>
                </div>
                <div className="pt-2 border-t border-dashed border-slate-300 flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-bold text-[#044749]">Upfront Payment Today:</span>
                  <span className="font-black text-base text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>₹0 (Free Consultation)</span>
                  </span>
                </div>
              </div>

              {/* Submission Actions */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-extrabold text-base shadow-xl shadow-[#E66323]/25 transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-white" />
                  {isSubmitting ? (
                    <span>Registering Interest...</span>
                  ) : (
                    <span>Reserve Care Spot for Parents</span>
                  )}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleCallbackRequest}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#044749] hover:text-[#E66323] transition underline underline-offset-4 cursor-pointer py-1"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Talk to a Care Manager First on WhatsApp</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-0.5">
                  <p className="text-xs text-[#044749] font-bold flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#E66323] shrink-0" />
                    <span>Zero Obligation • Direct Care Manager Review</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Our local Care Manager will reach out via WhatsApp to discuss your parents' routine.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 10. COMPACT RESPONSIVE FOOTER */}
      <footer className="relative bg-gradient-to-b from-teal-950 via-[#044749] to-[#033739] text-white pt-20 sm:pt-32 lg:pt-44 pb-12 sm:pb-16 flex flex-col justify-end items-center overflow-hidden">
        {/* SVG Wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden pointer-events-none leading-none z-10">
          <svg
            viewBox="0 0 1320 241"
            className="w-full h-10 sm:h-16 lg:h-24 block fill-slate-50"
            preserveAspectRatio="none"
          >
            <path d="M0,0 H1320 s-742.122,227.93 -923.3,237.008 S0,21.994 0,21.994 Z" />
          </svg>
        </div>

        {/* Ambient Decorative Background Glow (Yellow / Amber Light matching the Hero) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-25">
          <div className="absolute -top-12 left-1/4 w-[420px] h-[420px] rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute bottom-4 right-10 w-96 h-96 rounded-full bg-amber-300 blur-3xl" />
          <div className="absolute -bottom-10 left-10 w-80 h-80 rounded-full bg-emerald-400 blur-3xl" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left Column */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3.5">
              <Link href="/" className="inline-block hover:opacity-90 transition">
                <img
                  src="/images/logo.png"
                  alt="Thanal Eldercare Concierge"
                  className="h-12 sm:h-16 lg:h-20 w-auto object-contain brightness-110"
                />
              </Link>
              <p className="text-white font-bold text-sm sm:text-base">
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
              <p className="max-w-lg text-teal-100/90 leading-relaxed text-xs sm:text-sm">
                Dedicated CareBuddy eldercare accompaniment across Kerala. Bridging the distance for NRK families abroad with empathetic companionship, zero-commission healthcare logistics, and complete peace of mind.
              </p>
              <div className="text-[11px] sm:text-xs text-teal-200/80 space-y-0.5 pt-2 font-normal border-t border-teal-800/60 w-full">
                <p className="font-bold text-teal-100">Registered Office:</p>
                <p className="font-semibold text-white">Zynthexion Technologies Private Limited</p>
                <p>Suite No. A96, Door No. 63/700, D Space, 6th Floor, Sky Tower,</p>
                <p>Mavoor Road Junction, Bank Road, Kozhikode - 673001, Kerala</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col items-center md:items-end justify-between h-full space-y-5 text-center md:text-right pt-2 md:pt-0">
              <a
                href="https://wa.me/919496097611?text=Hi%20Thanal%20Team%2C%20I%20would%20like%20to%20know%20more%20about%20your%20care%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center md:items-end gap-1 hover:opacity-90 transition text-center md:text-right"
              >
                <div className="flex items-center gap-1.5 text-white font-bold text-sm sm:text-base">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#25D366] shrink-0" />
                  <span>Message us on WhatsApp</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-[#E66323] tracking-tight group-hover:underline">
                  +91 9496097611
                </span>
              </a>

              <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-1.5 text-xs sm:text-sm text-teal-100 font-semibold">
                <Link href="/luxury-living" className="text-amber-300 hover:text-white font-bold transition">
                  Luxury Senior Living
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-[#E66323] transition">
                  Terms
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-[#E66323] transition">
                  Privacy
                </Link>
                <span>•</span>
                <Link href="/refund-policy" className="hover:text-[#E66323] transition">
                  Refund Policy
                </Link>
              </div>

              <p className="text-[11px] sm:text-xs text-teal-300 pt-3 border-t border-teal-800/80 w-full md:w-auto text-center md:text-right">
                © {new Date().getFullYear()} Thanal. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* 11. LUXURY MOBILE FLOATING CONCIERGE ISLAND */}
      <div className="fixed bottom-3 inset-x-3 z-40 sm:hidden pb-[env(safe-area-inset-bottom)] pointer-events-none">
        <div className="pointer-events-auto bg-[#044749]/95 backdrop-blur-xl text-white rounded-2xl p-2.5 shadow-2xl border border-white/15 flex items-center justify-between gap-2.5">
          {/* Left: Online Status & Selected Plan Info */}
          <div className="min-w-0 pl-1.5 py-0.5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold tracking-tight text-white/90">Care Team Online</span>
            </div>
            <p className="text-[10px] text-teal-200/80 truncate font-medium">
              {getActivePlanName().split(':')[0]} selected
            </p>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={`https://wa.me/919496097611?text=${encodeURIComponent(`Hi Thanal Team, I live abroad and would like to learn more about the ${getActivePlanName()} for my parents in Kerala.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-white" />
              <span>WhatsApp</span>
            </a>

            <a
              href="#checkout-section"
              className="py-2.5 px-3 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-extrabold text-xs flex items-center gap-1 shadow-md shadow-[#E66323]/30 transition active:scale-95"
            >
              <span>Reserve</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 12. SUCCESS CONFIRMATION MODAL */}
      {successModal && paymentDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-9 max-w-lg w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-[#E66323]/10 border border-[#E66323] flex items-center justify-center text-[#E66323] mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#044749] mb-2">
              {paymentDetails.isCallback ? 'WhatsApp Connected & Request Sent!' : 'Care Spot Reserved!'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-5 leading-relaxed">
              {paymentDetails.isCallback ? (
                <>Thank you <strong>{fullName}</strong>. Your inquiry has been sent to our Care Operations team at <strong>info@zynthexion.com</strong> and WhatsApp has opened. Our Care Manager will connect with you shortly.</>
              ) : (
                <>Thank you <strong>{fullName}</strong>. Your spot reservation has been received. Our Care Manager will contact your WhatsApp number (<strong>{whatsappNumber}</strong>) to understand your parents' needs and introduce our team.</>
              )}
            </p>

            <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 border border-slate-200 text-left text-xs sm:text-sm text-slate-700 space-y-2 mb-5">
              <div className="flex justify-between">
                <span>Reference ID:</span>
                <span className="font-mono text-[#E66323] font-bold">{paymentDetails.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span>Parents' Location:</span>
                <span className="text-[#044749] font-bold">{parentTown}</span>
              </div>
              <div className="flex justify-between">
                <span>Selected Plan:</span>
                <span className="text-[#044749] font-bold">{getActivePlanName()}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-[#E66323] font-bold">
                  {paymentDetails.isCallback ? 'WhatsApp Chat Initiated' : 'Care Spot Registered'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSuccessModal(false);
                  if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="w-full py-3 rounded-xl bg-[#E66323] text-white font-bold text-sm hover:bg-[#d55516] transition block shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                Back to Home
              </button>
              <button
                type="button"
                onClick={() => setSuccessModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
