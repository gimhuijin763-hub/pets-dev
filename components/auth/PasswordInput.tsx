'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { PasswordStrength } from '@/utils/auth'

interface Props {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  label: string
  required?: boolean
  strength?: PasswordStrength | null
}

const RULES = [
  { key: 'minLength' as const, label: '8자 이상' },
  { key: 'hasLetter' as const, label: '영문 포함' },
  { key: 'hasNumber' as const, label: '숫자 포함' },
  { key: 'hasSpecial' as const, label: '특수문자 포함' },
]

export default function PasswordInput({ name, value, onChange, placeholder, label, required, strength }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="input pr-10"
          placeholder={placeholder ?? '••••••••'}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {strength && value.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {RULES.map((rule) => (
            <span
              key={rule.key}
              className={`text-xs font-medium ${strength[rule.key] ? 'text-green-500' : 'text-slate-400'}`}
            >
              {strength[rule.key] ? '✓' : '○'} {rule.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
