import { Animal, Application, ApplicationStatus } from '@/types';

export interface ApplicationsResponse {
  data: Application[]
  unauthorized: boolean
}

export interface ApiResult<T> {
  ok: boolean
  data: T | null
  error: string | null
  status: number
}

const NABI_LOCAL_IMAGE = '/images/animals/nabi.jpg'
const BROKEN_NABI_IMAGE = 'https://images.unsplash.com/photo-1573865526739-10c1dd7e0b3e?w=1200&q=80'

function normalizeAnimalImage(animal: Animal): Animal {
  if (animal.name !== '나비') {
    return animal
  }

  if (!animal.image_url || animal.image_url === BROKEN_NABI_IMAGE) {
    return { ...animal, image_url: NABI_LOCAL_IMAGE }
  }

  return animal
}

async function handleResponse<T>(response: Response): Promise<T | null> {
  if (!response.ok) {
    return null
  }
  const payload = (await response.json()) as { data?: T }
  return payload.data ?? null
}

// 동물 목록 조회
export async function getAnimals(): Promise<Animal[]> {
  const response = await fetch('/api/animals', { cache: 'no-store' })
  const data = await handleResponse<Animal[]>(response)
  return (data ?? []).map(normalizeAnimalImage)
}

// ID로 특정 동물 조회
export async function getAnimalById(id: string): Promise<Animal | null> {
  const response = await fetch(`/api/animals/${id}`, { cache: 'no-store' })
  const data = await handleResponse<Animal>(response)
  return data ? normalizeAnimalImage(data) : null
}

// 동물 등록
export async function createAnimal(
  animalData: {
    name: string
    type: string
    breed?: string
    age: string
    gender: string
    size?: string
    location: string
    description: string
    adoption_status: string
  }
): Promise<ApiResult<Animal>> {
  const response = await fetch('/api/animals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(animalData),
  })
  const payload = (await response.json().catch(() => null)) as { data?: Animal; error?: string } | null
  return {
    ok: response.ok,
    data: payload?.data ?? null,
    error: payload?.error ?? null,
    status: response.status,
  }
}

// 동물 입양 상태 변경 (관리자 전용)
export async function updateAnimalStatus(
  id: string,
  adoption_status: string
): Promise<{ ok: boolean; unauthorized: boolean }> {
  const response = await fetch(`/api/animals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ adoption_status }),
  })
  if (response.status === 401) {
    return { ok: false, unauthorized: true }
  }
  return { ok: response.ok, unauthorized: false }
}

// 동물 삭제 (관리자 전용)
export async function deleteAnimal(
  id: string
): Promise<{ ok: boolean; unauthorized: boolean }> {
  const response = await fetch(`/api/animals/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (response.status === 401) {
    return { ok: false, unauthorized: true }
  }
  return { ok: response.ok, unauthorized: false }
}

// 신청 목록 조회 (관리자 전용)
export async function getApplications(): Promise<ApplicationsResponse> {
  const response = await fetch('/api/applications', {
    cache: 'no-store',
    credentials: 'include',
  })
  if (response.status === 401) {
    return { data: [], unauthorized: true }
  }
  const data = await handleResponse<Application[]>(response)
  return { data: data ?? [], unauthorized: false }
}

// 특정 동물의 신청 건수 조회
export async function getApplicationsCountByAnimalId(animalId: string): Promise<number> {
  const response = await fetch(`/api/animals/${animalId}/applications/count`, { cache: 'no-store' })
  if (!response.ok) {
    return 0
  }
  const payload = (await response.json()) as { count?: number }
  return payload.count ?? 0
}

// 신청 추가
export async function addApplication(
  applicationData: Omit<Application, 'id' | 'status' | 'created_at'>
): Promise<ApiResult<Application>> {
  const response = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicationData),
  })
  const payload = (await response.json().catch(() => null)) as { data?: Application; error?: string } | null
  return {
    ok: response.ok,
    data: payload?.data ?? null,
    error: payload?.error ?? null,
    status: response.status,
  }
}

// 신청 상태 업데이트 (관리자 전용)
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<{ ok: boolean; unauthorized: boolean }> {
  const response = await fetch(`/api/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  })
  if (response.status === 401) {
    return { ok: false, unauthorized: true }
  }
  return { ok: response.ok, unauthorized: false }
}
