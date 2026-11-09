/**
 * @jest-environment node
 */

// jest.setup.ts mocks this module globally; this file tests the real one.
jest.unmock('@/libs/supabase');

const ORIGINAL_ENV = process.env;

// PROCESS_ENV is read at module load, so each test imports a fresh copy.
const loadSupabase = () => import('@/libs/supabase');

describe('libs/supabase', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('throws a clear error naming every missing variable', async () => {
    await expect(loadSupabase()).rejects.toThrow(
      /NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.*\.env\.sample.*\.env\.local/,
    );
  });

  it('names only the variable that is missing', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';

    await expect(loadSupabase()).rejects.toThrow(
      'Missing Supabase env: NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  });

  it('creates the client when the variables are set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    const { supabase } = await loadSupabase();

    expect(supabase).toBeDefined();
  });
});
