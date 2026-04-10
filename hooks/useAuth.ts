'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, type AuthUser } from '@/utils/auth'
import type { UserRole } from '@/types'

interface UseAuthOptions {
  requiredRole?: UserRole
  redirectTo?: string
}

interface UseAuthResult {
  user: AuthUser | null
  loading: boolean
}

export function useAuth(options: UseAuthOptions = {}): UseAuthResult {
  const { requiredRole, redirectTo = '/login' } = options
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const current = getCurrentUser()

    if (!current) {
      router.replace(redirectTo)
      return
    }

    if (requiredRole && current.role !== requiredRole) {
      // 역할이 다르면 본인 역할의 대시보드로 이동
      if (current.role === 'adopter') {
        router.replace('/adopter/dashboard')
      } else if (current.role === 'promoter') {
        router.replace('/promoter/dashboard')
      } else {
        router.replace('/')
      }
      return
    }

    setUser(current)
    setLoading(false)
  }, [requiredRole, redirectTo, router])

  return { user, loading }
}
