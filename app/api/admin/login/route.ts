import { NextResponse } from 'next/server'
import { isValidAdminPassword, setAdminCookie } from '@/lib/adminAuth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!password) {
      return NextResponse.json({ error: '비밀번호를 입력해 주세요.' }, { status: 400 })
    }

    if (!isValidAdminPassword(password)) {
      return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    setAdminCookie(response)
    return response
  } catch {
    return NextResponse.json({ error: '로그인 처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
