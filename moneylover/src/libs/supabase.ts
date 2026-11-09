import { createClient } from '@supabase/supabase-js';

// Constants
import { PROCESS_ENV } from '@/constants';

const REQUIRED_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: PROCESS_ENV.SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: PROCESS_ENV.SUPABASE_ANON_KEY,
};

const missingEnv = Object.entries(REQUIRED_ENV)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingEnv.length) {
  throw new Error(
    `Missing Supabase env: ${missingEnv.join(', ')}. Copy .env.sample to .env.local and fill in the values.`,
  );
}

export const supabase = createClient(PROCESS_ENV.SUPABASE_URL, PROCESS_ENV.SUPABASE_ANON_KEY);
