import Link from 'next/link'
import { PawPrint, Heart, Megaphone } from 'lucide-react'

export default function SignupRolePage() {
  return (
    <div className="max-w-lg mx-auto py-12">
      <div className="text-center mb-10">
        <PawPrint className="w-10 h-10 text-brand-500 mx-auto mb-3" />
        <h1 className="text-2xl font-extrabold text-slate-900">회원가입</h1>
        <p className="text-sm text-slate-500 mt-2">
          어떤 역할로 가입하시겠어요?
        </p>
      </div>

      <div className="grid gap-4">
        <Link
          href="/signup/adopter"
          className="card p-6 flex items-center gap-4 hover:ring-2 hover:ring-brand-400 transition group"
        >
          <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0 group-hover:bg-pink-100 transition">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <p className="font-bold text-slate-900">입양 희망자</p>
            <p className="text-xs text-slate-500 mt-1">
              입양 가능한 동물을 찾아보고 입양 신청을 할 수 있어요.
            </p>
          </div>
        </Link>

        <Link
          href="/signup/promoter"
          className="card p-6 flex items-center gap-4 hover:ring-2 hover:ring-brand-400 transition group"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition">
            <Megaphone className="w-7 h-7" />
          </div>
          <div>
            <p className="font-bold text-slate-900">홍보 담당자</p>
            <p className="text-xs text-slate-500 mt-1">
              보호소 동물을 등록하고 입양 홍보를 관리할 수 있어요.
            </p>
          </div>
        </Link>
      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-brand-500 font-medium hover:underline">
          로그인
        </Link>
      </p>
    </div>
  )
}
