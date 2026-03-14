import { NextResponse } from 'next/server'
import { getSupabasePublicClient } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const supabase = getSupabasePublicClient()
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: '동물 목록 조회에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}
