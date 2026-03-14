'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getAnimalById, getApplicationsCountByAnimalId } from '@/utils/supabase-storage'
import { Animal } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import { ArrowLeft, Heart, Calendar, User, Tag } from 'lucide-react'

export default function AnimalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [applicationsCount, setApplicationsCount] = useState(0)

  useEffect(() => {
    async function loadData() {
      const found = await getAnimalById(id)
      if (!found) {
        return
      }
      setAnimal(found)
      const count = await getApplicationsCountByAnimalId(id)
      setApplicationsCount(count)
    }
    loadData()
  }, [id])

  if (!animal) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        불러오는 중...
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5 transition">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      {/* 이미지 */}
      <div className="rounded-2xl overflow-hidden shadow-sm aspect-[16/9] bg-slate-100 mb-6">
        <img
          src={animal.image_url}
          alt={animal.name}
          className="w-full h-full object-cover"
          onError={(event) => {
            const target = event.currentTarget
            target.onerror = null
            target.src = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&q=80'
          }}
        />
      </div>

      {/* 기본 정보 */}
      <div className="card p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{animal.name}</h1>
            <p className="text-sm text-slate-500 mt-1">{animal.type}</p>
          </div>
          <StatusBadge status={animal.adoption_status} type="adoption" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <Calendar className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-500">나이</p>
            <p className="font-semibold text-slate-800 text-sm">{animal.age}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <User className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-500">성별</p>
            <p className="font-semibold text-slate-800 text-sm">{animal.gender === '남' ? '남아' : '여아'}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <Tag className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-500">종류</p>
            <p className="font-semibold text-slate-800 text-sm">{animal.type}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">{animal.description}</p>
      </div>

      {/* 신청 현황 (간략) */}
      {applicationsCount > 0 && (
        <div className="card p-4 mb-4 bg-amber-50 border-amber-100">
          <p className="text-sm text-amber-700 font-semibold">
            현재 {applicationsCount}건의 입양 신청이 접수되어 있습니다.
          </p>
        </div>
      )}

      {/* CTA */}
      {animal.adoption_status === '입양 가능' ? (
        <Link href={`/animals/${animal.id}/apply`} className="btn-primary w-full justify-center gap-2 text-base py-3">
          <Heart className="w-5 h-5" />
          입양 신청하기
        </Link>
      ) : (
        <div className="w-full text-center py-3 rounded-xl bg-slate-100 text-slate-400 font-semibold text-sm">
          현재 입양 신청을 받지 않습니다
        </div>
      )}
    </div>
  )
}
