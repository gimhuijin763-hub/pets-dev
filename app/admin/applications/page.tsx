"use client"

import { useEffect, useState, useCallback } from 'react'
import { getApplications, getAnimals, updateApplicationStatus } from '@/utils/supabase-storage'
import { Application, Animal, ApplicationStatus } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import { ClipboardList, RefreshCw } from 'lucide-react'

const ALL_STATUSES: ApplicationStatus[] = ['접수', '검토 중', '승인', '거절']

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [animals, setAnimals] = useState<Record<string, Animal>>({})
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | '전체'>('전체')
  const [updating, setUpdating] = useState<string | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const load = useCallback(async () => {
    const appsResponse = await getApplications()
    if (appsResponse.unauthorized) {
      setUnauthorized(true)
      setApplications([])
      return
    }

    setUnauthorized(false)
    const sortedApps = [...appsResponse.data].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    setApplications(sortedApps)

    const animalMap: Record<string, Animal> = {}
    const animalList = await getAnimals()
    animalList.forEach((a) => {
      animalMap[a.id] = a
    })
    setAnimals(animalMap)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleStatusChange(appId: string, status: ApplicationStatus) {
    setUpdating(appId)
    const result = await updateApplicationStatus(appId, status)
    if (result.unauthorized) {
      setUnauthorized(true)
      setUpdating(null)
      return
    }
    if (result.ok) {
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)))
    }
    setUpdating(null)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      setLoginError(payload?.error ?? '로그인에 실패했습니다.')
      setLoginLoading(false)
      return
    }

    setPassword('')
    setLoginLoading(false)
    await load()
  }

  async function handleLogout() {
    setLogoutLoading(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    setUnauthorized(true)
    setApplications([])
    setLogoutLoading(false)
  }

  const filtered =
    filterStatus === '전체'
      ? applications
      : applications.filter((a) => a.status === filterStatus)

  const counts: Record<string, number> = { 전체: applications.length }
  ALL_STATUSES.forEach((s) => {
    counts[s] = applications.filter((a) => a.status === s).length
  })

  if (unauthorized) {
    return (
      <div className="max-w-sm mx-auto">
        <div className="card p-6">
          <h1 className="section-title">관리자 로그인</h1>
          <p className="text-sm text-slate-500 mt-2">
            관리자 비밀번호를 입력해야 신청 내역을 확인할 수 있습니다.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-password" className="label">
                비밀번호
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="관리자 비밀번호"
              />
            </div>
            {loginError && <p className="text-sm text-red-500">{loginError}</p>}
            <button
              type="submit"
              className="btn-primary w-full justify-center"
              disabled={loginLoading}
            >
              {loginLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-brand-500" />
          <h1 className="section-title">입양 신청 관리</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="btn-secondary text-xs px-3 py-2"
            disabled={logoutLoading}
          >
            {logoutLoading ? '로그아웃 중...' : '로그아웃'}
          </button>
          <button onClick={load} className="btn-secondary gap-1.5 text-xs px-3 py-2">
            <RefreshCw className="w-3.5 h-3.5" />
            새로고침
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {(['전체', ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`card p-3 text-left transition ${
              filterStatus === s ? 'ring-2 ring-brand-400' : 'hover:shadow-md'
            }`}
          >
            <p className="text-xs text-slate-500 mb-1">{s}</p>
            <p className="text-2xl font-extrabold text-slate-900">{counts[s] ?? 0}</p>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>신청 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const animal = animals[app.animal_id]
            return (
              <div key={app.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                {animal && (
                  <div className="flex items-center gap-3 shrink-0">
                    <img
                      src={animal.image_url}
                      alt={animal.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{animal.name}</p>
                      <p className="text-xs text-slate-400">{animal.type} · {animal.age}</p>
                    </div>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-slate-800 text-sm">{app.applicant_name}</p>
                    <StatusBadge status={app.status} type="application" />
                  </div>
                  <p className="text-xs text-slate-400">{app.phone} · {app.email}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">{app.reason}</p>
                  <p className="text-xs text-slate-300 mt-1">
                    {new Date(app.created_at).toLocaleString('ko-KR')}
                  </p>
                </div>

                <div className="shrink-0">
                  <label className="label text-xs mb-1">상태 변경</label>
                  <select
                    value={app.status}
                    disabled={updating === app.id}
                    onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                    className="input py-1.5 text-xs w-32 disabled:opacity-60"
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {updating === app.id && (
                    <p className="text-xs text-brand-500 mt-1">저장 중...</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
