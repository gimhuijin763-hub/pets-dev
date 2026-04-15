// 이 파일은 비밀번호 강도 검사 유틸리티만 제공합니다.
// 인증 관련 기능은 lib/supabaseClient.ts 와 contexts/AuthContext.tsx 를 사용하세요.

export interface PasswordStrength {
  minLength: boolean
  hasLetter: boolean
  hasNumber: boolean
  hasSpecial: boolean
  allPassed: boolean
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const minLength = password.length >= 8
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)
  return { minLength, hasLetter, hasNumber, hasSpecial, allPassed: minLength && hasLetter && hasNumber && hasSpecial }
}

// @deprecated - lib/supabaseClient.ts 의 함수들을 사용하세요
// export { getCurrentUser, signInWithPassword, signUp, signOut, getAccessToken } from '@/lib/supabaseClient'
// export { useAuthContext } from '@/contexts/AuthContext'
