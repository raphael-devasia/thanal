'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
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
  ChevronRight,
  Sparkles,
  Wallet
} from 'lucide-react';
import {
  PLANS,
  ParentMode,
  PlanOption,
  COUNTRIES,
  TOP_NRK_COUNTRIES,
  ALL_COUNTRIES,
  detectVisitorCountry
} from '@/types/waitlist';
import GradientText from '@/components/GradientText';
import DepthCarousel from '@/components/DepthCarousel';

export default function DesktopHome() {
  // Plan Toggle & Selection State
  const [parentMode, setParentMode] = useState<ParentMode>('single');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('care_plus');

  // Matrix Collapsible Drawer State
  const [showCompareMatrix, setShowCompareMatrix] = useState<boolean>(false);

  // Quick Plan Recommender State
  const [recommenderChoice, setRecommenderChoice] = useState<'routine' | 'chronic' | 'intensive' | null>(null);

  // Lead Form State
  const [name, setName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [phoneDigits, setPhoneDigits] = useState<string>('');
  const [consentGiven, setConsentGiven] = useState<boolean>(true);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Companion Waitlist State
  const [showCompanionWaitlistModal, setShowCompanionWaitlistModal] = useState<boolean>(false);
  const [companionName, setCompanionName] = useState<string>('');
  const [companionCountryCode, setCompanionCountryCode] = useState<string>('');
  const [companionPhoneDigits, setCompanionPhoneDigits] = useState<string>('');
  const [companionConsent, setCompanionConsent] = useState<boolean>(true);
  const [companionSubmitting, setCompanionSubmitting] = useState<boolean>(false);
  const [companionSubmitted, setCompanionSubmitted] = useState<boolean>(false);
  const [companionError, setCompanionError] = useState<string | null>(null);

  // Three Pillars Drawer State
  const [isPillarDrawerOpen, setIsPillarDrawerOpen] = useState<boolean>(false);
  const [drawerPillar, setDrawerPillar] = useState<'vitality' | 'joy' | 'ease'>('vitality');

  const openPillarDrawer = (pillar: 'vitality' | 'joy' | 'ease') => {
    setDrawerPillar(pillar);
    setIsPillarDrawerOpen(true);
  };

  const closePillarDrawer = () => {
    setIsPillarDrawerOpen(false);
  };

  // Plan Full Inclusions Popup Modal State
  const [selectedInclusionPlan, setSelectedInclusionPlan] = useState<PlanOption | null>(null);

  // Handle Escape key to close modals and pillar drawer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedInclusionPlan) setSelectedInclusionPlan(null);
        if (showCompanionWaitlistModal) setShowCompanionWaitlistModal(false);
        if (isPillarDrawerOpen) closePillarDrawer();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPillarDrawerOpen, selectedInclusionPlan, showCompanionWaitlistModal]);

  // Auto-detect visitor country by timezone on mount
  useEffect(() => {
    const detected = detectVisitorCountry();
    if (detected) {
      setCountryCode(detected);
    }
  }, []);

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
        source: 'companion_waitlist_desktop'
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

  // UI & Workflow State
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlayingAudioDemo, setIsPlayingAudioDemo] = useState<boolean>(false);

  // FAQ Accordion State (open question indices)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  // Form Validation Helper
  const validateInputs = () => {
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return false;
    }
    const country = COUNTRIES.find((c) => c.code === countryCode);
    if (!country) {
      setErrorMessage('Please choose your country.');
      return false;
    }
    const cleanNumber = phoneDigits.replace(/[^0-9]/g, '').replace(/^0+/, '');
    if (!cleanNumber || cleanNumber.length < 6 || cleanNumber.length > 15) {
      setErrorMessage('Please enter a valid phone number format.');
      return false;
    }
    if (!consentGiven) {
      setErrorMessage('Please check the box to allow WhatsApp messaging.');
      return false;
    }
    return true;
  };

  const getActivePlanName = () => {
    const plan = PLANS.find((p) => p.id === selectedPlanId);
    return plan ? plan.name : 'Rodasi Care Plus Plan';
  };

  // Scroll to Form and select plan
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    const elem = document.getElementById('checkout-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Primary Action: Submit sample update / lead request
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateInputs()) return;

    setIsSubmitting(true);
    const country = COUNTRIES.find((c) => c.code === countryCode)!;
    const cleanNumber = phoneDigits.replace(/[^0-9]/g, '').replace(/^0+/, '');
    const cleanDialCode = country.dialCode.replace(/[^0-9]/g, '');
    const fullWhatsapp = `+${cleanDialCode}${cleanNumber}`;

    try {
      const payload = {
        name: name.trim(),
        whatsappNumber: fullWhatsapp,
        country: country.name.split(' (')[0],
        source: 'website_sample_form_desktop'
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

  // Secondary Action: Talk to our team first on WhatsApp (No personal details in URL)
  const handleCallbackRequest = async () => {
    setErrorMessage(null);
    if (!validateInputs()) return;

    setIsSubmitting(true);
    const country = COUNTRIES.find((c) => c.code === countryCode)!;
    const cleanNumber = phoneDigits.replace(/[^0-9]/g, '').replace(/^0+/, '');
    const cleanDialCode = country.dialCode.replace(/[^0-9]/g, '');
    const fullWhatsapp = `+${cleanDialCode}${cleanNumber}`;

    try {
      const payload = {
        name: name.trim(),
        whatsappNumber: fullWhatsapp,
        country: country.name.split(' (')[0],
        source: 'website_callback_request_desktop'
      };

      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});

      setIsSubmitting(false);

      const messageText = 'Hi Rodasi Team, I would like to learn more about Care Buddy services for my parents in Kerala.';
      const waUrl = `https://wa.me/919496097611?text=${encodeURIComponent(messageText)}`;
      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'What is a Care Buddy, and how is Rodasi different from an agency?',
      a: "A Care Buddy is not an impersonal agency nurse or domestic helper. Think of them as your dedicated proxy: the child on the ground in Kerala. Your Care Buddy and a coordinator you can message work together for your family. Your Care Buddy is an educated, background-verified professional (MSW graduates, retired nurses, or trained care specialists) assigned personally to your parents. They visit regularly, get to know your parent's unique medical routine and personality, escort them to doctor appointments (up to 6 hours per hospital trip), coordinate hospital visits, run essential errands, and provide warm companionship. You receive direct WhatsApp voice briefings and photos after every single visit."
    },
    {
      q: 'What happens during a medical emergency?',
      a: 'If your parents can\'t call, we call 108, and your Care Buddy goes to the hospital. We keep you updated until you arrive or someone you name takes over.'
    },
    {
      q: 'Can our parents consult their existing family doctor or preferred hospital in Kerala?',
      a: 'Any hospital or doctor your family chooses. We don\'t have preferred hospitals, so our advice is never tied to one.'
    },
    {
      q: 'How do you keep children abroad updated across different time zones (Gulf, UK, US, Australia)?',
      a: "Unlike generic apps that require logging into an unfamiliar portal, Rodasi is WhatsApp-first. After every visit or hospital consult, your Care Buddy sends a 60-second Malayalam or English voice note and high-resolution photos of prescriptions or test slips. In addition, we schedule regular parent-and-child video calls hosted by the Care Buddy at a fixed day and time tailored to your international time zone."
    },
    {
      q: 'How does the couple discount work for both parents?',
      a: 'We offer a straightforward, transparent 25% discount on the second parent for all plans. For example, on the Care Plus plan (₹11,000/month for a single parent), coverage for both parents is ₹19,250/month (₹11,000 + ₹8,250). Both parents receive comprehensive wellness monitoring, hospital accompaniment, and companionship.'
    },
    {
      q: 'What is your refund, pause, and cancellation policy?',
      a: 'We operate on a 3-month minimum commitment to establish a dependable care routine and build your parents’ Care Passport. If you need to cancel, provide 15 days notice and all unused full months are refunded pro-rata. If your family is traveling or your parents have a prolonged hospital stay, you can pause membership for 14 to 60 days with 7 days notice, freezing all billing until care resumes.'
    },
    {
      q: 'How are hospital bills, pharmacy refills, and taxi fares billed?',
      a: 'With 100% financial transparency. Rodasi never charges commissions or hidden markups on medical services. Doctor consultation fees, lab tests, and medications are paid directly at actuals to the service providers. For transport, your plan includes a refundable Zero-Markup Mobility Wallet float (₹1,500 to ₹4,000) with zero commissions and WhatsApp receipts sent at actuals, topped up monthly so there is zero cash friction for your parents. Your Care Buddy rides in the same vehicle so there is never a second fare.'
    },
    {
      q: 'How are Care Buddies vetted?',
      a: 'Every Care Buddy is background-checked before their first visit. We verify identity and credentials to ensure your parents are in trustworthy, dependable hands.'
    }
  ];

  const careBuddyPillars = [
    {
      title: '1. A Dedicated Family Face',
      badge: 'Trusted Personal Bond',
      badgeColor: '#F5D328',
      badgeTextColor: '#122617',
      description:
        'Your Care Buddy and a coordinator you can message work together for your parents. A single named companion assigned specifically to your family, visiting on a consistent schedule without rotating strangers.',
      bullets: [
        'Your Care Buddy and a coordinator you can message',
        'Permanent buddy assignment (no rotation of strangers)',
        'Comprehensive initial profiling to document your parents\' medical history, allergies, dietary preferences, and daily hobbies before the first official visit',
        'Welcome home visit with family video call'
      ],
      icon: Users
    },
    {
      title: '2. Doctor Appointments & Hospital Escort',
      badge: 'Zero Hospital Stress',
      badgeColor: '#F5D328',
      badgeTextColor: '#122617',
      description:
        'We book appointments for you and provide door-to-door AC taxi escort to hospitals across Kochi (up to 6 hours per hospital trip). Buddy navigates queues, sits beside the doctor, records audio notes, and coordinates pharmacy refills.',
      bullets: [
        'We book appointments for you',
        'Up to 6 hours per hospital trip with door-to-door escort',
        'Buddy stays beside doctor and records consultation notes',
        'WhatsApp voice summary sent immediately abroad'
      ],
      icon: Stethoscope
    },
    {
      title: '3. Medication Audits & Doorstep Refills',
      badge: 'Zero Dosage Confusion',
      badgeColor: '#F5D328',
      badgeTextColor: '#122617',
      description:
        'Care Buddy checks medicines against the prescription and checks with the doctor or pharmacist if something does not match, then coordinates doorstep refills.',
      bullets: [
        'Weekly medicine pill-box sorting and verification',
        'Coordinated refills delivered straight to the door',
        'Prescription photo records stored in Digital Care Passport'
      ],
      icon: Activity
    },
    {
      title: '4. Active Companionship & Dignity',
      badge: 'Combatting Senior Loneliness',
      badgeColor: '#F5D328',
      badgeTextColor: '#122617',
      description:
        'More than clinical checkups: company and help at home after a hospital stay, reading Malayalam newspapers, afternoon walks, and guided Sunday video calls with family abroad.',
      bullets: [
        'Company and help at home after a hospital stay',
        'Dedicated unhurried home companionship sessions',
        'Therapy comes from licensed providers, paid directly'
      ],
      icon: HeartHandshake
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F3] text-[#122617] font-sans selection:bg-[#F5D328] selection:text-[#122116]">
      {/* 1. TOP RESPONSIVE HEADER */}
      <header className="sticky top-0 z-40 bg-[#122617]/95 backdrop-blur-md border-b border-[#F5D328]/20 transition-all shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/images/logo.png"
              alt="Rodasi Eldercare Concierge"
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain brightness-110 group-hover:scale-102 transition"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-semibold text-[#EBF2E8]">
            <a href="#care-buddy-concept" className="hover:text-[#F5D328] transition py-1">
              The Care Buddy
            </a>
            <a href="#three-pillars" className="hover:text-[#F5D328] transition py-1">
              Three Pillars
            </a>
            <a href="#whatsapp-experience" className="hover:text-[#F5D328] transition py-1">
              How It Works
            </a>
            <a href="#pricing-section" className="hover:text-[#F5D328] transition py-1">
              Care Plans
            </a>
            <a href="#faq-section" className="hover:text-[#F5D328] transition py-1">
              FAQs
            </a>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20to%20learn%20more%20about%20Care%20Buddy%20services%20for%20my%20parents%20in%20Kerala."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-bold text-xs lg:text-sm shadow-md transition hover:scale-102 active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-[#122116] text-[#122116]" />
              <span>Chat with our team</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-x-clip pt-16 pb-16 lg:pt-24 lg:pb-24 bg-gradient-to-b from-[#18291D] via-[#183825] to-[#122617]">
        {/* Kerala Sanctuary Ambient Glows */}
        <div className="absolute top-12 left-1/4 w-[380px] h-[380px] rounded-full bg-[#F5D328]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-[420px] h-[420px] rounded-full bg-[#24412C]/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#F5D328]/10 blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Typography & Action */}
            <div className="col-span-12 lg:col-span-5 text-left space-y-6">
              {/* Badges: Founding Status */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183825] border border-[#F5D328]/25 text-[#EBF2E8] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span>Now enrolling founding families in Kochi</span>
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] text-white text-balance">
                When your parents need help back home, who is{' '}
                <span className="font-courgette italic text-[#E8F0C8] text-[1.08em] font-medium tracking-wide">
                  beside them?
                </span>
              </h1>

              <p className="text-[#EBF2E8]/90 text-base lg:text-lg leading-relaxed max-w-xl font-normal">
                <strong className="text-[#F5D328]">Rodasi</strong> pairs your parents with a dedicated{' '}
                <strong className="text-[#F5D328]">Care Buddy</strong> on the ground in Kochi: accompanying them to doctor
                visits, managing medication refills, running essential errands, and sharing real-time WhatsApp voice updates
                with you abroad.
              </p>

              {/* Primary CTA + Secondary Link */}
              <div className="pt-2 flex flex-row items-center gap-4">
                <a
                  href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20please%20send%20me%20a%20sample%20WhatsApp%20update%20and%20voice%20note%20that%20families%20abroad%20receive."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold text-base shadow-lg shadow-[#F5D328]/25 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5 text-[#122116]" />
                  <span>Send me a sample update</span>
                </a>

                <a
                  href="#pricing-section"
                  className="text-sm text-[#EBF2E8]/75 hover:text-[#F5D328] underline underline-offset-4 font-semibold transition px-1"
                >
                  See plans →
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-3 border-t border-[#F5D328]/20 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#EBF2E8]/85 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F5D328] shrink-0" />
                  <span>Named Care Buddy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F5D328] shrink-0" />
                  <span>No commissions from hospitals. You pay actuals.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F5D328] shrink-0" />
                  <span>Pro-Rata Refund Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Transparent Visual Blending into Hero (Doubled Scale for Bigger Screens) */}
            <div className="col-span-12 lg:col-span-7 flex flex-col items-center lg:items-end justify-center">
              <div className="relative w-full max-w-[680px] lg:max-w-[850px] xl:max-w-[960px]">
                {/* Ambient Warm & Emerald Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] lg:w-[680px] lg:h-[680px] bg-[#F5D328]/15 rounded-full blur-3xl pointer-events-none" />

                {/* Entire Transparent Cutout Image - Doubled visual scale, blends directly with hero background */}
                <div className="relative">
                  <img
                    src="/images/hero1.png"
                    alt="Rodasi Care Buddy with elderly parent in Kerala"
                    className="w-full h-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.55)] select-none"
                  />

                  {/* Background-checked badge */}
                  <div className="absolute top-3 left-3 sm:top-5 sm:left-5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#F5D328] text-[#122116] font-extrabold text-xs sm:text-sm tracking-tight flex items-center gap-1.5 sm:gap-2 shadow-xl shadow-black/50 z-20">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#122116]" />
                    <span>Background-checked</span>
                  </div>

                  {/* Floating WhatsApp Voice Briefing Card at bottom */}
                  <div className="absolute bottom-2 left-2 right-2 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-md bg-[#183825]/95 backdrop-blur-md border border-[#F5D328]/35 rounded-2xl p-3 sm:p-4 shadow-2xl z-20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0">
                        <Mic className="w-5 h-5 text-[#25D366]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5 mb-0.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse shrink-0" />
                            <p className="text-xs font-bold text-white truncate">Voice Note Sent to Dubai</p>
                          </div>
                          <span className="text-[9px] font-bold text-[#122116] bg-[#F5D328] px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                            Sample
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 my-1">
                          <div className="w-1 h-3 rounded-full bg-[#F5D328]" />
                          <div className="w-1 h-5 rounded-full bg-[#F5D328]" />
                          <div className="w-1 h-2 rounded-full bg-[#F5D328]" />
                          <div className="w-1 h-6 rounded-full bg-[#F5D328]" />
                          <div className="w-1 h-4 rounded-full bg-[#F5D328]" />
                          <div className="w-1 h-3 rounded-full bg-[#EBF2E8]/40" />
                          <div className="w-1 h-5 rounded-full bg-[#EBF2E8]/40" />
                          <div className="w-1 h-2 rounded-full bg-[#EBF2E8]/40" />
                        </div>
                        <p className="text-[11px] text-[#EBF2E8]/85 truncate">
                          BP recorded 120/80. Appa finished lunch and his walk.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 NARRATIVE: THE REALITY ACROSS OCEANS */}
      <section className="py-12 sm:py-16 bg-[#152B1B] border-t border-b border-[#F5D328]/20 text-[#EBF2E8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F5D328]">The Reality Across Oceans</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white text-balance">
            Long-distance phone calls aren’t enough when unexpected moments arise.
          </h2>
          <p className="text-base sm:text-lg text-[#EBF2E8]/85 leading-relaxed max-w-2xl mx-auto font-normal">
            You are building a future across oceans, but home never leaves your mind. When unexpected hospital OPD queues,
            confusing prescriptions, banking paperwork, or quiet afternoons arise, your parents shouldn’t have to face them
            alone.
          </p>
        </div>
      </section>

      {/* 3. LIVE WHATSAPP EXPERIENCE */}
      <section id="whatsapp-experience" className="py-14 sm:py-20 bg-[#F9F8F3] text-[#122617] border-t border-b border-[#122617]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="bg-[#183825]/10 text-[#122617] border border-[#183825]/20 text-xs font-bold px-3.5 py-1.5 rounded-full mb-2.5 inline-block uppercase tracking-wider">
              No Complex Portals • Just WhatsApp
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 text-[#122617]">
              <GradientText colors={['#122617', '#1E4429', '#2E613B', '#122617']}>
                Here is What You Receive on Your Phone
              </GradientText>
            </h2>
            <p className="text-[#2D4533] text-xs sm:text-base leading-relaxed">
              Whether you are at work in Dubai, London, or Dallas, you receive timely voice briefings, prescription scans, and
              photo updates directly from your parents’ Care Buddy.
            </p>
          </div>

          {/* Interactive Chat Mockup */}
          <div className="max-w-xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-[#183825]/15 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#122617] border-b border-[#183825]/40 text-white p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 overflow-hidden border border-[#F5D328]/40 shrink-0">
                  <img src="/images/hero2.png" alt="Care Buddy Anjali" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 truncate text-[#EBF2E8]">
                    <span>Rodasi Care Buddy</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F5D328] text-[#122116]">
                      Sample
                    </span>
                  </h4>
                  <p className="text-[10px] text-[#F5D328] truncate">Assigned to Amma & Achan (Kochi)</p>
                </div>
              </div>
              <span className="text-[10px] bg-black/40 border border-[#F5D328]/20 px-2 py-0.5 rounded-full text-[#EBF2E8]/90 shrink-0">
                11:45 AM IST
              </span>
            </div>

            {/* Chat Messages */}
            <div className="p-3 sm:p-5 space-y-3 bg-[#F8F5EE] min-h-[300px]">
              {/* Message 1 */}
              <div className="flex justify-start">
                <div className="bg-white border border-[#183825]/10 rounded-2xl rounded-tl-none p-3.5 max-w-[92%] sm:max-w-[85%] shadow-xs text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#183825]">Care Buddy Anjali:</p>
                    <span className="text-[9px] text-[#183825]/60 font-semibold bg-[#183825]/5 px-1.5 py-0.5 rounded">
                      Sample
                    </span>
                  </div>
                  <p className="leading-relaxed text-[#243B2B]">
                    Namaskaram Ramesh! I picked up Amma from home on time. We have arrived at City Care Clinic for her 11 AM
                    check-up with Dr. Varma. Queue token is #14.
                  </p>
                  <span className="text-[10px] text-[#183825]/60 block text-right">10:48 AM</span>
                </div>
              </div>

              {/* Message 2: Voice Note */}
              <div className="flex justify-start">
                <div className="bg-white border border-[#183825]/10 rounded-2xl rounded-tl-none p-3.5 max-w-[95%] sm:max-w-[88%] shadow-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudioDemo(!isPlayingAudioDemo)}
                      className="w-9 h-9 rounded-full bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition shadow-sm cursor-pointer"
                    >
                      {isPlayingAudioDemo ? (
                        <Volume2 className="w-4 h-4 text-[#122116]" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5 text-[#122116]" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 h-5">
                        <div className={`w-1 rounded-full bg-[#183825] ${isPlayingAudioDemo ? 'animate-wave-1' : 'h-2'}`} />
                        <div className={`w-1 rounded-full bg-[#183825] ${isPlayingAudioDemo ? 'animate-wave-2' : 'h-3'}`} />
                        <div className={`w-1 rounded-full bg-[#183825] ${isPlayingAudioDemo ? 'animate-wave-3' : 'h-5'}`} />
                        <div className={`w-1 rounded-full bg-[#183825] ${isPlayingAudioDemo ? 'animate-wave-4' : 'h-3'}`} />
                        <div className={`w-1 rounded-full bg-[#183825] ${isPlayingAudioDemo ? 'animate-wave-5' : 'h-4'}`} />
                      </div>
                      <div className="flex justify-between text-[10px] text-[#183825] mt-0.5 font-medium">
                        <span>🎙️ 0:58 Voice Note (Sample)</span>
                        <span>11:32 AM</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#183825] italic bg-[#EAF1E9] p-2.5 rounded-xl border border-[#183825]/15">
                    "Dr. Varma reviewed Amma's ECG and recorded BP at 125/82. Everything looks stable! He slightly adjusted
                    the morning tablet timing. Full audio summary above."
                  </p>
                </div>
              </div>

              {/* Message 3: Prescription */}
              <div className="flex justify-start">
                <div className="bg-white border border-[#183825]/10 rounded-2xl rounded-tl-none p-3.5 max-w-[92%] sm:max-w-[85%] shadow-xs text-xs space-y-1.5">
                  <div className="flex items-center gap-2 bg-[#122617] text-[#F5D328] p-2 rounded-xl border border-[#183825]/30 font-medium text-xs">
                    <FileText className="w-4 h-4 text-[#F5D328] shrink-0" />
                    <span className="truncate">Sample_Prescription_Slip.pdf</span>
                  </div>
                  <p className="text-[#243B2B] leading-relaxed">
                    Uploaded to your Care Passport. Monthly medicine refills coordinated for doorstep delivery.
                  </p>
                  <span className="text-[10px] text-[#183825]/60 block text-right">11:40 AM</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F1ECE1] p-3 text-center border-t border-[#183825]/10">
              <p className="text-xs text-[#2D4533] font-medium">
                No passwords to remember. You stay informed where you already spend your day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE CARE BUDDY CONCEPT */}
      <section id="care-buddy-concept" className="py-14 sm:py-20 lg:py-24 bg-[#F9F8F3] text-[#122617] border-b border-[#122617]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="bg-[#183825]/10 text-[#122617] border border-[#183825]/20 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 inline-block uppercase tracking-wider">
              The Heart of Rodasi
            </span>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-3 text-[#122617]">
              <GradientText colors={['#122617', '#1E4429', '#2E613B', '#122617']}>
                More than an agency. More than an app.<br className="hidden sm:inline" />
                Meet Your Parents' Care Buddy.
              </GradientText>
            </h2>
            <p className="text-[#2D4533] text-sm lg:text-base leading-relaxed">
              At Rodasi, peace of mind rests on one person: the Care Buddy. Someone who steps into your shoes on the ground,
              knowing your parents’ health, quirks, favorite routines, and doctors by heart.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {careBuddyPillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-white border border-[#183825]/15 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#183825]/10 border border-[#183825]/20 flex items-center justify-center">
                        <IconComp className="w-5 h-5 text-[#183825]" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F5D328]/25 text-[#122116]">
                        {pillar.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#122617]">{pillar.title}</h3>
                    <p className="text-xs text-[#2D4533] leading-relaxed">{pillar.description}</p>
                  </div>

                  <ul className="space-y-1.5 pt-2 border-t border-[#183825]/10 text-xs text-[#243B2B]">
                    {pillar.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#183825] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4B. THE THREE PILLARS OF RODASI CARE */}
      <section id="three-pillars" className="py-16 sm:py-24 bg-[#142D1C] text-[#EBF2E8] border-b border-[#F5D328]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="bg-[#183825] text-[#F5D328] border border-[#F5D328]/30 text-xs font-bold px-3.5 py-1.5 rounded-full inline-block uppercase tracking-wider">
              Comprehensive Service Scope
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              The Three Pillars of Rodasi Care
            </h2>
            <p className="text-[#EBF2E8]/85 text-sm sm:text-base leading-relaxed">
              A comprehensive eldercare framework tailored specifically for Kerala households and Malayali families living across oceans. Click any pillar below to inspect our full capabilities and live escort logs.
            </p>
          </div>

          {/* 3 Pillar Heading Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Card 1: Vitality & Care */}
            <div
              onClick={() => openPillarDrawer('vitality')}
              className="group relative p-7 sm:p-8 rounded-3xl bg-[#183825] border-2 border-[#183825]/30 hover:border-[#F5D328] shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between text-white"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#F5D328] text-[#122116] shadow-xs">
                    Pillar 01 : Health
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#F5D328]/15 border border-[#F5D328]/30 text-[#F5D328] flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-2 leading-snug tracking-tight">
                  Vitality & Care
                </h3>
                <p className="text-xs font-bold text-[#E8F0C8] mb-3">
                  Healthcare Coordination & Hospital Escorts
                </p>
                <p className="text-xs sm:text-sm text-[#E0EBDC] leading-relaxed font-normal mb-5">
                  Never worry about long OPD queues, medicine delays, or lonely hospital visits. Dedicated door-to-door AC transport, doctor consultation notes, medicine refills, and hospital accompaniment.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-[#F5D328] border border-[#F5D328]/30">
                    24/7 Emergency Mobilization Support
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-white border border-white/10">
                    OPD Hospital Escorts
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-white border border-white/10">
                    Medicine Refills
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-white border border-white/10">
                    Doctor Consultation Notes
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-white border border-white/10">
                    Home Lab / ECG
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-black text-white group-hover:text-[#F5D328] transition">
                <span className="inline-flex items-center gap-1.5">
                  <span>View Full Scope & Live Log</span>
                  <ArrowRight className="w-4 h-4 text-[#F5D328] transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-[11px] font-semibold bg-[#F5D328]/15 px-2.5 py-0.5 rounded-full text-[#F5D328]">
                  Click to Expand
                </span>
              </div>
            </div>

            {/* Card 2: Joy & Connection */}
            <div
              onClick={() => openPillarDrawer('joy')}
              className="group relative p-7 sm:p-8 rounded-3xl bg-[#183825] border-2 border-[#183825]/30 hover:border-[#F5D328] shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between text-white"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#F5D328] text-[#122116] shadow-xs">
                    Pillar 02 : Social & Mental
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#F5D328]/15 border border-[#F5D328]/30 text-[#F5D328] flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-2 leading-snug tracking-tight">
                  Joy & Connection
                </h3>
                <p className="text-xs font-bold text-[#E8F0C8] mb-3">
                  Combating Loneliness Through Genuine Presence
                </p>
                <p className="text-xs sm:text-sm text-[#E0EBDC] leading-relaxed font-normal mb-5">
                  Medical logistics is only half the battle. Unhurried companion visits, afternoon tea, reading Malayalam newspapers aloud, technology mentoring on WhatsApp video calls, and faith outings.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-white border border-white/10">
                    Afternoon Companion
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-white border border-white/10">
                    Tech Mentoring & Video Calls
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-white border border-white/10">
                    Personal Shopper
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-white border border-white/10">
                    Temple & Church Outings
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-black text-white group-hover:text-[#F5D328] transition">
                <span className="inline-flex items-center gap-1.5">
                  <span>View Full Scope & Visit Note</span>
                  <ArrowRight className="w-4 h-4 text-[#F5D328] transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-[11px] font-semibold bg-[#F5D328]/15 px-2.5 py-0.5 rounded-full text-[#F5D328]">
                  Click to Expand
                </span>
              </div>
            </div>

            {/* Card 3: Ease & Daily Living */}
            <div
              onClick={() => openPillarDrawer('ease')}
              className="group relative p-7 sm:p-8 rounded-3xl bg-[#183825] border-2 border-[#183825]/30 hover:border-[#F5D328] shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between text-white"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#F5D328] text-[#122116] shadow-xs">
                    Pillar 03 : Home, Chores & Govt
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#F5D328]/15 border border-[#F5D328]/30 text-[#F5D328] flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
                    <Home className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-2 leading-snug tracking-tight">
                  Ease & Daily Living
                </h3>
                <p className="text-xs font-bold text-[#E8F0C8] mb-3">
                  Zero Chores Burden & Bureaucracy Handled
                </p>
                <p className="text-xs sm:text-sm text-[#E0EBDC] leading-relaxed font-normal mb-5">
                  Managing fall prevention home safety audits, grab bar verification, Jeevan Pramaan biometric pension life certificates, utility bill runs, and trusted verified local handymen.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-white border border-white/10">
                    Home Safety Fall Audit
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-white border border-white/10">
                    Jeevan Pramaan (Pension)
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-white border border-white/10">
                    Utility Bill Errands
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#122617] text-white border border-white/10">
                    Verified Handyman Pool
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-black text-white group-hover:text-[#F5D328] transition">
                <span className="inline-flex items-center gap-1.5">
                  <span>View Full Scope & Audit Card</span>
                  <ArrowRight className="w-4 h-4 text-[#F5D328] transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-[11px] font-semibold bg-[#F5D328]/15 px-2.5 py-0.5 rounded-full text-[#F5D328]">
                  Click to Expand
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRANSPARENT MEMBERSHIP PLANS */}
      <section id="pricing-section" className="py-16 sm:py-24 bg-[#122617] text-[#EBF2E8] border-b border-[#F5D328]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="bg-[#183825] text-[#F5D328] border border-[#F5D328]/30 text-xs font-bold px-3.5 py-1.5 rounded-full inline-block uppercase tracking-wider">
              Transparent Membership
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Choose the Right Level of Care
            </h2>
            <p className="text-[#EBF2E8]/85 text-sm sm:text-base leading-relaxed">
              Every plan pairs your family with a named Care Buddy who is background-checked before their first visit. No hospital markups, zero hidden commissions. From weekly check-ins to daily presence with our 22-day Companion plan (launching soon).
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
                  <span className="text-[10px] bg-[#25D366] text-white px-1.5 py-0.2 rounded font-extrabold">2nd Parent 25% Off</span>
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

            {/* Clear explanation of 2nd parent discount */}
            <p className="text-xs text-[#EBF2E8]/85 text-center mt-3 font-medium">
              Covering both parents? Add a second parent for just 75% of the base fee (25% discount on the second parent&apos;s fee).
            </p>
          </div>

          {/* Introductory Line & Single Hospital Visit Card (Moved Above Plans) */}
          <div className="max-w-4xl mx-auto mb-12">
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
                <h3 className="text-xl sm:text-2xl font-black text-[#122617]">
                  Try us with one hospital visit
                </h3>
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
                    Transport customized to your needs (Standard Cab, SUV, Wheelchair Van, or your Own Car). We send a transparent, all-inclusive quote on WhatsApp before the visit.
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

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {PLANS.map((plan) => {
              const basePrice = parentMode === 'couple' ? plan.pricePerMonthCouple : plan.pricePerMonthSingle;
              const finalPrice = billingCycle === 'quarterly' ? Math.round(basePrice * 0.9) : basePrice;
              const finalPriceWithGst = Math.round(finalPrice * 1.18);
              const finalUsd = Math.round(finalPrice / 83.5);

              // Standardized short list matching mobile exactly
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
                  '24/7 Emergency mobilization support',
                  'WhatsApp update after every visit'
                ],
                comfort: [
                  '3 visits a week plus weekly companion afternoons',
                  '3 escorts (up to 6 hours each)',
                  'We book appointments',
                  'Full medicine check',
                  '24/7 Emergency mobilization support',
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
                      {parentMode === 'couple' && (
                        <p className={`text-xs mt-1 font-semibold ${plan.popular || plan.comingSoon ? 'text-[#F5D328]' : 'text-[#183825]'}`}>
                          Covers both parents (2nd parent at 25% off)
                        </p>
                      )}
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

                      {/* View Full Inclusions Popup Trigger */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedInclusionPlan(plan)}
                          className={`inline-flex items-center gap-1.5 text-xs font-bold transition cursor-pointer select-none group py-1 ${
                            plan.popular || plan.comingSoon ? 'text-[#F5D328] hover:text-[#FFE342]' : 'text-[#183825] hover:text-[#122617]'
                          }`}
                        >
                          <span>View full inclusions</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    {plan.comingSoon ? (
                      <button
                        type="button"
                        onClick={() => setShowCompanionWaitlistModal(true)}
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

          {/* Under Cards Terms & Visible All Plans Button */}
          <div className="mt-10 text-center space-y-4 max-w-xl mx-auto">
            <p className="text-xs text-[#EBF2E8]/90 font-medium leading-relaxed">
              3-month minimum commitment to build medical history and a trusted routine. Pause for 14 to 60 days. Unused full months refunded pro-rata.
            </p>
            <div className="flex justify-center">
              <Link
                href="/plans"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl bg-[#183825] hover:bg-[#1f452e] border border-[#F5D328]/40 text-[#F5D328] font-black text-sm transition shadow-md cursor-pointer hover:border-[#F5D328]"
              >
                <span>See all plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Commercial & Operational Rules */}
          <div className="mt-12 p-6 rounded-2xl bg-[#183825] border border-[#F5D328]/25 max-w-5xl mx-auto space-y-4">
            <h4 className="text-xs sm:text-sm font-bold text-[#F5D328] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F5D328]" />
              <span>Transparent Commercial Rules & Operational Policies</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-[#EBF2E8]/85">
              <div>
                <p className="font-bold text-[#EBF2E8] mb-1">3-Month Minimum & Pro-Rata Refund</p>
                <p>Initial enrollment is a 3-month minimum commitment to build medical history and a trusted routine. 15-day notice required, with unused full months refunded pro-rata.</p>
              </div>
              <div>
                <p className="font-bold text-[#EBF2E8] mb-1">Flexible Plan Pausing</p>
                <p>Heading on an overseas trip or facing a long hospital stay? Pause membership for 14 to 60 days with 7 days notice. Billing is completely frozen during pause.</p>
              </div>
              <div>
                <p className="font-bold text-[#EBF2E8] mb-1">Overtime Beyond Included Hours</p>
                <p>Care visits include designated accompaniment hours. Overtime beyond included hours is billed at ₹350/hour actuals (in 30-minute blocks), confirmed with you beforehand.</p>
              </div>
              <div>
                <p className="font-bold text-[#EBF2E8] mb-1">Zero-Markup Mobility Wallet</p>
                <p>To eliminate cash friction, standard plans include a refundable transport float (₹1,500 to ₹4,000). We route your rides, send a WhatsApp receipt at absolute actuals (zero commissions), and only invoice you once a month to top the wallet back up to its float level.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F5D328]/20 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-[#EBF2E8]/90">
              <span className="font-bold text-[#F5D328] shrink-0">What is Not Included:</span>
              <span>Doctor consultation fees, nursing procedures, diagnostic lab tests, prescription medicines, buddy overtime beyond included hours, and physical therapy or rehabilitation (therapy comes from licensed providers, paid directly with zero commission). Local transport is covered seamlessly via your plan&apos;s refundable Zero-Markup Mobility Wallet.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQS */}
      <section id="faq-section" className="py-16 sm:py-20 bg-[#F9F8F3] text-[#122617] border-b border-[#122617]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="bg-[#183825]/10 text-[#122617] border border-[#183825]/20 text-xs font-bold px-3.5 py-1.5 rounded-full inline-block uppercase tracking-wider">
              Questions & Answers
            </span>
            <h2 className="text-3xl font-extrabold text-[#122617]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-2xl bg-white border border-[#183825]/15 overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left font-bold text-sm text-[#122617] flex items-center justify-between gap-3 cursor-pointer hover:bg-[#F8F5EE]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#183825] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#2D4533] leading-relaxed border-t border-[#183825]/10 bg-[#FAF8F3]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CHECKOUT & RESERVATION SECTION */}
      <section id="checkout-section" className="py-16 sm:py-24 bg-[#122617] text-white border-b border-[#F5D328]/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#F5D328] uppercase tracking-wider">Try Us First</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Get a Sample WhatsApp Update</h2>
            <p className="text-xs sm:text-sm text-[#EBF2E8]/80">Zero payment today. We will send you a real sample voice note and visit summary.</p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-3xl bg-[#183825] border border-[#F5D328]/40 text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-[#F5D328]/20 border border-[#F5D328] flex items-center justify-center text-[#F5D328] mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#F5D328]" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#F5D328]">
                Request Received!
              </h3>
              <p className="text-xs sm:text-sm text-[#EBF2E8]/90 max-w-md mx-auto leading-relaxed">
                Thank you <strong>{name}</strong>. We will message you on WhatsApp shortly with sample voice notes and care summaries.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/919496097611?text=${encodeURIComponent('Hi Rodasi Team, please send me the sample WhatsApp update and voice note.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs sm:text-sm transition shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-transparent shrink-0" />
                  <span>Open WhatsApp Directly</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-5 bg-[#183825] p-6 sm:p-8 rounded-3xl border border-[#F5D328]/30 shadow-2xl">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-900/60 border border-red-500/50 text-red-200 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                {/* 1. Name */}
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
                    className="w-full px-3.5 py-3 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm"
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
                    className="w-full px-3.5 py-3 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="">Choose country</option>
                    <optgroup label="Popular Expats & NRK Regions" className="bg-[#122617] text-[#F5D328] font-bold">
                      {TOP_NRK_COUNTRIES.map((c) => (
                        <option key={`top_${c.code}`} value={c.code} className="bg-[#122617] text-white font-normal">
                          {c.name} (+{c.dialCode})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="All Countries (A to Z)" className="bg-[#122617] text-[#F5D328] font-bold">
                      {ALL_COUNTRIES.map((c) => (
                        <option key={`all_${c.code}`} value={c.code} className="bg-[#122617] text-white font-normal">
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
                      className="w-full pl-16 pr-3.5 py-3 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm"
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
                      className="mt-0.5 w-4 h-4 rounded border-[#F5D328]/40 text-[#F5D328] bg-[#122617] focus:ring-0 cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-[#EBF2E8]/90 leading-snug">
                      OK to message me on WhatsApp.
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-6 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4 fill-[#122116] text-[#122116]" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Send me a sample update'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCallbackRequest}
                  disabled={isSubmitting}
                  className="py-4 px-6 rounded-xl bg-[#122617] hover:bg-[#1f452e] text-[#F5D328] border border-[#F5D328]/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-[#F5D328] text-[#122116]" />
                  <span>Talk to our team first</span>
                </button>
              </div>

              {/* Note under the form */}
              <div className="text-center space-y-1 pt-1">
                <p className="text-xs font-semibold text-[#F5D328]">
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

      {/* 8. FOOTER */}
      <footer className="bg-[#0A130C] text-[#EBF2E8] py-12 px-4 border-t border-[#F5D328]/20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#F5D328]/15 pb-8">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo.png"
                alt="Rodasi"
                className="h-10 sm:h-12 w-auto object-contain brightness-110"
              />
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#EBF2E8]/75">
              <a href="#care-buddy-concept" className="hover:text-[#F5D328] transition">The Care Buddy</a>
              <span>·</span>
              <a href="#whatsapp-experience" className="hover:text-[#F5D328] transition">How It Works</a>
              <span>·</span>
              <a href="#pricing-section" className="hover:text-[#F5D328] transition">Plans</a>
              <span>·</span>
              <a href="#faq-section" className="hover:text-[#F5D328] transition">FAQs</a>
            </div>
          </div>

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

      {/* MODAL: FULL PLAN INCLUSIONS POPUP */}
      {selectedInclusionPlan && (() => {
        const basePrice = parentMode === 'couple' ? selectedInclusionPlan.pricePerMonthCouple : selectedInclusionPlan.pricePerMonthSingle;
        const finalPrice = billingCycle === 'quarterly' ? Math.round(basePrice * 0.9) : basePrice;
        const finalPriceWithGst = Math.round(finalPrice * 1.18);
        const finalUsd = Math.round(finalPrice / 83.5);

        return (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setSelectedInclusionPlan(null)}
          >
            <div
              className="bg-[#142D1C] border border-[#F5D328]/30 text-[#EBF2E8] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col relative shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 sm:p-7 border-b border-[#F5D328]/20 relative bg-[#183825]/90">
                <button
                  type="button"
                  onClick={() => setSelectedInclusionPlan(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#122617] border border-[#F5D328]/30 text-[#F5D328] hover:text-white flex items-center justify-center cursor-pointer transition"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1.5 pr-8">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5D328] bg-[#F5D328]/15 px-2.5 py-0.5 rounded-full inline-block">
                    Full Plan Scope &amp; Inclusions
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {selectedInclusionPlan.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#E8F0C8]">
                    {selectedInclusionPlan.tagline}
                  </p>
                  <p className="text-xs text-[#E0EBDC]/85 leading-relaxed pt-1">
                    {selectedInclusionPlan.description}
                  </p>

                  <div className="pt-3 flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#F5D328]">
                      ₹{finalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-[#EBF2E8]">
                      / month plus GST
                    </span>
                    <span className="text-xs text-[#EBF2E8]/70">
                      (₹{finalPriceWithGst.toLocaleString('en-IN')} incl. 18% GST • ~${finalUsd} USD)
                    </span>
                  </div>
                  {parentMode === 'couple' && (
                    <p className="text-xs font-semibold text-[#25D366]">
                      Covers both parents (2nd parent at 25% off)
                    </p>
                  )}
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto p-6 sm:p-7 space-y-5 text-xs sm:text-sm">
                {/* Touchpoint Highlights */}
                <div className="p-4 rounded-2xl bg-[#122617] border border-[#F5D328]/25 space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#F5D328]">
                    Core Care Metrics
                  </p>
                  <div className="space-y-2 text-xs font-semibold text-[#EBF2E8]">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#F5D328] shrink-0" />
                      <span>{selectedInclusionPlan.touchpoints}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Stethoscope className="w-4 h-4 text-[#F5D328] shrink-0" />
                      <span>{selectedInclusionPlan.hospitalHours}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <HeartHandshake className="w-4 h-4 text-[#F5D328] shrink-0" />
                      <span>{selectedInclusionPlan.companionTasters}</span>
                    </div>
                    {selectedInclusionPlan.mobilityWallet && (
                      <div className="flex items-center gap-2.5">
                        <Wallet className="w-4 h-4 text-[#F5D328] shrink-0" />
                        <span>{selectedInclusionPlan.mobilityWallet}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Features Checklist */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#F5D328]">
                    Complete Inclusions Checklist
                  </p>
                  <ul className="space-y-2.5 text-xs text-[#E0EBDC]">
                    {selectedInclusionPlan.features.map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <Check className="w-4 h-4 text-[#F5D328] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Assurance note */}
                <div className="p-3.5 rounded-xl bg-[#183825]/60 border border-[#F5D328]/20 text-[11px] text-[#EBF2E8]/85 leading-relaxed">
                  Doctor consults, medications, and lab diagnostics are paid directly at actuals with zero commission. Transport is managed seamlessly via your plan&apos;s refundable Zero-Markup Mobility Wallet float.
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 border-t border-[#F5D328]/20 bg-[#122617] flex items-center gap-3">
                {selectedInclusionPlan.comingSoon ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInclusionPlan(null);
                      setShowCompanionWaitlistModal(true);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] shadow-md"
                  >
                    <span>Join the waitlist</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <a
                    href={`https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20to%20ask%20about%20the%20${encodeURIComponent(selectedInclusionPlan.name)}%20plan%20for%20my%20parents.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer text-center bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] shadow-md"
                  >
                    Ask about {selectedInclusionPlan.name} on WhatsApp
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedInclusionPlan(null)}
                  className="py-3 px-5 rounded-xl border border-white/20 hover:border-white/40 text-[#EBF2E8] font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL: COMPANION WAITLIST */}
      {showCompanionWaitlistModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#183825] border border-[#F5D328]/30 text-[#EBF2E8] rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-4 relative shadow-2xl animate-in fade-in zoom-in duration-150">
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
                  Thank you <strong>{companionName}</strong>. We will message you on WhatsApp as soon as Companion spots open.
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
                    value={companionCountryCode || countryCode}
                    onChange={(e) => setCompanionCountryCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="">Choose country</option>
                    <optgroup label="Popular Expats & NRK Regions" className="bg-[#122617] text-[#F5D328] font-bold">
                      {TOP_NRK_COUNTRIES.map((c) => (
                        <option key={`top_comp_desk_${c.code}`} value={c.code} className="bg-[#122617] text-white font-normal">
                          {c.name} (+{c.dialCode})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="All Countries (A to Z)" className="bg-[#122617] text-[#F5D328] font-bold">
                      {ALL_COUNTRIES.map((c) => (
                        <option key={`all_comp_desk_${c.code}`} value={c.code} className="bg-[#122617] text-white font-normal">
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

      {/* MODAL: THREE PILLARS EXPANDED DETAILS */}
      {isPillarDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-5xl bg-[#15301E] text-[#EBF2E8] rounded-3xl shadow-2xl border border-[#F5D328]/35 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header & Pillar Switcher */}
            <div className="pt-4 pb-3.5 px-6 sm:px-8 border-b border-[#F5D328]/20 bg-[#122617] sticky top-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#183825] border border-[#F5D328]/25 text-xs font-bold overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setDrawerPillar('vitality')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    drawerPillar === 'vitality'
                      ? 'bg-[#F5D328] text-[#122116] shadow-xs font-bold'
                      : 'text-[#EBF2E8]/70 hover:text-[#F5D328]'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Vitality & Care</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerPillar('joy')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    drawerPillar === 'joy'
                      ? 'bg-[#F5D328] text-[#122116] shadow-xs font-bold'
                      : 'text-[#EBF2E8]/70 hover:text-[#F5D328]'
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Joy & Connection</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerPillar('ease')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    drawerPillar === 'ease'
                      ? 'bg-[#F5D328] text-[#122116] shadow-xs font-bold'
                      : 'text-[#EBF2E8]/70 hover:text-[#F5D328]'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Ease & Daily Living</span>
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closePillarDrawer}
                className="w-8 h-8 rounded-full bg-[#183825] border border-[#F5D328]/30 hover:bg-[#1f452e] text-[#F5D328] flex items-center justify-center shrink-0 transition cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              {drawerPillar === 'vitality' && (
                <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
                  {/* Left Column: Narrative & Key Inclusions */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5D328]/15 border border-[#F5D328]/30 text-[#F5D328] text-xs font-bold">
                      <Stethoscope className="w-4 h-4 text-[#F5D328]" />
                      <span>Pillar 01 : Healthcare Coordination & Hospital Escorts</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5D328] leading-tight">
                      Healthcare Coordination & Door-to-Door Hospital Accompaniment
                    </h3>

                    <p className="text-[#EBF2E8]/85 text-xs sm:text-sm leading-relaxed">
                      Never worry about long OPD queues, medicine delays, or lonely hospital visits. Your Care Buddy picks up your parents from home in an AC taxi, navigates hospital registration, stays beside the doctor during consultation, records audio notes, and safely escorts them home.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-[#183825] border border-[#F5D328]/25">
                        <p className="font-bold text-xs text-[#F5D328] mb-1">Doctor of Choice</p>
                        <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Hospitals across Kochi, such as Aster Medcity, Amrita, Lakeshore, Rajagiri, or your family doctor.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#183825] border border-[#F5D328]/25">
                        <p className="font-bold text-xs text-[#F5D328] mb-1">Medicine Checks & Refills</p>
                        <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Care Buddy checks medicines against the prescription, checks with doctor or pharmacist, and coordinates doorstep refills.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#183825] border border-[#F5D328]/25">
                        <p className="font-bold text-xs text-[#F5D328] mb-1">24/7 Emergency Mobilization Support</p>
                        <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Call 108 first for acute trauma; our emergency coordination mobilizes your Care Buddy directly to the hospital bedside.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#183825] border border-[#F5D328]/25">
                        <p className="font-bold text-xs text-[#F5D328] mb-1">Home Lab & ECG Visits</p>
                        <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Doorstep blood sample collection and diagnostic test coordination with digital reports uploaded to Care Passport.</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#183825]/70 border border-[#F5D328]/25 text-xs text-[#EBF2E8]/90 font-medium">
                      Zero hospital markups: all doctor fees, medicines, lab tests, and taxi fares paid at direct actuals.
                    </div>
                  </div>

                  {/* Right Column: Simulated Live Escort Snapshot */}
                  <div className="lg:col-span-5">
                    <div className="rounded-2xl bg-[#122116] text-[#EBF2E8] p-5 sm:p-6 shadow-xl border border-[#F5D328]/30 space-y-3.5">
                      <div className="flex items-center justify-between border-b border-[#F5D328]/20 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                          <span className="text-xs font-bold text-[#F5D328]">Live OPD Escort Log</span>
                        </div>
                        <span className="text-[10px] text-[#EBF2E8]/70 font-mono">Aster Medcity</span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="flex items-start gap-2.5">
                          <span className="text-[11px] font-mono text-[#F5D328] font-bold w-16 shrink-0">08:30 AM</span>
                          <div>
                            <p className="font-bold text-[#EBF2E8]">Doorstep AC Taxi Pickup</p>
                            <p className="text-[11px] text-[#EBF2E8]/70">Buddy arrives at home in Panampilly Nagar.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-[11px] font-mono text-[#F5D328] font-bold w-16 shrink-0">09:15 AM</span>
                          <div>
                            <p className="font-bold text-[#EBF2E8]">Fast-Track Registration</p>
                            <p className="text-[11px] text-[#EBF2E8]/70">Token handled by Buddy while parents seated in lounge.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-[11px] font-mono text-[#F5D328] font-bold w-16 shrink-0">10:00 AM</span>
                          <div>
                            <p className="font-bold text-[#EBF2E8]">Doctor Consultation</p>
                            <p className="text-[11px] text-[#EBF2E8]/70">Care Buddy beside parents taking detailed consultation notes.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-[11px] font-mono text-[#F5D328] font-bold w-16 shrink-0">10:45 AM</span>
                          <div>
                            <p className="font-bold text-[#EBF2E8]">Pharmacy Pickup & Report</p>
                            <p className="text-[11px] text-[#EBF2E8]/70">New prescription photo sent to family on WhatsApp.</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#F5D328]/20 flex items-center justify-between text-[11px]">
                        <span className="text-[#EBF2E8]/70">Care Buddy:</span>
                        <span className="text-[#F5D328] font-bold">Anoop K. (Assigned Escort)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {drawerPillar === 'joy' && (
                <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
                  {/* Left Column: Narrative & Key Inclusions */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5D328]/15 border border-[#F5D328]/30 text-[#F5D328] text-xs font-bold">
                      <HeartHandshake className="w-4 h-4 text-[#F5D328]" />
                      <span>Pillar 02 : Signature Companionship Core</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5D328] leading-tight">
                      Combating Loneliness Through Warmth, Conversation & Mentorship
                    </h3>

                    <p className="text-[#EBF2E8]/85 text-xs sm:text-sm leading-relaxed">
                      Medical logistics is only half the battle. Rodasi provides intellectual engagement, unhurried conversations, memory games, and accompanied outings so your parents feel loved, active, and socially connected every week.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-[#183825] border border-[#F5D328]/25">
                        <p className="font-bold text-xs text-[#F5D328] mb-1">Companion Afternoon Tasters</p>
                        <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Dedicated 2 to 3 hour unhurried visits included in plans to read, chat, and relax.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#183825] border border-[#F5D328]/25">
                        <p className="font-bold text-xs text-[#F5D328] mb-1">Personal Shopper Service</p>
                        <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Accompanied trips for local grocery or textile shopping and online ordering assistance.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#183825] border border-[#F5D328]/25">
                        <p className="font-bold text-xs text-[#F5D328] mb-1">Technology Mentorship</p>
                        <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Friendly coaching on WhatsApp video calls, iPad, YouTube, and digital payments.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#183825] border border-[#F5D328]/25">
                        <p className="font-bold text-xs text-[#F5D328] mb-1">Celebrations & Faith Outings</p>
                        <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Birthday surprises, festival treats, and accompanied visits to temple, church, or clubs.</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#183825]/70 border border-[#F5D328]/25 text-xs text-[#EBF2E8]/90 font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#F5D328] shrink-0" />
                      <span>Full 22-Day Daily Companion Plan launching soon for parents living alone.</span>
                    </div>
                  </div>

                  {/* Right Column: Simulated Companion Snapshot */}
                  <div className="lg:col-span-5">
                    <div className="rounded-2xl bg-[#122116] text-[#EBF2E8] p-5 sm:p-6 shadow-xl border border-[#F5D328]/30 space-y-3.5">
                      <div className="flex items-center justify-between border-b border-[#F5D328]/20 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#F5D328] animate-pulse" />
                          <span className="text-xs font-bold text-[#F5D328]">Companion Afternoon Visit</span>
                        </div>
                        <span className="text-[10px] text-[#EBF2E8]/70 font-mono">2.5 Hour Session</span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#183825] border border-[#F5D328]/25 space-y-1">
                          <p className="font-bold text-[#F5D328] flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#F5D328]" />
                            <span>Afternoon Tea & Mathrubhumi Editorial</span>
                          </p>
                          <p className="text-[11px] text-[#EBF2E8]/80">Care Buddy Lakshmi shared unhurried tea and discussed world news.</p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#183825] border border-[#F5D328]/25 space-y-1">
                          <p className="font-bold text-[#F5D328] flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#F5D328]" />
                            <span>Grandchildren Video Call Hosted</span>
                          </p>
                          <p className="text-[11px] text-[#EBF2E8]/80">Set up WhatsApp video call with grandchildren in Dubai on iPad.</p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#183825] border border-[#F5D328]/25 space-y-1">
                          <p className="font-bold text-[#F5D328] flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#F5D328]" />
                            <span>Garden Walk & Temple Visit</span>
                          </p>
                          <p className="text-[11px] text-[#EBF2E8]/80">Accompanied evening walk and peaceful local temple darshan.</p>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#F5D328]/20 flex items-center justify-between text-[11px]">
                        <span className="text-[#EBF2E8]/70">Audio Voice Note:</span>
                        <span className="text-[#F5D328] font-bold">Sent to Rahul (Dubai)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {drawerPillar === 'ease' && (
                <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
                  {/* Left Column: Narrative & Key Inclusions */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5D328]/15 border border-[#F5D328]/30 text-[#F5D328] text-xs font-bold">
                      <Home className="w-4 h-4 text-[#F5D328]" />
                      <span>Pillar 03 : Daily Chores, Home Safety & Paperwork</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5D328] leading-tight">
                      Zero Chores Burden, Home Safety Audits & Bureaucracy Handled
                    </h3>

                    <p className="text-[#EBF2E8]/85 text-xs sm:text-sm leading-relaxed">
                      Taking care of tedious bureaucracy and physical home maintenance so your parents can live in security and ease without stress, slippery bathroom risks, or endless government office queues.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-[#183825] border border-[#F5D328]/25">
                        <p className="font-bold text-xs text-[#F5D328] mb-1">Errands & Bill Payments</p>
                        <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">KSEB electricity bills, municipal water taxes, local paperwork, and courier pickups.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#183825] border border-[#F5D328]/25">
                        <p className="font-bold text-xs text-[#F5D328] mb-1">Jeevan Pramaan (Pension)</p>
                        <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Biometric digital Life Certificate assistance for central/state pension and bank paperwork.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#183825] border border-[#F5D328]/25">
                        <p className="font-bold text-xs text-[#F5D328] mb-1">Home Safety Fall Audit</p>
                        <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">In-home audit checking grab bars, anti-slip mats, night lights, and fall prevention pathways.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#183825] border border-[#F5D328]/25">
                        <p className="font-bold text-xs text-[#F5D328] mb-1">Verified Handyman Pool</p>
                        <p className="text-[11px] text-[#EBF2E8]/80 leading-relaxed">Background-checked electricians, plumbers, AC technicians, and deep-cleaning referrals.</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#183825]/70 border border-[#F5D328]/25 text-xs text-[#EBF2E8]/90 font-medium">
                      Zero commissions on maintenance: local specialists paid directly at transparent actuals.
                    </div>
                  </div>

                  {/* Right Column: Simulated Audit Card */}
                  <div className="lg:col-span-5">
                    <div className="rounded-2xl bg-[#122116] text-[#EBF2E8] p-5 sm:p-6 shadow-xl border border-[#F5D328]/30 space-y-3.5">
                      <div className="flex items-center justify-between border-b border-[#F5D328]/20 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                          <span className="text-xs font-bold text-[#F5D328]">Home Safety & Audit Card</span>
                        </div>
                        <span className="text-[10px] text-[#EBF2E8]/70 font-mono">Score: 96 / 100</span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#183825] border border-[#F5D328]/25 flex items-center justify-between">
                          <span className="text-[#EBF2E8]/80">Bathroom Grab Bars:</span>
                          <span className="font-bold text-[#F5D328]">Installed & Verified</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#183825] border border-[#F5D328]/25 flex items-center justify-between">
                          <span className="text-[#EBF2E8]/80">Non-Slip Wet Mats:</span>
                          <span className="font-bold text-[#F5D328]">Placed in Shower Area</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#183825] border border-[#F5D328]/25 flex items-center justify-between">
                          <span className="text-[#EBF2E8]/80">Jeevan Pramaan (Pension):</span>
                          <span className="font-bold text-[#F5D328]">Digital Biometric Done</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#183825] border border-[#F5D328]/25 flex items-center justify-between">
                          <span className="text-[#EBF2E8]/80">Inverter & AC Servicing:</span>
                          <span className="font-bold text-[#25D366]">Completed by Handyman</span>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#F5D328]/20 flex items-center justify-between text-[11px]">
                        <span className="text-[#EBF2E8]/70">Next Review:</span>
                        <span className="text-[#F5D328] font-bold">Scheduled in 6 Months</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
