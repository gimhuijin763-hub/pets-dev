const BASE = 'http://localhost:3002/api/animals'

// 먼저 현재 동물 수 확인
const existing = await fetch(BASE).then(r => r.json())
const currentCount = existing.data?.length ?? 0
console.log(`현재 동물 수: ${currentCount}`)

const needed = 20 - currentCount
if (needed <= 0) {
  console.log('이미 20마리 이상입니다. 추가 불필요.')
  process.exit(0)
}

console.log(`${needed}마리 추가 시작...`)

const animals = [
  { name: '초코', type: '개', breed: '푸들', age: '3살', gender: '남', size: '소형', location: '서울 강남 보호소', description: '활발하고 사람을 잘 따르는 초코색 푸들입니다. 산책을 무척 좋아합니다.', adoption_status: '입양 가능' },
  { name: '루나', type: '고양이', breed: '러시안블루', age: '2살', gender: '여', size: '소형', location: '서울 마포 보호소', description: '조용하고 온순한 성격의 러시안블루입니다. 실내 생활에 잘 적응합니다.', adoption_status: '입양 가능' },
  { name: '콩이', type: '개', breed: '비글', age: '1살', gender: '남', size: '중형', location: '경기 수원 보호소', description: '호기심이 많고 에너지가 넘치는 비글 강아지입니다. 놀기를 좋아해요.', adoption_status: '입양 가능' },
  { name: '미미', type: '고양이', breed: '페르시안', age: '4살', gender: '여', size: '소형', location: '부산 해운대 보호소', description: '부드러운 털과 온화한 성격을 가진 페르시안 고양이입니다. 무릎 위를 좋아해요.', adoption_status: '검토 중' },
  { name: '바둑이', type: '개', breed: '진돗개', age: '5살', gender: '남', size: '대형', location: '전남 진도 보호소', description: '충성스럽고 영리한 진돗개입니다. 넓은 마당이 있는 가정에 적합합니다.', adoption_status: '입양 가능' },
  { name: '치즈', type: '고양이', breed: '스코티시폴드', age: '1살', gender: '여', size: '소형', location: '인천 남동 보호소', description: '귀여운 접힌 귀를 가진 스코티시폴드입니다. 장난감을 가지고 노는 걸 좋아해요.', adoption_status: '입양 가능' },
  { name: '해피', type: '개', breed: '골든리트리버', age: '2살', gender: '남', size: '대형', location: '대전 유성 보호소', description: '밝고 친근한 골든리트리버입니다. 아이들과 잘 어울리며 훈련도 잘 받아요.', adoption_status: '입양 가능' },
  { name: '까미', type: '고양이', breed: '봄베이', age: '3살', gender: '남', size: '소형', location: '광주 북구 보호소', description: '까만 털이 윤기나는 봄베이 고양이입니다. 사람을 잘 따르고 애교가 많아요.', adoption_status: '검토 중' },
  { name: '몽이', type: '개', breed: '말티즈', age: '6살', gender: '여', size: '소형', location: '서울 송파 보호소', description: '하얀 솜뭉치 같은 말티즈입니다. 차분하고 실내 생활에 완벽히 적응되어 있어요.', adoption_status: '입양 완료' },
  { name: '호랑이', type: '고양이', breed: '벵갈', age: '2살', gender: '남', size: '중형', location: '경기 성남 보호소', description: '야생미 넘치는 외모의 벵갈 고양이입니다. 활동적이고 높은 곳을 좋아해요.', adoption_status: '입양 가능' },
  { name: '두부', type: '개', breed: '시바이누', age: '1살', gender: '남', size: '중형', location: '서울 강서 보호소', description: '독립적이면서도 주인에게 충실한 시바이누입니다. 표정이 아주 풍부해요.', adoption_status: '입양 가능' },
  { name: '별이', type: '고양이', breed: '먼치킨', age: '1살', gender: '여', size: '소형', location: '대구 수성 보호소', description: '짧은 다리로 깡충깡충 뛰어다니는 먼치킨입니다. 호기심이 많고 활발해요.', adoption_status: '입양 가능' },
  { name: '뽀삐', type: '개', breed: '포메라니안', age: '4살', gender: '여', size: '소형', location: '울산 남구 보호소', description: '풍성한 털이 매력적인 포메라니안입니다. 사람들의 관심을 좋아하며 밝은 성격이에요.', adoption_status: '검토 중' },
  { name: '모카', type: '고양이', breed: '아비시니안', age: '3살', gender: '남', size: '중형', location: '제주 제주시 보호소', description: '날씬하고 민첩한 아비시니안 고양이입니다. 탐험을 좋아하고 영리합니다.', adoption_status: '입양 가능' },
  { name: '보리', type: '개', breed: '코카스파니엘', age: '2살', gender: '남', size: '중형', location: '경기 고양 보호소', description: '긴 귀가 매력적인 코카스파니엘입니다. 온순하고 가족과 함께하는 시간을 좋아해요.', adoption_status: '입양 가능' },
  { name: '나래', type: '고양이', breed: '터키시앙고라', age: '5살', gender: '여', size: '소형', location: '충남 천안 보호소', description: '우아한 하얀 털을 가진 터키시앙고라입니다. 조용한 환경에서 잘 지내요.', adoption_status: '입양 완료' },
  { name: '탱고', type: '개', breed: '웰시코기', age: '1살', gender: '남', size: '중형', location: '서울 용산 보호소', description: '짧은 다리로 신나게 뛰어다니는 웰시코기입니다. 먹는 걸 무척 좋아해요.', adoption_status: '입양 가능' },
  { name: '구름', type: '고양이', breed: '래그돌', age: '2살', gender: '여', size: '중형', location: '경기 용인 보호소', description: '안기는 것을 좋아하는 래그돌 고양이입니다. 눈이 아주 파랗고 성격이 온순해요.', adoption_status: '입양 가능' },
  { name: '마루', type: '개', breed: '사모예드', age: '3살', gender: '남', size: '대형', location: '강원 춘천 보호소', description: '하얀 솜사탕 같은 사모예드입니다. 항상 웃는 표정으로 주변을 밝게 해줘요.', adoption_status: '입양 가능' },
  { name: '달이', type: '고양이', breed: '샴', age: '4살', gender: '여', size: '소형', location: '부산 사하 보호소', description: '수다쟁이 샴 고양이입니다. 주인에게 말을 많이 걸고 애교가 넘칩니다.', adoption_status: '검토 중' },
]

// needed 만큼만 추가
const toAdd = animals.slice(0, needed)

let success = 0
for (const animal of toAdd) {
  try {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(animal),
    })
    if (res.ok) {
      success++
      console.log(`✓ ${animal.name} 등록 완료`)
    } else {
      const err = await res.json()
      console.log(`✗ ${animal.name} 실패: ${err.error}`)
    }
  } catch (e) {
    console.log(`✗ ${animal.name} 오류: ${e.message}`)
  }
}

// 최종 확인
const final = await fetch(BASE).then(r => r.json())
console.log(`\n완료! 총 동물 수: ${final.data?.length ?? 0}마리 (${success}마리 추가됨)`)
