-- animals 테이블 생성
CREATE TABLE IF NOT EXISTS animals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  age TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('남', '여')),
  description TEXT,
  image_url TEXT,
  adoption_status TEXT NOT NULL CHECK (adoption_status IN ('입양 가능', '입양 완료', '검토 중')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- applications 테이블 생성
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  animal_id TEXT REFERENCES animals(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('접수', '검토 중', '승인', '거절')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_animals_type ON animals(type);
CREATE INDEX IF NOT EXISTS idx_animals_adoption_status ON animals(adoption_status);
CREATE INDEX IF NOT EXISTS idx_applications_animal_id ON applications(animal_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- animals 테이블 정책: 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read animals" ON animals
  FOR SELECT USING (true);

-- applications 테이블 정책: 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read applications" ON applications
  FOR SELECT USING (true);

-- applications 테이블 정책: 모든 사용자가 생성 가능
CREATE POLICY "Anyone can insert applications" ON applications
  FOR INSERT WITH CHECK (true);

-- applications 테이블 정책: 모든 사용자가 업데이트 가능 (MVP용, 추후 관리자 권한으로 제한)
CREATE POLICY "Anyone can update applications" ON applications
  FOR UPDATE USING (true);
