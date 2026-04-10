'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { PawPrint, LogOut } from 'lucide-react'
import { getCurrentUser, logout as authLogout, type AuthUser } from '@/utils/auth'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = pathname?.startsWith('/admin')
  const isAnimals = pathname === '/animals' || pathname?.startsWith('/animals/')

  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [pathname])

  function handleLogout() {
    authLogout()
    setUser(null)
    router.push('/')
  }

  return (
    <header className="h-16 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-brand-500 font-extrabold text-xl tracking-tight hover:opacity-80 transition">
          <PawPrint className="w-6 h-6" />
          Pets
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/animals"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
              isAnimals ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            동물 목록
          </Link>
          <Link
            href="/admin"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
              isAdmin ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            관리자
          </Link>

          {user ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <span className="text-xs text-slate-500">{user.display_name}</span>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition" title="로그아웃">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">
                로그인
              </Link>
              <Link href="/signup" className="text-sm font-medium text-white bg-brand-500 px-3 py-1.5 rounded-lg hover:bg-brand-600 transition">
                가입
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
