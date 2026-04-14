import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseServer'
import { createClient } from '@supabase/supabase-js'

const VALID_STATUSES = ['접수', '검토 중', '승인', '거절']

interface Params {
  params: { id: string }
}

// JWT 토큰으로부터 사용자 ID와 역할을 추출
async function verifyUserFromToken(request: Request): Promise<{ id: string; role: string } | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.substring(7)
  if (!token) return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null

  const metadata = data.user.user_metadata || {}
  return {
    id: data.user.id,
    role: metadata.role || '',
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    // 인증 확인
    const user = await verifyUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const body = await request.json()
    const status = typeof body?.status === 'string' ? body.status : ''

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: '유효하지 않은 상태입니다.' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()

    // 신청 정보 및 관련 동물 정보 조회
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*, animals!inner(promoter_id)')
      .eq('id', params.id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ error: '신청 정보를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 권한 검사
    const isAdmin = user.role === 'admin'
    const isPromoter = user.role === 'promoter'
    const animalPromoterId = (application.animals as { promoter_id: string }).promoter_id
    const isAnimalOwner = isPromoter && animalPromoterId === user.id

    // 관리자 또는 동물 소유자만 상태 변경 가능
    if (!isAdmin && !isAnimalOwner) {
      return NextResponse.json(
        { error: '해당 신청의 상태를 변경할 권한이 없습니다.' },
        { status: 403 }
      )
    }

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
