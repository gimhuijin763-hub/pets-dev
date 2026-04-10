import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseServer'

interface Params {
  params: { id: string }
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const animalId = params.id
    if (!animalId) {
      return NextResponse.json({ error: '동물 ID가 필요합니다.' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('animal_id', animalId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: '신청 목록 조회에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}
