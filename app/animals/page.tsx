'use client'

import { useEffect, useState } from 'react'
import { getAnimals, AnimalFilters } from '@/utils/supabase-storage'
import { Animal } from '@/types'
import AnimalCard from '@/components/AnimalCard'
import { PawPrint, Filter, X } from 'lucide-react'

// Filter options based on actual data schema
const TYPE_OPTIONS = ['전체', '강아지', '고양이']
const SIZE_OPTIONS = ['전체', '소형', '중형', '대형']
const GENDER_OPTIONS = ['전체', '남', '여']
const STATUS_OPTIONS = ['전체', '입양 가능', '입양 진행 중', '입양 완료']

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [filters, setFilters] = useState<AnimalFilters>({
    type: undefined,
    size: undefined,
    gender: undefined,
    adoption_status: '입양 가능', // Default to available only
    location: undefined,
  })

  useEffect(() => {
    async function loadAnimals() {
      setLoading(true)
      // Build filters object (exclude '전체' values)
      const activeFilters: AnimalFilters = {}
      if (filters.type && filters.type !== '전체') activeFilters.type = filters.type
      if (filters.size && filters.size !== '전체') activeFilters.size = filters.size
      if (filters.gender && filters.gender !== '전체') activeFilters.gender = filters.gender
      if (filters.adoption_status && filters.adoption_status !== '전체') {
        activeFilters.adoption_status = filters.adoption_status
      }
      if (filters.location?.trim()) activeFilters.location = filters.location.trim()

      const data = await getAnimals(Object.keys(activeFilters).length > 0 ? activeFilters : undefined)
      setAnimals(data)
      setLoading(false)
    }
    loadAnimals()
  }, [filters])

  function updateFilter(key: keyof AnimalFilters, value: string | undefined) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setFilters({
      type: undefined,
      size: undefined,
      gender: undefined,
      adoption_status: '입양 가능',
      location: undefined,
    })
  }

  const hasActiveFilters =
    (filters.type && filters.type !== '전체') ||
    (filters.size && filters.size !== '전체') ||
    (filters.gender && filters.gender !== '전체') ||
    (filters.adoption_status && filters.adoption_status !== '전체') ||
    filters.location?.trim()

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

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            showFilters || hasActiveFilters
              ? 'bg-brand-50 text-brand-600 border border-brand-200'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
          }`}
        >
          <Filter className="w-4 h-4" />
          필터 {showFilters ? '닫기' : hasActiveFilters ? '수정' : '열기'}
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 bg-brand-500 text-white text-xs rounded-full">
              ON
            </span>
          )}
        </button>

        <span className="text-sm text-slate-400">
          {loading ? '불러오는 중...' : `총 ${animals.length}마리`}
        </span>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card p-4 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">검색 조건</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-3 h-3" />
                초기화
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Type Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">동물 종류</label>
              <select
                value={filters.type || '전체'}
                onChange={(e) => updateFilter('type', e.target.value === '전체' ? undefined : e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">크기</label>
              <select
                value={filters.size || '전체'}
                onChange={(e) => updateFilter('size', e.target.value === '전체' ? undefined : e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              >
                {SIZE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">성별</label>
              <select
                value={filters.gender || '전체'}
                onChange={(e) => updateFilter('gender', e.target.value === '전체' ? undefined : e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt === '남' ? '남아' : opt === '여' ? '여아' : opt}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">입양 상태</label>
              <select
                value={filters.adoption_status || '전체'}
                onChange={(e) => updateFilter('adoption_status', e.target.value === '전체' ? undefined : e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">지역</label>
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => updateFilter('location', e.target.value || undefined)}
                placeholder="예: 서울, 부산"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">
          <PawPrint className="w-10 h-10 mx-auto mb-3 opacity-30 animate-pulse" />
          <p>동물들을 불러오는 중...</p>
        </div>
      ) : animals.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <PawPrint className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="mb-2">조건에 맞는 동물이 없습니다.</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-brand-500 hover:text-brand-600 font-medium"
            >
              필터 초기화하기
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </div>
  )
}
