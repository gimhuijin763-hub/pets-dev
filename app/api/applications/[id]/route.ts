import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseServer'

const VALID_STATUSES = ['접수', '검토 중', '승인', '거절']

interface Params {
  params: { id: string }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json()
    const status = typeof body?.status === 'string' ? body.status : ''

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: '유효하지 않은 상태입니다.' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: '상태 변경에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}
