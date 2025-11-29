-- Run this SQL query in your Supabase SQL Editor to assign publisher role to a user
-- Replace 'YOUR_USER_EMAIL_HERE' with the actual email address

-- First, find your user ID
SELECT id, email FROM auth.users WHERE email = '1ms23cs137@msrit.edu';

-- Then, insert or update the publisher role
-- Copy the ID from above and replace 'YOUR_USER_ID_HERE' below

INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'publisher')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'publisher';

-- Verify it worked
SELECT ur.*, u.email 
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE u.email = '1ms23cs137@msrit.edu';
