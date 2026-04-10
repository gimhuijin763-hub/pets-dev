'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getAnimals } from '@/utils/supabase-storage'
import type { Animal } from '@/types'

export default function PromoterAnimalsSection() {
  const searchParams = useSearchParams()
  const justCreated = searchParams.get('created') === 'true'

  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [showBanner, setShowBanner] = useState(justCreated)

  useEffect(() => {
    getAnimals().then((data) => {
      setAnimals(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => setShowBanner(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showBanner])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {showBanner && (
        <div className="card border-green-200 bg-green-50 p-4 flex items-center justify-between">
          <p className="text-sm text-green-700 font-medium">새 동물이 등록되었습니다!</p>
          <button onClick={() => setShowBanner(false)} className="text-green-500 hover:text-green-700 text-xs">닫기</button>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="section-title">등록 동물 관리</h1>
          <p className="text-sm text-slate-500 mt-2">
            등록된 동물들을 확인하고 관리하는 화면입니다.
          </p>
        </div>
        <Link href="/promoter/animals/new" className="btn-primary justify-center">
          새 동물 등록하기
        </Link>
      </div>

      <div className="card p-6">
        {loading ? (
          <p className="text-center py-10 text-sm text-slate-400">목록을 불러오는 중...</p>
        ) : animals.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm font-semibold">아직 등록된 동물이 없습니다.</p>
            <p className="text-xs text-slate-400 mt-2">새 동물을 등록하면 이곳에 목록이 표시됩니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {animals.map((animal) => (
              <div key={animal.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{animal.name}</p>
                  <p className="text-xs text-slate-500">
                    {animal.type} · {animal.age} · {animal.gender}
                    {animal.location ? ` · ${animal.location}` : ''}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  animal.adoption_status === '입양 가능'
                    ? 'bg-green-100 text-green-700'
                    : animal.adoption_status === '검토 중'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {animal.adoption_status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
