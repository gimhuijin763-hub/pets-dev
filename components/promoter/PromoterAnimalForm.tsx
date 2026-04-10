'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createAnimal } from '@/utils/supabase-storage'

interface FormData {
  name: string
  species: string
  breed: string
  age: string
  gender: string
  size: string
  location: string
  description: string
  adoption_status: string
}

const INITIAL_FORM: FormData = {
  name: '',
  species: '',
  breed: '',
  age: '',
  gender: '',
  size: '',
  location: '',
  description: '',
  adoption_status: '',
}

const REQUIRED_FIELDS: { key: keyof FormData; label: string }[] = [
  { key: 'name', label: '동물 이름' },
  { key: 'species', label: '종' },
  { key: 'age', label: '나이' },
  { key: 'gender', label: '성별' },
  { key: 'location', label: '보호소/지역' },
  { key: 'description', label: '동물 소개' },
  { key: 'adoption_status', label: '입양 상태' },
]

export default function PromoterAnimalForm() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    for (const { key, label } of REQUIRED_FIELDS) {
      if (!form[key].trim()) {
        newErrors[key] = `${label}을(를) 입력해 주세요.`
      }
    }

    if (form.description.trim() && form.description.trim().length < 10) {
      newErrors.description = '동물 소개를 10자 이상 작성해 주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError(null)

    const result = await createAnimal({
      name: form.name.trim(),
      type: form.species.trim(),
      breed: form.breed.trim() || undefined,
      age: form.age.trim(),
      gender: form.gender,
      size: form.size || undefined,
      location: form.location.trim(),
      description: form.description.trim(),
      adoption_status: form.adoption_status,
    })

    setLoading(false)

    if (!result.ok) {
      setServerError(result.error || '등록에 실패했습니다. 다시 시도해 주세요.')
      return
    }

    router.push('/promoter/animals?created=true')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="section-title">새 동물 등록</h1>
          <Link href="/promoter/animals" className="text-xs text-slate-500 hover:text-slate-700">
            목록으로 돌아가기
          </Link>
        </div>
        <p className="text-sm text-slate-500">
          아래 양식을 작성하고 등록 버튼을 누르면 동물 정보가 저장됩니다.
        </p>
      </div>

      {serverError && (
        <div className="card border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600 font-medium">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">동물 이름 <span className="text-red-400">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} className={`input ${errors.name ? 'border-red-300 ring-1 ring-red-300' : ''}`} placeholder="예: 나비" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="label">종 <span className="text-red-400">*</span></label>
            <input name="species" value={form.species} onChange={handleChange} className={`input ${errors.species ? 'border-red-300 ring-1 ring-red-300' : ''}`} placeholder="예: 고양이" />
            {errors.species && <p className="text-xs text-red-500 mt-1">{errors.species}</p>}
          </div>
          <div>
            <label className="label">품종</label>
            <input name="breed" value={form.breed} onChange={handleChange} className="input" placeholder="예: 코리안숏헤어" />
          </div>
          <div>
            <label className="label">나이 <span className="text-red-400">*</span></label>
            <input name="age" value={form.age} onChange={handleChange} className={`input ${errors.age ? 'border-red-300 ring-1 ring-red-300' : ''}`} placeholder="예: 2살" />
            {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
          </div>
          <div>
            <label className="label">성별 <span className="text-red-400">*</span></label>
            <select name="gender" value={form.gender} onChange={handleChange} className={`input ${errors.gender ? 'border-red-300 ring-1 ring-red-300' : ''}`}>
              <option value="">선택</option>
              <option value="여">여</option>
              <option value="남">남</option>
              <option value="모름">모름</option>
            </select>
            {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
          </div>
          <div>
            <label className="label">크기</label>
            <select name="size" value={form.size} onChange={handleChange} className="input">
              <option value="">선택</option>
              <option value="소형">소형</option>
              <option value="중형">중형</option>
              <option value="대형">대형</option>
            </select>
          </div>
          <div>
            <label className="label">보호소/지역 <span className="text-red-400">*</span></label>
            <input name="location" value={form.location} onChange={handleChange} className={`input ${errors.location ? 'border-red-300 ring-1 ring-red-300' : ''}`} placeholder="예: 서울 강남 보호소" />
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
          </div>
          <div>
            <label className="label">입양 상태 <span className="text-red-400">*</span></label>
            <select name="adoption_status" value={form.adoption_status} onChange={handleChange} className={`input ${errors.adoption_status ? 'border-red-300 ring-1 ring-red-300' : ''}`}>
              <option value="">선택</option>
              <option value="입양 가능">입양 가능</option>
              <option value="검토 중">검토 중</option>
              <option value="입양 완료">입양 완료</option>
            </select>
            {errors.adoption_status && <p className="text-xs text-red-500 mt-1">{errors.adoption_status}</p>}
          </div>
        </div>

        <div>
          <label className="label">동물 소개 <span className="text-red-400">*</span> <span className="text-slate-400 font-normal ml-1">(최소 10자)</span></label>
          <textarea name="description" value={form.description} onChange={handleChange} className={`input resize-none ${errors.description ? 'border-red-300 ring-1 ring-red-300' : ''}`} rows={5} placeholder="동물의 성격, 특징을 적어주세요." />
          <div className="flex justify-between mt-1">
            {errors.description ? <p className="text-xs text-red-500">{errors.description}</p> : <span />}
            <p className={`text-xs ml-auto ${form.description.length < 10 ? 'text-slate-400' : 'text-green-500'}`}>{form.description.length}자</p>
          </div>
        </div>

        <div>
          <label className="label">사진 업로드 (예정)</label>
          <input className="input" type="file" disabled />
          <p className="text-xs text-slate-400 mt-2">현재는 파일 업로드 기능이 없습니다.</p>
        </div>

        <div className="flex flex-col gap-2">
          <button type="submit" className="btn-primary justify-center" disabled={loading}>
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  )
}
