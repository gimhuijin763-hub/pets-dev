import { NextRequest, NextResponse } from 'next/server'
import { getSupabasePublicClient, getSupabaseAdminClient } from '@/lib/supabaseServer'
import { isAdminRequest } from '@/lib/adminAuth'
import type { AdoptionStatus } from '@/types'

interface Params {
  params: { id: string }
}

const VALID_STATUSES: AdoptionStatus[] = ['입양 가능', '입양 완료', '검토 중']

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

const UPDATABLE_FIELDS = ['name', 'type', 'breed', 'age', 'gender', 'size', 'location', 'description', 'image_url', 'adoption_status'] as const

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json()

    const updates: Record<string, string> = {}
    for (const field of UPDATABLE_FIELDS) {
      if (typeof body?.[field] === 'string') {
        updates[field] = body[field].trim()
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: '변경할 항목이 없습니다.' }, { status: 400 })
    }

    if (updates.adoption_status && !VALID_STATUSES.includes(updates.adoption_status as AdoptionStatus)) {
      return NextResponse.json({ error: '올바른 입양 상태를 선택해 주세요.' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('animals')
      .update(updates)
      .eq('id', params.id)
      .select('*')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: '수정에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: '관리자 인증이 필요합니다.' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()

    const { error: appError } = await supabase
      .from('applications')
      .delete()
      .eq('animal_id', params.id)

    if (appError) {
      return NextResponse.json({ error: '관련 신청 삭제에 실패했습니다.' }, { status: 500 })
    }

    const { error } = await supabase
      .from('animals')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: '동물 삭제에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}
