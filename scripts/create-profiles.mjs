// Supabase Management API를 통해 profiles 테이블 생성
import { readFileSync } from 'fs'

// .env.local에서 환경변수 읽기
const envFile = readFileSync('.env.local', 'utf8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) envVars[key.trim()] = rest.join('=').trim()
})

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('환경변수가 없습니다.')
  process.exit(1)
}

// Supabase REST API로 테이블 존재 여부 확인
const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`, {
  headers: {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  },
})

if (checkRes.ok) {
  console.log('✓ profiles 테이블이 이미 존재합니다.')
  process.exit(0)
}

console.log('profiles 테이블이 없습니다. Supabase Dashboard에서 SQL을 실행해 주세요.')
console.log('')
console.log('=== Supabase Dashboard > SQL Editor 에서 아래 SQL 실행 ===')
console.log('')
console.log(`CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('adopter', 'promoter')),
  display_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role full access profiles" ON public.profiles FOR ALL USING (true);`)
console.log('')
console.log('=== SQL 끝 ===')
console.log('')
console.log('URL: https://supabase.com/dashboard/project/' + SUPABASE_URL.split('//')[1].split('.')[0] + '/sql/new')
