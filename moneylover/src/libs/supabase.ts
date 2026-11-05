import { createClient } from '@supabase/supabase-js';

// Constants
import { PROCESS_ENV } from '@/constants';

export const supabase = createClient(
  PROCESS_ENV.SUPABASE_URL,
  PROCESS_ENV.SUPABASE_ANON_KEY,
);
