import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

function assertEnv(value: string, name: string) {
  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`)
  }
}

export function getSupabasePublicClient() {
  assertEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL')
  assertEnv(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  })
}

export function getSupabaseAdminClient() {
  assertEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL')
  assertEnv(supabaseServiceRoleKey, 'SUPABASE_SERVICE_ROLE_KEY')

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  })
}
