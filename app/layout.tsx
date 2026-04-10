import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, '')}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
      : 'http://localhost:3002')

const sharedOgImage = {
  url: `${siteUrl}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: 'Ptes 반려동물 입양 신청 관리 서비스',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ptes — 반려동물 입양 신청 관리',
  description: '보호소의 입양 가능한 동물을 조회하고, 입양 신청서를 제출하세요.',
  openGraph: {
    title: 'Ptes — 반려동물 입양 신청 관리',
    description: '보호소의 입양 가능한 동물을 조회하고, 입양 신청서를 제출하세요.',
    url: siteUrl,
    siteName: 'Ptes',
    locale: 'ko_KR',
    type: 'website',
    images: [sharedOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ptes — 반려동물 입양 신청 관리',
    description: '보호소의 입양 가능한 동물을 조회하고, 입양 신청서를 제출하세요.',
    images: [sharedOgImage.url],
  },
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
          © 2026 Ptes — 반려동물 입양 신청 관리 서비스
        </footer>
      </body>
    </html>
  )
}
