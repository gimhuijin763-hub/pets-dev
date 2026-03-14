import { NextResponse } from 'next/server'
import { getSupabasePublicClient } from '@/lib/supabaseServer'

interface Params {
  params: { id: string }
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
