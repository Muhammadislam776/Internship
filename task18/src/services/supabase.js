import { createClient } from '@supabase/supabase-js';

// Live Supabase project credentials provided by user
const defaultUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ojzvegwlmzqutvktdoui.supabase.co';
const defaultKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_WOAe9z8kbHyBZTOMwCdNMg_QciXLXuz';

// Fetch stored custom credentials from localStorage if user configured them in Settings
export const getSupabaseConfig = () => {
  const customUrl = localStorage.getItem('notifyflow_supabase_url');
  const customKey = localStorage.getItem('notifyflow_supabase_key');
  const resendKey = localStorage.getItem('notifyflow_resend_key');

  return {
    url: customUrl || defaultUrl,
    key: customKey || defaultKey,
    resendKey: resendKey || '',
    isCustom: true
  };
};

const config = getSupabaseConfig();
export const supabase = createClient(config.url, config.key);

export const updateSupabaseClient = (url, key) => {
  if (url) localStorage.setItem('notifyflow_supabase_url', url);
  if (key) localStorage.setItem('notifyflow_supabase_key', key);
  return createClient(url || defaultUrl, key || defaultKey);
};
