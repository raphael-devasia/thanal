import { NextResponse } from 'next/server';
import { sendLuxuryInquiryEmail, LuxuryInquiryEmailData } from '@/lib/email';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      whatsappNumber,
      email,
      currentLocation,
      inquiryFor,
      villaType,
      timeline,
      notes
    } = body;

    if (!fullName || !whatsappNumber || !currentLocation) {
      return NextResponse.json(
        { success: false, message: 'Please provide your name, WhatsApp number, and current location.' },
        { status: 400 }
      );
    }

    const inquiryId = `inq_${Date.now()}`;

    // Attempt saving to Firebase if configured
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      try {
        await addDoc(collection(db, 'luxury_inquiries'), {
          fullName,
          whatsappNumber,
          email: email || '',
          currentLocation,
          inquiryFor: inquiryFor || 'Parents in Kerala',
          villaType: villaType || '2BHK Garden Villa',
          timeline: timeline || 'Within 6 to 12 months',
          notes: notes || '',
          createdAt: serverTimestamp()
        });
      } catch (dbErr) {
        console.warn('Firestore write for luxury inquiry skipped/failed:', dbErr);
      }
    }

    // Send email notification to info@zynthexion.com asynchronously
    const emailData: LuxuryInquiryEmailData = {
      fullName,
      whatsappNumber,
      email: email || '',
      currentLocation,
      inquiryFor: inquiryFor || 'Parents in Kerala',
      villaType: villaType || '2BHK Garden Villa',
      timeline: timeline || 'Within 6 to 12 months',
      notes: notes || '',
      inquiryId
    };

    sendLuxuryInquiryEmail(emailData).catch((err) => {
      console.error('Async luxury inquiry email error:', err);
    });

    return NextResponse.json({
      success: true,
      inquiryId,
      message: 'Thank you! Your private brochure and inquiry have been received. Our Estate Concierge will connect with you on WhatsApp shortly.'
    });
  } catch (error: any) {
    console.error('API luxury inquiry error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
