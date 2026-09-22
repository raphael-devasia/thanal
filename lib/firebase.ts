import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import { WaitlistEntry } from '@/types/waitlist';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'thanal-demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'thanal-demo',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'thanal-demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:demo'
};

// Initialize Firebase App
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

const COLLECTION_NAME = 'waitlist_leads';

// Initial Mock Seed Data for Demonstration & Instant Testing
const MOCK_INITIAL_LEADS: WaitlistEntry[] = [
  {
    id: 'lead_demo_01',
    fullName: 'Rahul Varma',
    whatsappNumber: '+971 50 123 4567',
    nrkLocation: 'Dubai, UAE',
    parentDistrict: 'Kannur',
    parentMode: 'single',
    selectedPlan: 'active_care',
    selectedPlanName: 'Active Care Plan',
    selectedAddOns: ['opd_escort', 'lab_pickup'],
    paymentId: 'pay_Nz89Kk123456',
    orderId: 'order_Nz89Kk789012',
    paymentStatus: 'paid',
    depositAmount: 1000,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'lead_demo_02',
    fullName: 'Anjali Nambiar',
    whatsappNumber: '+974 55 987 654',
    nrkLocation: 'Doha, Qatar',
    parentDistrict: 'Kannur',
    parentMode: 'couple',
    selectedPlan: 'comprehensive_care',
    selectedPlanName: 'Comprehensive Care Plan',
    selectedAddOns: ['wheelchair_ac_transport'],
    paymentId: 'pay_Py45Mm987654',
    orderId: 'order_Py45Mm123456',
    paymentStatus: 'paid',
    depositAmount: 1000,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'lead_demo_03',
    fullName: 'Suresh Kumar',
    whatsappNumber: '+971 52 888 7766',
    nrkLocation: 'Abu Dhabi, UAE',
    parentDistrict: 'Kannur',
    parentMode: 'single',
    selectedPlan: 'guest',
    selectedPlanName: 'Guest / Pay-As-You-Go',
    selectedAddOns: ['opd_escort'],
    paymentId: 'GUEST_NO_DEPOSIT',
    orderId: 'guest_ord_7788',
    paymentStatus: 'Guest_Lead',
    depositAmount: 0,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'lead_demo_04',
    fullName: 'Dr. Faisal Mohammed',
    whatsappNumber: '+44 7911 123456',
    nrkLocation: 'London, UK',
    parentDistrict: 'Kozhikode',
    parentMode: 'couple',
    selectedPlan: 'safety_net',
    selectedPlanName: 'Safety Net Plan',
    selectedAddOns: ['legal_bank_escort'],
    paymentId: 'pay_Lx12Qp345678',
    orderId: 'order_Lx12Qp901234',
    paymentStatus: 'paid',
    depositAmount: 1000,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

// Helper: Save Waitlist Lead to Firestore (with LocalStorage fallback)
export async function saveWaitlistLead(lead: Omit<WaitlistEntry, 'id'>): Promise<string> {
  const isFirebaseConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...lead,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.warn('Firestore write failed, using local storage fallback:', error);
    }
  }

  // Fallback to localStorage for instant local demo without live Firebase setup
  const localData = getLocalLeads();
  const newLead: WaitlistEntry = {
    ...lead,
    id: `lead_local_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  localData.unshift(newLead);
  if (typeof window !== 'undefined') {
    localStorage.setItem('thanal_waitlist_leads', JSON.stringify(localData));
  }
  return newLead.id!;
}

// Helper: Fetch all Waitlist Leads
export async function fetchWaitlistLeads(): Promise<WaitlistEntry[]> {
  const isFirebaseConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const leads: WaitlistEntry[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        leads.push({
          id: doc.id,
          fullName: data.fullName || '',
          whatsappNumber: data.whatsappNumber || '',
          nrkLocation: data.nrkLocation || '',
          parentDistrict: data.parentDistrict || 'Kannur',
          parentMode: data.parentMode || 'single',
          selectedPlan: data.selectedPlan || 'active_care',
          selectedPlanName: data.selectedPlanName || '',
          selectedAddOns: data.selectedAddOns || [],
          paymentId: data.paymentId || '',
          orderId: data.orderId || '',
          paymentStatus: data.paymentStatus || 'paid',
          depositAmount: typeof data.depositAmount === 'number' ? data.depositAmount : 1000,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
        });
      });
      if (leads.length > 0) return leads;
    } catch (error) {
      console.warn('Firestore fetch failed, using local demo data:', error);
    }
  }

  return getLocalLeads();
}

// Local Storage Helper
function getLocalLeads(): WaitlistEntry[] {
  if (typeof window === 'undefined') return MOCK_INITIAL_LEADS;
  const stored = localStorage.getItem('thanal_waitlist_leads') || localStorage.getItem('kaithang_waitlist_leads');
  if (!stored) {
    localStorage.setItem('thanal_waitlist_leads', JSON.stringify(MOCK_INITIAL_LEADS));
    return MOCK_INITIAL_LEADS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_INITIAL_LEADS;
  }
}

export { app, db };
