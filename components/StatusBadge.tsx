import { ApplicationStatus, AdoptionStatus } from '@/types'

const applicationColors: Record<ApplicationStatus, string> = {
  '접수':    'bg-blue-50 text-blue-600 ring-1 ring-blue-200',
  '검토 중': 'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
  '승인':   'bg-green-50 text-green-600 ring-1 ring-green-200',
  '거절':   'bg-red-50 text-red-500 ring-1 ring-red-200',
}

const adoptionColors: Record<AdoptionStatus, string> = {
  '입양 가능': 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200',
  '검토 중':  'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
  '입양 완료': 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
}

interface Props {
  status: ApplicationStatus | AdoptionStatus
  type?: 'application' | 'adoption'
}

export default function StatusBadge({ status, type = 'application' }: Props) {
  const colorMap =
    type === 'adoption'
      ? adoptionColors[status as AdoptionStatus]
      : applicationColors[status as ApplicationStatus]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorMap ?? 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  )
}
