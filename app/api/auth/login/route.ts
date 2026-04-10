import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json({ error: '이메일과 비밀번호를 입력해 주세요.' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Login error:', authError.message, authError.status)
      return NextResponse.json({ error: '로그인 실패: ' + authError.message }, { status: 401 })
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json({ error: '로그인에 실패했습니다.' }, { status: 500 })
    }

    // user_metadata에서 역할 정보 읽기
    const meta = authData.user.user_metadata ?? {}

    return NextResponse.json({
      data: {
        id: authData.user.id,
        email: authData.user.email,
        role: meta.role ?? null,
        display_name: meta.display_name ?? '',
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      },
    })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
