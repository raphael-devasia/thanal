import { NextResponse } from 'next/server';
import { saveWaitlistLead } from '@/lib/firebase';
import { WaitlistEntry } from '@/types/waitlist';
import { sendLeadNotificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      fullName,
      whatsappNumber,
      country,
      source
    } = body;

    const leadName = (name || fullName || '').trim();
    const phone = (whatsappNumber || '').trim();
    const leadCountry = (country || '').trim();

    if (!leadName || !phone) {
      return NextResponse.json(
        { success: false, message: 'Please provide your name and WhatsApp number.' },
        { status: 400 }
      );
    }

    const payload: Omit<WaitlistEntry, 'id'> = {
      fullName: leadName,
      whatsappNumber: phone,
      country: leadCountry || 'Unknown',
      source: source || 'website_sample_form',
      createdAt: new Date().toISOString()
    };

    const leadId = await saveWaitlistLead(payload);

    // Email alerts to the team: lead ID, first name and country only.
    // Details stay in the admin view behind a login.
    const firstName = leadName.split(' ')[0] || leadName;
    sendLeadNotificationEmail({
      leadId,
      firstName,
      country: leadCountry || 'Not specified'
    }).catch((emailErr) => {
      console.error('Async lead email alert error:', emailErr);
    });

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Sample request received! We will connect with you on WhatsApp shortly.'
    });
  } catch (error: any) {
    console.error('API lead collection error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to record lead' },
      { status: 500 }
    );
  }
}
