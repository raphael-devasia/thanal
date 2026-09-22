import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const depositAmount = body.amount || 1000;

    const order = await createRazorpayOrder(depositAmount);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: order.key
    });
  } catch (error: any) {
    console.error('API /api/razorpay error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
