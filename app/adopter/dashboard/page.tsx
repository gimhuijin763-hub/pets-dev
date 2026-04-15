"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, LogOut, Search, ClipboardList, UserCog } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function AdopterDashboardPage() {
  const { user, loading, signOut } = useAuth({ requiredRole: 'adopter' })
  const router = useRouter()

  async function handleLogout() {
    await signOut()
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
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900">{user.display_name}님, 환영합니다!</h1>
              <p className="text-xs text-slate-400">입양 희망자 대시보드</p>
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
            <span className="font-semibold">역할:</span> 입양 희망자
          </p>
          {user.phone && (
            <p className="text-sm text-slate-600 mt-1">
              <span className="font-semibold">연락처:</span> {user.phone}
            </p>
          )}
        </div>

        <div className="grid gap-3">
          <Link href="/animals" className="btn-primary justify-center gap-2">
            <Search className="w-4 h-4" />
            입양 가능한 동물 보기
          </Link>
          <Link href="/adopter/applications" className="btn-secondary justify-center gap-2">
            <ClipboardList className="w-4 h-4" />
            내 입양 신청 내역
          </Link>
          <Link href="/adopter/profile" className="btn-secondary justify-center gap-2">
            <UserCog className="w-4 h-4" />
            내 정보 수정
          </Link>
        </div>
      </div>
    </div>
  )
}
