import { NextRequest, NextResponse } from 'next/server'
import { getSupabasePublicClient, getSupabaseAdminClient } from '@/lib/supabaseServer'
import { isAdminRequest } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'
import type { AdoptionStatus } from '@/types'

interface Params {
  params: { id: string }
}

const VALID_STATUSES: AdoptionStatus[] = ['입양 가능', '입양 완료', '검토 중']

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

export async function GET(_: Request, { params }: Params) {
  try {
    const supabase = getSupabasePublicClient()
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: '동물 정보를 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}

const UPDATABLE_FIELDS = ['name', 'type', 'breed', 'age', 'gender', 'size', 'location', 'description', 'image_url', 'adoption_status'] as const

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    // 인증 확인
    const user = await verifyUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    // 관리자는 모든 동물 수정 가능, promoter는 자신의 동물만
    const isAdmin = user.role === 'admin'

    const supabase = getSupabaseAdminClient()

    // 동물 정보 및 소유자 확인
    const { data: animal, error: fetchError } = await supabase
      .from('animals')
      .select('id, promoter_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !animal) {
      return NextResponse.json({ error: '동물 정보를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 권한 검사: 관리자가 아니면서 소유자도 아닌 경우
    if (!isAdmin && animal.promoter_id !== user.id) {
      return NextResponse.json({ error: '자신이 등록한 동물만 수정할 수 있습니다.' }, { status: 403 })
    }

    const body = await request.json()

    const updates: Record<string, string> = {}
    for (const field of UPDATABLE_FIELDS) {
      if (typeof body?.[field] === 'string') {
        updates[field] = body[field].trim()
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: '변경할 항목이 없습니다.' }, { status: 400 })
    }

    if (updates.adoption_status && !VALID_STATUSES.includes(updates.adoption_status as AdoptionStatus)) {
      return NextResponse.json({ error: '올바른 입양 상태를 선택해 주세요.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('animals')
      .update(updates)
      .eq('id', params.id)
      .select('*')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: '수정에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const supabase = getSupabaseAdminClient()

    // 관리자 쿠키 인증 확인
    const isAdminByCookie = isAdminRequest(request)

    // JWT 토큰 인증 확인
    const user = await verifyUserFromToken(request)
    const isAdminByToken = user?.role === 'admin'
    const isPromoter = user?.role === 'promoter'

    // 관리자가 아닌 경우, 소유자인지 확인
    if (!isAdminByCookie && !isAdminByToken) {
      if (!user) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
      }

      if (!isPromoter) {
        return NextResponse.json({ error: '홍보자만 동물을 삭제할 수 있습니다.' }, { status: 403 })
      }

      // 동물 소유자 확인
      const { data: animal, error: fetchError } = await supabase
        .from('animals')
        .select('promoter_id')
        .eq('id', params.id)
        .single()

      if (fetchError || !animal) {
        return NextResponse.json({ error: '동물 정보를 찾을 수 없습니다.' }, { status: 404 })
      }

      if (animal.promoter_id !== user.id) {
        return NextResponse.json({ error: '자신이 등록한 동물만 삭제할 수 있습니다.' }, { status: 403 })
      }
    }

    const { error: appError } = await supabase
      .from('applications')
      .delete()
      .eq('animal_id', params.id)

    if (appError) {
      return NextResponse.json({ error: '관련 신청 삭제에 실패했습니다.' }, { status: 500 })
    }

    const { error } = await supabase
      .from('animals')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: '동물 삭제에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}
