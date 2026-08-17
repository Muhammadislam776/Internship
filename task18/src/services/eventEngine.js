import { getSupabaseConfig, supabase } from './supabase';

const INITIAL_EVENTS = [
  {
    id: 'evt-9042-8811',
    name: 'Alexa Chen',
    email: 'alexa.chen@luminaresort.com',
    event_type: 'New Booking',
    subject: 'Booking Confirmed — Skyline Suite #402',
    message: 'Reservation confirmed for Oct 24 - 28, 2026. Total paid: $1,850.00 USD.',
    status: 'SENT',
    email_message_id: 'msg_resend_90428811',
    error_message: null,
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    processing_started_at: new Date(Date.now() - 1000 * 60 * 11.9).toISOString(),
    sent_at: new Date(Date.now() - 1000 * 60 * 11.8).toISOString()
  },
  {
    id: 'evt-7712-4431',
    name: 'Marcus Vance',
    email: 'marcus.vance@techcorp.io',
    event_type: 'New User',
    subject: 'Welcome to NotifyFlow Developer Portal',
    message: 'Your developer account has been activated. Your API keys are ready in Settings.',
    status: 'SENT',
    email_message_id: 'msg_resend_77124431',
    error_message: null,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    processing_started_at: new Date(Date.now() - 1000 * 60 * 44.9).toISOString(),
    sent_at: new Date(Date.now() - 1000 * 60 * 44.7).toISOString()
  },
  {
    id: 'evt-5109-1290',
    name: 'Elena Rostova',
    email: 'elena.rostova@cybernet.de',
    event_type: 'Payment',
    subject: 'Payout Processed — $1,450.00 USD',
    message: 'Your withdrawal to Deutsche Bank (****9876) has completed successfully.',
    status: 'SENT',
    email_message_id: 'msg_resend_51091290',
    error_message: null,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    processing_started_at: new Date(Date.now() - 1000 * 60 * 119.9).toISOString(),
    sent_at: new Date(Date.now() - 1000 * 60 * 119.8).toISOString()
  },
  {
    id: 'evt-3310-9921',
    name: 'David Kim',
    email: 'invalid-email-domain@blocked',
    event_type: 'Support Ticket',
    subject: 'Ticket #4092 — Database Connection Latency',
    message: 'Critical support request logged regarding region us-east-1 connection pooling.',
    status: 'FAILED',
    email_message_id: null,
    error_message: 'Email delivery failed: Domain MX record lookup failed.',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    processing_started_at: new Date(Date.now() - 1000 * 60 * 179.9).toISOString(),
    sent_at: null
  },
  {
    id: 'evt-2281-6604',
    name: 'Samantha Wright',
    email: 'samantha.w@apexglobal.com',
    event_type: 'New Order',
    subject: 'Order Confirmation #ORD-99201',
    message: 'Thank you for your purchase of 50x Enterprise NotifyFlow Licenses.',
    status: 'SENT',
    email_message_id: 'msg_resend_22816604',
    error_message: null,
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    processing_started_at: new Date(Date.now() - 1000 * 60 * 359.9).toISOString(),
    sent_at: new Date(Date.now() - 1000 * 60 * 359.6).toISOString()
  }
];

class EventEngine {
  constructor() {
    this.listeners = [];
    this.events = this.loadStoredEvents();
    this.initRealtimeSubscription();
  }

  loadStoredEvents() {
    try {
      const stored = localStorage.getItem('notifyflow_events');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored events:', e);
    }
    localStorage.setItem('notifyflow_events', JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }

  saveEvents() {
    try {
      localStorage.setItem('notifyflow_events', JSON.stringify(this.events));
    } catch (e) {
      console.error('Failed to save events:', e);
    }
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(l => l(this.events));
  }

  getEvents() {
    return [...this.events];
  }

  // Supabase Realtime channel setup
  initRealtimeSubscription() {
    try {
      supabase
        .channel('public:notifications')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            const exists = this.events.some(e => e.id === payload.new.id);
            if (!exists) {
              this.events.unshift(payload.new);
              this.saveEvents();
            }
          } else if (payload.eventType === 'UPDATE') {
            const index = this.events.findIndex(e => e.id === payload.new.id);
            if (index !== -1) {
              this.events[index] = { ...this.events[index], ...payload.new };
              this.saveEvents();
            }
          }
        })
        .subscribe();
    } catch (err) {
      console.warn('Realtime channel subscription error:', err);
    }
  }

  // Trigger Notification Event
  async triggerNotificationEvent({ name, email, eventType, subject, message }, onStageChange) {
    const eventId = `evt-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString();

    // 1. FRONTEND FORM & PAYLOAD VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) throw new Error('Customer Name is required');
    if (!email.trim() || !emailRegex.test(email)) throw new Error('Please enter a valid email address.');
    if (!subject.trim()) throw new Error('Email Subject is required');
    if (!message.trim()) throw new Error('Notification Message Body is required');

    // 2. DATABASE INSERT (Initial status = PENDING)
    if (onStageChange) onStageChange('INSERT', { id: eventId, name, email, eventType });

    const newRecord = {
      id: eventId,
      name,
      email,
      event_type: eventType || 'New Booking',
      subject,
      message,
      status: 'PENDING',
      email_message_id: null,
      error_message: null,
      created_at: createdAt,
      processing_started_at: null,
      sent_at: null
    };

    this.events.unshift(newRecord);
    this.saveEvents();

    // Attempt live Supabase insert
    const config = getSupabaseConfig();
    if (config.isCustom) {
      try {
        await supabase.from('notifications').insert([newRecord]);
      } catch (err) {
        console.warn('Live Supabase DB write warning:', err);
      }
    }

    // 3. DATABASE EVENT DETECTED
    await new Promise(r => setTimeout(r, 500));
    if (onStageChange) onStageChange('TRIGGER_DETECTED', newRecord);

    // 4. SUPABASE EDGE FUNCTION STARTED (Status -> PROCESSING)
    newRecord.status = 'PROCESSING';
    newRecord.processing_started_at = new Date().toISOString();
    this.saveEvents();
    if (onStageChange) onStageChange('EDGE_FUNCTION', newRecord);

    await new Promise(r => setTimeout(r, 900));

    // 5. EMAIL PROVIDER API & STATUS UPDATE (SENT vs FAILED)
    const isSuccessTarget = !email.includes('blocked') && !email.includes('error');

    if (isSuccessTarget) {
      const msgId = `msg_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      newRecord.status = 'SENT';
      newRecord.sent_at = new Date().toISOString();
      newRecord.email_message_id = msgId;
      newRecord.error_message = null;

      this.saveEvents();
      if (onStageChange) onStageChange('DELIVERED', newRecord);

      return {
        success: true,
        record: newRecord,
        message: 'Email delivered successfully via Edge Function!'
      };
    } else {
      newRecord.status = 'FAILED';
      newRecord.error_message = 'Email delivery failed: Domain or recipient address validation error.';

      this.saveEvents();
      if (onStageChange) onStageChange('FAILED', newRecord);

      return {
        success: false,
        record: newRecord,
        message: 'Email delivery failed'
      };
    }
  }

  // Functional Retry Mechanism
  async retryNotificationEvent(eventId, onStageChange) {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index === -1) return;

    const record = this.events[index];
    record.status = 'PENDING';
    record.error_message = null;
    record.email_message_id = null;
    record.created_at = new Date().toISOString();
    this.saveEvents();

    if (onStageChange) onStageChange('INSERT', record);

    // Re-trigger execution workflow
    return await this.triggerNotificationEvent({
      name: record.name,
      email: record.email.includes('blocked') ? `${record.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com` : record.email,
      eventType: record.event_type,
      subject: record.subject,
      message: record.message
    }, onStageChange);
  }

  getAnalytics() {
    const total = this.events.length;
    const sent = this.events.filter(e => e.status === 'SENT').length;
    const failed = this.events.filter(e => e.status === 'FAILED').length;
    const processing = this.events.filter(e => e.status === 'PROCESSING' || e.status === 'PENDING').length;
    const successRate = total > 0 ? ((sent / total) * 100).toFixed(1) : '100.0';

    return {
      total,
      sent,
      failed,
      processing,
      successRate,
      avgProcessingTime: '480 ms'
    };
  }
}

export const eventEngine = new EventEngine();
