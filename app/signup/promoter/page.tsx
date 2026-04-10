"use client"

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Megaphone } from 'lucide-react'
import { signup, checkPasswordStrength } from '@/utils/auth'
import EmailInput from '@/components/auth/EmailInput'
import PasswordInput from '@/components/auth/PasswordInput'

export default function SignupPromoterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', display_name: '', phone: '' })
  const [error, setError] = useState<string | null>(null)

  const pwStrength = useMemo(() => checkPasswordStrength(form.password), [form.password])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    const result = signup({
      email: form.email,
      password: form.password,
      role: 'promoter',
      display_name: form.display_name,
      phone: form.phone,
    })

    if (!result.ok) {
      setError(result.error)
      return
    }

    router.push('/promoter/dashboard')
  }

  const confirmMismatch = form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-3">
          <Megaphone className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">홍보 담당자 가입</h1>
        <p className="text-sm text-slate-500 mt-1">
          가입 후 보호소 동물을 등록하고 입양 홍보를 관리할 수 있어요.
        </p>
      </div>

      {error && (
        <div className="card border-red-200 bg-red-50 p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="label">이름 (또는 단체명) <span className="text-red-400">*</span></label>
          <input name="display_name" value={form.display_name} onChange={handleChange} className="input" placeholder="예: 서울동물보호소" />
        </div>

        <EmailInput value={form.email} onChange={handleChange} />

        <PasswordInput
          name="password"
          label="비밀번호"
          required
          value={form.password}
          onChange={handleChange}
          strength={pwStrength}
        />

        <div>
          <PasswordInput
            name="passwordConfirm"
            label="비밀번호 확인"
            required
            value={form.passwordConfirm}
            onChange={handleChange}
          />
          {confirmMismatch && (
            <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        <div>
          <label className="label">연락처</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="010-0000-0000" />
        </div>

        <button type="submit" className="btn-primary w-full justify-center">
          가입하기
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 mt-6">
        <Link href="/signup" className="text-brand-500 font-medium hover:underline">← 역할 선택으로 돌아가기</Link>
      </p>
    </div>
  )
}
