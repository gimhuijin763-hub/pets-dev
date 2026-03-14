-- 기존 정책 정리
DROP POLICY IF EXISTS "Anyone can read animals" ON animals;
DROP POLICY IF EXISTS "Anyone can read applications" ON applications;
DROP POLICY IF EXISTS "Anyone can insert applications" ON applications;
DROP POLICY IF EXISTS "Anyone can update applications" ON applications;

-- animals 테이블: 공개 읽기 허용
CREATE POLICY "Public read animals" ON animals
  FOR SELECT USING (true);

-- applications 테이블: 공개 insert 허용 (신청서 제출)
CREATE POLICY "Public insert applications" ON applications
  FOR INSERT WITH CHECK (true);
