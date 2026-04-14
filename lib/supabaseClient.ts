import { createClient } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 브라우저용 Supabase 클라이언트 (싱글톤)
let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient

  browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return browserClient
}

// 서버용 Supabase 클라이언트 (필요시 사용)
export function getSupabaseServerClient() {
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// 현재 사용자 정보 가져오기 (브라우저)
export async function getCurrentUser() {
  const supabase = getSupabaseBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const metadata = user.user_metadata || {}

  return {
    id: user.id,
    email: user.email || '',
    role: (metadata.role as UserRole) || 'adopter',
    display_name: (metadata.display_name as string) || '',
    phone: (metadata.phone as string) || undefined,
    created_at: user.created_at,
  }
}

// 액세스 토큰 가져오기 (API 호출용)
export async function getAccessToken(): Promise<string | null> {
  const supabase = getSupabaseBrowserClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}

// 로그아웃
export async function signOut() {
  const supabase = getSupabaseBrowserClient()
  await supabase.auth.signOut()
}

// 로그인
export async function signInWithPassword(email: string, password: string) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { ok: false, error: error.message } as const
  }

  if (!data.user) {
    return { ok: false, error: '로그인에 실패했습니다.' } as const
  }

  const metadata = data.user.user_metadata || {}

  return {
    ok: true,
    user: {
      id: data.user.id,
      email: data.user.email || '',
      role: (metadata.role as UserRole) || 'adopter',
      display_name: (metadata.display_name as string) || '',
      phone: (metadata.phone as string) || undefined,
      created_at: data.user.created_at,
    },
  } as const
}

// 회원가입
export async function signUp(email: string, password: string, role: UserRole, displayName: string, phone?: string) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        display_name: displayName,
        phone: phone || null,
      },
    },
  })

  if (error) {
    return { ok: false, error: error.message } as const
  }

  if (!data.user) {
    return { ok: false, error: '회원가입에 실패했습니다.' } as const
  }

  return {
    ok: true,
    user: {
      id: data.user.id,
      email: data.user.email || '',
      role,
      display_name: displayName,
      phone: phone || undefined,
      created_at: data.user.created_at,
    },
  } as const
}
