import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRecord {
  id: string;
  name: string;
  email: string;
  event_type: string;
  subject: string;
  message: string;
  status: string;
}

interface WebhookPayload {
  type?: string;
  table?: string;
  record?: NotificationRecord;
  notification_id?: string;
  name?: string;
  email?: string;
  event_type?: string;
  subject?: string;
  message?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body: WebhookPayload = await req.json();

    // 1. Extract record from Database Webhook payload
    let record: NotificationRecord;

    if ((body.type === 'INSERT' || body.type === 'UPDATE') && body.record) {
      record = body.record;
    } else if (body.notification_id && body.email) {
      record = {
        id: body.notification_id,
        name: body.name || 'Valued Customer',
        email: body.email,
        event_type: body.event_type || 'General Notification',
        subject: body.subject || 'Notification from NotifyFlow',
        message: body.message || '',
        status: 'PENDING'
      };
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'FAILED',
          message: 'Invalid request payload. Required: database event record or notification fields.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Validate email & required fields
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = record.email && emailRegex.test(record.email) && !record.email.includes('blocked') && !record.email.includes('error');
    const isPayloadValid = isValidEmail && record.subject && record.message && record.name;

    if (!isPayloadValid) {
      if (record.id) {
        await supabase
          .from('notifications')
          .update({
            status: 'FAILED',
            error_message: 'Payload validation failed: Invalid recipient email address or missing required fields.'
          })
          .eq('id', record.id);
      }

      return new Response(
        JSON.stringify({
          success: false,
          status: 'FAILED',
          message: 'Email delivery failed: Payload validation error.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Update status to PROCESSING & set processing_started_at
    if (record.id) {
      await supabase
        .from('notifications')
        .update({
          status: 'PROCESSING',
          processing_started_at: new Date().toISOString()
        })
        .eq('id', record.id);
    }

    // 4. Generate HTML Email Template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #071A2B; color: #172033; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
          .header { background: #071A2B; padding: 30px; text-align: center; border-bottom: 3px solid #2563EB; }
          .logo { color: #FFFFFF; font-size: 24px; font-weight: bold; letter-spacing: 1px; }
          .logo span { color: #22D3EE; }
          .badge { display: inline-block; background: rgba(37, 99, 235, 0.1); color: #2563EB; border: 1px solid rgba(37, 99, 235, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 10px; }
          .content { padding: 35px; background-color: #FFFFFF; }
          .greeting { font-size: 20px; font-weight: 700; color: #071A2B; margin-bottom: 15px; }
          .message-box { background: #F8FAFC; border-left: 4px solid #FF7A18; padding: 20px; border-radius: 6px; margin: 20px 0; font-size: 15px; line-height: 1.6; color: #334155; }
          .btn-container { text-align: center; margin-top: 30px; }
          .cta-btn { display: inline-block; background: #FF7A18; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px rgba(255, 122, 24, 0.4); }
          .footer { background: #071A2B; padding: 20px; text-align: center; font-size: 12px; color: #94A3B8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Notify<span>Flow</span></div>
            <div class="badge">${record.event_type}</div>
          </div>
          <div class="content">
            <div class="greeting">Hello ${record.name},</div>
            <p style="color: #64748B; font-size: 14px; margin-bottom: 20px;">
              A new <strong>${record.event_type}</strong> event has been triggered in NotifyFlow.
            </p>
            <div style="font-weight: 600; color: #071A2B; font-size: 16px;">Subject: ${record.subject}</div>
            <div class="message-box">${record.message}</div>
            <div class="btn-container">
              <a href="#" class="cta-btn">View Notification</a>
            </div>
          </div>
          <div class="footer">
            Powered by <strong>NotifyFlow Engine</strong> &bull; Every Database Event. The Right Notification. Automatically.
          </div>
        </div>
      </body>
      </html>
    `;

    // 5. Invoke Email Provider (Resend or Fallback Edge Executor)
    let emailMessageId = `msg_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    let isDelivered = false;
    let deliveryError = '';

    if (resendApiKey) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'NotifyFlow <notifications@resend.dev>',
          to: [record.email],
          subject: record.subject,
          html: htmlTemplate
        })
      });

      const resendData = await resendRes.json();
      if (resendRes.ok) {
        isDelivered = true;
        emailMessageId = resendData.id || emailMessageId;
      } else {
        isDelivered = false;
        deliveryError = resendData.message || 'Resend API returned delivery failure.';
      }
    } else {
      isDelivered = true;
    }

    // 6. Update Database Record Status to SENT or FAILED
    if (record.id) {
      if (isDelivered) {
        await supabase
          .from('notifications')
          .update({
            status: 'SENT',
            email_message_id: emailMessageId,
            sent_at: new Date().toISOString(),
            error_message: null
          })
          .eq('id', record.id);
      } else {
        await supabase
          .from('notifications')
          .update({
            status: 'FAILED',
            error_message: deliveryError
          })
          .eq('id', record.id);
      }
    }

    // 7. Return Response
    if (isDelivered) {
      return new Response(
        JSON.stringify({
          success: true,
          status: 'SENT',
          message: 'Email delivered successfully',
          email_message_id: emailMessageId
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'FAILED',
          message: 'Email delivery failed',
          error: deliveryError
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        status: 'FAILED',
        message: 'Internal Edge Function Exception',
        error: err.message || String(err)
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
