import { NextResponse } from 'next/server';
import { saveWaitlistLead } from '@/lib/firebase';
import { WaitlistEntry } from '@/types/waitlist';

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

    if (!fullName || !whatsappNumber || !nrkLocation || !selectedPlan || !paymentId) {
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
      selectedPlan,
      selectedPlanName: selectedPlanName || selectedPlan,
      selectedAddOns: selectedAddOns || [],
      paymentId,
      orderId: orderId || `order_${Date.now()}`,
      paymentStatus: paymentStatus || (selectedPlan === 'guest' ? 'Guest_Lead' : 'paid'),
      depositAmount: typeof depositAmount === 'number' ? depositAmount : (selectedPlan === 'guest' ? 0 : 1000),
      createdAt: new Date().toISOString()
    };

    const leadId = await saveWaitlistLead(payload);

    return NextResponse.json({
      success: true,
      leadId,
      message: selectedPlan === 'guest' ? 'Free guest account created!' : 'Waitlist spot successfully secured!',
      data: payload
    });
  } catch (error: any) {
    console.error('API /api/verify-payment error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to verify payment and record lead' },
      { status: 500 }
    );
  }
}
