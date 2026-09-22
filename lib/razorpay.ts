import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock12345';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret_key_12345';

export function getRazorpayInstance() {
  return new Razorpay({
    key_id,
    key_secret
  });
}

export async function createRazorpayOrder(amountInINR: number = 1000) {
  const isRazorpayConfigured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

  const amountInPaise = amountInINR * 100;
  const currency = 'INR';
  const receipt = `rcpt_${Date.now()}`;

  if (isRazorpayConfigured) {
    try {
      const razorpay = getRazorpayInstance();
      const order: any = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt,
        notes: { purpose: 'Thanal Eldercare Pilot Deposit' }
      });
      return {
        id: order.id as string,
        amount: order.amount as number,
        currency: order.currency as string,
        key: key_id
      };
    } catch (error) {
      console.warn('Razorpay SDK order creation error, using mock order:', error);
    }
  }

  // Fallback mock order for instant testing when API keys are not supplied in .env
  return {
    id: `order_mock_${Date.now().toString(36)}`,
    amount: amountInPaise,
    currency,
    key: key_id
  };
}
