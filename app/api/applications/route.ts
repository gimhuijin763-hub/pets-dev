import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabaseServer'
import { isAdminRequest } from '@/lib/adminAuth'

const PHONE_REGEX = /^[0-9\-+\s]{9,13}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: '관리자 인증이 필요합니다.' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: '신청 목록 조회에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const applicantName = typeof body?.applicant_name === 'string' ? body.applicant_name.trim() : ''
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const reason = typeof body?.reason === 'string' ? body.reason.trim() : ''
    const animalId = typeof body?.animal_id === 'string' ? body.animal_id.trim() : ''

    if (!applicantName || !phone || !email || !reason || !animalId) {
      return NextResponse.json({ error: '필수 입력값이 누락되었습니다.' }, { status: 400 })
    }

    if (!PHONE_REGEX.test(phone)) {
      return NextResponse.json({ error: '올바른 연락처를 입력해 주세요.' }, { status: 400 })
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: '올바른 이메일을 입력해 주세요.' }, { status: 400 })
    }

    if (reason.length < 20) {
      return NextResponse.json({ error: '신청 사유는 20자 이상이어야 합니다.' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const { data: animal, error: animalError } = await supabase
      .from('animals')
      .select('id, adoption_status')
      .eq('id', animalId)
      .single()

    if (animalError || !animal) {
      return NextResponse.json({ error: '신청 대상 동물을 찾을 수 없습니다.' }, { status: 404 })
    }

    if (animal.adoption_status !== '입양 가능') {
      return NextResponse.json({ error: '현재 입양 신청을 받을 수 없습니다.' }, { status: 400 })
    }

    const { data: existingApplication, error: existingError } = await supabase
      .from('applications')
      .select('id')
      .eq('animal_id', animalId)
      .eq('email', email)
      .limit(1)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json({ error: '기존 신청 내역 확인에 실패했습니다.' }, { status: 500 })
    }

    if (existingApplication) {
      return NextResponse.json(
        { error: '같은 이메일로 이미 해당 동물에 대한 입양 신청이 접수되어 있습니다.' },
        { status: 409 }
      )
    }

    const newApplication = {
      id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      animal_id: animalId,
      applicant_name: applicantName,
      phone,
      email,
      reason,
      status: '접수',
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([newApplication])
      .select('*')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: '신청 저장에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: '서버 설정 오류가 발생했습니다.' }, { status: 500 })
  }
}
