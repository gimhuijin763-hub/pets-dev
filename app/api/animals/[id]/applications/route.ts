import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseServer'
import { requireAuth } from '@/lib/apiAuth'

interface Params {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    // 인증 확인
    const authResult = await requireAuth(request)
    if (authResult.response) return authResult.response
    const user = authResult.user

    const animalId = params.id
    if (!animalId) {
      return NextResponse.json(
        { error: '동물 ID가 필요합니다.', code: 'BAD_REQUEST' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdminClient()

    // 동물 정보 조회 (promoter_id 확인용)
    const { data: animal, error: animalError } = await supabase
      .from('animals')
      .select('promoter_id')
      .eq('id', animalId)
      .single()

    if (animalError || !animal) {
      return NextResponse.json(
        { error: '동물을 찾을 수 없습니다.', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // 권한 검사: 관리자이거나 해당 동물의 소유자인 경우만 조회 가능
    const isAdmin = user.role === 'admin'
    const isOwner = animal.promoter_id === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: '이 동물의 신청 목록을 조회할 권한이 없습니다.', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('animal_id', animalId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: '신청 목록 조회에 실패했습니다.', code: 'DB_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
