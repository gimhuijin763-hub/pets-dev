-- 데이터 소유권 필드 추가 마이그레이션
-- 2025-04-14: promoter_id 및 applicant_id 필드 추가

-- 1. animals 테이블에 promoter_id 필드 추가
ALTER TABLE animals
ADD COLUMN IF NOT EXISTS promoter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. applications 테이블에 applicant_id 필드 추가
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS applicant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. 기존 데이터에 대한 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_animals_promoter_id ON animals(promoter_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);

-- 4. RLS (Row Level Security) 정책 설정

-- Animals 테이블 RLS 정책
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- 모든 사용자는 동물 목록 조회 가능
CREATE POLICY "Animals are viewable by everyone"
ON animals FOR SELECT
TO anon, authenticated
USING (true);

-- 동물 등록: 인증된 사용자만 가능 (역할은 애플리케이션 레벨에서 검증)
CREATE POLICY "Authenticated users can insert animals"
ON animals FOR INSERT
TO authenticated
WITH CHECK (true);

-- 동물 수정: 소유자 또는 관리자만 가능
CREATE POLICY "Users can update own animals"
ON animals FOR UPDATE
TO authenticated
USING (
  promoter_id = auth.uid() OR
  EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.role = 'admin')
);

-- 동물 삭제: 소유자 또는 관리자만 가능
CREATE POLICY "Users can delete own animals"
ON animals FOR DELETE
TO authenticated
USING (
  promoter_id = auth.uid() OR
  EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.role = 'admin')
);

-- Applications 테이블 RLS 정책
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 신청 조회: 본인 신청만 조회 가능 (또는 관련 동물의 소유자)
CREATE POLICY "Users can view own applications"
ON applications FOR SELECT
TO authenticated
USING (
  applicant_id = auth.uid() OR
  animal_id IN (SELECT id FROM animals WHERE promoter_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.role = 'admin')
);

-- 비로그인 사용자도 신청 가능
CREATE POLICY "Anyone can insert applications"
ON applications FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 신청 상태 수정: 관련 동물의 소유자 또는 관리자만 가능
CREATE POLICY "Animal owners can update application status"
ON applications FOR UPDATE
TO authenticated
USING (
  animal_id IN (SELECT id FROM animals WHERE promoter_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.role = 'admin')
);

-- 5. 코멘트 추가
COMMENT ON COLUMN animals.promoter_id IS '동물을 등록한 홍보자의 사용자 ID';
COMMENT ON COLUMN applications.applicant_id IS '입양을 신청한 사용자 ID (로그인한 경우)';
