import { Suspense } from 'react'
import PromoterAnimalsSection from '@/components/promoter/PromoterAnimalsSection'

export default function PromoterAnimalsPage() {
  return (
    <Suspense fallback={<p className="text-center py-10 text-sm text-slate-400">로딩 중...</p>}>
      <PromoterAnimalsSection />
    </Suspense>
  )
}
