-- Supabase Dashboard > SQL Editor 에서 실행하세요
-- profiles 테이블: 회원가입 시 역할(adopter/promoter) 저장

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('adopter', 'promoter')),
  display_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 서비스 역할(service_role)로 모든 프로필 조회 가능 (관리자용)
CREATE POLICY "Service role can read all profiles"
  ON public.profiles FOR SELECT
  USING (true);
