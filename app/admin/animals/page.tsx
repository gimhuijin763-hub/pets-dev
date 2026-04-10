"use client"

import { useEffect, useState, useCallback } from 'react'
import { getAnimals, updateAnimalStatus, deleteAnimal, getApplications } from '@/utils/supabase-storage'
import { Animal, AdoptionStatus } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'

const ALL_STATUSES: AdoptionStatus[] = ['입양 가능', '검토 중', '입양 완료']

export default function AdminAnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [filterStatus, setFilterStatus] = useState<AdoptionStatus | '전체'>('전체')
  const [updating, setUpdating] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [appCounts, setAppCounts] = useState<Record<string, number>>({})

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getAnimals()
    setAnimals(data)

    const appsRes = await getApplications()
    if (appsRes.unauthorized) {
      setUnauthorized(true)
      setLoading(false)
      return
    }
    setUnauthorized(false)
    const counts: Record<string, number> = {}
    appsRes.data.forEach((app) => {
      counts[app.animal_id] = (counts[app.animal_id] || 0) + 1
    })
    setAppCounts(counts)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleStatusChange(id: string, status: AdoptionStatus) {
    setUpdating(id)
    const result = await updateAnimalStatus(id, status)
    if (result.unauthorized) {
      setUnauthorized(true)
      setUpdating(null)
      return
    }
    if (result.ok) {
      setAnimals((prev) => prev.map((a) => (a.id === id ? { ...a, adoption_status: status } : a)))
    }
    setUpdating(null)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" 동물을 정말 삭제하시겠습니까?\n관련된 입양 신청도 함께 삭제됩니다.`)) return
    setDeleting(id)
    const result = await deleteAnimal(id)
    if (result.unauthorized) {
      setUnauthorized(true)
      setDeleting(null)
      return
    }
    if (result.ok) {
      setAnimals((prev) => prev.filter((a) => a.id !== id))
    }
    setDeleting(null)
  }

  if (unauthorized) {
    return (
      <div className="max-w-sm mx-auto">
        <div className="card p-6 text-center">
          <h1 className="section-title">관리자 인증 필요</h1>
          <p className="text-sm text-slate-500 mt-2">
            동물 관리 기능은 관리자 로그인이 필요합니다.
          </p>
          <Link href="/admin/applications" className="btn-primary justify-center mt-4 inline-block">
            입양 신청 관리에서 로그인하기
          </Link>
        </div>
      </div>
    )
  }

  const filtered = filterStatus === '전체' ? animals : animals.filter((a) => a.adoption_status === filterStatus)

  const counts: Record<string, number> = { '전체': animals.length }
  ALL_STATUSES.forEach((s) => {
    counts[s] = animals.filter((a) => a.adoption_status === s).length
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">동물 관리</h1>
          <p className="text-xs text-slate-400 mt-1">등록된 동물의 상태를 관리하고 삭제할 수 있습니다.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="btn-secondary text-xs px-3 py-2">관리자 홈</Link>
          <button onClick={load} className="btn-secondary text-xs px-3 py-2">새로고침</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(['전체', ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`card p-3 text-left transition ${filterStatus === s ? 'ring-2 ring-brand-400' : 'hover:shadow-md'}`}
          >
            <p className="text-xs text-slate-500 mb-1">{s}</p>
            <p className="text-2xl font-extrabold text-slate-900">{counts[s] ?? 0}</p>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-16 text-sm text-slate-400">불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-sm">해당 상태의 동물이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((animal) => (
            <div key={animal.id} className={`card p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${deleting === animal.id ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3 shrink-0">
                {animal.image_url ? (
                  <img src={animal.image_url} alt={animal.name} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs">없음</div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 text-sm">{animal.name}</p>
                    <StatusBadge status={animal.adoption_status} type="adoption" />
                  </div>
                  <p className="text-xs text-slate-400">{animal.type} · {animal.age} · {animal.gender}</p>
                  {animal.location && <p className="text-xs text-slate-400">{animal.location}</p>}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 truncate">{animal.description}</p>
                <p className="text-xs text-slate-300 mt-1">
                  신청 {appCounts[animal.id] || 0}건
                  {animal.created_at && ` · ${new Date(animal.created_at).toLocaleDateString('ko-KR')}`}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div>
                  <label className="label text-xs mb-1">상태 변경</label>
                  <select
                    value={animal.adoption_status}
                    disabled={updating === animal.id}
                    onChange={(e) => handleStatusChange(animal.id, e.target.value as AdoptionStatus)}
                    className="input py-1.5 text-xs w-28 disabled:opacity-60"
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {updating === animal.id && <p className="text-xs text-brand-500 mt-1">저장 중...</p>}
                </div>
                <button
                  onClick={() => handleDelete(animal.id, animal.name)}
                  disabled={deleting === animal.id}
                  className="text-xs text-red-400 hover:text-red-600 mt-5 px-2 py-1 rounded hover:bg-red-50 transition"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
