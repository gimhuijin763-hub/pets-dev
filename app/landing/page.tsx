'use client';

import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

const problemPoints = [
  '입양 가능한 동물 정보를 한눈에 보기 어렵습니다',
  '신청 정보가 여러 채널로 들어와 확인이 번거롭습니다',
  '접수 후 검토 상태를 일관되게 관리하기 어렵습니다',
  '운영자는 전체 신청 현황을 빠르게 파악하기 어렵습니다',
];

const features = [
  {
    title: '입양 가능 동물 목록',
    description: '입양 가능한 동물을 리스트 형태로 조회하고 핵심 정보를 빠르게 탐색합니다.',
    icon: ClipboardList,
  },
  {
    title: '동물 상세 페이지',
    description: '이름, 나이, 성별, 설명, 사진을 확인하고 바로 신청 가능합니다.',
    icon: PawPrint,
  },
  {
    title: '입양 신청 폼',
    description: '신청자 정보와 신청 사유를 제출하면 즉시 데이터가 저장됩니다.',
    icon: ClipboardCheck,
  },
  {
    title: '관리자 신청 내역',
    description: '전체 신청 히스토리를 한 화면에서 조회하고 필터링합니다.',
    icon: Users,
  },
  {
    title: '신청 상태 변경',
    description: '접수 · 검토중 · 승인 · 거절 상태를 즉시 변경해 운영 흐름을 단축합니다.',
    icon: ShieldCheck,
  },
];

const demoPoints = [
  '입양 가능 동물 목록이 정상적으로 보입니다',
  '동물 상세 페이지가 열립니다',
  '입양 신청이 정상 제출됩니다',
  '관리자 페이지에서 신청 내역이 보입니다',
  '상태 변경이 즉시 반영됩니다',
  '발표 데모가 중단 없이 끝까지 이어집니다',
];

const faqs = [
  {
    question: 'ptes는 누구를 위한 서비스인가요?',
    answer: '보호소, 입양센터, 유기동물 입양 프로세스를 운영하는 담당자를 위한 서비스입니다.',
  },
  {
    question: '일반 입양 신청자도 사용할 수 있나요?',
    answer: '네. 신청자는 입양 가능한 동물을 확인하고 바로 신청서를 제출할 수 있습니다.',
  },
  {
    question: '왜 로그인 기능이 없나요?',
    answer:
      '이번 MVP는 핵심 흐름 검증이 목적이기 때문에 로그인/회원가입 없이 가장 중요한 기능만 구현했습니다.',
  },
  {
    question: '어떤 기능은 제외되었나요?',
    answer:
      '결제, 채팅, 의료기록 관리, 임시보호 관리, 자동 알림, 다기관 운영 등은 현재 범위에서 제외되었습니다.',
  },
  {
    question: '이 서비스의 핵심 가치는 무엇인가요?',
    answer: '입양 가능 동물 조회부터 신청 접수, 관리자 상태 관리까지 하나의 흐름으로 연결한다는 점입니다.',
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-24">
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-500 via-orange-500 to-amber-400 text-white p-10 md:p-14 shadow-xl">
        <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid gap-12 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6 fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              핵심 흐름 중심의 입양 관리 서비스
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              흩어진 입양 절차를,
              <br /> 하나의 흐름으로 연결하다
            </h1>
            <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-xl">
              ptes는 보호소와 입양센터가 동물 조회 → 입양 신청 접수 → 관리자 상태 관리까지 한 곳에서
              처리할 수 있도록 만든 유기동물 입양 관리 서비스입니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/animals"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-brand-600 px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-white/90 transition"
              >
                데모 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/animals"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                서비스 체험하기
              </Link>
              <Link
                href="/animals"
                className="inline-flex items-center gap-2 rounded-xl border border-white/60 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition"
              >
                메인 페이지 바로가기
              </Link>
            </div>
            <p className="text-sm text-white/80">
              로그인 없이 핵심 흐름에 집중한 <strong>핵심 기능 중심 서비스</strong>
            </p>
          </div>

          <div className="relative fade-in-up-delayed">
            <div className="absolute -inset-6 rounded-3xl bg-white/10 blur-2xl" />
            <div className="relative rounded-3xl border border-white/30 bg-white/15 backdrop-blur-md p-6 shadow-2xl float-slow">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                <PawPrint className="h-5 w-5" />
                실시간 입양 운영 대시보드
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-xs uppercase tracking-widest text-white/70">Today</p>
                  <p className="text-2xl font-bold">입양 신청 12건</p>
                  <p className="text-sm text-white/80">승인 대기 4건 · 검토중 5건</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span>보호소 전체 동물</span>
                    <span className="font-semibold">28마리</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/20">
                    <div className="h-2 w-2/3 rounded-full bg-white" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>입양 가능</span>
                    <span>18마리</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <CheckCircle2 className="h-4 w-4" />
                  상태 변경 즉시 반영
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-[1fr_1.2fr] items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-brand-500">문제 제기</p>
          <h2 className="section-title">
            입양 절차가 나뉘어 있을수록, 운영은 더 비효율적입니다
          </h2>
          <p className="text-slate-600 leading-relaxed">
            많은 보호소와 입양센터는 동물 정보 확인, 신청서 접수, 상태 관리가 여러 도구에 흩어져 있어 운영
            흐름이 끊기고 관리 부담이 커집니다.
          </p>
          <p className="font-semibold text-slate-700">
            문제는 프로세스가 복잡해서가 아니라, 핵심 흐름이 연결되어 있지 않기 때문입니다.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {problemPoints.map((point) => (
            <div key={point} className="card p-4 bg-white">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                <p className="text-sm text-slate-600 leading-relaxed">{point}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 md:p-10 shadow-sm border border-slate-100">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-brand-500">해결 방식</p>
            <h2 className="section-title">ptes는 입양 운영의 가장 핵심적인 흐름만 빠르게 연결합니다</h2>
            <p className="text-slate-600 leading-relaxed">
              복잡한 부가 기능은 제외하고, 가장 중요한 3가지 경험에 집중했습니다.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              '입양 가능한 동물 조회',
              '입양 신청서 제출',
              '관리자 상태 관리',
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white text-sm font-bold">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{item}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {index === 0 && '목록에서 동물을 빠르게 탐색하고 상세 정보를 확인합니다.'}
                    {index === 1 && '신청자 정보와 신청 사유를 바로 입력해 제출합니다.'}
                    {index === 2 && '접수, 검토중, 승인, 거절 상태를 즉시 변경합니다.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-brand-500">핵심 기능</p>
          <h2 className="section-title">데모에 꼭 필요한 기능만 남겼습니다</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="card p-5 bg-white">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            )}
          )}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-brand-500">사용자 흐름</p>
          <h2 className="section-title mt-3">누구나 이해할 수 있는 단순한 흐름</h2>
          <p className="text-slate-600 mt-3">
            동물 목록 확인 → 상세 정보 확인 → 신청서 작성 → 제출 완료
          </p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-700">관리자 플로우</p>
            <p className="mt-2 text-sm text-slate-600">신청 목록 확인 → 신청 내용 검토 → 상태 변경</p>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            불필요한 단계 없이, 발표 데모가 끊기지 않도록 가장 중요한 흐름만 설계했습니다.
          </p>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl">
          <p className="text-sm font-semibold text-white/70">관리자 기능 강조</p>
          <h2 className="text-2xl font-bold mt-3">
            운영자는 여러 도구를 오갈 필요가 없습니다
          </h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            ptes의 핵심 가치는 단순히 신청을 받는 것이 아니라, 들어온 신청을 한곳에서 보고 바로 처리할 수 있다는
            점입니다.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-white/80">
            <li>• 전체 신청 내역 한 번에 확인</li>
            <li>• 상태값 즉시 변경</li>
            <li>• 운영 흐름 단순화</li>
            <li>• 관리자 입장에서 빠른 대응 가능</li>
          </ul>
          <p className="mt-6 font-semibold text-white">
            입양 신청 접수 이후의 관리까지 연결되어야, 실제 운영이 됩니다.
          </p>
        </div>
      </section>

      <section className="rounded-3xl bg-brand-50 p-8 md:p-10 border border-brand-100">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <p className="text-sm font-semibold text-brand-500">MVP 특장점</p>
            <h2 className="section-title mt-3">짧은 개발 기간에도, 핵심 흐름은 완전하게</h2>
            <p className="text-slate-600 mt-3">
              이 서비스에서 중요한 것은 많은 기능이 아니라, 끝까지 끊기지 않고 설득력 있게 보여지는 흐름입니다.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              '최소 기능 집중: 로그인, 결제, 채팅 없이 핵심 가치만 구현',
              '빠른 데모 가능: end-to-end 플로우 중심',
              '실행 가능한 기술 스택: Next.js, TypeScript, Tailwind CSS',
              '운영 우선 설계: 디자인보다 작동과 데모 안정성 우선',
            ].map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <CheckCircle2 className="mt-1 h-4 w-4 text-brand-500" />
                <p className="text-sm text-slate-600">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-brand-500">데모/성과 포인트</p>
          <h2 className="section-title">이 서비스는 이렇게 검증됩니다</h2>
          <p className="text-slate-600">
            ptes는 분산된 입양 신청 과정을 하나의 운영 흐름으로 연결하는 서비스입니다.
          </p>
          <div className="mt-6 grid gap-3">
            {demoPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                <CheckCircle2 className="mt-1 h-4 w-4 text-brand-500" />
                <p className="text-sm text-slate-600">{point}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-brand-500">FAQ</p>
          <h2 className="section-title mt-3">자주 묻는 질문</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-100 p-4">
                <p className="font-semibold text-slate-800">{faq.question}</p>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 최종 CTA 섹션 제거 요청으로 삭제 */}
    </div>
  )
}
