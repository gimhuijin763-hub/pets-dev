"use client"

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PawPrint } from 'lucide-react'
import { signInWithPassword } from '@/lib/supabaseClient'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signInWithPassword(form.email, form.password)

    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    if (redirectTo) {
      router.push(redirectTo)
    } else if (result.user.role === 'promoter') {
      router.push('/promoter/dashboard')
    } else if (result.user.role === 'adopter') {
      router.push('/adopter/dashboard')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <PawPrint className="w-10 h-10 text-brand-500 mx-auto mb-3" />
        <h1 className="text-xl font-extrabold text-slate-900">로그인</h1>
      </div>

      {error && (
        <div className="card border-red-200 bg-red-50 p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="label">이메일</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="example@email.com" />
        </div>
        <div>
          <label className="label">비밀번호</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="input" placeholder="••••••" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 mt-6">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-brand-500 font-medium hover:underline">회원가입</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-center py-20 text-sm text-slate-400">로딩 중...</p>}>
      <LoginForm />
    </Suspense>
  )
}
