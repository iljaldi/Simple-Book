
-- 1) 잘못된 FK/트리거/함수 정리
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_user_id_fkey;

-- 이전에 생성된 public.users 자동생성 트리거/함수 제거
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2) profiles 테이블 생성: auth.users 와 1:1, 가벼운 프로필 전용
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3) RLS 활성화 및 최소 정책
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Select own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view their own profile (profiles)'
  ) THEN
    CREATE POLICY "Users can view their own profile (profiles)"
      ON public.profiles
      FOR SELECT
      USING (id = auth.uid());
  END IF;

  -- Update own profile (선택 사항)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update their own profile (profiles)'
  ) THEN
    CREATE POLICY "Users can update their own profile (profiles)"
      ON public.profiles
      FOR UPDATE
      USING (id = auth.uid());
  END IF;
END $$;

-- 4) 신규 가입 시 profiles 자동 생성 트리거
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profiles ON auth.users;
CREATE TRIGGER on_auth_user_created_profiles
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- 5) 기존 유저 백필
INSERT INTO public.profiles (id, email, name)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data->>'name', u.email)
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- 6) 올바른 FK: categories.user_id -> profiles(id)
ALTER TABLE public.categories
  ADD CONSTRAINT categories_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
