import Razorpay from 'razorpay';
import crypto from 'crypto';

/**
 * Returns an instantiated Razorpay client instance if environment keys are configured.
 * Otherwise returns null (for development/demo mode).
 */
export function getRazorpayClient(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('your_') || key_secret.includes('your_')) {
    return null;
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Validates Razorpay HMAC SHA256 payment signature.
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
}
