'use client'

import { useEffect, useState } from 'react'
import { getAnimals } from '@/utils/supabase-storage'
import { Animal } from '@/types'
import AnimalCard from '@/components/AnimalCard'
import { PawPrint } from 'lucide-react'

const TYPES = ['전체', '개', '고양이']

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [filter, setFilter] = useState('전체')
  const [showAdopted, setShowAdopted] = useState(false)

  useEffect(() => {
    async function loadAnimals() {
      const data = await getAnimals()
      setAnimals(data)
    }
    loadAnimals()
  }, [])

  const filtered = animals
    .filter((a) => showAdopted || a.adoption_status !== '입양 완료')
    .filter((a) => filter === '전체' || a.type === filter)

  return (
    <div>
      <div className="mb-8 py-10 px-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl text-white text-center shadow-lg">
        <div className="flex justify-center mb-3">
          <PawPrint className="w-10 h-10 opacity-90" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">입양 가능한 친구들</h1>
        <p className="mt-2 text-brand-100 text-sm max-w-md mx-auto leading-relaxed">
          보호소의 동물들이 새 가족을 기다리고 있어요.<br />
          마음에 드는 친구를 찾아 입양 신청서를 제출해보세요.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
              filter === t
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-500'
            }`}
          >
            {t}
          </button>
        ))}
        <button
          onClick={() => setShowAdopted((v) => !v)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
            showAdopted
              ? 'bg-slate-700 text-white border-slate-700'
              : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
          }`}
        >
          {showAdopted ? '입양 완료 포함' : '입양 완료 제외'}
        </button>
        <span className="ml-auto text-sm text-slate-400 flex items-center">
          총 {filtered.length}마리
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <PawPrint className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>등록된 동물이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </div>
  )
}
