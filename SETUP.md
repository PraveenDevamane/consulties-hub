# 🚀 Setup Guide for Cloned Project

This guide will help you set up the ConsultiesHub project with your own Supabase database.

---

## ✅ Step-by-Step Setup

### **1. Create a Supabase Project**

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click **"New Project"**
4. Fill in:
   - **Name**: `consulties-hub`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup to complete

---

### **2. Create Database Tables**

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"+ New query"**
3. Open the migration file in this project:
   ```
   supabase/migrations/20251128171239_6de3abb6-0368-4891-9df7-eb6aec4dbf3d.sql
   ```
4. Copy **ALL** the SQL from that file
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)

You should see: "Success. No rows returned"

---

### **3. Fix Security Policies (Important!)**

Create another **New query** in SQL Editor and run this:

```sql
-- Allow authenticated users to add businesses
DROP POLICY IF EXISTS "Users can insert businesses if they are publishers" ON public.businesses;
DROP POLICY IF EXISTS "Publishers can insert businesses" ON public.businesses;

CREATE POLICY "Authenticated users can insert businesses"
ON public.businesses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = publisher_id);

-- Allow everyone to view businesses
DROP POLICY IF EXISTS "Anyone can view businesses" ON public.businesses;
CREATE POLICY "Anyone can view businesses"
ON public.businesses
FOR SELECT
TO public
USING (true);

-- Allow users to update/delete their own businesses
CREATE POLICY "Users can update their own businesses"
ON public.businesses
FOR UPDATE
TO authenticated
USING (auth.uid() = publisher_id);

CREATE POLICY "Users can delete their own businesses"
ON public.businesses
FOR DELETE
TO authenticated
USING (auth.uid() = publisher_id);
```

---

### **4. Get Your Supabase Credentials**

1. In Supabase, go to **Settings** → **API**
2. Copy these values:

   **a) Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **b) anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cC...
   ```

   **c) service_role key** (click "Reveal"):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cC... (different from anon key)
   ```

---

### **5. Create `.env` File**

In your project root folder (where `package.json` is), create a file named `.env`:

```bash
# Copy .env.example to .env and fill in your values:
cp .env.example .env
```

Then edit `.env` with your values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important:** Replace the placeholder values with your actual Supabase credentials!

---

### **6. Install Dependencies**

```bash
npm install
```

---

### **7. Run the App**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or whatever URL is shown)

---

### **8. Seed Sample Data (Optional)**

To populate your database with sample businesses:

```bash
npm run seed
```

This will add:
- 18 sample businesses (restaurants, hotels, etc.)
- Sample bookings
- Sample advertisements

---

## 🎯 Quick Test

1. Go to [http://localhost:5173](http://localhost:5173)
2. Click **"GET STARTED"**
3. Create an account (Sign Up)
4. Choose **"Continue as Publisher"**
5. Click **"Add Your Business"**
6. Fill in the form and submit

If it works, you're all set! ✅

---

## 🐛 Troubleshooting

### "Failed to insert business" or "RLS policy violation"
- Make sure you ran Step 3 (Fix Security Policies)

### "Invalid API key"
- Check your `.env` file has the correct keys
- Make sure you're using YOUR Supabase project, not the old one

### Seed script fails
- Verify you set `SUPABASE_SERVICE_ROLE_KEY` in `.env`
- Make sure you ran the migration (Step 2)

### App shows blank/errors
- Check browser console (F12) for errors
- Verify `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server: Stop (`Ctrl+C`) and run `npm run dev` again

---

## 📝 What's in the Database?

After running the migration, you'll have these tables:
- `businesses` - Business listings
- `categories` - Business categories (Restaurants, Hotels, etc.)
- `user_roles` - User role management
- `advertisements` - Publisher ads
- `feedback` - User reviews
- `service_bookings` - Service appointments

---

## 🔒 Security Notes

- Never commit `.env` file to git (it's in `.gitignore`)
- Never share your `service_role` key publicly
- Use `anon` key for frontend, `service_role` only for backend/seeding

---

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Ran migration SQL to create tables
- [ ] Ran RLS policy SQL to fix permissions
- [ ] Got API credentials from Supabase
- [ ] Created `.env` file with credentials
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Tested signup/login
- [ ] Tested adding a business

---

Need help? Check the error message and refer to the troubleshooting section above! 🚀
