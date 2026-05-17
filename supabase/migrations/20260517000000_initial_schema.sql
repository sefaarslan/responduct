-- ============================================================
-- Responduct — Initial Schema Migration
-- Tarih: 2026-05-17
-- ============================================================


-- ============================================================
-- 1. ENUM TİPLERİ
-- ============================================================

CREATE TYPE plan_type AS ENUM ('starter', 'professional', 'enterprise');

CREATE TYPE subscription_status AS ENUM (
  'active',
  'trialing',
  'cancelled',
  'past_due',
  'paused'
);

CREATE TYPE user_role AS ENUM ('admin', 'sales');

CREATE TYPE feedback_status AS ENUM ('draft', 'completed');


-- ============================================================
-- 2. TABLOLAR
-- (Fonksiyon public.users'a bağımlı olduğu için tablolar önce gelir)
-- ============================================================

-- companies
CREATE TABLE public.companies (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name            varchar(255) NOT NULL,
  plan_type               plan_type NOT NULL DEFAULT 'starter',
  max_users               integer NOT NULL DEFAULT 5,
  max_schools             integer NOT NULL DEFAULT 20,
  max_feedbacks_monthly   integer NOT NULL DEFAULT 100,
  subscription_status     subscription_status NOT NULL DEFAULT 'trialing',
  created_at              timestamptz NOT NULL DEFAULT now()
);

-- subscriptions
CREATE TABLE public.subscriptions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  lemon_subscription_id   varchar(255) UNIQUE,
  lemon_customer_id       varchar(255),
  plan_type               plan_type NOT NULL,
  status                  varchar(50) NOT NULL,
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- users — auth.users ile 1:1 ilişkili
CREATE TABLE public.users (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id   uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  email        varchar(255) NOT NULL,
  full_name    varchar(255) NOT NULL DEFAULT '',
  role         user_role NOT NULL DEFAULT 'sales',
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- schools
CREATE TABLE public.schools (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  school_name     varchar(255) NOT NULL,
  city            varchar(100),
  district        varchar(100),
  address         text,
  phone           varchar(30),
  contact_person  varchar(255),
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- school_assignments — okul ↔ satışçı
CREATE TABLE public.school_assignments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, user_id)
);

-- products
CREATE TABLE public.products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  product_name  varchar(255) NOT NULL,
  description   text,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- school_product_assignments — okul ↔ ürün
CREATE TABLE public.school_product_assignments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, product_id)
);

-- questions
CREATE TABLE public.questions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  question_text  text NOT NULL,
  order_index    integer NOT NULL DEFAULT 0,
  is_required    boolean NOT NULL DEFAULT false,
  is_active      boolean NOT NULL DEFAULT true
);

-- feedbacks — bir okul ziyareti oturumu
CREATE TABLE public.feedbacks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  school_id   uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status      feedback_status NOT NULL DEFAULT 'draft',
  visit_date  date NOT NULL DEFAULT CURRENT_DATE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- feedback_answers — soru bazlı cevaplar; ses dosyası saklanmaz
CREATE TABLE public.feedback_answers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id  uuid NOT NULL REFERENCES public.feedbacks(id) ON DELETE CASCADE,
  question_id  uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answer_text  text,
  is_skipped   boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (feedback_id, question_id)
);


-- ============================================================
-- 3. YARDIMCI FONKSİYON
-- public.users tablosu yukarıda oluşturulduğu için artık güvenli.
-- ============================================================

CREATE OR REPLACE FUNCTION get_my_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.users WHERE id = auth.uid();
$$;


-- ============================================================
-- 4. INDEXLER
-- ============================================================

CREATE INDEX idx_users_company_id          ON public.users(company_id);
CREATE INDEX idx_schools_company_id        ON public.schools(company_id);
CREATE INDEX idx_products_company_id       ON public.products(company_id);
CREATE INDEX idx_feedbacks_company_id      ON public.feedbacks(company_id);
CREATE INDEX idx_feedbacks_user_id         ON public.feedbacks(user_id);
CREATE INDEX idx_feedbacks_school_id       ON public.feedbacks(school_id);
CREATE INDEX idx_feedbacks_product_id      ON public.feedbacks(product_id);
CREATE INDEX idx_feedbacks_visit_date      ON public.feedbacks(visit_date);
CREATE INDEX idx_feedback_answers_feedback ON public.feedback_answers(feedback_id);
CREATE INDEX idx_school_assignments_user   ON public.school_assignments(user_id);
CREATE INDEX idx_school_assignments_school ON public.school_assignments(school_id);
CREATE INDEX idx_questions_product_order   ON public.questions(product_id, order_index);
CREATE INDEX idx_subscriptions_company_id  ON public.subscriptions(company_id);


-- ============================================================
-- 5. TRİGGER — subscriptions.updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ============================================================
-- 6. TRİGGER — Yeni auth kullanıcısı → public.users otomatik profil
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, company_id, email, full_name, role)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'company_id')::uuid,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'sales')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();


-- ============================================================
-- 7. TRİGGER — Aylık feedback limit kontrolü
-- ============================================================

CREATE OR REPLACE FUNCTION check_feedback_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company       public.companies;
  v_monthly_count integer;
BEGIN
  SELECT * INTO v_company
  FROM public.companies
  WHERE id = NEW.company_id;

  IF v_company.max_feedbacks_monthly = -1 THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO v_monthly_count
  FROM public.feedbacks
  WHERE company_id = NEW.company_id
    AND created_at >= date_trunc('month', now());

  IF v_monthly_count >= v_company.max_feedbacks_monthly THEN
    RAISE EXCEPTION 'Aylık feedback limiti aşıldı (limit: %)', v_company.max_feedbacks_monthly;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER feedbacks_check_limit
  BEFORE INSERT ON public.feedbacks
  FOR EACH ROW EXECUTE FUNCTION check_feedback_limit();


-- ============================================================
-- 8. ROW LEVEL SECURITY — Tüm tablolarda aktif
-- ============================================================

ALTER TABLE public.companies                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_assignments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_product_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_answers           ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 9. RLS POLİTİKALARI
-- ============================================================

-- companies
CREATE POLICY "companies: kendi şirketini gör"
  ON public.companies FOR SELECT
  USING (id = get_my_company_id());

-- subscriptions
CREATE POLICY "subscriptions: kendi şirkete ait"
  ON public.subscriptions FOR SELECT
  USING (company_id = get_my_company_id());

-- users
CREATE POLICY "users: kendi şirkete ait kullanıcıları gör"
  ON public.users FOR SELECT
  USING (company_id = get_my_company_id());

CREATE POLICY "users: kendi profilini güncelle"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "users: admin yeni kullanıcı ekler"
  ON public.users FOR INSERT
  WITH CHECK (
    company_id = get_my_company_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "users: admin kullanıcı siler"
  ON public.users FOR DELETE
  USING (
    company_id = get_my_company_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- schools
CREATE POLICY "schools: kendi şirkete ait okulları gör"
  ON public.schools FOR SELECT
  USING (company_id = get_my_company_id());

CREATE POLICY "schools: admin ekler"
  ON public.schools FOR INSERT
  WITH CHECK (
    company_id = get_my_company_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "schools: admin günceller"
  ON public.schools FOR UPDATE
  USING (
    company_id = get_my_company_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "schools: admin siler"
  ON public.schools FOR DELETE
  USING (
    company_id = get_my_company_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- school_assignments
CREATE POLICY "school_assignments: kendi şirkete ait"
  ON public.school_assignments FOR SELECT
  USING (
    school_id IN (
      SELECT id FROM public.schools WHERE company_id = get_my_company_id()
    )
  );

CREATE POLICY "school_assignments: admin ekler"
  ON public.school_assignments FOR INSERT
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    AND school_id IN (
      SELECT id FROM public.schools WHERE company_id = get_my_company_id()
    )
  );

CREATE POLICY "school_assignments: admin siler"
  ON public.school_assignments FOR DELETE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    AND school_id IN (
      SELECT id FROM public.schools WHERE company_id = get_my_company_id()
    )
  );

-- products
CREATE POLICY "products: kendi şirkete ait ürünleri gör"
  ON public.products FOR SELECT
  USING (company_id = get_my_company_id());

CREATE POLICY "products: admin ekler"
  ON public.products FOR INSERT
  WITH CHECK (
    company_id = get_my_company_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "products: admin günceller"
  ON public.products FOR UPDATE
  USING (
    company_id = get_my_company_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "products: admin siler"
  ON public.products FOR DELETE
  USING (
    company_id = get_my_company_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- school_product_assignments
CREATE POLICY "school_product_assignments: kendi şirkete ait"
  ON public.school_product_assignments FOR SELECT
  USING (
    school_id IN (
      SELECT id FROM public.schools WHERE company_id = get_my_company_id()
    )
  );

CREATE POLICY "school_product_assignments: admin ekler"
  ON public.school_product_assignments FOR INSERT
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    AND school_id IN (
      SELECT id FROM public.schools WHERE company_id = get_my_company_id()
    )
  );

CREATE POLICY "school_product_assignments: admin siler"
  ON public.school_product_assignments FOR DELETE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    AND school_id IN (
      SELECT id FROM public.schools WHERE company_id = get_my_company_id()
    )
  );

-- questions
CREATE POLICY "questions: kendi şirkete ait ürünlerin sorularını gör"
  ON public.questions FOR SELECT
  USING (
    product_id IN (
      SELECT id FROM public.products WHERE company_id = get_my_company_id()
    )
  );

CREATE POLICY "questions: admin ekler"
  ON public.questions FOR INSERT
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    AND product_id IN (
      SELECT id FROM public.products WHERE company_id = get_my_company_id()
    )
  );

CREATE POLICY "questions: admin günceller"
  ON public.questions FOR UPDATE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    AND product_id IN (
      SELECT id FROM public.products WHERE company_id = get_my_company_id()
    )
  );

CREATE POLICY "questions: admin siler"
  ON public.questions FOR DELETE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    AND product_id IN (
      SELECT id FROM public.products WHERE company_id = get_my_company_id()
    )
  );

-- feedbacks: admin tümünü görür, sales yalnızca kendininkini
CREATE POLICY "feedbacks: admin tümünü görür"
  ON public.feedbacks FOR SELECT
  USING (
    company_id = get_my_company_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "feedbacks: sales kendi feedbacklerini görür"
  ON public.feedbacks FOR SELECT
  USING (
    company_id = get_my_company_id()
    AND user_id = auth.uid()
  );

CREATE POLICY "feedbacks: sales ekler"
  ON public.feedbacks FOR INSERT
  WITH CHECK (
    company_id = get_my_company_id()
    AND user_id = auth.uid()
  );

CREATE POLICY "feedbacks: sales kendi draft'ını günceller"
  ON public.feedbacks FOR UPDATE
  USING (
    company_id = get_my_company_id()
    AND user_id = auth.uid()
    AND status = 'draft'
  );

-- feedback_answers
CREATE POLICY "feedback_answers: kendi şirkete ait feedbacklerin cevapları"
  ON public.feedback_answers FOR SELECT
  USING (
    feedback_id IN (
      SELECT id FROM public.feedbacks WHERE company_id = get_my_company_id()
    )
  );

CREATE POLICY "feedback_answers: sales kendi cevaplarını ekler"
  ON public.feedback_answers FOR INSERT
  WITH CHECK (
    feedback_id IN (
      SELECT id FROM public.feedbacks
      WHERE company_id = get_my_company_id()
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "feedback_answers: sales kendi cevaplarını günceller"
  ON public.feedback_answers FOR UPDATE
  USING (
    feedback_id IN (
      SELECT id FROM public.feedbacks
      WHERE company_id = get_my_company_id()
        AND user_id = auth.uid()
        AND status = 'draft'
    )
  );
