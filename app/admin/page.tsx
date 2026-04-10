import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="card p-6 space-y-6">
        <div>
          <h1 className="section-title">관리자 홈</h1>
          <p className="text-sm text-slate-500 mt-2">
            관리 기능으로 이동할 수 있는 시작 화면입니다.
          </p>
        </div>

        <div className="grid gap-3">
          <Link href="/admin/applications" className="btn-primary justify-center">
            입양 신청 관리로 이동
          </Link>
          <Link href="/admin/animals" className="btn-secondary justify-center">
            동물 관리로 이동
          </Link>
          <Link href="/admin/users" className="btn-secondary justify-center">
            사용자 관리로 이동
          </Link>
        </div>
      </div>
    </div>
  )
}
