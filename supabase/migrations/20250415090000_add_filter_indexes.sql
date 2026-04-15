-- 동물 필터 성능을 위한 인덱스 추가
-- 2025-04-15: 필터 기능 추가로 인한 인덱스 최적화

-- 필터에 자주 사용되는 필드에 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_animals_type ON animals(type);
CREATE INDEX IF NOT EXISTS idx_animals_size ON animals(size);
CREATE INDEX IF NOT EXISTS idx_animals_gender ON animals(gender);
CREATE INDEX IF NOT EXISTS idx_animals_adoption_status ON animals(adoption_status);
CREATE INDEX IF NOT EXISTS idx_animals_location ON animals(location);

-- 복합 인덱스: 가장 자주 함께 필터링되는 조합
-- (type + adoption_status) - "강아지 입양 가능" 같은 검색에 유용
CREATE INDEX IF NOT EXISTS idx_animals_type_status ON animals(type, adoption_status);

-- (location + adoption_status) - "서울 지역 입양 가능" 같은 검색에 유용
CREATE INDEX IF NOT EXISTS idx_animals_location_status ON animals(location, adoption_status);

COMMENT ON INDEX idx_animals_type IS '동물 종류 필터용 인덱스';
COMMENT ON INDEX idx_animals_size IS '크기 필터용 인덱스';
COMMENT ON INDEX idx_animals_gender IS '성별 필터용 인덱스';
COMMENT ON INDEX idx_animals_adoption_status IS '입양 상태 필터용 인덱스';
COMMENT ON INDEX idx_animals_location IS '지역 필터용 인덱스 (부분 일치 검색)';
