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
  ChevronRight
} from 'lucide-react';
import {
  PLANS,
  ParentMode,
  POPULAR_NRK_LOCATIONS,
  KERALA_DISTRICTS
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
  const [fullName, setFullName] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [nrkLocation, setNrkLocation] = useState<string>('');
  const [parentTown, setParentTown] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [consentAgreed, setConsentAgreed] = useState<boolean>(false);

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
    if (!consentAgreed) {
      setErrorMessage('Please accept the consent terms and Privacy Policy before continuing.');
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

  // Primary Action: Submit Care Spot Registration (Zero online payment today)
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      const leadId = `RODASI_${Date.now().toString(36)}`;
      const orderId = `ord_${Date.now().toString(36)}`;

      await recordLeadInDatabase(leadId, orderId, 'Lead_Submitted', 0, false);
    } catch (err: any) {
      console.error('Lead submission error:', err);
      setErrorMessage(err?.message || 'Reservation failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Secondary Action: Talk to our team first on WhatsApp
  const handleCallbackRequest = async () => {
    setErrorMessage(null);
    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      const leadId = `WA_CARE_${Date.now().toString(36)}`;
      const orderId = `wa_ord_${Date.now().toString(36)}`;

      await recordLeadInDatabase(leadId, orderId, 'Callback_Requested', 0, true);

      const planName = getActivePlanName();
      const messageText = `Hi Rodasi Care Team,\n\nI would like to inquire about Rodasi eldercare for my parents in Kerala.\n\n• Name: ${fullName}\n• WhatsApp: ${whatsappNumber}\n• Expat Location: ${nrkLocation}\n• Parents' Location: ${parentTown}\n• Interested Plan: ${planName} (${parentMode === 'couple' ? 'Couple Plan' : 'Single Parent'})\n• Billing Preference: ${billingCycle === 'quarterly' ? 'Quarterly (10% Off)' : 'Monthly'}\nPlease let me know when we can connect.`;

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
      setErrorMessage(err?.message || 'Registration failed. Please contact Rodasi support.');
    } finally {
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
      a: 'With 100% financial transparency. Rodasi never charges commissions or hidden markups on medical services. Doctor consultation fees, lab tests, medications, and taxi fares are paid directly at actuals to the service providers. For transport, your Care Buddy rides in the same vehicle so there is never a second fare. For overseas children who prefer not to deal in local cash, we offer an optional prepaid travel and pharmacy wallet reconciled monthly with receipts.'
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
        'Care Buddy checks medicines against the prescription and tells the doctor if something doesn’t match, then coordinates doorstep refills.',
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

      {/* 5. TRANSPARENT MEMBERSHIP PLANS */}
      <section id="pricing-section" className="py-16 sm:py-24 bg-[#122617] text-[#EBF2E8] border-b border-[#F5D328]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="bg-[#183825] text-[#F5D328] border border-[#F5D328]/30 text-xs font-bold px-3.5 py-1.5 rounded-full inline-block uppercase tracking-wider">
              Transparent Membership
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Choose the Right Level of Care
            </h2>
            <p className="text-[#EBF2E8]/85 text-sm sm:text-base leading-relaxed">
              Every plan pairs your family with a named Care Buddy who is background-checked before their first visit. No hospital markups, zero hidden commissions.
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

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PLANS.filter((p) => !p.comingSoon).map((plan) => {
              const basePrice = parentMode === 'couple' ? plan.pricePerMonthCouple : plan.pricePerMonthSingle;
              const finalPrice = billingCycle === 'quarterly' ? Math.round(basePrice * 0.9) : basePrice;
              const finalUsd = Math.round(finalPrice / 83.5);

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 lg:p-7 flex flex-col justify-between transition-all relative ${
                    plan.popular
                      ? 'bg-[#183825] border-2 border-[#F5D328] shadow-2xl scale-[1.02] text-white'
                      : 'bg-white border-2 border-[#183825]/15 text-[#122617] shadow-md hover:border-[#183825]/30'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F5D328] text-[#122116] text-[11px] uppercase font-black px-3.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                      Recommended
                    </div>
                  )}

                  <div>
                    <h3 className={`text-xl sm:text-2xl font-black mb-1 ${plan.popular ? 'text-white' : 'text-[#122617]'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-xs font-bold mb-3 ${plan.popular ? 'text-[#E8F0C8]' : 'text-[#2D4533]'}`}>
                      {plan.tagline}
                    </p>
                    <p className={`text-xs sm:text-sm leading-relaxed mb-5 font-normal min-h-[40px] ${plan.popular ? 'text-[#E0EBDC]' : 'text-[#374F3E]'}`}>
                      {plan.description}
                    </p>

                    <div className={`pb-5 mb-5 border-b ${plan.popular ? 'border-white/15' : 'border-[#183825]/15'}`}>
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-3xl sm:text-4xl font-black ${plan.popular ? 'text-white' : 'text-[#122617]'}`}>
                          ₹{finalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className={`font-bold text-xs sm:text-sm ${plan.popular ? 'text-[#E8F0C8]' : 'text-[#2D4533]'}`}>
                          / month
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 font-semibold ${plan.popular ? 'text-[#E0EBDC]/80' : 'text-[#374F3E]'}`}>
                        (~${finalUsd} USD / month {billingCycle === 'quarterly' ? '• with 10% quarterly prepay' : ''})
                      </p>
                      <p className={`text-[10px] mt-1 ${plan.popular ? 'text-[#F5D328]' : 'text-[#183825]/80'} font-semibold`}>
                        * Prices are exclusive of 18% GST (added at billing)
                      </p>
                    </div>

                    <div className={`space-y-2 mb-5 p-3 sm:p-4 rounded-xl text-xs ${plan.popular ? 'bg-[#122617] border border-white/10 text-white' : 'bg-[#F4F7F2] border border-[#183825]/10 text-[#122617]'}`}>
                      <div className="flex items-center gap-2 font-bold">
                        <Clock className={`w-3.5 h-3.5 shrink-0 ${plan.popular ? 'text-[#F5D328]' : 'text-[#183825]'}`} />
                        <span>{plan.touchpoints}</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold">
                        <Stethoscope className={`w-3.5 h-3.5 shrink-0 ${plan.popular ? 'text-[#F5D328]' : 'text-[#183825]'}`} />
                        <span>{plan.hospitalHours}</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold">
                        <HeartHandshake className={`w-3.5 h-3.5 shrink-0 ${plan.popular ? 'text-[#F5D328]' : 'text-[#183825]'}`} />
                        <span>{plan.companionTasters}</span>
                      </div>
                    </div>

                    <ul className={`space-y-2 text-xs mb-6 ${plan.popular ? 'text-[#E0EBDC]' : 'text-[#374F3E]'}`}>
                      {plan.features.slice(3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.popular ? 'text-[#F5D328]' : 'text-[#183825]'}`} />
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
                          ? 'bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold shadow-md active:scale-[0.98]'
                          : 'bg-[#122617] hover:bg-[#183825] text-white active:scale-[0.98]'
                      }`}
                    >
                      <span>Select {plan.name.split(':')[0]}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Single Hospital Visit Card */}
          <div className="mt-10 max-w-3xl mx-auto p-6 rounded-3xl bg-[#F9F8F3] border-2 border-[#183825]/15 shadow-md flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#183825]/60 bg-[#E8F0C8] px-2.5 py-1 rounded-full">Try before you subscribe</span>
                <h3 className="text-xl font-black text-[#122617] mt-3">Try us with one hospital visit</h3>
                <p className="text-sm text-[#374F3E] leading-relaxed mt-2">
                  Your Care Buddy picks your parent up from home, stays through the visit, and brings them back. You get a voice note, the prescription photo and a summary on WhatsApp.
                </p>
              </div>
              <ul className="text-xs text-[#2D4533] space-y-1">
                <li>From ₹1,500 plus GST. Taxi at actuals, shown before you confirm.</li>
                <li>Up to 3 hours; ₹350 an hour after that, in 30-minute blocks.</li>
                <li>Free cancellation up to 12 hours before.</li>
              </ul>
              <p className="text-[11px] text-[#374F3E]/70 leading-relaxed">
                If you join a monthly plan within 30 days, we credit this visit against your first month.
              </p>
            </div>
            <div className="shrink-0">
              <a
                href="https://wa.me/919496097611?text=Hi%20Rodasi%20Team%2C%20I%20would%20like%20a%20quote%20for%20a%20single%20hospital%20visit%20for%20my%20parent."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#122617] hover:bg-[#183825] text-white font-bold text-sm transition whitespace-nowrap"
              >
                Ask for a quote on WhatsApp
              </a>
            </div>
          </div>

          {/* Commercial & Operational Rules */}
          <div className="mt-12 p-6 rounded-2xl bg-[#183825] border border-[#F5D328]/25 max-w-5xl mx-auto space-y-4">
            <h4 className="text-sm font-bold text-[#F5D328] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F5D328]" />
              <span>Transparent Commercial Rules & Operational Policies</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#EBF2E8]/80">
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
                <p>Care visits include designated accompaniment hours. Overtime beyond included hours is billed at ₹350/hour actuals (in 30-min blocks), confirmed with you beforehand.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F5D328]/20 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-[#EBF2E8]/90">
              <span className="font-bold text-[#F5D328] shrink-0">What is Not Included:</span>
              <span>Doctor consultation fees, nursing procedures, diagnostic lab tests, prescription medicines, taxi fares, buddy overtime beyond included hours, and physical therapy or rehabilitation (therapy comes from licensed providers, paid directly at actuals with zero commission).</span>
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#F5D328] uppercase tracking-wider">Care Spot Reservation</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Reserve Your Parents’ Care Buddy</h2>
            <p className="text-xs sm:text-sm text-[#EBF2E8]/80">Zero payment today. We confirm parent routines confidentially on WhatsApp.</p>
          </div>

          <form onSubmit={handleLeadSubmit} className="space-y-5 bg-[#183825] p-6 sm:p-8 rounded-3xl border border-[#F5D328]/30 shadow-2xl">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-900/60 border border-red-500/50 text-red-200 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Menon"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +971 50 123 4567"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">Your Expat Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dubai, UAE"
                  value={nrkLocation}
                  onChange={(e) => setNrkLocation(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#EBF2E8] uppercase tracking-wider mb-1">Parents' Town in Kerala</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kochi, Ernakulam"
                  value={parentTown}
                  onChange={(e) => setParentTown(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#122617] border border-[#F5D328]/30 text-white placeholder:text-[#EBF2E8]/40 focus:outline-none focus:border-[#F5D328] text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Consent Box */}
            <div className="p-4 rounded-xl bg-[#122617] border border-[#F5D328]/30">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#F5D328]/40 text-[#F5D328] bg-[#16291C] focus:ring-0 cursor-pointer shrink-0"
                />
                <span className="text-xs text-[#EBF2E8]/90 leading-relaxed">
                  I consent to Rodasi contacting me via WhatsApp and agree to the{' '}
                  <Link href="/privacy" target="_blank" className="text-[#F5D328] underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  . I confirm that my parents have consented to buddy home visits, photo updates, and voice briefings. (Specific parental health details will be collected confidentially on WhatsApp).
                </span>
              </label>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 px-6 rounded-xl bg-[#F5D328] hover:bg-[#FFE342] text-[#122116] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-[#122116]" />
                <span>{isSubmitting ? 'Registering Interest...' : 'Reserve Care Spot for Parents'}</span>
              </button>

              <button
                type="button"
                onClick={handleCallbackRequest}
                disabled={isSubmitting}
                className="py-4 px-6 rounded-xl bg-[#122617] hover:bg-[#1f452e] text-[#F5D328] border border-[#F5D328]/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-[#F5D328] text-[#122617]" />
                <span>Talk to our team first</span>
              </button>
            </div>

            <p className="text-[11px] text-[#EBF2E8]/70 text-center font-normal">
              Zero payment today. We connect on WhatsApp within one working day.
            </p>
          </form>
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
            A product of Zynthexion Technologies Private Limited, Kochi, Kerala.
          </p>
        </div>
      </footer>

      {/* SUCCESS CONFIRMATION MODAL */}
      {successModal && paymentDetails && (
        <div className="fixed inset-0 z-50 bg-[#0A130C]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#15301E] border border-[#F5D328]/30 text-[#EBF2E8] rounded-2xl sm:rounded-3xl p-6 sm:p-9 max-w-lg w-full text-center shadow-2xl relative">
            <div className="w-14 h-14 rounded-full bg-[#F5D328]/15 border border-[#F5D328] flex items-center justify-center text-[#F5D328] mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#F5D328]" />
            </div>

            <h3 className="text-2xl font-extrabold text-[#F5D328] mb-2">
              {paymentDetails.isCallback ? 'WhatsApp Connected & Request Sent!' : 'Care Spot Reserved!'}
            </h3>
            <p className="text-[#EBF2E8]/85 text-xs sm:text-sm mb-5 leading-relaxed">
              Thank you <strong>{fullName}</strong>. Your request has been received. Your Care Buddy and a coordinator will connect with you
              on WhatsApp (<strong>{whatsappNumber}</strong>) shortly to understand your parents’ needs.
            </p>

            <button
              type="button"
              onClick={() => setSuccessModal(false)}
              className="w-full py-3 rounded-xl bg-[#F5D328] text-[#122116] font-extrabold text-sm hover:bg-[#FFE342] transition cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
