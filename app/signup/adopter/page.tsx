"use client"

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { signup, checkPasswordStrength } from '@/utils/auth'
import EmailInput from '@/components/auth/EmailInput'
import PasswordInput from '@/components/auth/PasswordInput'

export default function SignupAdopterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', display_name: '', phone: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const pwStrength = useMemo(() => checkPasswordStrength(form.password), [form.password])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)

    const result = await signup({
      email: form.email,
      password: form.password,
      role: 'adopter',
      display_name: form.display_name,
      phone: form.phone,
    })

    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    router.push('/adopter/dashboard')
  }

  const confirmMismatch = form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-3">
          <Heart className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">입양 희망자 가입</h1>
        <p className="text-sm text-slate-500 mt-1">
          가입 후 입양 가능한 동물을 확인하고 신청할 수 있어요.
        </p>
      </div>

      {error && (
        <div className="card border-red-200 bg-red-50 p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="label">이름 <span className="text-red-400">*</span></label>
          <input name="display_name" value={form.display_name} onChange={handleChange} className="input" placeholder="예: 김희진" />
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

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
          {loading ? '가입 중...' : '가입하기'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 mt-6">
        <Link href="/signup" className="text-brand-500 font-medium hover:underline">← 역할 선택으로 돌아가기</Link>
      </p>
    </div>
  )
}
