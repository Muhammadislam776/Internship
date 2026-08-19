const Stripe = require('stripe');
require('dotenv').config();

let currentSecretKey = process.env.STRIPE_SECRET_KEY || '';
let stripeInstance = null;

function initStripe(key) {
  const targetKey = key || currentSecretKey;
  if (targetKey && targetKey.startsWith('sk_')) {
    try {
      stripeInstance = new Stripe(targetKey, {
        apiVersion: '2023-10-16',
      });
      currentSecretKey = targetKey;
      console.log('⚡ Stripe SDK initialized with secret key ending in:', targetKey.slice(-4));
      return stripeInstance;
    } catch (err) {
      console.error('Failed to initialize Stripe SDK:', err.message);
      stripeInstance = null;
      return null;
    }
  }
  stripeInstance = null;
  return null;
}

// Initial call
initStripe();

module.exports = {
  getStripe: () => stripeInstance,
  initStripe,
  getSecretKey: () => currentSecretKey
};
