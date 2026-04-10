const BASE = 'http://localhost:3002/api/animals'

const imageMap = {
  'animal_1775775035118_ivdy1e4': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80', // 초코 - 푸들
  'animal_1775775035533_7bemzs3': 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&q=80', // 루나 - 러시안블루
  'animal_1775775035645_2hzxvq3': 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&q=80', // 콩이 - 비글
  'animal_1775775035942_dbm6rjt': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80', // 미미 - 페르시안
  'animal_1775775036209_g75z2s8': 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80', // 바둑이 - 진돗개
  'animal_1775775036322_h3n4yup': 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=800&q=80', // 치즈 - 스코티시폴드
  'animal_1775775036459_tjj5riw': 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&q=80', // 해피 - 골든리트리버
  'animal_1775775036558_im15fx0': 'https://images.unsplash.com/photo-1557246565-8a3d3ab5d7f6?w=800&q=80', // 까미 - 봄베이 (검은 고양이)
  'animal_1775775036666_q7tu07d': 'https://images.unsplash.com/photo-1637255885906-d09fd42b4032?w=800&q=80', // 몽이 - 말티즈
  'animal_1775775036774_4j9wvyw': 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=800&q=80', // 호랑이 - 벵갈
  'animal_1775775036877_q2rrgf0': 'https://images.unsplash.com/photo-1583337130417-13104dec14a3?w=800&q=80', // 두부 - 시바이누
  'animal_1775775036987_lwquqg0': 'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=800&q=80', // 별이 - 먼치킨
  'animal_1775775037086_q67fdaa': 'https://images.unsplash.com/photo-1587559070757-f72a388edbba?w=800&q=80', // 뽀삐 - 포메라니안
  'animal_1775775037203_ntasg21': 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&q=80', // 모카 - 아비시니안
}

let success = 0
for (const [id, url] of Object.entries(imageMap)) {
  try {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: url }),
    })
    if (res.ok) {
      success++
      console.log(`✓ ${id} 이미지 업데이트`)
    } else {
      const err = await res.json()
      console.log(`✗ ${id} 실패: ${err.error}`)
    }
  } catch (e) {
    console.log(`✗ ${id} 오류: ${e.message}`)
  }
}

console.log(`\n완료! ${success}/${Object.keys(imageMap).length}마리 이미지 업데이트됨`)
