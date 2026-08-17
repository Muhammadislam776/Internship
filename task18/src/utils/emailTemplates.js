export const generateEmailHTML = ({ name, email, eventType, subject, message, sentAt, messageId }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #071A2B; color: #172033; margin: 0; padding: 20px; }
    .email-card { max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(7,26,43,0.35); border: 1px solid rgba(226, 232, 240, 0.8); }
    .email-header { background: #071A2B; padding: 28px 32px; text-align: center; border-bottom: 3px solid #2563EB; position: relative; }
    .email-logo { color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; font-family: 'Outfit', sans-serif; }
    .email-logo span { color: #22D3EE; }
    .email-badge { display: inline-block; background: rgba(37, 99, 235, 0.15); color: #22D3EE; border: 1px solid rgba(34, 211, 238, 0.3); padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 12px; }
    .email-body { padding: 36px; background-color: #FFFFFF; }
    .greeting { font-size: 18px; font-weight: 700; color: #071A2B; margin-bottom: 12px; }
    .intro { color: #64748B; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    .subject-line { font-weight: 700; color: #071A2B; font-size: 15px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .message-container { background: #F8FAFC; border-left: 4px solid #FF7A18; padding: 20px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 28px; white-space: pre-wrap; }
    .cta-wrapper { text-align: center; margin: 32px 0 16px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #FF7A18, #EA580C); color: #FFFFFF !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 16px rgba(255, 122, 24, 0.35); }
    .meta-footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 16px 36px; font-size: 12px; color: #94A3B8; display: flex; justify-content: space-between; align-items: center; }
    .email-footer { background: #071A2B; padding: 24px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid rgba(255,255,255,0.08); }
  </style>
</head>
<body>
  <div class="email-card">
    <div class="email-header">
      <div class="email-logo">Notify<span>Flow</span></div>
      <div class="email-badge">${eventType || 'Automated Event'}</div>
    </div>
    <div class="email-body">
      <div class="greeting">Hello ${name || 'Customer'},</div>
      <div class="intro">
        A new event record was created in your database and triggered an automated email via <strong>NotifyFlow Edge Function</strong>.
      </div>
      <div class="subject-line">Subject: ${subject}</div>
      <div class="message-container">${message}</div>
      <div class="cta-wrapper">
        <a href="#" class="cta-button">View Notification Details &rarr;</a>
      </div>
    </div>
    <div class="meta-footer">
      <div>Message ID: <code>${messageId || 'msg_pending'}</code></div>
      <div>Sent: ${sentAt ? new Date(sentAt).toLocaleTimeString() : 'Just now'}</div>
    </div>
    <div class="email-footer">
      Powered by <strong>NotifyFlow Engine</strong> &bull; Every Event Deserves a Notification.
    </div>
  </div>
</body>
</html>
  `;
};
