import Link from 'next/link'
import Image from 'next/image'
import { Animal } from '@/types'
import StatusBadge from '@/components/StatusBadge'

interface Props {
  animal: Animal
}

export default function AnimalCard({ animal }: Props) {
  return (
    <Link href={`/animals/${animal.id}`} className="card group block">
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={animal.image_url}
          alt={animal.name}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={animal.adoption_status} type="adoption" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-bold text-lg text-slate-900">{animal.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {animal.type} · {animal.age} · {animal.gender}
            </p>
          </div>
          <span className="shrink-0 mt-1 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
            #{animal.type}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {animal.description}
        </p>
        <div className="mt-4 flex justify-end">
          <span className="text-xs font-semibold text-brand-500 group-hover:underline">
            상세 보기 →
          </span>
        </div>
      </div>
    </Link>
  )
}
