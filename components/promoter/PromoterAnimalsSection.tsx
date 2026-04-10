'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getAnimals } from '@/utils/supabase-storage'
import type { Animal, ApplicationStatus } from '@/types'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

interface Application {
  id: string
  applicant_name: string
  phone: string
  email: string
  reason: string
  status: ApplicationStatus
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  '접수': 'bg-blue-50 text-blue-600',
  '검토 중': 'bg-yellow-50 text-yellow-600',
  '승인': 'bg-green-50 text-green-700',
  '거절': 'bg-red-50 text-red-600',
}

function AnimalRow({ animal }: { animal: Animal }) {
  const [open, setOpen] = useState(false)
  const [applications, setApplications] = useState<Application[]>([])
  const [fetching, setFetching] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function loadApplications() {
    if (applications.length > 0) return
    setFetching(true)
    try {
      const res = await fetch(`/api/animals/${animal.id}/applications`)
      const payload = await res.json()
      setApplications(payload.data ?? [])
    } finally {
      setFetching(false)
    }
  }

  function toggle() {
    if (!open) loadApplications()
    setOpen((v) => !v)
  }

  async function updateStatus(appId: string, status: ApplicationStatus) {
    setUpdatingId(appId)
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status } : a))
        )
      }
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 px-2 rounded-lg transition"
      >
        <div>
          <p className="text-sm font-semibold text-slate-800">{animal.name}</p>
          <p className="text-xs text-slate-500">
            {animal.type} · {animal.age} · {animal.gender}
            {animal.location ? ` · ${animal.location}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            animal.adoption_status === '입양 가능'
              ? 'bg-green-100 text-green-700'
              : animal.adoption_status === '검토 중'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {animal.adoption_status}
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="mx-2 mb-3 rounded-xl bg-slate-50 p-4">
          {fetching ? (
            <p className="text-xs text-slate-400 text-center py-4">신청 목록 불러오는 중...</p>
          ) : applications.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">아직 접수된 신청이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 mb-2">신청자 목록 ({applications.length}건)</p>
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-xl p-3 border border-slate-100">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{app.applicant_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{app.email} · {app.phone}</p>
                      <p className="text-xs text-slate-400 mt-1">신청일: {new Date(app.created_at).toLocaleDateString('ko-KR')}</p>
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 rounded p-2 leading-relaxed">{app.reason}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLORS[app.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {app.status}
                    </span>
                  </div>
                  {app.status !== '승인' && app.status !== '거절' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        disabled={updatingId === app.id}
                        onClick={() => updateStatus(app.id, '승인')}
                        className="flex-1 text-xs font-semibold bg-green-500 text-white rounded-lg py-1.5 hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {updatingId === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        승인
                      </button>
                      <button
                        disabled={updatingId === app.id}
                        onClick={() => updateStatus(app.id, '거절')}
                        className="flex-1 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-lg py-1.5 hover:bg-red-100 transition disabled:opacity-50"
                      >
                        거절
                      </button>
                      {app.status === '접수' && (
                        <button
                          disabled={updatingId === app.id}
                          onClick={() => updateStatus(app.id, '검토 중')}
                          className="flex-1 text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg py-1.5 hover:bg-yellow-100 transition disabled:opacity-50"
                        >
                          검토 중
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function PromoterAnimalsSection() {
  const searchParams = useSearchParams()
  const justCreated = searchParams.get('created') === 'true'

  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [showBanner, setShowBanner] = useState(justCreated)

  useEffect(() => {
    getAnimals().then((data) => {
      setAnimals(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => setShowBanner(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showBanner])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {showBanner && (
        <div className="card border-green-200 bg-green-50 p-4 flex items-center justify-between">
          <p className="text-sm text-green-700 font-medium">새 동물이 등록되었습니다!</p>
          <button onClick={() => setShowBanner(false)} className="text-green-500 hover:text-green-700 text-xs">닫기</button>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="section-title">등록 동물 관리</h1>
          <p className="text-sm text-slate-500 mt-2">
            동물 이름을 클릭하면 신청자 목록과 처리 현황을 확인할 수 있습니다.
          </p>
        </div>
        <Link href="/promoter/animals/new" className="btn-primary justify-center">
          새 동물 등록하기
        </Link>
      </div>

      <div className="card p-4">
        {loading ? (
          <p className="text-center py-10 text-sm text-slate-400">목록을 불러오는 중...</p>
        ) : animals.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm font-semibold">아직 등록된 동물이 없습니다.</p>
            <p className="text-xs text-slate-400 mt-2">새 동물을 등록하면 이곳에 목록이 표시됩니다.</p>
          </div>
        ) : (
          <div>
            {animals.map((animal) => (
              <AnimalRow key={animal.id} animal={animal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
