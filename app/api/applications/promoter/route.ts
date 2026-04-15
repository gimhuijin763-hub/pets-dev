import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseServer'
import { requirePromoter } from '@/lib/apiAuth'

// 홍보자용: 자신의 동물에 대한 신청 목록 조회
export async function GET(request: NextRequest) {
  try {
    const authResult = await requirePromoter(request)
    if (authResult.response) return authResult.response
    const user = authResult.user

    const supabase = getSupabaseAdminClient()

    // 1. 먼저 이 홍보자의 동물 ID 목록을 가져옴
    const { data: myAnimals, error: animalsError } = await supabase
      .from('animals')
      .select('id')
      .eq('promoter_id', user.id)

    if (animalsError) {
      return NextResponse.json(
        { error: '동물 목록 조회에 실패했습니다.', code: 'DB_ERROR' },
        { status: 500 }
      )
    }

    if (!myAnimals || myAnimals.length === 0) {
      return NextResponse.json({ data: [] })
    }

    const animalIds = myAnimals.map(a => a.id)

    // 2. 이 동물들에 대한 신청 목록 조회
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select('*, animals(id, name, type, image_url)')
      .in('animal_id', animalIds)
      .order('created_at', { ascending: false })

    if (appsError) {
      return NextResponse.json(
        { error: '신청 목록 조회에 실패했습니다.', code: 'DB_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: applications ?? [] })
  } catch {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
