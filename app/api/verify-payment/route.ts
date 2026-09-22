import { NextResponse } from 'next/server';
import { saveWaitlistLead } from '@/lib/firebase';
import { WaitlistEntry } from '@/types/waitlist';
import { sendLeadNotificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      whatsappNumber,
      nrkLocation,
      parentDistrict,
      parentMode,
      selectedPlan,
      selectedPlanName,
      selectedAddOns,
      paymentId,
      orderId,
      paymentStatus,
      depositAmount
    } = body;

    if (!fullName || !whatsappNumber || !nrkLocation) {
      return NextResponse.json(
        { success: false, message: 'Missing required lead details' },
        { status: 400 }
      );
    }

    const payload: Omit<WaitlistEntry, 'id'> = {
      fullName,
      whatsappNumber,
      nrkLocation,
      parentDistrict: parentDistrict || 'Kannur',
      parentMode: parentMode || 'single',
      selectedPlan: selectedPlan || 'active_care',
      selectedPlanName: selectedPlanName || 'Thanal Inaugural Pilot Plan',
      selectedAddOns: selectedAddOns || [],
      paymentId: paymentId || `lead_${Date.now()}`,
      orderId: orderId || `lead_ord_${Date.now()}`,
      paymentStatus: paymentStatus || 'Lead_Submitted',
      depositAmount: typeof depositAmount === 'number' ? depositAmount : 0,
      createdAt: new Date().toISOString()
    };

    const leadId = await saveWaitlistLead(payload);

    // Send email notification to info@zynthexion.com asynchronously
    const isCallback = paymentStatus === 'Callback_Requested';
    sendLeadNotificationEmail({
      fullName,
      whatsappNumber,
      nrkLocation,
      parentTown: parentDistrict || 'Kannur',
      leadType: isCallback ? 'Callback_Requested' : 'Lead_Submitted',
      selectedPlanName: selectedPlanName || 'Thanal Inaugural Pilot Plan',
      leadId
    }).catch((emailErr) => {
      console.error('Async lead email sending error:', emailErr);
    });

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Lead successfully registered! Our Care Manager will contact you shortly.',
      data: payload
    });
  } catch (error: any) {
    console.error('API lead collection error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to record lead' },
      { status: 500 }
    );
  }
}

