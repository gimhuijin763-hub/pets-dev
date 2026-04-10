'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart, Megaphone, Search, Shield, Handshake, PawPrint } from 'lucide-react'
import { getAnimals } from '@/utils/supabase-storage'
import type { Animal } from '@/types'
import StatusBadge from '@/components/StatusBadge'

export default function LandingPage() {
  const [animals, setAnimals] = useState<Animal[]>([])

  useEffect(() => {
    getAnimals().then((data) => {
      setAnimals(data.filter((a) => a.adoption_status === '입양 가능').slice(0, 6))
    })
  }, [])

  return (
    <div className="space-y-20 pb-20 -mt-2">

      {/* ── Hero ── */}
      <section className="text-center pt-12 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 text-brand-600 px-4 py-1.5 text-sm font-semibold mb-6">
          <PawPrint className="w-4 h-4" />
          반려동물 입양 연결 플랫폼
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          새 가족을 기다리는<br />아이들을 만나보세요
        </h1>
        <p className="mt-4 text-slate-500 text-base md:text-lg max-w-lg mx-auto">
          보호소 동물과 입양 희망자를 연결합니다.<br className="hidden sm:block" />
          쉽고 투명한 입양 과정을 경험하세요.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link
            href="/animals"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 text-white px-6 py-3 font-semibold shadow-md hover:bg-brand-600 transition"
          >
            입양 가능한 동물 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/signup/promoter"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 text-slate-700 px-6 py-3 font-semibold hover:border-brand-300 hover:text-brand-600 transition"
          >
            동물 등록하기
          </Link>
        </div>
      </section>

      {/* ── 사용자 경로 ── */}
      <section className="grid gap-5 md:grid-cols-2">
        <Link href="/signup/adopter" className="card p-6 flex items-start gap-5 group hover:ring-2 hover:ring-brand-300 transition">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0 group-hover:bg-pink-100 transition">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">입양을 원하시나요?</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              입양 가능한 동물을 찾아보고, 마음에 드는 아이에게 바로 입양 신청할 수 있어요.
            </p>
            <span className="text-xs font-semibold text-brand-500 mt-3 inline-block group-hover:underline">
              입양 희망자로 시작하기 →
            </span>
          </div>
        </Link>

        <Link href="/signup/promoter" className="card p-6 flex items-start gap-5 group hover:ring-2 hover:ring-brand-300 transition">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition">
            <Megaphone className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">동물을 등록하고 싶으신가요?</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              보호소나 개인이 입양 대상 동물을 등록하고, 입양 과정을 관리할 수 있어요.
            </p>
            <span className="text-xs font-semibold text-brand-500 mt-3 inline-block group-hover:underline">
              홍보 담당자로 시작하기 →
            </span>
          </div>
        </Link>
      </section>

      {/* ── 가치 포인트 ── */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900">왜 Ptes인가요?</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Search, title: '쉽게 찾기', desc: '한눈에 볼 수 있는 동물 목록에서 원하는 조건으로 빠르게 탐색합니다.' },
            { icon: Handshake, title: '분명하게 연결', desc: '입양 희망자와 보호 단체가 직접 연결되어 투명한 소통이 가능합니다.' },
            { icon: Shield, title: '신뢰할 수 있는 진행', desc: '신청부터 승인까지 모든 단계를 실시간으로 확인할 수 있습니다.' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="text-center px-4 py-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 실제 동물 프리뷰 ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">지금 입양 가능한 동물</h2>
            <p className="text-sm text-slate-500 mt-1">새 가족을 기다리고 있어요</p>
          </div>
          <Link href="/animals" className="text-sm font-semibold text-brand-500 hover:underline flex items-center gap-1">
            전체 보기 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {animals.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {animals.map((animal) => (
              <Link key={animal.id} href={`/animals/${animal.id}`} className="card group block overflow-hidden">
                <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={animal.image_url || ''}
                    alt={animal.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80'
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={animal.adoption_status} type="adoption" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900">{animal.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {animal.type}{animal.breed ? ` · ${animal.breed}` : ''} · {animal.age}
                    {animal.location ? ` · ${animal.location}` : ''}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <span className="text-xs font-semibold text-brand-500 group-hover:underline">
                      상세 보기 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="w-full aspect-[4/3] bg-slate-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 최종 CTA ── */}
      <section className="rounded-3xl bg-gradient-to-br from-brand-500 to-orange-500 text-white p-10 md:p-14 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold">
          새 가족을 만들어 주세요
        </h2>
        <p className="mt-3 text-white/85 max-w-md mx-auto">
          입양을 기다리는 아이들이 있습니다. 지금 바로 시작하세요.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link
            href="/animals"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-brand-600 px-6 py-3 font-semibold shadow-md hover:bg-white/90 transition"
          >
            입양 가능한 동물 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 text-white px-6 py-3 font-semibold hover:bg-white/15 transition"
          >
            무료로 가입하기
          </Link>
        </div>
      </section>
    </div>
  )
}
