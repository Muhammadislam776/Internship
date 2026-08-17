-- ====================================================
-- NOTIFYFLOW PRODUCTION POSTGRESQL DATABASE QUERIES
-- ====================================================

-- ----------------------------------------------------
-- 1. TABLE CREATION (DDL)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    event_type TEXT NOT NULL DEFAULT 'New Booking',
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SENT', 'FAILED')),
    email_message_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processing_started_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_email ON public.notifications(email);
CREATE INDEX IF NOT EXISTS idx_notifications_event_type ON public.notifications(event_type);

-- Row Level Security (RLS) & Policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to notifications"
    ON public.notifications FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to notifications"
    ON public.notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access for status tracking"
    ON public.notifications FOR UPDATE USING (true);

-- Enable Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;


-- ----------------------------------------------------
-- 2. AUTOMATED DATABASE TRIGGER & WEBHOOK FUNCTION
-- ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_notification_event()
RETURNS TRIGGER AS $$
DECLARE
    edge_function_url TEXT := 'https://' || current_setting('app.settings.supabase_ref', true) || '.supabase.co/functions/v1/send-notification-email';
    service_role_key TEXT := current_setting('app.settings.service_role_key', true);
BEGIN
    -- Fire Edge Function asynchronously upon INSERT or RETRY (status reset to PENDING)
    IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND NEW.status = 'PENDING' AND OLD.status = 'FAILED') THEN
        PERFORM net.http_post(
            url := edge_function_url,
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || service_role_key
            ),
            body := jsonb_build_object(
                'type', TG_OP,
                'table', 'notifications',
                'record', row_to_json(NEW)
            )
        );
    END IF;
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Edge function trigger error: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach Trigger to Table
DROP TRIGGER IF EXISTS on_notification_created ON public.notifications;
CREATE TRIGGER on_notification_created
    AFTER INSERT OR UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_notification_event();


-- ----------------------------------------------------
-- 3. COMMON DML & OPERATIONAL QUERIES
-- ----------------------------------------------------

-- [Q1] Insert New Notification Event (Triggers Edge Function Automatically)
INSERT INTO public.notifications (
    name,
    email,
    event_type,
    subject,
    message,
    status
) VALUES (
    'Alexa Chen',
    'alexa.chen@luminaresort.com',
    'New Booking',
    'Booking Confirmation — Skyline Suite #402',
    'Your luxury room reservation for Oct 24-28, 2026 is confirmed. Total paid: $1,850.00 USD.',
    'PENDING'
) RETURNING id, status, created_at;


-- [Q2] Fetch Recent Event Logs with Pagination
SELECT 
    id,
    name,
    email,
    event_type,
    subject,
    status,
    email_message_id,
    created_at,
    sent_at
FROM public.notifications
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;


-- [Q3] Filter Notifications by Delivery Status
SELECT *
FROM public.notifications
WHERE status = 'SENT'
ORDER BY created_at DESC;

SELECT *
FROM public.notifications
WHERE status = 'FAILED'
ORDER BY created_at DESC;


-- [Q4] Calculate System Analytics & Delivery Success Rate
SELECT
    COUNT(*) AS total_events,
    COUNT(*) FILTER (WHERE status = 'SENT') AS emails_sent,
    COUNT(*) FILTER (WHERE status = 'FAILED') AS emails_failed,
    COUNT(*) FILTER (WHERE status IN ('PENDING', 'PROCESSING')) AS in_flight,
    ROUND(
        (COUNT(*) FILTER (WHERE status = 'SENT')::NUMERIC / NULLIF(COUNT(*), 0)::NUMERIC) * 100, 
        2
    ) AS success_rate_percentage,
    AVG(EXTRACT(EPOCH FROM (sent_at - created_at)) * 1000) AS avg_delivery_latency_ms
FROM public.notifications;


-- [Q5] Group Events by Type Distribution
SELECT
    event_type,
    COUNT(*) AS total_count,
    COUNT(*) FILTER (WHERE status = 'SENT') AS sent_count,
    COUNT(*) FILTER (WHERE status = 'FAILED') AS failed_count
FROM public.notifications
GROUP BY event_type
ORDER BY total_count DESC;


-- [Q6] Retry Failed Notification Dispatch
UPDATE public.notifications
SET 
    status = 'PENDING',
    error_message = NULL,
    created_at = NOW()
WHERE id = 'evt-3310-9921'
  AND status = 'FAILED'
RETURNING id, status;


-- [Q7] Delete / Archive Test Records
DELETE FROM public.notifications
WHERE email LIKE '%test%' OR email LIKE '%blocked%';
