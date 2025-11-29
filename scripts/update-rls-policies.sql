-- Option 2: Update RLS policy to allow any authenticated user to insert businesses
-- This is better than disabling RLS completely

-- First, drop the existing restrictive policy if it exists
DROP POLICY IF EXISTS "Users can insert businesses if they are publishers" ON public.businesses;
DROP POLICY IF EXISTS "Publishers can insert businesses" ON public.businesses;

-- Create a new policy that allows any authenticated user to insert
CREATE POLICY "Authenticated users can insert businesses"
ON public.businesses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = publisher_id);

-- This policy allows:
-- - Any logged-in user to add a business
-- - As long as the publisher_id matches their user ID

-- Also ensure SELECT is open for everyone
DROP POLICY IF EXISTS "Anyone can view businesses" ON public.businesses;
CREATE POLICY "Anyone can view businesses"
ON public.businesses
FOR SELECT
TO public
USING (true);

-- Allow users to update their own businesses
DROP POLICY IF EXISTS "Users can update their own businesses" ON public.businesses;
CREATE POLICY "Users can update their own businesses"
ON public.businesses
FOR UPDATE
TO authenticated
USING (auth.uid() = publisher_id)
WITH CHECK (auth.uid() = publisher_id);

-- Allow users to delete their own businesses
DROP POLICY IF EXISTS "Users can delete their own businesses" ON public.businesses;
CREATE POLICY "Users can delete their own businesses"
ON public.businesses
FOR DELETE
TO authenticated
USING (auth.uid() = publisher_id);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'businesses';
