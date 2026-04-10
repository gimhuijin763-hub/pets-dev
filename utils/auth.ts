import type { UserRole } from '@/types'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  display_name: string
  phone?: string
  created_at: string
}

const USERS_KEY = 'pets_users'
const SESSION_KEY = 'auth_user'

function getUsers(): AuthUser[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users: AuthUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function isEmailTaken(email: string): boolean {
  if (!email) return false
  const users = getUsers()
  return users.some((u) => u.email === email.toLowerCase().trim())
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

export function signup(params: {
  email: string
  password: string
  role: UserRole
  display_name: string
  phone?: string
}): { ok: true; user: AuthUser } | { ok: false; error: string } {
  const { email, password, role, display_name, phone } = params

  if (!email || !password || !role || !display_name) {
    return { ok: false, error: '필수 항목을 모두 입력해 주세요.' }
  }
  const strength = checkPasswordStrength(password)
  if (!strength.allPassed) {
    return { ok: false, error: '비밀번호는 8자 이상, 영문·숫자·특수문자를 모두 포함해야 합니다.' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { ok: false, error: '올바른 이메일 형식을 입력해 주세요.' }
  }

  const users = getUsers()
  if (users.some((u) => u.email === email.toLowerCase())) {
    return { ok: false, error: '이미 가입된 이메일입니다.' }
  }

  const newUser: AuthUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: email.toLowerCase(),
    role,
    display_name,
    phone: phone || undefined,
    created_at: new Date().toISOString(),
  }

  // 비밀번호는 별도 저장 (간단 해시)
  const pwKey = `pets_pw_${newUser.id}`
  localStorage.setItem(pwKey, btoa(password))

  users.push(newUser)
  saveUsers(users)

  // 자동 로그인
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser))

  return { ok: true, user: newUser }
}

export function login(email: string, password: string): { ok: true; user: AuthUser } | { ok: false; error: string } {
  if (!email || !password) {
    return { ok: false, error: '이메일과 비밀번호를 입력해 주세요.' }
  }

  const users = getUsers()
  const user = users.find((u) => u.email === email.toLowerCase())

  if (!user) {
    return { ok: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  const pwKey = `pets_pw_${user.id}`
  const stored = localStorage.getItem(pwKey)
  if (!stored || atob(stored) !== password) {
    return { ok: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return { ok: true, user }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}
