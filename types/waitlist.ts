export type ParentMode = 'single' | 'couple';

export interface PlanOption {
  id: 'safety_net' | 'active_care' | 'comprehensive_care' | 'guest';
  name: string;
  pricePerMonthSingle: number;
  pricePerMonthCouple: number;
  usdPriceSingle: number;
  usdPriceCouple: number;
  description: string;
  features: string[];
  popular?: boolean;
  isGuest?: boolean;
}

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface WaitlistEntry {
  id?: string;
  fullName: string;
  whatsappNumber: string;
  nrkLocation: string; // e.g. Dubai, UAE
  parentDistrict: string; // default "Kannur"
  parentMode: ParentMode; // 'single' | 'couple'
  selectedPlan: string;
  selectedPlanName?: string;
  selectedAddOns: string[];
  paymentId: string;
  orderId: string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'Guest_Lead';
  depositAmount: number; // 1000 or 0 for guest
  createdAt: string; // ISO string
}

export const PLANS: PlanOption[] = [
  {
    id: 'safety_net',
    name: 'Safety Net Plan',
    pricePerMonthSingle: 2500,
    pricePerMonthCouple: 3750,
    usdPriceSingle: 30,
    usdPriceCouple: 45,
    description: 'Essential emergency backup & digital vitals tracking for peace of mind.',
    features: [
      '24/7 SOS Dispatch & Emergency Triage',
      'Digital EMR (Health Records) Vault',
      '1 Monthly Comprehensive Vitals Audit'
    ]
  },
  {
    id: 'active_care',
    name: 'Active Care Plan',
    pricePerMonthSingle: 7000,
    pricePerMonthCouple: 10500,
    usdPriceSingle: 85,
    usdPriceCouple: 125,
    description: 'Complete hands-on assistance for regular clinic visits and medication management.',
    features: [
      'Everything in Safety Net Plan',
      '2 Scheduled Hospital OPD Escorts/mo',
      'Doorstep Pharmacy Refills & Delivery'
    ],
    popular: true
  },
  {
    id: 'comprehensive_care',
    name: 'Comprehensive Care Plan',
    pricePerMonthSingle: 15000,
    pricePerMonthCouple: 21500,
    usdPriceSingle: 180,
    usdPriceCouple: 260,
    description: 'Dedicated 1-on-1 care management with weekly visits and priority support.',
    features: [
      'Everything in Active Care Plan',
      '4 Scheduled Hospital OPD Escorts/mo',
      'Weekly Home Health & Vitals Audits',
      '24/7 Dedicated Care Manager (Malayalam & English)'
    ]
  }
];

export const GUEST_PLAN: PlanOption = {
  id: 'guest',
  name: 'Guest / Pay-As-You-Go',
  pricePerMonthSingle: 0,
  pricePerMonthCouple: 0,
  usdPriceSingle: 0,
  usdPriceCouple: 0,
  description: 'Not ready to subscribe? Create a free Guest Account. Book services a-la-carte at standard retail prices plus a ₹250 convenience fee.',
  features: [
    'Zero Monthly Membership Fee',
    'A-la-carte OPD & Lab Escort Booking',
    'Standard Retail Rates + ₹250 Convenience Fee',
    'No Deposit Required to Register'
  ],
  isGuest: true
};

export const ADD_ONS: AddOnOption[] = [
  {
    id: 'opd_escort',
    name: 'Additional OPD Escort',
    price: 1200,
    unit: '/visit'
  },
  {
    id: 'wheelchair_ac_transport',
    name: 'Wheelchair AC Transport',
    price: 2200,
    unit: '/trip'
  },
  {
    id: 'lab_pickup',
    name: 'Diagnostic Lab Pickup',
    price: 150,
    unit: '/sample'
  },
  {
    id: 'legal_bank_escort',
    name: 'Govt / Bank / Legal Escort',
    price: 800,
    unit: '/visit'
  }
];

export const KERALA_DISTRICTS = [
  'Kannur',
  'Kasaragod',
  'Wayanad',
  'Kozhikode',
  'Malappuram',
  'Palakkad',
  'Thrissur',
  'Ernakulam',
  'Idukki',
  'Kottayam',
  'Alappuzha',
  'Pathanamthitta',
  'Kollam',
  'Thiruvananthapuram'
];

export const POPULAR_NRK_LOCATIONS = [
  'Dubai, UAE',
  'Abu Dhabi, UAE',
  'Sharjah, UAE',
  'Doha, Qatar',
  'Riyadh, Saudi Arabia',
  'Muscat, Oman',
  'Kuwait City, Kuwait',
  'Manama, Bahrain',
  'London, UK',
  'Singapore',
  'Toronto, Canada',
  'New York, USA',
  'Sydney, Australia'
];
