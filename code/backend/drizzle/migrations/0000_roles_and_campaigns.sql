
-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  organization text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'farmer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-create profile + default farmer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, organization, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'organization',
    NEW.raw_user_meta_data->>'phone'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'farmer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Campaigns
CREATE TYPE public.campaign_status AS ENUM ('cho_duyet', 'can_bo_sung', 'dang_gay_quy', 'hoan_thanh', 'tu_choi');

CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  district text NOT NULL,
  summary text NOT NULL,
  story text NOT NULL,
  method text NOT NULL DEFAULT '',
  impact text NOT NULL DEFAULT '',
  goal numeric NOT NULL DEFAULT 0,
  raised numeric NOT NULL DEFAULT 0,
  supporters integer NOT NULL DEFAULT 0,
  image_url text,
  status campaign_status NOT NULL DEFAULT 'cho_duyet',
  review_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.campaigns TO anon;
GRANT SELECT, INSERT, UPDATE ON public.campaigns TO authenticated;
GRANT ALL ON public.campaigns TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads approved campaigns" ON public.campaigns FOR SELECT TO anon, authenticated USING (status IN ('dang_gay_quy', 'hoan_thanh'));
CREATE POLICY "Owners read own campaigns" ON public.campaigns FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners insert own campaigns" ON public.campaigns FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own pending campaigns" ON public.campaigns FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Admins manage all campaigns" ON public.campaigns FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Campaign updates (tiến độ)
CREATE TABLE public.campaign_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.campaign_updates TO anon;
GRANT SELECT, INSERT ON public.campaign_updates TO authenticated;
GRANT ALL ON public.campaign_updates TO service_role;
ALTER TABLE public.campaign_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads updates of approved campaigns" ON public.campaign_updates FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.status IN ('dang_gay_quy','hoan_thanh')));
CREATE POLICY "Owners post updates" ON public.campaign_updates FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.owner_id = auth.uid()));

-- Donations (ghi nhận đóng góp mô phỏng)
CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
  campaign_slug text NOT NULL,
  amount numeric NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  anonymous boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.donations TO anon;
GRANT SELECT, INSERT ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can donate" ON public.donations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Campaign owners read donations of own campaigns" ON public.donations FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.owner_id = auth.uid()));
CREATE POLICY "Admins read all donations" ON public.donations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Volunteer applications
CREATE TABLE public.volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  campaign_slug text NOT NULL,
  role text NOT NULL,
  experience text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.volunteer_applications TO anon;
GRANT SELECT, INSERT ON public.volunteer_applications TO authenticated;
GRANT ALL ON public.volunteer_applications TO service_role;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply" ON public.volunteer_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read applications" ON public.volunteer_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
