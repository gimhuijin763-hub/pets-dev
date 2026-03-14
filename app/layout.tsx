import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'ptes — 반려동물 입양 신청 관리',
  description: '보호소의 입양 가능한 동물을 조회하고, 입양 신청서를 제출하세요.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-100 mt-12">
          © 2026 ptes — 반려동물 입양 신청 관리 서비스
        </footer>
      </body>
    </html>
  )
}
