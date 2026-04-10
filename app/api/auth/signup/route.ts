import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''
    const role = typeof body?.role === 'string' ? body.role.trim() : ''
    const display_name = typeof body?.display_name === 'string' ? body.display_name.trim() : ''
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''

    if (!email || !password || !role || !display_name) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해 주세요.' }, { status: 400 })
    }

    if (!['adopter', 'promoter'].includes(role)) {
      return NextResponse.json({ error: '올바른 역할을 선택해 주세요.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '비밀번호는 6자 이상이어야 합니다.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '올바른 이메일 형식을 입력해 주세요.' }, { status: 400 })
    }

    // Supabase Auth signUp (역할 정보를 user_metadata에 저장)
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, display_name, phone: phone || null },
      },
    })

    if (authError) {
      if (authError.message?.includes('already been registered') || authError.message?.includes('already registered')) {
        return NextResponse.json({ error: '이미 가입된 이메일입니다.' }, { status: 409 })
      }
      console.error('Auth signup error:', authError)
      return NextResponse.json({ error: '회원가입에 실패했습니다: ' + authError.message }, { status: 500 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: '사용자 생성에 실패했습니다.' }, { status: 500 })
    }

    // signUp이 세션을 반환하면 바로 사용 (이메일 확인 OFF인 경우)
    // 세션이 없으면 (이메일 확인 ON) signIn을 시도하지 않고 가입만 완료
    const session = authData.session

    return NextResponse.json({
      data: {
        id: authData.user.id,
        email: authData.user.email,
        role,
        display_name,
        access_token: session?.access_token ?? null,
        refresh_token: session?.refresh_token ?? null,
      },
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
