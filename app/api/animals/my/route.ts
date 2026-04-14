import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseServer'
import { createClient } from '@supabase/supabase-js'

// JWT 토큰으로부터 사용자 ID와 역할을 추출
async function verifyUserFromToken(request: Request): Promise<{ id: string; role: string } | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.substring(7)
  if (!token) return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null

  const metadata = data.user.user_metadata || {}
  return {
    id: data.user.id,
    role: metadata.role || '',
  }
}

// 현재 로그인한 홍보자의 동물 목록 조회
export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    if (user.role !== 'promoter' && user.role !== 'admin') {
      return NextResponse.json({ error: '홍보자만 접근할 수 있습니다.' }, { status: 403 })
    }

    const supabase = getSupabaseAdminClient()

    // 관리자는 모든 동물 조회 가능, 홍보자는 자신의 동물만
    let query = supabase.from('animals').select('*').order('created_at', { ascending: false })

    if (user.role === 'promoter') {
      query = query.eq('promoter_id', user.id)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: '동물 목록 조회에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}
