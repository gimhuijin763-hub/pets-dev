'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import type { UserRole } from '@/types'

interface UseAuthOptions {
  requiredRole?: UserRole
  redirectTo?: string
}

interface UseAuthResult {
  user: {
    id: string
    email: string
    role: UserRole
    display_name: string
    phone?: string
    created_at: string
  } | null
  loading: boolean
  signOut: () => Promise<void>
}

export function useAuth(options: UseAuthOptions = {}): UseAuthResult {
  const { requiredRole, redirectTo = '/login' } = options
  const router = useRouter()
  const { user, loading, signOut } = useAuthContext()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace(redirectTo)
      return
    }

    if (requiredRole && user.role !== requiredRole) {
      // 역할이 다르면 본인 역할의 대시보드로 이동
      if (user.role === 'adopter') {
        router.replace('/adopter/dashboard')
      } else if (user.role === 'promoter') {
        router.replace('/promoter/dashboard')
      } else {
        router.replace('/')
      }
      return
    }
  }, [requiredRole, redirectTo, router, user, loading])

  return { user, loading, signOut }
}
