import { NextResponse } from 'next/server'
import { clearAdminCookie } from '@/lib/adminAuth'

export async function POST() {
  try {
    const response = NextResponse.json({ ok: true })
    clearAdminCookie(response)
    return response
  } catch {
    return NextResponse.json({ error: '로그아웃 처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
