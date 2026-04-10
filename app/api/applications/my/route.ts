import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseServer'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')?.trim().toLowerCase()

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: '올바른 이메일을 입력해 주세요.' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('applications')
      .select('*, animals(id, name, type, breed, image_url, adoption_status)')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: '신청 내역 조회에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}
