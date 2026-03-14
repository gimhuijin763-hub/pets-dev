import { Animal, Application, ApplicationStatus } from '@/types';

export interface ApplicationsResponse {
  data: Application[]
  unauthorized: boolean
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
  return data ?? []
}

// ID로 특정 동물 조회
export async function getAnimalById(id: string): Promise<Animal | null> {
  const response = await fetch(`/api/animals/${id}`, { cache: 'no-store' })
  const data = await handleResponse<Animal>(response)
  return data ?? null
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
): Promise<Application | null> {
  const response = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicationData),
  })
  const data = await handleResponse<Application>(response)
  return data ?? null
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
