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

export const TOP_NRK_COUNTRIES: CountryOption[] = [
  { code: 'AE', name: 'United Arab Emirates', dialCode: '971' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '966' },
  { code: 'QA', name: 'Qatar', dialCode: '974' },
  { code: 'OM', name: 'Oman', dialCode: '968' },
  { code: 'KW', name: 'Kuwait', dialCode: '965' },
  { code: 'BH', name: 'Bahrain', dialCode: '973' },
  { code: 'IN', name: 'India', dialCode: '91' },
  { code: 'GB', name: 'United Kingdom', dialCode: '44' },
  { code: 'US', name: 'United States', dialCode: '1' },
  { code: 'CA', name: 'Canada', dialCode: '1' },
  { code: 'AU', name: 'Australia', dialCode: '61' },
  { code: 'SG', name: 'Singapore', dialCode: '65' },
  { code: 'DE', name: 'Germany', dialCode: '49' },
  { code: 'IE', name: 'Ireland', dialCode: '353' },
  { code: 'NZ', name: 'New Zealand', dialCode: '64' },
  { code: 'MY', name: 'Malaysia', dialCode: '60' },
  { code: 'CH', name: 'Switzerland', dialCode: '41' }
];

export const ALL_COUNTRIES: CountryOption[] = [
  { code: 'AF', name: 'Afghanistan', dialCode: '93' },
  { code: 'AL', name: 'Albania', dialCode: '355' },
  { code: 'DZ', name: 'Algeria', dialCode: '213' },
  { code: 'AS', name: 'American Samoa', dialCode: '1-684' },
  { code: 'AD', name: 'Andorra', dialCode: '376' },
  { code: 'AO', name: 'Angola', dialCode: '244' },
  { code: 'AI', name: 'Anguilla', dialCode: '1-264' },
  { code: 'AG', name: 'Antigua and Barbuda', dialCode: '1-268' },
  { code: 'AR', name: 'Argentina', dialCode: '54' },
  { code: 'AM', name: 'Armenia', dialCode: '374' },
  { code: 'AW', name: 'Aruba', dialCode: '297' },
  { code: 'AU', name: 'Australia', dialCode: '61' },
  { code: 'AT', name: 'Austria', dialCode: '43' },
  { code: 'AZ', name: 'Azerbaijan', dialCode: '994' },
  { code: 'BS', name: 'Bahamas', dialCode: '1-242' },
  { code: 'BH', name: 'Bahrain', dialCode: '973' },
  { code: 'BD', name: 'Bangladesh', dialCode: '880' },
  { code: 'BB', name: 'Barbados', dialCode: '1-246' },
  { code: 'BY', name: 'Belarus', dialCode: '375' },
  { code: 'BE', name: 'Belgium', dialCode: '32' },
  { code: 'BZ', name: 'Belize', dialCode: '501' },
  { code: 'BJ', name: 'Benin', dialCode: '229' },
  { code: 'BM', name: 'Bermuda', dialCode: '1-441' },
  { code: 'BT', name: 'Bhutan', dialCode: '975' },
  { code: 'BO', name: 'Bolivia', dialCode: '591' },
  { code: 'BA', name: 'Bosnia and Herzegovina', dialCode: '387' },
  { code: 'BW', name: 'Botswana', dialCode: '267' },
  { code: 'BR', name: 'Brazil', dialCode: '55' },
  { code: 'IO', name: 'British Indian Ocean Territory', dialCode: '246' },
  { code: 'VG', name: 'British Virgin Islands', dialCode: '1-284' },
  { code: 'BN', name: 'Brunei', dialCode: '673' },
  { code: 'BG', name: 'Bulgaria', dialCode: '359' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '226' },
  { code: 'BI', name: 'Burundi', dialCode: '257' },
  { code: 'KH', name: 'Cambodia', dialCode: '855' },
  { code: 'CM', name: 'Cameroon', dialCode: '237' },
  { code: 'CA', name: 'Canada', dialCode: '1' },
  { code: 'CV', name: 'Cape Verde', dialCode: '238' },
  { code: 'KY', name: 'Cayman Islands', dialCode: '1-345' },
  { code: 'CF', name: 'Central African Republic', dialCode: '236' },
  { code: 'TD', name: 'Chad', dialCode: '235' },
  { code: 'CL', name: 'Chile', dialCode: '56' },
  { code: 'CN', name: 'China', dialCode: '86' },
  { code: 'CO', name: 'Colombia', dialCode: '57' },
  { code: 'KM', name: 'Comoros', dialCode: '269' },
  { code: 'CG', name: 'Congo - Brazzaville', dialCode: '242' },
  { code: 'CD', name: 'Congo - Kinshasa', dialCode: '243' },
  { code: 'CK', name: 'Cook Islands', dialCode: '682' },
  { code: 'CR', name: 'Costa Rica', dialCode: '506' },
  { code: 'HR', name: 'Croatia', dialCode: '385' },
  { code: 'CU', name: 'Cuba', dialCode: '53' },
  { code: 'CY', name: 'Cyprus', dialCode: '357' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '420' },
  { code: 'CI', name: 'Cote d\'Ivoire', dialCode: '225' },
  { code: 'DK', name: 'Denmark', dialCode: '45' },
  { code: 'DJ', name: 'Djibouti', dialCode: '253' },
  { code: 'DM', name: 'Dominica', dialCode: '1-767' },
  { code: 'DO', name: 'Dominican Republic', dialCode: '1-809' },
  { code: 'EC', name: 'Ecuador', dialCode: '593' },
  { code: 'EG', name: 'Egypt', dialCode: '20' },
  { code: 'SV', name: 'El Salvador', dialCode: '503' },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '240' },
  { code: 'ER', name: 'Eritrea', dialCode: '291' },
  { code: 'EE', name: 'Estonia', dialCode: '372' },
  { code: 'SZ', name: 'Eswatini', dialCode: '268' },
  { code: 'ET', name: 'Ethiopia', dialCode: '251' },
  { code: 'FK', name: 'Falkland Islands', dialCode: '500' },
  { code: 'FO', name: 'Faroe Islands', dialCode: '298' },
  { code: 'FJ', name: 'Fiji', dialCode: '679' },
  { code: 'FI', name: 'Finland', dialCode: '358' },
  { code: 'FR', name: 'France', dialCode: '33' },
  { code: 'GF', name: 'French Guiana', dialCode: '594' },
  { code: 'PF', name: 'French Polynesia', dialCode: '689' },
  { code: 'GA', name: 'Gabon', dialCode: '241' },
  { code: 'GM', name: 'Gambia', dialCode: '220' },
  { code: 'GE', name: 'Georgia', dialCode: '995' },
  { code: 'DE', name: 'Germany', dialCode: '49' },
  { code: 'GH', name: 'Ghana', dialCode: '233' },
  { code: 'GI', name: 'Gibraltar', dialCode: '350' },
  { code: 'GR', name: 'Greece', dialCode: '30' },
  { code: 'GL', name: 'Greenland', dialCode: '299' },
  { code: 'GD', name: 'Grenada', dialCode: '1-473' },
  { code: 'GP', name: 'Guadeloupe', dialCode: '590' },
  { code: 'GU', name: 'Guam', dialCode: '1-671' },
  { code: 'GT', name: 'Guatemala', dialCode: '502' },
  { code: 'GG', name: 'Guernsey', dialCode: '44' },
  { code: 'GN', name: 'Guinea', dialCode: '224' },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '245' },
  { code: 'GY', name: 'Guyana', dialCode: '592' },
  { code: 'HT', name: 'Haiti', dialCode: '509' },
  { code: 'HN', name: 'Honduras', dialCode: '504' },
  { code: 'HK', name: 'Hong Kong', dialCode: '852' },
  { code: 'HU', name: 'Hungary', dialCode: '36' },
  { code: 'IS', name: 'Iceland', dialCode: '354' },
  { code: 'IN', name: 'India', dialCode: '91' },
  { code: 'ID', name: 'Indonesia', dialCode: '62' },
  { code: 'IR', name: 'Iran', dialCode: '98' },
  { code: 'IQ', name: 'Iraq', dialCode: '964' },
  { code: 'IE', name: 'Ireland', dialCode: '353' },
  { code: 'IM', name: 'Isle of Man', dialCode: '44' },
  { code: 'IL', name: 'Israel', dialCode: '972' },
  { code: 'IT', name: 'Italy', dialCode: '39' },
  { code: 'JM', name: 'Jamaica', dialCode: '1-876' },
  { code: 'JP', name: 'Japan', dialCode: '81' },
  { code: 'JE', name: 'Jersey', dialCode: '44' },
  { code: 'JO', name: 'Jordan', dialCode: '962' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '7' },
  { code: 'KE', name: 'Kenya', dialCode: '254' },
  { code: 'KI', name: 'Kiribati', dialCode: '686' },
  { code: 'KW', name: 'Kuwait', dialCode: '965' },
  { code: 'KG', name: 'Kyrgyzstan', dialCode: '996' },
  { code: 'LA', name: 'Laos', dialCode: '856' },
  { code: 'LV', name: 'Latvia', dialCode: '371' },
  { code: 'LB', name: 'Lebanon', dialCode: '961' },
  { code: 'LS', name: 'Lesotho', dialCode: '266' },
  { code: 'LR', name: 'Liberia', dialCode: '231' },
  { code: 'LY', name: 'Libya', dialCode: '218' },
  { code: 'LI', name: 'Liechtenstein', dialCode: '423' },
  { code: 'LT', name: 'Lithuania', dialCode: '370' },
  { code: 'LU', name: 'Luxembourg', dialCode: '352' },
  { code: 'MO', name: 'Macau', dialCode: '853' },
  { code: 'MG', name: 'Madagascar', dialCode: '261' },
  { code: 'MW', name: 'Malawi', dialCode: '265' },
  { code: 'MY', name: 'Malaysia', dialCode: '60' },
  { code: 'MV', name: 'Maldives', dialCode: '960' },
  { code: 'ML', name: 'Mali', dialCode: '223' },
  { code: 'MT', name: 'Malta', dialCode: '356' },
  { code: 'MH', name: 'Marshall Islands', dialCode: '692' },
  { code: 'MQ', name: 'Martinique', dialCode: '596' },
  { code: 'MR', name: 'Mauritania', dialCode: '222' },
  { code: 'MU', name: 'Mauritius', dialCode: '230' },
  { code: 'YT', name: 'Mayotte', dialCode: '262' },
  { code: 'MX', name: 'Mexico', dialCode: '52' },
  { code: 'FM', name: 'Micronesia', dialCode: '691' },
  { code: 'MD', name: 'Moldova', dialCode: '373' },
  { code: 'MC', name: 'Monaco', dialCode: '377' },
  { code: 'MN', name: 'Mongolia', dialCode: '976' },
  { code: 'ME', name: 'Montenegro', dialCode: '382' },
  { code: 'MS', name: 'Montserrat', dialCode: '1-664' },
  { code: 'MA', name: 'Morocco', dialCode: '212' },
  { code: 'MZ', name: 'Mozambique', dialCode: '258' },
  { code: 'MM', name: 'Myanmar', dialCode: '95' },
  { code: 'NA', name: 'Namibia', dialCode: '264' },
  { code: 'NR', name: 'Nauru', dialCode: '674' },
  { code: 'NP', name: 'Nepal', dialCode: '977' },
  { code: 'NL', name: 'Netherlands', dialCode: '31' },
  { code: 'NC', name: 'New Caledonia', dialCode: '687' },
  { code: 'NZ', name: 'New Zealand', dialCode: '64' },
  { code: 'NI', name: 'Nicaragua', dialCode: '505' },
  { code: 'NE', name: 'Niger', dialCode: '227' },
  { code: 'NG', name: 'Nigeria', dialCode: '234' },
  { code: 'NU', name: 'Niue', dialCode: '683' },
  { code: 'NF', name: 'Norfolk Island', dialCode: '672' },
  { code: 'KP', name: 'North Korea', dialCode: '850' },
  { code: 'MK', name: 'North Macedonia', dialCode: '389' },
  { code: 'MP', name: 'Northern Mariana Islands', dialCode: '1-670' },
  { code: 'NO', name: 'Norway', dialCode: '47' },
  { code: 'OM', name: 'Oman', dialCode: '968' },
  { code: 'PK', name: 'Pakistan', dialCode: '92' },
  { code: 'PW', name: 'Palau', dialCode: '680' },
  { code: 'PS', name: 'Palestine', dialCode: '970' },
  { code: 'PA', name: 'Panama', dialCode: '507' },
  { code: 'PG', name: 'Papua New Guinea', dialCode: '675' },
  { code: 'PY', name: 'Paraguay', dialCode: '595' },
  { code: 'PE', name: 'Peru', dialCode: '51' },
  { code: 'PH', name: 'Philippines', dialCode: '63' },
  { code: 'PL', name: 'Poland', dialCode: '48' },
  { code: 'PT', name: 'Portugal', dialCode: '351' },
  { code: 'PR', name: 'Puerto Rico', dialCode: '1-787' },
  { code: 'QA', name: 'Qatar', dialCode: '974' },
  { code: 'RE', name: 'Reunion', dialCode: '262' },
  { code: 'RO', name: 'Romania', dialCode: '40' },
  { code: 'RU', name: 'Russia', dialCode: '7' },
  { code: 'RW', name: 'Rwanda', dialCode: '250' },
  { code: 'WS', name: 'Samoa', dialCode: '685' },
  { code: 'SM', name: 'San Marino', dialCode: '378' },
  { code: 'ST', name: 'Sao Tome and Principe', dialCode: '239' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '966' },
  { code: 'SN', name: 'Senegal', dialCode: '221' },
  { code: 'RS', name: 'Serbia', dialCode: '381' },
  { code: 'SC', name: 'Seychelles', dialCode: '248' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '232' },
  { code: 'SG', name: 'Singapore', dialCode: '65' },
  { code: 'SX', name: 'Sint Maarten', dialCode: '1-721' },
  { code: 'SK', name: 'Slovakia', dialCode: '421' },
  { code: 'SI', name: 'Slovenia', dialCode: '386' },
  { code: 'SB', name: 'Solomon Islands', dialCode: '677' },
  { code: 'SO', name: 'Somalia', dialCode: '252' },
  { code: 'ZA', name: 'South Africa', dialCode: '27' },
  { code: 'KR', name: 'South Korea', dialCode: '82' },
  { code: 'SS', name: 'South Sudan', dialCode: '211' },
  { code: 'ES', name: 'Spain', dialCode: '34' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '94' },
  { code: 'BL', name: 'Saint Barthelemy', dialCode: '590' },
  { code: 'SH', name: 'Saint Helena', dialCode: '290' },
  { code: 'KN', name: 'Saint Kitts and Nevis', dialCode: '1-869' },
  { code: 'LC', name: 'Saint Lucia', dialCode: '1-758' },
  { code: 'MF', name: 'Saint Martin', dialCode: '590' },
  { code: 'PM', name: 'Saint Pierre and Miquelon', dialCode: '508' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', dialCode: '1-784' },
  { code: 'SD', name: 'Sudan', dialCode: '249' },
  { code: 'SR', name: 'Suriname', dialCode: '597' },
  { code: 'SE', name: 'Sweden', dialCode: '46' },
  { code: 'CH', name: 'Switzerland', dialCode: '41' },
  { code: 'SY', name: 'Syria', dialCode: '963' },
  { code: 'TW', name: 'Taiwan', dialCode: '886' },
  { code: 'TJ', name: 'Tajikistan', dialCode: '992' },
  { code: 'TZ', name: 'Tanzania', dialCode: '255' },
  { code: 'TH', name: 'Thailand', dialCode: '66' },
  { code: 'TL', name: 'Timor-Leste', dialCode: '670' },
  { code: 'TG', name: 'Togo', dialCode: '228' },
  { code: 'TK', name: 'Tokelau', dialCode: '690' },
  { code: 'TO', name: 'Tonga', dialCode: '676' },
  { code: 'TT', name: 'Trinidad and Tobago', dialCode: '1-868' },
  { code: 'TN', name: 'Tunisia', dialCode: '216' },
  { code: 'TR', name: 'Turkey', dialCode: '90' },
  { code: 'TM', name: 'Turkmenistan', dialCode: '993' },
  { code: 'TC', name: 'Turks and Caicos Islands', dialCode: '1-649' },
  { code: 'TV', name: 'Tuvalu', dialCode: '688' },
  { code: 'UG', name: 'Uganda', dialCode: '256' },
  { code: 'UA', name: 'Ukraine', dialCode: '380' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '971' },
  { code: 'GB', name: 'United Kingdom', dialCode: '44' },
  { code: 'US', name: 'United States', dialCode: '1' },
  { code: 'UY', name: 'Uruguay', dialCode: '598' },
  { code: 'UZ', name: 'Uzbekistan', dialCode: '998' },
  { code: 'VU', name: 'Vanuatu', dialCode: '678' },
  { code: 'VA', name: 'Vatican City', dialCode: '379' },
  { code: 'VE', name: 'Venezuela', dialCode: '58' },
  { code: 'VN', name: 'Vietnam', dialCode: '84' },
  { code: 'VI', name: 'U.S. Virgin Islands', dialCode: '1-340' },
  { code: 'WF', name: 'Wallis and Futuna', dialCode: '681' },
  { code: 'YE', name: 'Yemen', dialCode: '967' },
  { code: 'ZM', name: 'Zambia', dialCode: '260' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '263' },
];

// Combined lookup list (used for finding country objects by ISO code)
export const COUNTRIES: CountryOption[] = ALL_COUNTRIES;

export function detectVisitorCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Dubai') || tz.includes('Abu_Dhabi')) return 'AE';
    if (tz.includes('Riyadh')) return 'SA';
    if (tz.includes('Qatar')) return 'QA';
    if (tz.includes('Muscat')) return 'OM';
    if (tz.includes('Kuwait')) return 'KW';
    if (tz.includes('Bahrain')) return 'BH';
    if (tz.includes('Kolkata') || tz.includes('Calcutta')) return 'IN';
    if (tz.includes('London') || tz.includes('Belfast')) return 'GB';
    if (
      tz.includes('New_York') ||
      tz.includes('Chicago') ||
      tz.includes('Los_Angeles') ||
      tz.includes('Denver') ||
      tz.includes('Phoenix') ||
      tz.includes('Detroit') ||
      tz.includes('Indianapolis') ||
      tz.includes('Anchorage') ||
      tz.includes('Honolulu')
    ) {
      return 'US';
    }
    if (
      tz.includes('Toronto') ||
      tz.includes('Vancouver') ||
      tz.includes('Montreal') ||
      tz.includes('Edmonton') ||
      tz.includes('Winnipeg') ||
      tz.includes('Halifax')
    ) {
      return 'CA';
    }
    if (
      tz.includes('Sydney') ||
      tz.includes('Melbourne') ||
      tz.includes('Perth') ||
      tz.includes('Brisbane') ||
      tz.includes('Adelaide') ||
      tz.includes('Darwin') ||
      tz.includes('Hobart')
    ) {
      return 'AU';
    }
    if (tz.includes('Singapore')) return 'SG';
    if (tz.includes('Berlin') || tz.includes('Frankfurt')) return 'DE';
    if (tz.includes('Dublin')) return 'IE';
    if (tz.includes('Auckland')) return 'NZ';
    if (tz.includes('Kuala_Lumpur')) return 'MY';
    if (tz.includes('Zurich') || tz.includes('Geneva')) return 'CH';
    if (tz.includes('Paris')) return 'FR';
    if (tz.includes('Rome')) return 'IT';
    if (tz.includes('Madrid')) return 'ES';
    if (tz.includes('Amsterdam')) return 'NL';
    if (tz.includes('Stockholm')) return 'SE';
    if (tz.includes('Oslo')) return 'NO';
    if (tz.includes('Copenhagen')) return 'DK';
    if (tz.includes('Helsinki')) return 'FI';
    if (tz.includes('Vienna')) return 'AT';
    if (tz.includes('Brussels')) return 'BE';
    if (tz.includes('Warsaw')) return 'PL';
    if (tz.includes('Tokyo')) return 'JP';
    if (tz.includes('Seoul')) return 'KR';
    if (tz.includes('Bangkok')) return 'TH';
    if (tz.includes('Jakarta')) return 'ID';
    if (tz.includes('Manila')) return 'PH';
    if (tz.includes('Colombo')) return 'LK';
    if (tz.includes('Dhaka')) return 'BD';
    if (tz.includes('Karachi')) return 'PK';
    if (tz.includes('Kathmandu')) return 'NP';
    if (tz.includes('Johannesburg')) return 'ZA';
    if (tz.includes('Cairo')) return 'EG';
    if (tz.includes('Nairobi')) return 'KE';
    if (tz.includes('Lagos')) return 'NG';
    if (tz.includes('Sao_Paulo')) return 'BR';
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
