# 🔧 Fixing the Seed Script & RLS Issues

## Why the Seed Script is Not Working

The seed script is failing because of **Row-Level Security (RLS)** policies in Supabase that prevent inserting data into the `businesses` table.

---

## 🚀 Quick Fix (3 Steps)

### **Step 1: Fix RLS Policies in Supabase**

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Copy and paste this SQL:

```sql
-- Allow any authenticated user to insert businesses
DROP POLICY IF EXISTS "Users can insert businesses if they are publishers" ON public.businesses;
DROP POLICY IF EXISTS "Publishers can insert businesses" ON public.businesses;

CREATE POLICY "Authenticated users can insert businesses"
ON public.businesses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = publisher_id);

-- Allow public to view all businesses
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
USING (auth.uid() = publisher_id);

-- Allow users to delete their own businesses
DROP POLICY IF EXISTS "Users can delete their own businesses" ON public.businesses;
CREATE POLICY "Users can delete their own businesses"
ON public.businesses
FOR DELETE
TO authenticated
USING (auth.uid() = publisher_id);
```

4. Click **Run** (or press Cmd+Enter)

---

### **Step 2: Set Environment Variables**

You need your Supabase credentials. Get them from your Supabase dashboard:

1. Go to **Settings** → **API**
2. Copy your **Project URL** and **service_role key** (NOT the anon key!)

Then set them in your terminal:

```bash
export SUPABASE_URL="https://your-project-id.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

**Optional:** You can also set specific user IDs:
```bash
export PUBLISHER_ID="user-uuid-here"
export USER_ID="user-uuid-here"
```

---

### **Step 3: Run the Seed Script**

```bash
npm run seed
```

---

## 🐛 Still Not Working? Debug Steps

### Test 1: Check Environment Variables

```bash
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

Both should show values. If empty, set them again.

### Test 2: Run with Verbose Output

```bash
node scripts/seed-sample.mjs
```

This will show detailed error messages.

### Test 3: Check if Categories Exist

The seed script needs these categories in your database:
- Restaurants
- Hotels
- Footwear
- Electronics
- Fashion
- Healthcare
- Education
- Services
- News

Run this SQL to check:
```sql
SELECT * FROM categories;
```

If missing, insert them:
```sql
INSERT INTO categories (name) VALUES
('Restaurants'),
('Hotels'),
('Footwear'),
('Electronics'),
('Fashion'),
('Healthcare'),
('Education'),
('Services'),
('News');
```

---

## ⚠️ Common Errors & Solutions

### Error: "new row violates row-level security policy"
**Solution:** Run Step 1 above (update RLS policies)

### Error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
**Solution:** Run Step 2 above (set environment variables)

### Error: "Failed to insert businesses"
**Solution:** Check if categories exist (Test 3 above)

### Error: "Could not list auth users"
**Solution:** Make sure you're using the service_role key, NOT the anon key

---

## 🎯 Alternative: Add Businesses Manually via UI

If you just want to test without seeding:

1. Login to your app
2. Click "Continue as Publisher"
3. Click "Add Your Business"
4. Fill in the form manually

The app should work after fixing RLS (Step 1).

---

## 📝 What Changed

I updated the seed script to show better error messages. When it fails now, it will tell you exactly what's wrong and what SQL script to run.

---

Need more help? Let me know what error message you're seeing! 🚀
