'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronDown,
  MessageCircle,
  Search,
  HelpCircle,
  ShieldCheck,
  Stethoscope,
  Clock,
  HeartHandshake,
  CreditCard,
  PhoneCall,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import BrandName from '@/components/BrandName';

interface FaqItem {
  id: string;
  category: 'all' | 'buddy' | 'medical' | 'billing' | 'communication';
  q: string;
  a: string;
  highlights?: string[];
}

export default function FaqPage() {
  const [openFaqId, setOpenFaqId] = useState<string | null>('buddy-difference');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'buddy' | 'medical' | 'billing' | 'communication'>('all');

  const faqs: FaqItem[] = [
    {
      id: 'buddy-difference',
      category: 'buddy',
      q: 'What is a Care Buddy, and how is Greymatters different from an agency?',
      a: "A Care Buddy is not an impersonal agency nurse or domestic helper. Think of them as your dedicated proxy: the child on the ground in Kerala. Your Care Buddy and a coordinator you can message work together for your family. Your Care Buddy is an educated, background-verified professional (MSW graduates, retired nurses, or trained care specialists) assigned personally to your parents. They visit regularly, get to know your parent's unique medical routine and personality, escort them to doctor appointments (up to 6 hours per hospital trip), coordinate hospital visits, run essential errands, and provide warm companionship. You receive direct WhatsApp voice briefings and photos after every single visit.",
      highlights: [
        'Dedicated companion assigned permanently (no rotation of strangers)',
        'Up to 6 hours hospital escort per doctor consult',
        'Direct Malayalam or English WhatsApp voice briefings after every visit'
      ]
    },
    {
      id: 'emergency-protocol',
      category: 'medical',
      q: 'What happens during a medical emergency?',
      a: "If your parents can't call, we call 108, and your Care Buddy goes to the hospital. We keep you updated until you arrive or someone you name takes over.",
      highlights: [
        'Immediate 108 ambulance dispatch and coordination',
        'Care Buddy deployed to the hospital emergency department',
        'Continuous family updates abroad until you or your named local relative takes over'
      ]
    },
    {
      id: 'family-doctor',
      category: 'medical',
      q: 'Can our parents consult their existing family doctor or preferred hospital in Kerala?',
      a: "Any hospital or doctor your family chooses. We don't have preferred hospitals, so our advice is never tied to one.",
      highlights: [
        'Zero hospital ties or kickbacks',
        'We visit whichever specialist, clinic, or hospital your parents trust',
        'Unbiased, objective patient advocacy beside the doctor'
      ]
    },
    {
      id: 'time-zone-updates',
      category: 'communication',
      q: 'How do you keep children abroad updated across different time zones (Gulf, UK, US, Australia)?',
      a: "Unlike generic apps that require logging into an unfamiliar portal, Greymatters is WhatsApp-first. After every visit or hospital consult, your Care Buddy sends a 60-second Malayalam or English voice note and high-resolution photos of prescriptions or test slips. In addition, we schedule regular parent-and-child video calls hosted by the Care Buddy at a fixed day and time tailored to your international time zone.",
      highlights: [
        'No app login required: all updates arrive directly in your WhatsApp',
        '60-second audio summary + crisp photos of medicine slips',
        'Scheduled cross-timezone video calls hosted by the buddy'
      ]
    },
    {
      id: 'couple-discount',
      category: 'billing',
      q: 'How does the couple discount work for both parents?',
      a: "We offer a straightforward, transparent 25% discount on the second parent for all plans. For example, on the Care Plus plan (₹11,000/month for a single parent), coverage for both parents is ₹19,250/month (₹11,000 + ₹8,250). Both parents receive comprehensive wellness monitoring, hospital accompaniment, and companionship.",
      highlights: [
        'Flat 25% savings applied automatically to the second parent',
        'Equal high-touch attention, accompaniment, and records for both parents',
        'Shared home visits and coordinated hospital visits'
      ]
    },
    {
      id: 'refund-policy',
      category: 'billing',
      q: 'What is your refund, pause, and cancellation policy?',
      a: "Start with a single month. No lock-in. Cancel anytime with 15 days notice. Monthly plans: no refund for the current month, and you stop at the end of it. Quarterly prepaid plans: unused full months are refunded pro-rata within 5 to 7 business days. No cancellation fees. If your family is traveling or your parents have a prolonged hospital stay, you can pause membership for 14 to 60 days with 7 days notice, freezing all billing until care resumes.",
      highlights: [
        'Start with a single month: no mandatory long-term lock-in',
        'Quarterly prepaid unused full months refunded pro-rata within 5 to 7 business days',
        'Zero cancellation fees',
        'Pause membership for 14 to 60 days when parents travel abroad'
      ]
    },
    {
      id: 'zero-commission-billing',
      category: 'billing',
      q: 'How are hospital bills, pharmacy refills, and taxi fares billed?',
      a: "With 100% financial transparency. Greymatters never charges commissions or hidden markups on medical services. Doctor consultation fees, lab tests, and medications are paid directly at actuals to the service providers. For transport, your plan includes a refundable Zero-Markup Mobility Wallet float (₹1,500 to ₹4,000) with zero commissions and WhatsApp receipts sent at actuals, topped up monthly so there is zero cash friction for your parents. Your Care Buddy rides in the same vehicle so there is never a second fare.",
      highlights: [
        '100% zero commissions: all doctors, labs, and medicines paid at true actual cost',
        'Refundable Zero-Markup Mobility Wallet float covers cabs without parents handling cash',
        'Itemized digital receipts shared via WhatsApp'
      ]
    },
    {
      id: 'buddy-vetting',
      category: 'buddy',
      q: 'How are Care Buddies vetted and selected?',
      a: "Every Care Buddy is background-checked before their first visit. We verify identity and credentials to ensure your parents are in trustworthy, dependable hands.",
      highlights: [
        'Government ID and identity verification',
        'Criminal background and reference checks',
        'Healthcare, social work, or professional eldercare training',
        'Continuous performance and punctuality monitoring'
      ]
    },
    {
      id: 'service-locations',
      category: 'buddy',
      q: 'Which locations in Kerala do you currently serve?',
      a: "We currently provide full Care Buddy accompaniment across Kochi, Ernakulam city, and immediate surrounding suburbs (including Kakkanad, Aluva, Tripunithura, Fort Kochi, and Edappally). We are actively expanding to Kottayam, Thrissur, and Kozhikode.",
      highlights: [
        'Active throughout Greater Kochi and Ernakulam district',
        'Expanding to Kottayam, Thrissur, and Kozhikode',
        'Door-to-door coverage directly to your parents’ doorstep'
      ]
    },
    {
      id: 'what-not-included',
      category: 'medical',
      q: 'Does Greymatters provide 24/7 maid services or full-time bedside nursing?',
      a: "No. Greymatters is an accompaniment and eldercare advocacy concierge, not a maid bureau or live-in servant agency. We provide structured daytime visits, hospital accompaniment up to 6 hours per consult, errands, and warm companionship. If your parent requires continuous bedside nursing or post-operative wound care, we connect you with vetted, licensed home nursing providers and supervise their schedule without taking any agency commission.",
      highlights: [
        'Accompaniment concierge, not a maid or domestic helper agency',
        'Independent coordination with licensed nurses when full-time bedside care is needed',
        'Zero agency commission on third-party nursing referrals'
      ]
    },
    {
      id: 'service-pause',
      category: 'billing',
      q: 'Can we pause the plan if our parents travel to visit us abroad for a month or two?',
      a: "Yes. You can pause your family's membership for 14 to 60 days with 7 days advance notice. All billing is frozen during the pause period, and your parent's designated Care Buddy and medical records remain reserved until they return to Kerala.",
      highlights: [
        'Pause from 14 up to 60 days with 7 days written notice',
        'No fees during paused periods',
        'Same Care Buddy resumes care when parents return home'
      ]
    },
    {
      id: 'getting-started',
      category: 'buddy',
      q: 'How do we begin care for our parents?',
      a: "Getting started takes just 3 simple steps: 1) Reach out via WhatsApp to discuss your parents' daily routine and location. 2) Complete a 20-minute family intake call where we record medical history, medications, and family preferences. 3) Your assigned Care Buddy conducts an initial home welcome visit and joins a family video call with you.",
      highlights: [
        'Step 1: Quick WhatsApp conversation',
        'Step 2: 20-minute parent profiling and medical routine documentation',
        'Step 3: In-person home welcome visit with live video call to children abroad'
      ]
    }
  ];

  const categories = [
    { key: 'all', label: 'All Questions' },
    { key: 'buddy', label: 'Care Buddy & Services' },
    { key: 'medical', label: 'Medical & Emergencies' },
    { key: 'billing', label: 'Pricing & Billing' },
    { key: 'communication', label: 'Updates & WhatsApp' }
  ] as const;

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const qLower = faq.q.toLowerCase();
      const aLower = faq.a.toLowerCase();
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        qLower.includes(searchLower) ||
        aLower.includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [faqs, activeCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const sampleWhatsAppUrl =
    'https://wa.me/919496097611?text=' +
    encodeURIComponent(
      'Hi Greymatters Team, I have a question about Care Buddy eldercare services for my parents in Kerala.'
    );

  return (
    <div className="min-h-screen bg-[#F9F8F3] text-[#122617] font-sans selection:bg-[#F1E5C6] selection:text-[#122116] pb-16">
      {/* 1. TOP STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-[#122617] text-white border-b border-[#F1E5C6]/30 navbar-glow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#F1E5C6] hover:text-[#F7EED8] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to <BrandName /></span>
          </Link>

          <Link href="/" className="inline-flex items-center">
            <img
              src="/images/logo.png"
              alt="Greymatters"
              className="h-11 sm:h-13 w-auto object-contain brightness-110"
            />
          </Link>

          <a
            href={sampleWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition shadow-sm active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white text-transparent shrink-0" />
            <span className="hidden sm:inline">Ask on WhatsApp</span>
            <span className="sm:hidden">Chat</span>
          </a>
        </div>
      </header>

      {/* 2. HERO / SEARCH BANNER */}
      <section className="bg-gradient-to-b from-[#122617] via-[#183825] to-[#122617] text-white py-12 sm:py-16 px-4 border-b border-[#183825]">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#183825] border border-[#F1E5C6]/30 text-[#F1E5C6] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions & Answers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Frequently Asked Questions
          </h1>

          <p className="text-xs sm:text-sm text-[#EBF2E8]/85 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our Care Buddy concept, emergency coordination, hospital accompaniment, transparent monthly billing, and WhatsApp updates across oceans.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#122617]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. emergency, refund, doctor, transport)..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-[#122617] placeholder:text-[#122617]/40 text-xs sm:text-sm font-medium border border-[#F1E5C6]/40 focus:outline-none focus:ring-2 focus:ring-[#F1E5C6] shadow-md"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#122617]/50 hover:text-[#122617]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY PILLS */}
      <section className="bg-[#FAF8F3] border-b border-[#122617]/10 sticky top-[57px] sm:top-[65px] z-30 shadow-xs backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#183825] text-[#F1E5C6] shadow-sm'
                      : 'bg-white text-[#122617]/80 hover:bg-[#183825]/10 border border-[#122617]/15'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION LIST */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#183825]/10 p-8 space-y-3">
            <HelpCircle className="w-8 h-8 text-[#183825]/40 mx-auto" />
            <h3 className="font-bold text-base text-[#122617]">No questions match your search</h3>
            <p className="text-xs text-[#2D4533] max-w-md mx-auto">
              We are happy to answer any specific questions about your parents’ needs directly on WhatsApp.
            </p>
            <div className="pt-2">
              <a
                href={sampleWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-transparent" />
                <span>Ask our team directly</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-white border border-[#183825]/15 overflow-hidden shadow-xs hover:border-[#183825]/30 transition"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-[#122617] flex items-center justify-between gap-3 cursor-pointer hover:bg-[#FAF8F3] transition"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#183825] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#C5A880]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 text-xs sm:text-sm text-[#2D4533] leading-relaxed border-t border-[#183825]/10 bg-[#FAF8F3]/60 space-y-3">
                      <p>{faq.a}</p>

                      {faq.highlights && faq.highlights.length > 0 && (
                        <div className="pt-2 border-t border-[#183825]/10 space-y-1.5">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#183825]">
                            Key Takeaways:
                          </p>
                          <ul className="space-y-1">
                            {faq.highlights.map((item, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-2 text-xs text-[#243B2B]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#183825] mt-1.5 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 5. STILL HAVE QUESTIONS? CALLOUT CARD */}
        <div className="pt-8">
          <div className="rounded-2xl bg-gradient-to-r from-[#122617] to-[#183825] text-white p-6 sm:p-8 border border-[#F1E5C6]/30 shadow-md space-y-4">
            <div className="max-w-xl space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#F1E5C6] bg-[#183825] px-2.5 py-1 rounded-full border border-[#F1E5C6]/20">
                Direct Family Support
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Have a question specific to your parents’ situation?
              </h3>
              <p className="text-xs sm:text-sm text-[#EBF2E8]/85 leading-relaxed">
                Whether it is doctor queues, complex mobility, or coordinating across time zones, speak with our care team directly on WhatsApp.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                href={sampleWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent shrink-0" />
                <span>Chat with Care Team on WhatsApp</span>
              </a>

              <Link
                href="/plans"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F1E5C6] hover:bg-[#F7EED8] text-[#122116] text-xs sm:text-sm font-extrabold transition shadow-sm active:scale-95"
              >
                <span>View Care Plans & Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 6. FOOTER */}
      <footer className="mt-12 bg-[#0D1C11] text-[#EBF2E8] py-10 px-4 border-t border-[#F1E5C6]/20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Link href="/" className="inline-block">
            <img
              src="/images/logo.png"
              alt="Greymatters"
              className="h-10 w-auto object-contain mx-auto brightness-110"
            />
          </Link>

          {/* Three Trust Lines */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#F1E5C6] font-medium">
            <span>Named Care Buddy</span>
            <span className="text-[#EBF2E8]/40">·</span>
            <span>No hospital commissions</span>
            <span className="text-[#EBF2E8]/40">·</span>
            <span>Pro-rata refund</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#EBF2E8]/70">
            <Link href="/" className="hover:text-[#F1E5C6] transition">Home</Link>
            <span>·</span>
            <Link href="/plans" className="hover:text-[#F1E5C6] transition">Plans & Pricing</Link>
            <span>·</span>
            <Link href="/luxury-living" className="hover:text-[#F1E5C6] transition">Retirement Living</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-[#F1E5C6] transition">Terms</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-[#F1E5C6] transition">Privacy</Link>
            <span>·</span>
            <Link href="/refund-policy" className="hover:text-[#F1E5C6] transition">Refund Policy</Link>
          </div>

          <p className="text-[11px] text-[#EBF2E8]/50">
            © {new Date().getFullYear()} <BrandName />. Operated by Zynthexion Technologies Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
