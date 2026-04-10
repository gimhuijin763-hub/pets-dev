"use client"

import { useEffect, useState, useCallback } from 'react'
import { getApplications, getAnimals } from '@/utils/supabase-storage'
import { Application, Animal, ApplicationStatus } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'

interface Applicant {
  name: string
  email: string
  phone: string
  applications: (Application & { animalName?: string })[]
}

export default function AdminUsersPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [unauthorized, setUnauthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)

    const appsRes = await getApplications()
    if (appsRes.unauthorized) {
      setUnauthorized(true)
      setLoading(false)
      return
    }
    setUnauthorized(false)

    const animalList = await getAnimals()
    const animalMap: Record<string, Animal> = {}
    animalList.forEach((a) => { animalMap[a.id] = a })

    const grouped: Record<string, Applicant> = {}
    appsRes.data.forEach((app) => {
      const key = app.email
      if (!grouped[key]) {
        grouped[key] = {
          name: app.applicant_name,
          email: app.email,
          phone: app.phone,
          applications: [],
        }
      }
      grouped[key].applications.push({
        ...app,
        animalName: animalMap[app.animal_id]?.name,
      })
    })

    const sorted = Object.values(grouped).sort(
      (a, b) => b.applications.length - a.applications.length
    )
    setApplicants(sorted)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (unauthorized) {
    return (
      <div className="max-w-sm mx-auto">
        <div className="card p-6 text-center">
          <h1 className="section-title">관리자 인증 필요</h1>
          <p className="text-sm text-slate-500 mt-2">
            사용자 관리 기능은 관리자 로그인이 필요합니다.
          </p>
          <Link href="/admin/applications" className="btn-primary justify-center mt-4 inline-block">
            입양 신청 관리에서 로그인하기
          </Link>
        </div>
      </div>
    )
  }

  const totalApps = applicants.reduce((sum, a) => sum + a.applications.length, 0)

  const statusCounts: Record<ApplicationStatus, number> = { '접수': 0, '검토 중': 0, '승인': 0, '거절': 0 }
  applicants.forEach((a) => {
    a.applications.forEach((app) => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1
    })
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">사용자 관리</h1>
          <p className="text-xs text-slate-400 mt-1">입양 신청자 목록과 신청 현황을 확인할 수 있습니다.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="btn-secondary text-xs px-3 py-2">관리자 홈</Link>
          <button onClick={load} className="btn-secondary text-xs px-3 py-2">새로고침</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="card p-3">
          <p className="text-xs text-slate-500 mb-1">총 신청자</p>
          <p className="text-2xl font-extrabold text-slate-900">{applicants.length}</p>
        </div>
        <div className="card p-3">
          <p className="text-xs text-slate-500 mb-1">총 신청 건수</p>
          <p className="text-2xl font-extrabold text-slate-900">{totalApps}</p>
        </div>
        <div className="card p-3">
          <p className="text-xs text-slate-500 mb-1">승인</p>
          <p className="text-2xl font-extrabold text-green-600">{statusCounts['승인']}</p>
        </div>
        <div className="card p-3">
          <p className="text-xs text-slate-500 mb-1">대기 (접수+검토)</p>
          <p className="text-2xl font-extrabold text-amber-600">{statusCounts['접수'] + statusCounts['검토 중']}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-16 text-sm text-slate-400">불러오는 중...</p>
      ) : applicants.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-sm">아직 입양 신청자가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applicants.map((person) => {
            const isExpanded = expandedEmail === person.email
            return (
              <div key={person.email} className="card overflow-hidden">
                <button
                  onClick={() => setExpandedEmail(isExpanded ? null : person.email)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{person.name}</p>
                      <p className="text-xs text-slate-400">{person.email} · {person.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      신청 {person.applications.length}건
                    </span>
                    <span className={`text-slate-400 text-xs transition ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-2">
                    {person.applications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {app.animalName || '(알 수 없음)'}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-xs">{app.reason}</p>
                          <p className="text-xs text-slate-300 mt-0.5">
                            {new Date(app.created_at).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                        <StatusBadge status={app.status} type="application" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
