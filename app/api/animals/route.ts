import { NextResponse } from 'next/server'
import { getSupabasePublicClient, getSupabaseAdminClient } from '@/lib/supabaseServer'
import type { AdoptionStatus } from '@/types'

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

const VALID_GENDERS = ['남', '여', '모름']
const VALID_STATUSES: AdoptionStatus[] = ['입양 가능', '입양 완료', '검토 중']

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const type = typeof body?.type === 'string' ? body.type.trim() : ''
    const breed = typeof body?.breed === 'string' ? body.breed.trim() : ''
    const age = typeof body?.age === 'string' ? body.age.trim() : ''
    const gender = typeof body?.gender === 'string' ? body.gender.trim() : ''
    const size = typeof body?.size === 'string' ? body.size.trim() : ''
    const location = typeof body?.location === 'string' ? body.location.trim() : ''
    const description = typeof body?.description === 'string' ? body.description.trim() : ''
    const adoption_status = typeof body?.adoption_status === 'string' ? body.adoption_status.trim() : ''

    if (!name || !type || !age || !gender || !location || !description || !adoption_status) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해 주세요.' }, { status: 400 })
    }

    if (description.length < 10) {
      return NextResponse.json({ error: '동물 소개를 10자 이상 작성해 주세요.' }, { status: 400 })
    }

    if (!VALID_GENDERS.includes(gender)) {
      return NextResponse.json({ error: '올바른 성별을 선택해 주세요.' }, { status: 400 })
    }

    if (!VALID_STATUSES.includes(adoption_status as AdoptionStatus)) {
      return NextResponse.json({ error: '올바른 입양 상태를 선택해 주세요.' }, { status: 400 })
    }

    const newAnimal = {
      id: `animal_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      name,
      type,
      breed: breed || null,
      age,
      gender,
      size: size || null,
      location: location || null,
      description,
      image_url: null,
      adoption_status,
      created_at: new Date().toISOString(),
    }

    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('animals')
      .insert([newAnimal])
      .select('*')
      .single()

    if (error || !data) {
      console.error('Animal insert error:', error)
      if (error?.code === '42501') {
        return NextResponse.json(
          { error: 'DB 쓰기 권한이 없습니다. SUPABASE_SERVICE_ROLE_KEY가 올바른지 확인해 주세요.' },
          { status: 500 }
        )
      }
      return NextResponse.json({ error: '동물 등록에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}
