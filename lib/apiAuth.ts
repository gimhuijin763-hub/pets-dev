import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export interface AuthUser {
  id: string
  role: string
  email?: string
}

// JWT 토큰으로부터 사용자 인증 정보 추출
export async function verifyUserFromToken(request: Request): Promise<AuthUser | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.substring(7)
  if (!token) return null

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null

  const metadata = data.user.user_metadata || {}
  return {
    id: data.user.id,
    role: (metadata.role as string) || '',
    email: data.user.email,
  }
}

// 인증된 사용자 가져오기 (401 반환)
export async function requireAuth(request: Request): Promise<{ user: AuthUser; response?: never } | { user?: never; response: Response }> {
  const user = await verifyUserFromToken(request)
  if (!user) {
    return {
      response: NextResponse.json(
        { error: '로그인이 필요합니다.', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }
  }
  return { user }
}

// 특정 역할 필요
export async function requireRole(
  request: Request,
  allowedRoles: string[]
): Promise<{ user: AuthUser; response?: never } | { user?: never; response: Response }> {
  const authResult = await requireAuth(request)
  if (authResult.response) return authResult

  const { user } = authResult
  if (!allowedRoles.includes(user.role)) {
    return {
      response: NextResponse.json(
        { error: '접근 권한이 없습니다.', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }
  }
  return { user }
}

// 관리자 권한 확인
export async function requireAdmin(request: Request): Promise<{ user: AuthUser; response?: never } | { user?: never; response: Response }> {
  return requireRole(request, ['admin'])
}

// 홍보자 권한 확인
export async function requirePromoter(request: Request): Promise<{ user: AuthUser; response?: never } | { user?: never; response: Response }> {
  return requireRole(request, ['promoter', 'admin'])
}

// 입양 희망자 권한 확인
export async function requireAdopter(request: Request): Promise<{ user: AuthUser; response?: never } | { user?: never; response: Response }> {
  return requireRole(request, ['adopter', 'admin'])
}
