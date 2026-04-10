'use client'

import { useEffect, useState } from 'react'
import { isEmailTaken } from '@/utils/auth'

interface Props {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function EmailInput({ value, onChange }: Props) {
  const [status, setStatus] = useState<'idle' | 'valid' | 'taken' | 'invalid'>('idle')

  useEffect(() => {
    if (!value.trim()) {
      setStatus('idle')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value.trim())) {
      setStatus('invalid')
      return
    }

    const timer = setTimeout(() => {
      setStatus(isEmailTaken(value) ? 'taken' : 'valid')
    }, 300)

    return () => clearTimeout(timer)
  }, [value])

  return (
    <div>
      <label className="label">이메일 <span className="text-red-400">*</span></label>
      <input
        name="email"
        type="email"
        value={value}
        onChange={onChange}
        className={`input ${
          status === 'taken' ? 'border-red-300 ring-1 ring-red-300' :
          status === 'valid' ? 'border-green-300 ring-1 ring-green-300' : ''
        }`}
        placeholder="example@email.com"
      />
      {status === 'taken' && (
        <p className="text-xs text-red-500 mt-1">이미 가입된 이메일입니다.</p>
      )}
      {status === 'valid' && (
        <p className="text-xs text-green-500 mt-1">사용 가능한 이메일입니다.</p>
      )}
      {status === 'invalid' && value.length > 3 && (
        <p className="text-xs text-slate-400 mt-1">올바른 이메일 형식을 입력해 주세요.</p>
      )}
    </div>
  )
}
