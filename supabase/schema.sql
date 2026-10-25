-- ============================================================
-- ELEV8 PLATFORM — SUPABASE DATABASE SCHEMA
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- TABLE: users (mirrors Supabase auth.users)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL UNIQUE,
  phone        TEXT,
  role         TEXT NOT NULL CHECK (role IN ('worker', 'employer', 'admin')) DEFAULT 'worker',
  lang_preference TEXT NOT NULL DEFAULT 'en' CHECK (lang_preference IN ('en', 'hi', 'mr')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABLE: worker_profiles
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.worker_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  first_name          TEXT NOT NULL DEFAULT '',
  last_name           TEXT NOT NULL DEFAULT '',
  title               TEXT NOT NULL DEFAULT '',
  bio                 TEXT DEFAULT '',
  city                TEXT DEFAULT '',
  state               TEXT DEFAULT '',
  location            TEXT DEFAULT '',
  hourly_rate         NUMERIC(10,2) DEFAULT 0,
  travel_distance     TEXT DEFAULT '10km',
  experience_level    TEXT DEFAULT '' CHECK (experience_level IN ('', 'fresher', '1-3yr', '3-5yr', '5-10yr', '10+yr')),
  availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'soon', 'unavailable')),
  work_preferences    TEXT[] DEFAULT '{}',
  skills              TEXT[] DEFAULT '{}',
  profile_photo_url   TEXT,
  is_premium          BOOLEAN NOT NULL DEFAULT FALSE,
  rating              NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_reviews       INTEGER NOT NULL DEFAULT 0,
  profile_views       INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABLE: employer_profiles
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.employer_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT '',
  company_name    TEXT DEFAULT '',
  description     TEXT DEFAULT '',
  location        TEXT DEFAULT '',
  logo_url        TEXT,
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  total_listings  INTEGER NOT NULL DEFAULT 0,
  total_hires     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABLE: job_listings
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.job_listings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id     UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  type            TEXT NOT NULL DEFAULT 'business' CHECK (type IN ('business', 'household')),
  title           TEXT NOT NULL,
  category        TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  location        TEXT NOT NULL DEFAULT '',
  pay_rate        NUMERIC(10,2) NOT NULL DEFAULT 0,
  pay_type        TEXT NOT NULL DEFAULT 'daily' CHECK (pay_type IN ('hourly', 'daily', 'monthly', 'fixed')),
  job_type        TEXT DEFAULT 'contract' CHECK (job_type IN ('full-time', 'part-time', 'contract', 'emergency', 'weekend', 'evening')),
  duration        TEXT DEFAULT '',
  urgency         TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent', 'very_urgent')),
  required_skills TEXT[] DEFAULT '{}',
  is_premium      BOOLEAN NOT NULL DEFAULT FALSE,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'filled', 'expired')),
  applicant_count INTEGER NOT NULL DEFAULT 0,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABLE: job_applications
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.job_applications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id      UUID NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  worker_id   UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'viewed', 'shortlisted', 'hired', 'rejected')),
  message     TEXT DEFAULT '',
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (job_id, worker_id)
);

-- ─────────────────────────────────────────
-- TABLE: certifications
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.certifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id    UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  type         TEXT NOT NULL DEFAULT 'elev8' CHECK (type IN ('partner', 'elev8')),
  partner_name TEXT DEFAULT '',
  cert_name    TEXT NOT NULL,
  cert_url     TEXT DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verified_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABLE: messages
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  job_id      UUID REFERENCES public.job_listings(id) ON DELETE SET NULL,
  content     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABLE: reviews
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  worker_id    UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  job_id       UUID REFERENCES public.job_listings(id) ON DELETE SET NULL,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABLE: saved_jobs (worker wishlists)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id  UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  job_id     UUID NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (worker_id, job_id)
);

-- ─────────────────────────────────────────
-- TABLE: notifications
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  link       TEXT DEFAULT '',
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- INDEXES (for fast queries)
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_job_listings_category    ON public.job_listings(category);
CREATE INDEX IF NOT EXISTS idx_job_listings_status      ON public.job_listings(status);
CREATE INDEX IF NOT EXISTS idx_job_listings_employer    ON public.job_listings(employer_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_created     ON public.job_listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_user     ON public.worker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_avail    ON public.worker_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_applications_job         ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker      ON public.job_applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver        ON public.messages(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user       ON public.notifications(user_id, is_read);

-- ─────────────────────────────────────────
-- TRIGGER: updated_at auto-update
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_worker_profiles_updated_at
  BEFORE UPDATE ON public.worker_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_employer_profiles_updated_at
  BEFORE UPDATE ON public.employer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_job_listings_updated_at
  BEFORE UPDATE ON public.job_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────
-- TRIGGER: auto-update worker rating on new review
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_worker_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.worker_profiles
  SET
    rating = (
      SELECT ROUND(AVG(rating)::NUMERIC, 2)
      FROM public.reviews
      WHERE worker_id = NEW.worker_id
    ),
    total_reviews = (
      SELECT COUNT(*) FROM public.reviews WHERE worker_id = NEW.worker_id
    )
  WHERE id = NEW.worker_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_worker_rating
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_worker_rating();

-- ─────────────────────────────────────────
-- TRIGGER: auto-increment applicant_count
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_applicant_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.job_listings
  SET applicant_count = applicant_count + 1
  WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_increment_applicant_count
  AFTER INSERT ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION increment_applicant_count();

-- ─────────────────────────────────────────
-- TRIGGER: auto-create profile on new user
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'worker' THEN
    INSERT INTO public.worker_profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF NEW.role = 'employer' THEN
    INSERT INTO public.employer_profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_handle_new_user
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────
ALTER TABLE public.users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications       ENABLE ROW LEVEL SECURITY;

-- ── users ──
CREATE POLICY "Users can read own record"
  ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own record"
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- ── worker_profiles ──
CREATE POLICY "Anyone can view worker profiles"
  ON public.worker_profiles FOR SELECT USING (TRUE);
CREATE POLICY "Workers can update own profile"
  ON public.worker_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert worker profiles"
  ON public.worker_profiles FOR INSERT WITH CHECK (TRUE);

-- ── employer_profiles ──
CREATE POLICY "Anyone can view employer profiles"
  ON public.employer_profiles FOR SELECT USING (TRUE);
CREATE POLICY "Employers can update own profile"
  ON public.employer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert employer profiles"
  ON public.employer_profiles FOR INSERT WITH CHECK (TRUE);

-- ── job_listings ──
CREATE POLICY "Anyone can view active jobs"
  ON public.job_listings FOR SELECT USING (status = 'active' OR employer_id IN (
    SELECT id FROM public.employer_profiles WHERE user_id = auth.uid()
  ));
CREATE POLICY "Employers can insert own jobs"
  ON public.job_listings FOR INSERT WITH CHECK (employer_id IN (
    SELECT id FROM public.employer_profiles WHERE user_id = auth.uid()
  ));
CREATE POLICY "Employers can update own jobs"
  ON public.job_listings FOR UPDATE USING (employer_id IN (
    SELECT id FROM public.employer_profiles WHERE user_id = auth.uid()
  ));
CREATE POLICY "Employers can delete own jobs"
  ON public.job_listings FOR DELETE USING (employer_id IN (
    SELECT id FROM public.employer_profiles WHERE user_id = auth.uid()
  ));

-- ── job_applications ──
CREATE POLICY "Workers can view own applications"
  ON public.job_applications FOR SELECT USING (worker_id IN (
    SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()
  ) OR job_id IN (
    SELECT id FROM public.job_listings WHERE employer_id IN (
      SELECT id FROM public.employer_profiles WHERE user_id = auth.uid()
    )
  ));
CREATE POLICY "Workers can apply"
  ON public.job_applications FOR INSERT WITH CHECK (worker_id IN (
    SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()
  ));
CREATE POLICY "Employers can update application status"
  ON public.job_applications FOR UPDATE USING (job_id IN (
    SELECT id FROM public.job_listings WHERE employer_id IN (
      SELECT id FROM public.employer_profiles WHERE user_id = auth.uid()
    )
  ));

-- ── messages ──
CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receivers can mark messages read"
  ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- ── reviews ──
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can leave reviews"
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ── certifications ──
CREATE POLICY "Anyone can view approved certs"
  ON public.certifications FOR SELECT USING (status = 'approved' OR worker_id IN (
    SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()
  ));
CREATE POLICY "Workers can submit certifications"
  ON public.certifications FOR INSERT WITH CHECK (worker_id IN (
    SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()
  ));

-- ── saved_jobs ──
CREATE POLICY "Workers can manage own saved jobs"
  ON public.saved_jobs FOR ALL USING (worker_id IN (
    SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()
  ));

-- ── notifications ──
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT WITH CHECK (TRUE);

-- ─────────────────────────────────────────
-- TABLE: negotiations
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.negotiations (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id        UUID NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  job_id                UUID NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  worker_id             UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  employer_id           UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  status                TEXT NOT NULL DEFAULT 'pending_customer' CHECK (status IN ('open', 'pending_customer', 'pending_worker', 'countered', 'accepted', 'rejected')),
  original_rate         NUMERIC(10,2) NOT NULL DEFAULT 0,
  worker_proposed_rate  NUMERIC(10,2),
  employer_counter_rate NUMERIC(10,2),
  final_agreed_rate     NUMERIC(10,2),
  worker_message        TEXT,
  employer_message      TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: negotiation_offers
CREATE TABLE IF NOT EXISTS public.negotiation_offers (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  negotiation_id        UUID NOT NULL REFERENCES public.negotiations(id) ON DELETE CASCADE,
  offered_by            TEXT NOT NULL CHECK (offered_by IN ('worker', 'employer')),
  offered_rate          NUMERIC(10,2) NOT NULL,
  message               TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: negotiations
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parties can view their negotiations"
  ON public.negotiations FOR SELECT USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()) OR
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Parties can update negotiations"
  ON public.negotiations FOR UPDATE USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()) OR
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Workers and employers can create negotiations"
  ON public.negotiations FOR INSERT WITH CHECK (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()) OR
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Parties can view offers"
  ON public.negotiation_offers FOR SELECT USING (
    negotiation_id IN (
      SELECT id FROM public.negotiations WHERE
        worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()) OR
        employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Parties can insert offers"
  ON public.negotiation_offers FOR INSERT WITH CHECK (
    negotiation_id IN (
      SELECT id FROM public.negotiations WHERE
        worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()) OR
        employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    )
  );
