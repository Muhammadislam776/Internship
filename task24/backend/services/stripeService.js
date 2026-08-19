const { getStripe } = require('../config/stripe');

/**
 * Creates a real Stripe Checkout Session for a validated product.
 * Supports coupons, billing address collection, and customer emails.
 */
async function createCheckoutSession(product, clientUrl, options = {}) {
  const stripe = getStripe();
  const { customerEmail, couponCode, discountAmount = 0 } = options;

  const successUrl = `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&productId=${product.id}`;
  const cancelUrl = `${clientUrl}/payment-cancelled?productId=${product.id}`;

  const finalPriceInCents = Math.max(100, product.priceInCents - Math.round(discountAmount * 100));

  // 1. Invoke Real Stripe API if key is present
  if (stripe) {
    try {
      console.log(`📡 Creating Real Stripe Checkout Session for ${product.name} ($${(finalPriceInCents/100).toFixed(2)})...`);

      const sessionPayload = {
        payment_method_types: ['card'],
        mode: 'payment',
        billing_address_collection: 'required',
        customer_email: customerEmail || undefined,
        line_items: [
          {
            price_data: {
              currency: product.currency || 'usd',
              product_data: {
                name: product.name,
                description: `${product.description} ${couponCode ? `(Coupon ${couponCode} applied)` : ''}`,
                images: [product.image],
              },
              unit_amount: finalPriceInCents,
            },
            quantity: 1,
          }
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          productId: product.id,
          productName: product.name,
          originalPrice: product.price.toString(),
          finalPrice: (finalPriceInCents / 100).toString(),
          couponCode: couponCode || 'NONE',
          customerEmail: customerEmail || 'guest@payflow.io'
        }
      };

      const session = await stripe.checkout.sessions.create(sessionPayload);

      console.log(`✅ Real Stripe Checkout Session Created! ID: ${session.id}`);
      return {
        url: session.url,
        sessionId: session.id,
        isSimulated: false,
        paymentIntentId: session.payment_intent || null
      };
    } catch (err) {
      console.error('❌ Stripe SDK Error:', err.message);
      throw new Error(`Stripe Checkout Session Failed: ${err.message}`);
    }
  }

  // 2. Realistic Simulated Fallback when STRIPE_SECRET_KEY is empty
  console.log(`ℹ️ [SIMULATED MODE] STRIPE_SECRET_KEY absent. Generating session for ${product.name}`);
  const mockSessionId = `cs_live_${Math.random().toString(36).substring(2, 12)}${Date.now().toString(36)}`;
  const simulatedUrl = `${clientUrl}/payment-success?session_id=${mockSessionId}&productId=${product.id}&mode=simulated&amount=${finalPriceInCents/100}`;

  return {
    url: simulatedUrl,
    sessionId: mockSessionId,
    isSimulated: true,
    paymentIntentId: `pi_${Math.random().toString(36).substring(2, 14)}`
  };
}

/**
 * Retrieves session from Stripe
 */
async function retrieveCheckoutSession(sessionId) {
  const stripe = getStripe();
  if (stripe && sessionId && !sessionId.includes('cs_live_') && !sessionId.includes('cs_test_simulated')) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'customer_details', 'payment_intent']
      });
      return session;
    } catch (err) {
      console.error('Error retrieving Stripe session:', err.message);
      return null;
    }
  }
  return null;
}

/**
 * Creates Stripe Billing Portal Session for managing customer invoices & payment methods
 */
async function createBillingPortalSession(customerId, returnUrl) {
  const stripe = getStripe();
  if (stripe && customerId) {
    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return portalSession;
    } catch (err) {
      console.error('Error creating portal session:', err.message);
      return null;
    }
  }
  return null;
}

/**
 * Issues refund on Stripe payment intent
 */
async function processRefund(paymentIntentId, amountInCents) {
  const stripe = getStripe();
  if (stripe && paymentIntentId) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amountInCents || undefined
      });
      return refund;
    } catch (err) {
      console.error('Error issuing Stripe refund:', err.message);
      throw err;
    }
  }
  return { id: `re_mock_${Date.now()}`, status: 'succeeded' };
}

module.exports = {
  createCheckoutSession,
  retrieveCheckoutSession,
  createBillingPortalSession,
  processRefund
};
