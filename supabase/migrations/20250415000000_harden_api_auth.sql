-- API 인증 강화 마이그레이션
-- 2025-04-15: 입양 신청 인증 필수로 변경 및 RLS 정책 강화

-- 1. Applications 테이블 INSERT 정책 변경: 인증된 사용자만 가능
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Anyone can insert applications" ON applications;

-- 새 정책: 인증된 사용자만 신청 가능 (applicant_id 필수)
CREATE POLICY "Authenticated users can insert applications"
ON applications FOR INSERT
TO authenticated
WITH CHECK (
  -- applicant_id가 현재 사용자 ID와 일치해야 함
  applicant_id = auth.uid()
);

-- 2. applications 테이블에 applicant_id NOT NULL 제약 추가 (선택사항, 단계적 적용 권장)
-- 참고: 기존 데이터가 NULL인 경우 먼저 마이그레이션 필요
-- ALTER TABLE applications ALTER COLUMN applicant_id SET NOT NULL;

-- 3. 추가 성능 최적화 인덱스
CREATE INDEX IF NOT EXISTS idx_applications_animal_id ON applications(animal_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- 4. animals 테이블 RLS 정책 검증 (이미 설정되어 있어야 함)
-- 동물 등록 시 promoter_id가 현재 사용자와 일치하도록 강화
DROP POLICY IF EXISTS "Authenticated users can insert animals" ON animals;

CREATE POLICY "Authenticated users can insert animals"
ON animals FOR INSERT
TO authenticated
WITH CHECK (
  -- promoter_id가 현재 사용자 ID와 일치해야 함 (자기 자신만 등록)
  promoter_id = auth.uid()
);

-- 5. 코멘트 업데이트
COMMENT ON COLUMN animals.promoter_id IS '동물을 등록한 홍보자의 사용자 ID (RLS: 자기 자신만 등록, 수정, 삭제 가능)';
COMMENT ON COLUMN applications.applicant_id IS '입양을 신청한 사용자 ID (RLS: 인증된 사용자만 신청, 본인 신청만 조회 가능)';
