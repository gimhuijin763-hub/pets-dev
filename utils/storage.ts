import { Animal, Application, ApplicationStatus } from '@/types';

const ANIMALS_KEY = 'ptes_animals';
const APPLICATIONS_KEY = 'ptes_applications';

const SEED_ANIMALS: Animal[] = [
  {
    id: 'a1',
    name: '호두',
    type: '개',
    age: '2살',
    gender: '남',
    description: '활발하고 사람을 좋아하는 골든 리트리버 믹스입니다. 다른 반려동물과도 잘 어울리며, 기본 훈련이 되어 있어요. 산책을 매우 즐기며 공놀이를 좋아합니다.',
    image_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
    adoption_status: '입양 가능',
  },
  {
    id: 'a2',
    name: '나비',
    type: '고양이',
    age: '3살',
    gender: '여',
    description: '독립적이지만 애교가 넘치는 코리안 숏헤어입니다. 조용한 환경을 좋아하며, 한 번 신뢰를 얻으면 끊임없이 곁에서 그루밍해주는 사랑스러운 아이입니다.',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
    adoption_status: '입양 가능',
  },
  {
    id: 'a3',
    name: '콩이',
    type: '개',
    age: '1살',
    gender: '남',
    description: '장난기 많고 에너지 넘치는 비글 믹스입니다. 냄새를 맡으며 탐험하는 것을 즐기고, 아이들과 놀기를 좋아합니다. 기초 훈련 진행 중입니다.',
    image_url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&q=80',
    adoption_status: '입양 가능',
  },
  {
    id: 'a4',
    name: '달이',
    type: '고양이',
    age: '5살',
    gender: '여',
    description: '차분하고 온화한 성격의 러시안 블루입니다. 혼자 있는 시간도 잘 보내며, 조용한 집에서 느긋하게 생활하기에 적합합니다. 건강 이상 없음.',
    image_url: 'https://images.unsplash.com/photo-1555685812-4b8f59697ef3?w=600&q=80',
    adoption_status: '입양 가능',
  },
  {
    id: 'a5',
    name: '뭉치',
    type: '개',
    age: '4살',
    gender: '남',
    description: '포메라니안 믹스로 작고 귀여운 외모에 완전히 반할 것입니다. 사람을 좋아하고 무릎 위에 앉아 있는 것을 즐깁니다. 실내 생활에 최적화된 아이에요.',
    image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80',
    adoption_status: '입양 가능',
  },
  {
    id: 'a6',
    name: '초코',
    type: '개',
    age: '6살',
    gender: '여',
    description: '라브라도 믹스로 차분하고 순종적인 성격입니다. 고령자 가정이나 조용한 가정에 잘 맞으며, 이미 기본 훈련이 완벽히 완료된 성숙한 아이입니다.',
    image_url: 'https://images.unsplash.com/photo-1593134257782-e89567b7718a?w=600&q=80',
    adoption_status: '입양 가능',
  },
];

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function getAnimals(): Animal[] {
  if (!isClient()) return [];
  const raw = localStorage.getItem(ANIMALS_KEY);
  if (!raw) {
    localStorage.setItem(ANIMALS_KEY, JSON.stringify(SEED_ANIMALS));
    return SEED_ANIMALS;
  }
  try {
    const parsed = JSON.parse(raw) as Animal[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(ANIMALS_KEY, JSON.stringify(SEED_ANIMALS));
      return SEED_ANIMALS;
    }

    const merged = parsed.map((animal) => {
      const seed = SEED_ANIMALS.find((item) => item.id === animal.id);
      const fallbackUrl = seed?.image_url || '';
      const candidateUrl =
        animal.image_url ||
        (animal as Partial<Animal> & { imageUrl?: string; image?: string }).imageUrl ||
        (animal as Partial<Animal> & { image?: string }).image ||
        fallbackUrl;

      return {
        ...seed,
        ...animal,
        image_url: candidateUrl,
      } as Animal;
    });

    localStorage.setItem(ANIMALS_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return SEED_ANIMALS;
  }
}

export function getAnimalById(id: string): Animal | undefined {
  return getAnimals().find((a) => a.id === id);
}

export function getApplications(): Application[] {
  if (!isClient()) return [];
  const raw = localStorage.getItem(APPLICATIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Application[];
  } catch {
    return [];
  }
}

export function getApplicationsByAnimalId(animalId: string): Application[] {
  return getApplications().filter((a) => a.animal_id === animalId);
}

export function addApplication(
  data: Omit<Application, 'id' | 'status' | 'created_at'>
): Application {
  const list = getApplications();
  const newApp: Application = {
    ...data,
    id: `app_${Date.now()}`,
    status: '접수',
    created_at: new Date().toISOString(),
  };
  list.push(newApp);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(list));
  return newApp;
}

export function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): void {
  const list = getApplications();
  const idx = list.findIndex((a) => a.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(list));
  }
}
