export type ParentMode = 'single' | 'couple';

export interface PlanOption {
  id: 'essential' | 'care_plus' | 'comfort' | 'companion' | 'safety_net' | 'active_care' | 'comprehensive_care' | 'guest';
  name: string;
  tagline?: string;
  pricePerMonthSingle: number;
  pricePerMonthCouple: number;
  usdPriceSingle: number;
  usdPriceCouple: number;
  description: string;
  touchpoints?: string;
  hospitalHours?: string;
  companionTasters?: string;
  features: string[];
  popular?: boolean;
  comingSoon?: boolean;
  isGuest?: boolean;
}

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: 'AE', name: 'United Arab Emirates (+971)', dialCode: '971' },
  { code: 'SA', name: 'Saudi Arabia (+966)', dialCode: '966' },
  { code: 'QA', name: 'Qatar (+974)', dialCode: '974' },
  { code: 'OM', name: 'Oman (+968)', dialCode: '968' },
  { code: 'KW', name: 'Kuwait (+965)', dialCode: '965' },
  { code: 'BH', name: 'Bahrain (+973)', dialCode: '973' },
  { code: 'IN', name: 'India (+91)', dialCode: '91' },
  { code: 'GB', name: 'United Kingdom (+44)', dialCode: '44' },
  { code: 'US', name: 'United States (+1)', dialCode: '1' },
  { code: 'CA', name: 'Canada (+1)', dialCode: '1' },
  { code: 'AU', name: 'Australia (+61)', dialCode: '61' },
  { code: 'SG', name: 'Singapore (+65)', dialCode: '65' },
  { code: 'DE', name: 'Germany (+49)', dialCode: '49' },
  { code: 'IE', name: 'Ireland (+353)', dialCode: '353' },
  { code: 'NZ', name: 'New Zealand (+64)', dialCode: '64' },
  { code: 'MY', name: 'Malaysia (+60)', dialCode: '60' },
  { code: 'CH', name: 'Switzerland (+41)', dialCode: '41' }
];

export function detectVisitorCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Dubai')) return 'AE';
    if (tz.includes('Riyadh')) return 'SA';
    if (tz.includes('Qatar')) return 'QA';
    if (tz.includes('Muscat')) return 'OM';
    if (tz.includes('Kuwait')) return 'KW';
    if (tz.includes('Bahrain')) return 'BH';
    if (tz.includes('London')) return 'GB';
    if (tz.includes('Kolkata') || tz.includes('Calcutta')) return 'IN';
    if (tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Los_Angeles') || tz.includes('Denver')) return 'US';
    if (tz.includes('Toronto') || tz.includes('Vancouver')) return 'CA';
    if (tz.includes('Sydney') || tz.includes('Melbourne') || tz.includes('Perth') || tz.includes('Brisbane')) return 'AU';
    if (tz.includes('Singapore')) return 'SG';
    if (tz.includes('Berlin') || tz.includes('Frankfurt')) return 'DE';
    if (tz.includes('Dublin')) return 'IE';
    if (tz.includes('Auckland')) return 'NZ';
    if (tz.includes('Kuala_Lumpur')) return 'MY';
  } catch {
    // fallback
  }
  return '';
}

export interface WaitlistEntry {
  id?: string;
  fullName: string;
  whatsappNumber: string;
  country?: string;
  source?: string;
  nrkLocation?: string; // legacy support
  parentDistrict?: string;
  parentMode?: ParentMode;
  selectedPlan?: string;
  selectedPlanName?: string;
  selectedAddOns?: string[];
  paymentId?: string;
  orderId?: string;
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'Guest_Lead' | 'Lead_Submitted' | 'Callback_Requested';
  depositAmount?: number;
  createdAt: string; // ISO string
}

export const PLANS: PlanOption[] = [
  {
    id: 'essential',
    name: 'Care Essential',
    tagline: 'Reliable Safety Net & Medical Escort',
    pricePerMonthSingle: 6000,
    pricePerMonthCouple: 10500, // 25% discount on second parent (6000 + 4500)
    usdPriceSingle: 72,
    usdPriceCouple: 126,
    description: 'Ideal for independent parents who need a reliable emergency backup, regular wellness checks, and hospital OPD accompaniment.',
    touchpoints: '3 to 4 touchpoints / mo (1 weekly buddy visit + 1 call/wk)',
    hospitalHours: '1 hospital trip / mo (up to 4 hours buddy accompaniment)',
    companionTasters: '1 Companion Afternoon taster / month',
    features: [
      '1 Weekly Care Buddy in-person check-in (1.5 hrs)',
      '1 Hospital OPD Escort trip / month (up to 4 hrs buddy time)',
      '1 Companion Afternoon taster session per month',
      'Emergency line answered 7 am to 10 pm. Outside those hours, call 108 first; your buddy responds in the morning.',
      'Care Passport digital folder & monthly health report',
      '2 Errands or bill payment runs per month',
      'Initial Home Safety & fall-prevention audit'
    ]
  },
  {
    id: 'care_plus',
    name: 'Care Plus',
    tagline: 'Active Health Management & Hospital Support',
    pricePerMonthSingle: 11000,
    pricePerMonthCouple: 19250, // 25% discount on second parent (11000 + 8250)
    usdPriceSingle: 132,
    usdPriceCouple: 231,
    description: 'Designed for parents with chronic health needs who require frequent check-ins, routine hospital visits, and instant WhatsApp voice updates.',
    touchpoints: '10 to 12 in-person visits (~18-20 hrs with parent / mo)',
    hospitalHours: '2 hospital trips / mo (up to 5 hours buddy accompaniment each)',
    companionTasters: '2 Companion Afternoon tasters / month',
    features: [
      '2 Weekly Care Buddy visits (1.5 hrs each) + 2 calls/wk',
      '2 Hospital OPD Escort trips / month (up to 5 hrs buddy time each)',
      '2 Companion Afternoon tasters per month',
      '1 Planned Doctor consult or tele-consult per quarter',
      'Instant WhatsApp voice notes & prescription photos after each visit',
      'Doorstep medicine stock checks & refill management',
      'Errands & bill payments included (reasonable use)',
      'Annual home safety & fall-prevention audit'
    ],
    popular: true
  },
  {
    id: 'comfort',
    name: 'Care Complete',
    tagline: 'High-Attention Coordination & Companionship',
    pricePerMonthSingle: 18000,
    pricePerMonthCouple: 31500, // 25% discount on second parent (18000 + 13500)
    usdPriceSingle: 216,
    usdPriceCouple: 378,
    description: 'Complete hands-on attention for parents needing frequent in-person contact, intensive hospital coordination, and rich companion engagement.',
    touchpoints: '16 to 19 in-person visits (~30 hrs with parent / mo)',
    hospitalHours: '3 hospital trips / mo (up to 6 hours buddy accompaniment each)',
    companionTasters: '4 Companion Afternoon tasters / month (weekly companionship)',
    features: [
      '3 Weekly Care Buddy visits (1.5 hrs each) + 3 calls/wk',
      '3 Hospital OPD Escort trips / month (up to 6 hrs buddy time each)',
      '4 Companion Afternoon tasters per month (weekly companionship)',
      '2 Planned Doctor consults or tele-consults per quarter',
      'WhatsApp update after every visit + weekly summary + monthly report',
      'Full errand running, bank & pension life certificate assistance',
      'Home safety audit every 6 months'
    ]
  },
  {
    id: 'companion',
    name: 'Companion',
    tagline: 'Signature Daily Companionship (Launching Soon)',
    pricePerMonthSingle: 20000,
    pricePerMonthCouple: 35000,
    usdPriceSingle: 240,
    usdPriceCouple: 420,
    description: '22 days a month, 3 hours a day of dedicated companionship. For parents living alone who seek warmth, meaningful conversation, and daily presence. Join the waitlist.',
    touchpoints: '26 in-person visits (70 to 75 hrs with parent / mo)',
    hospitalHours: '2 hospital trips / mo (up to 6 hours buddy time each)',
    companionTasters: 'Full daily service (22 days x 3 hrs = 66 hrs companionship)',
    features: [
      '22 Days a month x 3 hours daily dedicated companionship (66 hrs)',
      '1 Care Buddy coordination visit + daily check-in calls',
      '2 Hospital OPD escort trips / month (up to 6 hrs each)',
      'Monthly scheduled parent-and-child video call hosted by the buddy',
      'Personal Shopper service (accompanied shopping or online ordering)',
      'Memory games, reading aloud, light walks & tech mentoring',
      'Early upgrade access for founding members'
    ],
    comingSoon: true
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
