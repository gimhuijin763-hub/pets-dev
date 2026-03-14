'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PawPrint } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const isAnimals = pathname === '/animals' || pathname?.startsWith('/animals/')

  return (
    <header className="h-16 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-brand-500 font-extrabold text-xl tracking-tight hover:opacity-80 transition">
          <PawPrint className="w-6 h-6" />
          ptes
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
        </nav>
      </div>
    </header>
  )
}
