'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAnimalById, addApplication } from '@/utils/supabase-storage'
import { Animal } from '@/types'
import { ArrowLeft, CheckCircle } from 'lucide-react'

interface FormData {
  applicant_name: string
  phone: string
  email: string
  reason: string
}

export default function ApplyPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [form, setForm] = useState<FormData>({ applicant_name: '', phone: '', email: '', reason: '' })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadAnimal() {
      const found = await getAnimalById(id)
      if (!found || found.adoption_status !== '입양 가능') {
        router.push('/animals')
        return
      }
      setAnimal(found)
    }
    loadAnimal()
  }, [id, router])

  function validate(): boolean {
    const newErrors: Partial<FormData> = {}
    if (!form.applicant_name.trim()) newErrors.applicant_name = '이름을 입력해 주세요.'
    if (!form.phone.trim()) newErrors.phone = '연락처를 입력해 주세요.'
    else if (!/^[0-9\-+\s]{9,13}$/.test(form.phone.trim())) newErrors.phone = '올바른 연락처를 입력해 주세요.'
    if (!form.email.trim()) newErrors.email = '이메일을 입력해 주세요.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) newErrors.email = '올바른 이메일을 입력해 주세요.'
    if (!form.reason.trim()) newErrors.reason = '신청 사유를 입력해 주세요.'
    else if (form.reason.trim().length < 20) newErrors.reason = '신청 사유를 20자 이상 작성해 주세요.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitError(null)
    setLoading(true)
    const result = await addApplication({ animal_id: id, ...form })
    if (result.ok) {
      setSubmitted(true)
    } else {
      setSubmitError(result.error ?? '신청서 제출에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    }
    setLoading(false)
  }

  if (!animal) return null

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">신청서가 제출되었습니다!</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          <strong>{animal.name}</strong>에 대한 입양 신청이 성공적으로 접수되었습니다.<br />
          담당자가 검토 후 연락드릴 예정입니다.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/" className="btn-primary justify-center">
            다른 동물 보러 가기
          </Link>
          <Link href={`/animals/${id}`} className="btn-secondary justify-center">
            {animal.name} 페이지로
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link href={`/animals/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5 transition">
        <ArrowLeft className="w-4 h-4" />
        {animal.name} 상세로 돌아가기
      </Link>

      {/* 신청 대상 */}
      <div className="card flex items-center gap-4 p-4 mb-6">
        <img src={animal.image_url} alt={animal.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
        <div>
          <p className="text-xs text-slate-400 font-medium mb-0.5">입양 신청 대상</p>
          <p className="font-bold text-slate-900 text-lg">{animal.name}</p>
          <p className="text-sm text-slate-500">{animal.type} · {animal.age} · {animal.gender === '남' ? '남아' : '여아'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <h1 className="text-xl font-extrabold text-slate-900 mb-1">입양 신청서</h1>
        <p className="text-sm text-slate-500 !mt-1 pb-4 border-b border-slate-100">
          아래 정보를 정확히 입력해 주세요. 담당자가 검토 후 연락드립니다.
        </p>

        <div>
          <label htmlFor="applicant_name" className="label">신청자 이름 <span className="text-red-400">*</span></label>
          <input
            id="applicant_name"
            name="applicant_name"
            type="text"
            value={form.applicant_name}
            onChange={handleChange}
            placeholder="홍길동"
            className={`input ${errors.applicant_name ? 'border-red-300 ring-1 ring-red-300' : ''}`}
          />
          {errors.applicant_name && <p className="text-xs text-red-500 mt-1">{errors.applicant_name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="label">연락처 <span className="text-red-400">*</span></label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="010-0000-0000"
            className={`input ${errors.phone ? 'border-red-300 ring-1 ring-red-300' : ''}`}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="email" className="label">이메일 <span className="text-red-400">*</span></label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className={`input ${errors.email ? 'border-red-300 ring-1 ring-red-300' : ''}`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="reason" className="label">
            신청 사유 <span className="text-red-400">*</span>
            <span className="text-slate-400 font-normal ml-1.5">(최소 20자)</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={5}
            value={form.reason}
            onChange={handleChange}
            placeholder="이 동물을 입양하려는 이유, 거주 환경, 반려동물 경험 등을 적어주세요."
            className={`input resize-none ${errors.reason ? 'border-red-300 ring-1 ring-red-300' : ''}`}
          />
          <div className="flex justify-between mt-1">
            {errors.reason ? (
              <p className="text-xs text-red-500">{errors.reason}</p>
            ) : (
              <span />
            )}
            <p className={`text-xs ml-auto ${form.reason.length < 20 ? 'text-slate-400' : 'text-green-500'}`}>
              {form.reason.length}자
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? '제출 중...' : '신청서 제출하기'}
        </button>
        {submitError && (
          <p className="text-sm text-red-500">{submitError}</p>
        )}
      </form>
    </div>
  )
}
