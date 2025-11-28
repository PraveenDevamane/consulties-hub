-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'publisher', 'admin');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table (roles MUST be in separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create categories table
CREATE TABLE public.categories (
  category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create businesses table
CREATE TABLE public.businesses (
  business_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(category_id),
  description TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create advertisements table
CREATE TABLE public.advertisements (
  ad_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE public.feedback (
  feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(business_id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create service_bookings table
CREATE TABLE public.service_bookings (
  booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  TO authenticated
  USING (true);

-- Businesses policies
CREATE POLICY "Anyone can view businesses"
  ON public.businesses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Publishers can insert businesses"
  ON public.businesses FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'publisher') AND auth.uid() = publisher_id);

CREATE POLICY "Publishers can update own businesses"
  ON public.businesses FOR UPDATE
  TO authenticated
  USING (auth.uid() = publisher_id);

CREATE POLICY "Publishers can delete own businesses"
  ON public.businesses FOR DELETE
  TO authenticated
  USING (auth.uid() = publisher_id);

-- Advertisements policies
CREATE POLICY "Anyone can view advertisements"
  ON public.advertisements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Publishers can insert advertisements"
  ON public.advertisements FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'publisher') AND auth.uid() = publisher_id);

CREATE POLICY "Publishers can update own advertisements"
  ON public.advertisements FOR UPDATE
  TO authenticated
  USING (auth.uid() = publisher_id);

CREATE POLICY "Publishers can delete own advertisements"
  ON public.advertisements FOR DELETE
  TO authenticated
  USING (auth.uid() = publisher_id);

-- Feedback policies
CREATE POLICY "Anyone can view feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert feedback"
  ON public.feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback"
  ON public.feedback FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feedback"
  ON public.feedback FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Service bookings policies
CREATE POLICY "Users can view own bookings"
  ON public.service_bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert bookings"
  ON public.service_bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default categories
INSERT INTO public.categories (name) VALUES
  ('Restaurants'),
  ('Hotels'),
  ('Footwear'),
  ('Electronics'),
  ('Fashion'),
  ('Healthcare'),
  ('Education'),
  ('Services'),
  ('News');

-- Function to update business rating based on feedback
CREATE OR REPLACE FUNCTION public.update_business_rating()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.businesses
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM public.feedback
    WHERE business_id = NEW.business_id
  )
  WHERE business_id = NEW.business_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update rating when feedback is added
CREATE TRIGGER on_feedback_created
  AFTER INSERT ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION public.update_business_rating();