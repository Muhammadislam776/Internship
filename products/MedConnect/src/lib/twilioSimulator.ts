import { TwilioLog } from '../types';

export interface SendSmsParams {
  toPhone: string;
  patientName: string;
  appointmentId: string;
  appointmentTime: string;
  doctorName: string;
  clinicName: string;
  type?: 'standard_reminder' | 'urgent_confirmation' | 'telehealth_link' | 'refill_ready';
  telehealthUrl?: string;
}

export interface TwilioSendResult {
  messageSid: string;
  status: 'QUEUED' | 'SENT' | 'DELIVERED';
  costGbp: number;
  body: string;
  timestamp: string;
}

/**
 * Simulates Twilio REST API SMS Dispatch & Interactive 2-way Webhook engine
 */
export class TwilioService {
  private static accountSid = 'AC_MOCK_TWILIO_UK_NHS_MEDCONNECT_2026';
  private static senderNumber = '+44 7488 880922'; // MedConnect Twilio Alphanumeric / Virtual UK mobile

  public static generateSmsBody(params: SendSmsParams): string {
    switch (params.type) {
      case 'telehealth_link':
        return `[MedConnect Telehealth] Hi ${params.patientName}, your video consultation with ${params.doctorName} is ready. Join encrypted room: ${params.telehealthUrl || 'https://medconnect.uk/telehealth/' + params.appointmentId} . Please join 5 mins early.`;
      
      case 'urgent_confirmation':
        return `[URGENT REMINDER] Hi ${params.patientName}, your clinic appointment with ${params.doctorName} is tomorrow at ${params.appointmentTime} at ${params.clinicName}. Please reply YES to confirm attendance, or CANCEL to release this slot for NHS emergency triage.`;
      
      case 'refill_ready':
        return `[MedConnect EPS] Hi ${params.patientName}, your repeat prescription request has been approved by ${params.doctorName} and electronically transmitted to your nominated pharmacy.`;

      case 'standard_reminder':
      default:
        return `[MedConnect Reminder] Hi ${params.patientName}, your appointment with ${params.doctorName} is scheduled for ${params.appointmentTime} at ${params.clinicName}. Reply YES to confirm or RESCHEDULE if needed.`;
    }
  }

  public static async dispatchSms(params: SendSmsParams): Promise<{ log: TwilioLog; result: TwilioSendResult }> {
    // Artificial network latency simulation
    await new Promise((resolve) => setTimeout(resolve, 350));

    const body = this.generateSmsBody(params);
    const messageSid = `SM${Math.random().toString(36).substring(2, 12).toUpperCase()}${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toISOString();
    const costGbp = 0.038; // standard UK Twilio SMS outbound rate £0.038

    const result: TwilioSendResult = {
      messageSid,
      status: 'DELIVERED',
      costGbp,
      body,
      timestamp
    };

    const log: TwilioLog = {
      id: messageSid,
      timestamp,
      recipientPhone: params.toPhone,
      recipientName: params.patientName,
      appointmentId: params.appointmentId,
      type: 'SMS_REMINDER',
      status: 'DELIVERED',
      message: body,
      costGbp
    };

    return { log, result };
  }

  public static async dispatchVoiceCall(params: {
    toPhone: string;
    patientName: string;
    appointmentId: string;
    doctorName: string;
    appointmentTime: string;
  }): Promise<{ log: TwilioLog; callSid: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const callSid = `CA${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
    const timestamp = new Date().toISOString();
    const voiceMessage = `Automated Voice Call: "Hello ${params.patientName}, this is an automated confirmation call from MedConnect for your appointment with ${params.doctorName} at ${params.appointmentTime}. Press 1 to confirm, Press 2 to reschedule."`;

    const log: TwilioLog = {
      id: callSid,
      timestamp,
      recipientPhone: params.toPhone,
      recipientName: params.patientName,
      appointmentId: params.appointmentId,
      type: 'VOICE_CALL',
      status: 'DELIVERED',
      message: voiceMessage,
      costGbp: 0.065
    };

    return { log, callSid };
  }

  /**
   * Simulates an incoming Twilio Webhook (e.g. Patient replies "YES" or "CANCEL")
   */
  public static handleInboundReply(incomingText: string, originalLog: TwilioLog): {
    action: 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULE_REQUESTED' | 'UNKNOWN';
    responseMessage: string;
  } {
    const text = incomingText.trim().toUpperCase();

    if (text === 'YES' || text === '1' || text.includes('CONFIRM') || text.includes('YES I WILL ATTEND')) {
      return {
        action: 'CONFIRMED',
        responseMessage: 'Thank you! Your appointment is verified in our calendar. See you soon.'
      };
    } else if (text === 'CANCEL' || text === 'NO' || text === '2') {
      return {
        action: 'CANCELLED',
        responseMessage: 'Your appointment has been cancelled and released for triage. Call our clinic if you wish to re-register.'
      };
    } else if (text.includes('RESCHEDULE') || text.includes('CHANGE')) {
      return {
        action: 'RESCHEDULE_REQUESTED',
        responseMessage: 'Please open your booking portal link or reply with preferred day/time to rebook.'
      };
    }

    return {
      action: 'UNKNOWN',
      responseMessage: 'Thanks for your message. A clinic care coordinator will review your inquiry shortly.'
    };
  }
}
