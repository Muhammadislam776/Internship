const twilio = require('twilio');
require('dotenv').config();

let twilioClient = null;
let twilioPhone = process.env.TWILIO_PHONE_NUMBER || '';

function initTwilio(accountSid, authToken, fromPhone) {
  const sid = accountSid || process.env.TWILIO_ACCOUNT_SID;
  const token = authToken || process.env.TWILIO_AUTH_TOKEN;
  const phone = fromPhone || process.env.TWILIO_PHONE_NUMBER;

  if (sid && token && sid.startsWith('AC')) {
    try {
      twilioClient = twilio(sid, token);
      twilioPhone = phone;
      console.log('⚡ Twilio Real SMS Gateway Client Initialized Successfully!');
      return twilioClient;
    } catch (err) {
      console.error('Failed to initialize Twilio SMS SDK:', err.message);
      twilioClient = null;
      return null;
    }
  }
  twilioClient = null;
  return null;
}

initTwilio();

/**
 * Dispatches real SIM SMS message via Twilio Gateway if configured
 */
async function sendSmsViaTwilio(toPhoneNumber, messageBody) {
  if (twilioClient && twilioPhone) {
    try {
      console.log(`📡 Sending REAL SIM SMS via Twilio to ${toPhoneNumber}...`);
      const message = await twilioClient.messages.create({
        body: messageBody,
        from: twilioPhone,
        to: toPhoneNumber
      });
      console.log(`✅ REAL SIM SMS Delivered via Twilio! Message SID: ${message.sid}`);
      return { success: true, sid: message.sid, realSmsSent: true };
    } catch (err) {
      console.error('❌ Twilio SMS Send Error:', err.message);
      return { success: false, error: err.message, realSmsSent: false };
    }
  }
  return { success: false, realSmsSent: false, reason: 'Twilio API keys not set in environment or settings' };
}

module.exports = {
  initTwilio,
  sendSmsViaTwilio,
  isTwilioConfigured: () => !!twilioClient
};
