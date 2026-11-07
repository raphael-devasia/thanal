'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GradientText from '@/components/GradientText';
import {
  HeartPulse,
  ShieldCheck,
  Trees,
  UtensilsCrossed,
  Users,
  Home,
  CheckCircle2,
  Phone,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  Send,
  Building,
  Award,
  Activity,
  Heart,
  FileText
} from 'lucide-react';

export default function LuxuryLivingPage() {
  // Contact Form State
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    email: '',
    currentLocation: 'Dubai, UAE',
    inquiryFor: 'My Parents in Kerala',
    residenceType: 'Independent 2BHK Garden Villa',
    timeline: 'Within 6 to 12 months',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [inquiryId, setInquiryId] = useState('');

  // Audience toggle for interactive view
  const [activeAudienceTab, setActiveAudienceTab] = useState<'parents' | 'retiree'>('parents');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.whatsappNumber.trim()) {
      setSubmitError('Please provide your name and WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/luxury-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          villaType: formData.residenceType // mapped for backwards-compatible API handling
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit inquiry. Please try again.');
      }

      setInquiryId(data.inquiryId || `INQ-${Date.now()}`);
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err?.message || 'Something went wrong. Please connect with us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppMessageUrl = () => {
    const text = `Hello Thanal Concierge, I am interested in the Luxury Senior Living Villas & Apartments in Kerala.\n\nName: ${formData.fullName || 'Interested Family'}\nLocation: ${formData.currentLocation}\nInquiring For: ${formData.inquiryFor}\nPreferred Residence: ${formData.residenceType}\nTimeline: ${formData.timeline}\n\nPlease share the private brochure, floor plans, and pricing details.`;
    return `https://wa.me/919496097611?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 font-sans selection:bg-[#E66323] selection:text-white pb-20 sm:pb-0">
      {/* 1. TOP ANNOUNCEMENT & CONCIERGE BAR */}
      <div className="bg-[#044749] text-white text-xs py-2.5 px-4 border-b border-teal-800/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-medium text-teal-100">
              Introducing Thanal Sansthanam: Kerala Premier Luxury Senior Living
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/"
              className="text-amber-300 hover:text-white transition flex items-center gap-1 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition group-hover:-translate-x-0.5" />
              <span>Thanal At-Home Eldercare</span>
            </Link>
            <span className="hidden sm:inline text-teal-700">|</span>
            <a
              href="https://wa.me/919496097611?text=Hello%20Thanal%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20luxury%20senior%20living%20community."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-white transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Concierge: +91 94960 97611</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION WITH IDENTICAL BRAND LOGO */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-[37px] z-40 transition-all shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-block hover:opacity-90 transition">
              <img
                src="/images/logo.png"
                alt="Thanal Eldercare Concierge"
                className="h-10 sm:h-14 lg:h-16 w-auto object-contain"
              />
            </Link>
            <div className="hidden sm:flex items-center pl-3 border-l border-slate-200">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 inline-block">
                Luxury Living
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#philosophy" className="hover:text-[#044749] transition">
              Philosophy
            </a>
            <a href="#heritage" className="hover:text-[#044749] transition">
              Kerala Roots
            </a>
            <a href="#amenities" className="hover:text-[#044749] transition">
              World-Class Amenities
            </a>
            <a href="#audience" className="hover:text-[#044749] transition">
              For Families
            </a>
            <Link
              href="/"
              className="text-slate-600 hover:text-[#044749] transition"
            >
              At-Home Eldercare
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#inquire"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Request Brochure</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-teal-950 via-[#044749] to-[#033739] text-white">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-400 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>A Haven for Refined Retirement in Kerala : Villas & Apartments</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-white mb-6">
            Premium Senior Living in <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100">
              God’s Own Country.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-teal-100/90 leading-relaxed font-normal mb-10">
            Experience a retirement defined by freedom, luxury, and absolute peace of mind. Beautifully designed villas and apartments in Kerala combining barrier-free independence with 24/7 world-class care.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
            <a
              href="#inquire"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-950/40 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Request Private Brochure</span>
            </a>

            <a
              href="https://wa.me/919496097611?text=Hello%20Thanal%2C%20I%20would%20like%20to%20schedule%20a%20private%20campus%20consultation%20and%20tour."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-sm sm:text-base backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Speak with Concierge</span>
            </a>
          </div>

          {/* 4 Feature Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 border-t border-teal-800/70 text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
              <Building className="w-5 h-5 text-amber-300 mb-2" />
              <div className="text-xs font-bold text-white">Villas & Apartments</div>
              <div className="text-[11px] text-teal-200/80">Barrier-free independent living</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
              <HeartPulse className="w-5 h-5 text-amber-300 mb-2" />
              <div className="text-xs font-bold text-white">24/7 Clinical Safety</div>
              <div className="text-[11px] text-teal-200/80">On-site doctors & nursing</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
              <UtensilsCrossed className="w-5 h-5 text-amber-300 mb-2" />
              <div className="text-xs font-bold text-white">Curated Kerala Dining</div>
              <div className="text-[11px] text-teal-200/80">Nutritious chef prepared meals</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
              <Trees className="w-5 h-5 text-amber-300 mb-2" />
              <div className="text-xs font-bold text-white">Holistic Ayurveda</div>
              <div className="text-[11px] text-teal-200/80">Lush restorative wellness</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 2: CORE PHILOSOPHY (INTRODUCTION) */}
      <section id="philosophy" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#044749] text-xs font-bold tracking-wide">
                <Award className="w-3.5 h-3.5 text-[#044749]" />
                <span>Our Core Philosophy</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                <GradientText>
                  A Life of Dignity, Joy, and Independence.
                </GradientText>
              </h2>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                Retirement should be a celebration, not a compromise. Our luxury senior living community is meticulously designed to offer a life free from daily chores and worries. Whether you are returning to your roots in Kerala to enjoy your golden years, or seeking a safe, vibrant haven for your parents, our community provides the perfect balance. We blend elegant, senior-friendly architecture with round-the-clock professional healthcare, ensuring every resident feels cherished, secure, and entirely at home in their private villa or apartment.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-[#E66323] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#044749]">Zero Chores Burden</h3>
                    <p className="text-[11px] text-slate-600">Full housekeeping, laundry, and property care handled daily.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-[#E66323] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#044749]">Villas & Luxury Apartments</h3>
                    <p className="text-[11px] text-slate-600">Private residences with total personal privacy and autonomy.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#044749] to-teal-900 text-white p-7 sm:p-9 shadow-xl border border-teal-800 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-300/40">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest font-bold text-amber-300 mb-1">
                    The Thanal Standard
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    Care That Never Intrudes, But Is Always There.
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
                    We recognize that true luxury for seniors is the freedom to live on one’s own terms, backed by an invisible, immediate response safety net staffed by professionals who genuinely care.
                  </p>
                </div>

                <div className="pt-4 border-t border-teal-700/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-extrabold text-amber-300 text-lg">24 / 7</div>
                    <div className="text-teal-200">On-Site Emergency Response</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-amber-300 text-lg">100%</div>
                    <div className="text-teal-200">Barrier-Free Design</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 3: THE KERALA CONNECTION (CULTURAL PILLAR) */}
      <section id="heritage" className="py-16 sm:py-24 bg-[#F4F6F4] border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>The Kerala Connection</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              <GradientText>
                Deeply Rooted in Our Heritage
              </GradientText>
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              We believe that true comfort comes from familiarity. Every aspect of our community reflects the soul of Kerala. From authentic regional cuisine and the celebration of local festivals to staff who speak your language and understand your culture, we have created an environment that feels exactly like home, only easier.
            </p>
          </div>

          {/* 4 Cultural Highlights */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#E66323] flex items-center justify-center font-bold mb-4">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#044749] mb-2">Authentic Nadan Cuisine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chef-crafted vegetarian delicacies, traditional Onam and Vishu feasts, and nutrient-balanced meals tailored to doctor guidelines.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#044749] flex items-center justify-center font-bold mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#044749] mb-2">Malayalam Warmth</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Attentive caregivers and concierge personnel who speak Malayalam fluently and understand traditional Kerala family values.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#044749] mb-2">Festivals & Celebrations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Year-round community joy celebrating Onam, Vishu, Christmas, Eid, classical music evenings, and temple excursions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-4">
                <Trees className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#044749] mb-2">Ayurvedic Serenity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Traditional healing gardens, herbal pathways, and certified therapists offering therapeutic massages and joint care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 4: KEY AMENITIES & FEATURES (ICON GRID) */}
      <section id="amenities" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#044749] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#044749]" />
              <span>World-Class Living Experience</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              <GradientText>
                Everything You Need, Right at Your Doorstep.
              </GradientText>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A comprehensive ecosystem designed from the ground up for physical wellness, active social life, and complete freedom across all villas and apartments.
            </p>
          </div>

          {/* 6 Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Round-the-Clock Healthcare */}
            <div className="p-7 rounded-2xl bg-[#FAF9F5] border border-slate-200 hover:border-[#044749] transition shadow-sm hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#044749] flex items-center justify-center mb-5 group-hover:bg-[#044749] group-hover:text-white transition">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#044749] mb-2">
                Round-the-Clock Healthcare
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                24/7 on-site professional nursing staff, rapid emergency response systems, and regular health monitoring.
              </p>
            </div>

            {/* 2. Barrier-Free Architecture */}
            <div className="p-7 rounded-2xl bg-[#FAF9F5] border border-slate-200 hover:border-[#044749] transition shadow-sm hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#044749] flex items-center justify-center mb-5 group-hover:bg-[#044749] group-hover:text-white transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#044749] mb-2">
                Barrier-Free Architecture
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ergonomically designed, wheelchair-friendly villas and apartments with anti-slip flooring, grab bars, and smart safety features.
              </p>
            </div>

            {/* 3. Holistic Wellness */}
            <div className="p-7 rounded-2xl bg-[#FAF9F5] border border-slate-200 hover:border-[#044749] transition shadow-sm hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#044749] flex items-center justify-center mb-5 group-hover:bg-[#044749] group-hover:text-white transition">
                <Trees className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#044749] mb-2">
                Holistic Wellness
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Lush, expansive green spaces featuring dedicated zones for traditional Ayurvedic therapies, yoga, and morning meditation.
              </p>
            </div>

            {/* 4. Wholesome Nutrition */}
            <div className="p-7 rounded-2xl bg-[#FAF9F5] border border-slate-200 hover:border-[#044749] transition shadow-sm hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#044749] flex items-center justify-center mb-5 group-hover:bg-[#044749] group-hover:text-white transition">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#044749] mb-2">
                Wholesome Nutrition
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A highly curated, nutritious vegetarian menu prepared daily by expert chefs, tailored to senior dietary requirements.
              </p>
            </div>

            {/* 5. Vibrant Community Life */}
            <div className="p-7 rounded-2xl bg-[#FAF9F5] border border-slate-200 hover:border-[#044749] transition shadow-sm hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#044749] flex items-center justify-center mb-5 group-hover:bg-[#044749] group-hover:text-white transition">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#044749] mb-2">
                Vibrant Community Life
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A daily calendar of activities including morning walking clubs, group exercises, indoor games, and cultural gatherings to keep the mind and body active.
              </p>
            </div>

            {/* 6. Maintenance-Free Living */}
            <div className="p-7 rounded-2xl bg-[#FAF9F5] border border-slate-200 hover:border-[#044749] transition shadow-sm hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#044749] flex items-center justify-center mb-5 group-hover:bg-[#044749] group-hover:text-white transition">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#044749] mb-2">
                Maintenance-Free Living
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Complete housekeeping, laundry, and property maintenance services, so residents can focus purely on enjoying life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION 5: AUDIENCE-SPECIFIC HOOKS (SPLIT SECTION) */}
      <section id="audience" className="py-16 sm:py-24 bg-[#FAF9F5] border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              <GradientText>
                Designed for Global Malayali Families
              </GradientText>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Whether you are planning for your beloved parents or charting your own graceful return home to Kerala.
            </p>

            {/* Interactive Toggle for Mobile & Desktop */}
            <div className="inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300 mt-4">
              <button
                type="button"
                onClick={() => setActiveAudienceTab('parents')}
                className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeAudienceTab === 'parents'
                    ? 'bg-[#044749] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#044749]'
                }`}
              >
                For NRIs Purchasing for Parents
              </button>
              <button
                type="button"
                onClick={() => setActiveAudienceTab('retiree')}
                className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeAudienceTab === 'retiree'
                    ? 'bg-[#044749] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#044749]'
                }`}
              >
                For the Retiring NRI
              </button>
            </div>
          </div>

          {/* Dual Audience Cards */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: For Parents */}
            <div
              className={`rounded-3xl p-8 border transition flex flex-col justify-between ${
                activeAudienceTab === 'parents'
                  ? 'bg-white border-[#E66323] shadow-xl ring-2 ring-[#E66323]/20'
                  : 'bg-white/70 border-slate-200'
              }`}
            >
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#E66323] text-xs font-bold">
                  <Heart className="w-3.5 h-3.5" />
                  <span>For the NRI Purchasing for Parents</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#044749] leading-snug">
                  Give Them the Lifestyle They Deserve.
                </h3>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  You work hard across the globe to provide for your family. Give your parents the ultimate gift: a secure, luxurious, and engaging community where their health, daily meals, and happiness are professionally managed by people who care.
                </p>

                <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#E66323] shrink-0" />
                    <span>Real-time WhatsApp health reports and family portal access</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#E66323] shrink-0" />
                    <span>Immediate emergency hospital coordination in Kochi & nearby</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#E66323] shrink-0" />
                    <span>Joyful companionship with like-minded peer residents</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <a
                  href="#inquire"
                  onClick={() => setFormData((prev) => ({ ...prev, inquiryFor: 'My Parents in Kerala' }))}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-50 hover:bg-[#E66323] text-[#E66323] hover:text-white font-bold text-xs sm:text-sm border border-[#E66323]/30 transition"
                >
                  <span>Inquire for Parents</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 2: For Retiring NRI */}
            <div
              className={`rounded-3xl p-8 border transition flex flex-col justify-between ${
                activeAudienceTab === 'retiree'
                  ? 'bg-white border-[#044749] shadow-xl ring-2 ring-[#044749]/20'
                  : 'bg-white/70 border-slate-200'
              }`}
            >
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-[#044749] text-xs font-bold">
                  <Home className="w-3.5 h-3.5" />
                  <span>For the Retiring NRI</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#044749] leading-snug">
                  Welcome Back to Kerala.
                </h3>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  Ready to return home? Trade the fast-paced global hustle for the serene, lush landscapes of Kerala. Enjoy an active, independent retirement surrounded by like-minded peers, premium amenities, and the peace of mind that your future healthcare needs are fully covered.
                </p>

                <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#044749] shrink-0" />
                    <span>Freehold villa or luxury apartment options with complete community amenities</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#044749] shrink-0" />
                    <span>Lush walking pathways, library, dining hall & wellness clubhouse</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#044749] shrink-0" />
                    <span>Zero property maintenance or housekeeping headaches</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <a
                  href="#inquire"
                  onClick={() => setFormData((prev) => ({ ...prev, inquiryFor: 'Myself / Spouse (Retirement Return)' }))}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-50 hover:bg-[#044749] text-[#044749] hover:text-white font-bold text-xs sm:text-sm border border-[#044749]/30 transition"
                >
                  <span>Inquire for My Retirement</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECTION 6: CONTACT FORM & PRODUCT EXPLANATION */}
      <section id="inquire" className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#FAF9F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Product Introduction */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#E66323] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Private Consultation & Brochure</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                <GradientText>
                  About the Product: What is Thanal Sansthanam?
                </GradientText>
              </h2>

              <div className="text-sm sm:text-base text-slate-700 space-y-4 leading-relaxed">
                <p>
                  <strong>Thanal Sansthanam</strong> is an exclusive, gated retirement community in Kerala built specifically for senior living. Unlike conventional crowded housing or clinical nursing homes, we offer private, independent luxury villas and senior-friendly apartments paired with a discreet, 24/7 world-class hospitality and healthcare network.
                </p>
                <p>
                  Every villa and apartment is designed barrier-free with zero steps, anti-slip flooring, and hospital-linked panic call points. Residents enjoy daily chef-prepared Kerala cuisine, housekeeping, laundry, lush Ayurvedic gardens, morning walking clubs, and on-site doctors: eliminating all household burdens while preserving total personal dignity.
                </p>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#044749]">
                  What Happens When You Inquire:
                </h3>
                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Instant private brochure and residence floor plans sent to WhatsApp.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>One-on-one consultation with our Senior Living Advisor.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Optional VIP campus tour booking for you or your family in Kerala.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <div className="text-xs text-slate-500 mb-2 font-medium">Prefer an immediate chat?</div>
                <a
                  href={getWhatsAppMessageUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Estate Concierge on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-xl relative">
                {submitted ? (
                  <div className="text-center py-10 space-y-5 animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-extrabold text-[#044749]">
                        Inquiry Received with Pleasure
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                        Thank you, <strong>{formData.fullName}</strong>. Your private brochure and floor plans have been dispatched. Our Senior Living Concierge will contact you at <strong>{formData.whatsappNumber}</strong>.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs text-slate-700 max-w-sm mx-auto space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Reference Number:</span>
                        <span className="font-mono font-bold text-[#E66323]">{inquiryId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Residence Choice:</span>
                        <span className="font-bold text-[#044749]">{formData.residenceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Timeline:</span>
                        <span className="font-bold text-slate-800">{formData.timeline}</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href={getWhatsAppMessageUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Open WhatsApp Conversation</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            fullName: '',
                            whatsappNumber: '',
                            email: '',
                            currentLocation: 'Dubai, UAE',
                            inquiryFor: 'My Parents in Kerala',
                            residenceType: 'Independent 2BHK Garden Villa',
                            timeline: 'Within 6 to 12 months',
                            notes: ''
                          });
                        }}
                        className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#044749]">
                        Request Private Brochure & Campus Tour
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Please share your details for our villas and apartments brochure. All communications are strictly confidential.
                      </p>
                    </div>

                    {submitError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                        {submitError}
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Dr. K. Radhakrishnan"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#044749] text-xs sm:text-sm bg-white"
                        />
                      </div>

                      {/* WhatsApp Phone */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          name="whatsappNumber"
                          required
                          value={formData.whatsappNumber}
                          onChange={handleInputChange}
                          placeholder="+971 50 123 4567 or +91 ..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#044749] text-xs sm:text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="name@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#044749] text-xs sm:text-sm bg-white"
                        />
                      </div>

                      {/* Current Location */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Your Current City / Country *
                        </label>
                        <input
                          type="text"
                          name="currentLocation"
                          required
                          value={formData.currentLocation}
                          onChange={handleInputChange}
                          placeholder="e.g. Dubai, London, Bangalore"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#044749] text-xs sm:text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Inquiring For */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Inquiring For
                        </label>
                        <select
                          name="inquiryFor"
                          value={formData.inquiryFor}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#044749] text-xs sm:text-sm bg-white cursor-pointer"
                        >
                          <option value="My Parents in Kerala">My Parents in Kerala</option>
                          <option value="Myself / Spouse (Retirement Return)">Myself / Spouse (Retirement Return)</option>
                          <option value="Both (Family Group)">Both (Family Group)</option>
                          <option value="Exploring for the Future">Exploring for the Future</option>
                        </select>
                      </div>

                      {/* Residence Type (Villas & Apartments) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Preferred Residence Type
                        </label>
                        <select
                          name="residenceType"
                          value={formData.residenceType}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#044749] text-xs sm:text-sm bg-white cursor-pointer"
                        >
                          <option value="Independent 2BHK Garden Villa">Independent 2BHK Garden Villa</option>
                          <option value="Independent 3BHK Heritage Villa">Independent 3BHK Heritage Villa</option>
                          <option value="Senior-Friendly 1BHK Apartment">Senior-Friendly 1BHK Apartment</option>
                          <option value="Luxury 2BHK Apartment">Luxury 2BHK Apartment</option>
                          <option value="Assisted Care Residence">Assisted Care Residence</option>
                          <option value="Undecided / Need Guidance">Undecided / Need Guidance</option>
                        </select>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Anticipated Move-In Timeline
                      </label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#044749] text-xs sm:text-sm bg-white cursor-pointer"
                      >
                        <option value="Immediate (0 to 3 months)">Immediate (0 to 3 months)</option>
                        <option value="Within 6 to 12 months">Within 6 to 12 months</option>
                        <option value="1 to 2 Years">1 to 2 Years</option>
                        <option value="Exploring / Planning Ahead">Exploring / Planning Ahead</option>
                      </select>
                    </div>

                    {/* Notes / Health Requirements */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Special Healthcare or Accessibility Requirements (Optional)
                      </label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="e.g. Mobility assistance needed, preferred floor in apartment, dietary requests..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#044749] text-xs sm:text-sm bg-white"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Dispatching Brochure...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            <span>Request Private Brochure & Pricing</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-center text-slate-500 pt-1">
                      Zero spam guarantee. Your contact details are shared only with our senior clinical concierge.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. LUXURY LIVING FOOTER */}
      <footer className="relative bg-gradient-to-b from-teal-950 via-[#044749] to-[#033739] text-white pt-20 sm:pt-28 pb-12 sm:pb-16 flex flex-col justify-end items-center overflow-hidden">
        {/* SVG Wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden pointer-events-none leading-none z-10">
          <svg
            viewBox="0 0 1320 241"
            className="w-full h-10 sm:h-16 lg:h-24 block fill-[#FAF9F5]"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 items-start mb-10">
            {/* Column 1 & 2: Logo, Old description & Registered Office */}
            <div className="lg:col-span-2 space-y-4 text-center md:text-left">
              <Link href="/" className="inline-block hover:opacity-90 transition">
                <img
                  src="/images/logo.png"
                  alt="Thanal Eldercare Concierge"
                  className="h-12 sm:h-16 lg:h-20 w-auto object-contain brightness-110 mx-auto md:mx-0"
                />
              </Link>
              <p className="max-w-md text-teal-100/90 leading-relaxed text-xs sm:text-sm">
                Sansthanam Luxury Senior Living Estate. Redefining retirement in Kerala through dignified care and barrier-free luxury.
              </p>
              <div className="text-[11px] sm:text-xs text-teal-200/80 space-y-0.5 pt-2 font-normal border-t border-teal-800/60 max-w-md">
                <p className="font-bold text-teal-100">Registered Office:</p>
                <p className="font-semibold text-white">Zynthexion Technologies Private Limited</p>
                <p>Suite No. A96, Door No. 63/700, D Space, 6th Floor, Sky Tower,</p>
                <p>Mavoor Road Junction, Bank Road, Kozhikode - 673001, Kerala</p>
              </div>
            </div>

            {/* Column 3: Old Details - Residences */}
            <div className="text-center md:text-left text-xs">
              <div className="font-bold text-white uppercase tracking-wider mb-3">
                Residences
              </div>
              <ul className="space-y-2 text-teal-200">
                <li>Senior-Friendly Apartments</li>
                <li>Luxury Garden Villas</li>
                <li>Assisted Care Pavilions</li>
                <li>Ayurvedic Health Retreat</li>
              </ul>
            </div>

            {/* Column 4: Old Details - Services */}
            <div className="text-center md:text-left text-xs">
              <div className="font-bold text-white uppercase tracking-wider mb-3">
                Services
              </div>
              <ul className="space-y-2 text-teal-200">
                <li><Link href="/" className="hover:text-white transition">Thanal At-Home Eldercare</Link></li>
                <li>24/7 Clinical Emergency Net</li>
                <li>Chef Curated Kerala Dining</li>
                <li>Concierge Hospital Escorts</li>
              </ul>
            </div>

            {/* Column 5: WhatsApp Direct Contact & Old Concierge Details */}
            <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left text-xs">
              <div>
                <div className="font-bold text-white uppercase tracking-wider mb-2">
                  Concierge Contact
                </div>
                <div className="space-y-1 text-teal-200">
                  <div>Email: info@zynthexion.com</div>
                  <div>Kochi, Kerala, India</div>
                </div>
              </div>

              <a
                href="https://wa.me/919496097611?text=Hi%20Thanal%20Team%2C%20I%20would%20like%20to%20know%20more%20about%20your%20care%20services%20and%20luxury%20living."
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center md:items-start gap-1 hover:opacity-90 transition pt-1"
              >
                <div className="flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm">
                  <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>Message us on WhatsApp</span>
                </div>
                <span className="text-lg sm:text-xl font-black text-[#E66323] tracking-tight group-hover:underline">
                  +91 9496097611
                </span>
              </a>
            </div>
          </div>

          {/* Bottom Legal & Copyright Bar */}
          <div className="pt-8 border-t border-teal-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-teal-300/80">
            <div>
              © {new Date().getFullYear()} Thanal Luxury Living. A product of Zynthexion Technologies Pvt. Ltd.
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/" className="hover:text-white transition">At-Home Eldercare</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <span>•</span>
              <Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 10. STICKY MOBILE BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden shadow-lg flex items-center gap-2">
        <a
          href="https://wa.me/919496097611?text=Hello%20Thanal%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20luxury%20senior%20living%20community."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Concierge</span>
        </a>

        <a
          href="#inquire"
          className="flex-1 py-2.5 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <FileText className="w-4 h-4" />
          <span>Get Brochure</span>
        </a>
      </div>
    </div>
  );
}
