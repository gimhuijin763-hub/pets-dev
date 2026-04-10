"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Megaphone, LogOut, PawPrint, PlusCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { logout } from '@/utils/auth'

export default function PromoterDashboardPage() {
  const { user, loading } = useAuth({ requiredRole: 'promoter' })
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push('/')
  }

  if (loading || !user) {
    return <p className="text-center py-20 text-sm text-slate-400">로딩 중...</p>
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900">{user.display_name}님, 환영합니다!</h1>
              <p className="text-xs text-slate-400">홍보 담당자 대시보드</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary text-xs px-3 py-2 gap-1.5">
            <LogOut className="w-3.5 h-3.5" />
            로그아웃
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-sm text-slate-600">
            <span className="font-semibold">이메일:</span> {user.email}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            <span className="font-semibold">역할:</span> 홍보 담당자
          </p>
          {user.phone && (
            <p className="text-sm text-slate-600 mt-1">
              <span className="font-semibold">연락처:</span> {user.phone}
            </p>
          )}
        </div>

        <div className="grid gap-3">
          <Link href="/promoter/animals" className="btn-primary justify-center gap-2">
            <PawPrint className="w-4 h-4" />
            등록 동물 관리
          </Link>
          <Link href="/promoter/animals/new" className="btn-secondary justify-center gap-2">
            <PlusCircle className="w-4 h-4" />
            새 동물 등록
          </Link>
        </div>
      </div>
    </div>
  )
}
