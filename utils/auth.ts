import type { UserRole } from '@/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const SESSION_KEY = 'auth_session'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  display_name: string
  phone?: string
  created_at: string
}

interface AuthSession {
  user: AuthUser
  access_token: string
  refresh_token: string
  expires_at?: number
}

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

// 세션 저장
function saveSession(session: AuthSession) {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

// 세션 가져오기
export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) return null
    const session = JSON.parse(stored) as AuthSession

    // 토큰 만료 체크
    if (session.expires_at && Date.now() / 1000 > session.expires_at) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }

    return session
  } catch {
    return null
  }
}

// API 호출 헤더용 토큰 가져오기
export function getAccessToken(): string | null {
  return getSession()?.access_token || null
}

// Supabase Auth 회원가입
export async function signup(params: {
  email: string
  password: string
  role: UserRole
  display_name: string
  phone?: string
}): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  const { email, password, role, display_name, phone } = params

  if (!email || !password || !role || !display_name) {
    return { ok: false, error: '필수 항목을 모두 입력해 주세요.' }
  }

  const strength = checkPasswordStrength(password)
  if (!strength.allPassed) {
    return { ok: false, error: '비밀번호는 8자 이상, 영문·숫자·특수문자를 모두 포함해야 합니다.' }
  }

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, display_name, phone }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { ok: false, error: data.error || '회원가입에 실패했습니다.' }
    }

    const user: AuthUser = {
      id: data.data.id,
      email: data.data.email,
      role: data.data.role,
      display_name: display_name,
      phone: phone || undefined,
      created_at: new Date().toISOString(),
    }

    // 세션이 있는 경우 저장
    if (data.data.access_token) {
      saveSession({
        user,
        access_token: data.data.access_token,
        refresh_token: data.data.refresh_token,
      })
    }

    return { ok: true, user }
  } catch {
    return { ok: false, error: '회원가입 중 오류가 발생했습니다.' }
  }
}

// Supabase Auth 로그인
export async function login(email: string, password: string): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  if (!email || !password) {
    return { ok: false, error: '이메일과 비밀번호를 입력해 주세요.' }
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { ok: false, error: data.error || '로그인에 실패했습니다.' }
    }

    const user: AuthUser = {
      id: data.data.id,
      email: data.data.email,
      role: data.data.role,
      display_name: data.data.display_name,
      phone: data.data.phone,
      created_at: new Date().toISOString(),
    }

    saveSession({
      user,
      access_token: data.data.access_token,
      refresh_token: data.data.refresh_token,
    })

    return { ok: true, user }
  } catch {
    return { ok: false, error: '로그인 중 오류가 발생했습니다.' }
  }
}

// 로그아웃
export function logout() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
}

// 현재 사용자 가져오기
export function getCurrentUser(): AuthUser | null {
  return getSession()?.user || null
}
