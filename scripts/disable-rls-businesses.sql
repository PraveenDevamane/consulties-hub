-- Option 1: Disable RLS completely (allows anyone to insert)
-- WARNING: This makes the table accessible to anyone. Only use for development.

ALTER TABLE public.businesses DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'businesses';
