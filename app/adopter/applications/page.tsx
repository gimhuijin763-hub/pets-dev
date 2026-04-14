'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { getMyApplications } from '@/utils/supabase-storage'
import { ClipboardList, ArrowLeft, PawPrint } from 'lucide-react'

interface ApplicationWithAnimal {
  id: string
  animal_id: string
  applicant_name: string
  phone: string
  email: string
  reason: string
  status: string
  created_at: string
  animals: {
    id: string
    name: string
    type: string
    breed?: string
    image_url: string
    adoption_status: string
  } | null
}

export default function AdopterApplicationsPage() {
  const { user, loading } = useAuth({ requiredRole: 'adopter' })
  const [applications, setApplications] = useState<ApplicationWithAnimal[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    async function load() {
      setFetching(true)
      try {
        const result = await getMyApplications()
        if (result.error) {
          setError(result.error)
        } else {
          setApplications(result.data as ApplicationWithAnimal[])
        }
      } catch {
        setError('네트워크 오류가 발생했습니다.')
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [user])

  if (loading || !user) {
    return <p className="text-center py-20 text-sm text-slate-400">로딩 중...</p>
  }

  const statusColor: Record<string, string> = {
    '접수': 'bg-blue-50 text-blue-600',
    '검토 중': 'bg-yellow-50 text-yellow-600',
    '승인': 'bg-green-50 text-green-700',
    '거절': 'bg-red-50 text-red-600',
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link
        href="/adopter/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        대시보드로
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">내 입양 신청 내역</h1>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
      </div>

      {fetching ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card p-6 text-center text-slate-500">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="card p-12 text-center">
          <PawPrint className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">아직 제출한 입양 신청이 없습니다.</p>
          <Link href="/animals" className="btn-primary mt-5 inline-flex">
            입양 가능한 동물 보기
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="card p-4">
              <div className="flex gap-4 items-start">
                <img
                  src={app.animals?.image_url || ''}
                  alt={app.animals?.name || '동물'}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80'
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-bold text-slate-900">
                      {app.animals?.name ?? '(삭제된 동물)'}
                    </p>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[app.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {app.animals?.type}{app.animals?.breed ? ` · ${app.animals.breed}` : ''}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    신청일: {new Date(app.created_at).toLocaleDateString('ko-KR')}
                  </p>
                  {app.animals && (
                    <Link
                      href={`/animals/${app.animal_id}`}
                      className="text-xs text-brand-500 font-medium hover:underline mt-1 inline-block"
                    >
                      동물 페이지 보기 →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
