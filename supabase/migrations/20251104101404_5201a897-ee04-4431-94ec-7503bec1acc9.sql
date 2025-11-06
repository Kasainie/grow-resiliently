-- Create user role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'agronomist', 'farmer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  role app_role NOT NULL DEFAULT 'farmer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table for fine-grained access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
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
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- Create crops reference table
CREATE TABLE public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  variety TEXT,
  typical_days_to_maturity INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

-- Create farms table
CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  area_ha DECIMAL(10, 2),
  soil_type TEXT,
  has_irrigation BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

-- Create plots table
CREATE TABLE public.plots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  crop_id UUID REFERENCES public.crops(id),
  planting_date DATE,
  expected_harvest_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;

-- Create images table for crop diagnosis
CREATE TABLE public.images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  plot_id UUID REFERENCES public.plots(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ai_label TEXT,
  ai_confidence DECIMAL(5, 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Create recommendations table
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  plot_id UUID REFERENCES public.plots(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('planting', 'irrigation', 'fertilizer', 'pesticide', 'harvest')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  payload JSONB,
  source_model TEXT,
  recommended_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Create alerts table for real-time notifications
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warning', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Enable realtime for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for crops (public read)
CREATE POLICY "Anyone can view crops"
  ON public.crops FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage crops"
  ON public.crops FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for farms
CREATE POLICY "Users can view their own farms"
  ON public.farms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own farms"
  ON public.farms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farms"
  ON public.farms FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farms"
  ON public.farms FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Agronomists and admins can view all farms"
  ON public.farms FOR SELECT
  USING (public.has_role(auth.uid(), 'agronomist') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for plots
CREATE POLICY "Users can view plots of their farms"
  ON public.plots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = plots.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage plots of their farms"
  ON public.plots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = plots.farm_id
      AND farms.user_id = auth.uid()
    )
  );

-- RLS Policies for images
CREATE POLICY "Users can view images of their farms"
  ON public.images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload images to their farms"
  ON public.images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
  ON public.images FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for recommendations
CREATE POLICY "Users can view recommendations for their farms"
  ON public.recommendations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = recommendations.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "System can create recommendations"
  ON public.recommendations FOR INSERT
  WITH CHECK (true);

-- RLS Policies for alerts
CREATE POLICY "Users can view their own alerts"
  ON public.alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON public.alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create alerts"
  ON public.alerts FOR INSERT
  WITH CHECK (true);

-- Trigger function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'farmer')
  );
  
  -- Add user to user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'farmer')
  );
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farms_updated_at
  BEFORE UPDATE ON public.farms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plots_updated_at
  BEFORE UPDATE ON public.plots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default crops
INSERT INTO public.crops (name, variety, typical_days_to_maturity) VALUES
  ('Maize', 'Hybrid', 120),
  ('Rice', 'IR64', 115),
  ('Wheat', 'Spring', 110),
  ('Sorghum', 'Sweet', 100),
  ('Beans', 'Common', 90),
  ('Cassava', 'TME419', 360),
  ('Sweet Potato', 'Orange', 120),
  ('Millet', 'Pearl', 75),
  ('Groundnut', 'Runner', 120),
  ('Cowpea', 'Improved', 70);