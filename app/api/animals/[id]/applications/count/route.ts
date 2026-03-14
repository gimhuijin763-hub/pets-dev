import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseServer'

interface Params {
  params: { id: string }
}

export async function GET(_: Request, { params }: Params) {
  try {
    const supabase = getSupabaseAdminClient()
    const { count, error } = await supabase
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .eq('animal_id', params.id)

    if (error) {
      return NextResponse.json({ error: '신청 건수 조회에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ count: count ?? 0 })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}
