'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeft, CheckCircle, User } from 'lucide-react'

export default function AdopterProfilePage() {
  const { user, loading } = useAuth({ requiredRole: 'adopter' })
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  if (!loading && user && !initialized) {
    setDisplayName(user.display_name)
    setPhone(user.phone || '')
    setInitialized(true)
  }

  if (loading || !user) {
    return <p className="text-center py-20 text-sm text-slate-400">로딩 중...</p>
  }

  function handleSave() {
    setError(null)
    if (!displayName.trim()) {
      setError('이름을 입력해 주세요.')
      return
    }
    if (phone && !/^[0-9\-+\s]{9,13}$/.test(phone.trim())) {
      setError('올바른 연락처를 입력해 주세요.')
      return
    }
    try {
      const USERS_KEY = 'pets_users'
      const SESSION_KEY = 'auth_user'
      const raw = localStorage.getItem(USERS_KEY)
      const users = raw ? JSON.parse(raw) : []
      const currentUser = user!
      const updated = users.map((u: { id: string }) =>
        u.id === currentUser.id
          ? { ...u, display_name: displayName.trim(), phone: phone.trim() || undefined }
          : u
      )
      localStorage.setItem(USERS_KEY, JSON.stringify(updated))
      const newUser = { ...currentUser, display_name: displayName.trim(), phone: phone.trim() || undefined }
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('저장 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <Link
        href="/adopter/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        대시보드로
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">내 정보 수정</h1>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
      </div>

      <div className="card p-6 space-y-5">
        <div>
          <label className="label">이메일</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="input bg-slate-50 text-slate-400 cursor-default"
          />
          <p className="text-xs text-slate-400 mt-1">이메일은 변경할 수 없습니다.</p>
        </div>

        <div>
          <label className="label">이름 <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="홍길동"
            className="input"
          />
        </div>

        <div>
          <label className="label">연락처</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            className="input"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {saved && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            저장되었습니다.
          </div>
        )}

        <button onClick={handleSave} className="btn-primary w-full justify-center">
          저장하기
        </button>
      </div>
    </div>
  )
}
