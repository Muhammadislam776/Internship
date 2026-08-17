-- ====================================================
-- NOTIFYFLOW PRODUCTION DATABASE MIGRATION
-- Table: notifications
-- ====================================================

-- 1. Create table with exact required columns
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

-- 2. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_email ON public.notifications(email);
CREATE INDEX IF NOT EXISTS idx_notifications_event_type ON public.notifications(event_type);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Anonymous / Authenticated policies for demo
CREATE POLICY "Allow public read access to notifications"
    ON public.notifications
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert access to notifications"
    ON public.notifications
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update access for status tracking"
    ON public.notifications
    FOR UPDATE
    USING (true);

-- 4. Enable Supabase Realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 5. Create PostgreSQL Webhook Trigger calling Supabase Edge Function
CREATE OR REPLACE FUNCTION public.handle_new_notification_event()
RETURNS TRIGGER AS $$
DECLARE
    edge_function_url TEXT := 'https://' || current_setting('app.settings.supabase_ref', true) || '.supabase.co/functions/v1/send-notification-email';
    service_role_key TEXT := current_setting('app.settings.service_role_key', true);
BEGIN
    -- Invoke Edge Function asynchronously via pg_net when a new record is inserted or retried
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

-- Create Trigger on INSERT and UPDATE (for Retry workflow)
DROP TRIGGER IF EXISTS on_notification_created ON public.notifications;
CREATE TRIGGER on_notification_created
    AFTER INSERT OR UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_notification_event();
