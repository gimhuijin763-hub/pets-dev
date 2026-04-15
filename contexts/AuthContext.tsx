'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabaseClient'
import type { UserRole } from '@/types'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  display_name: string
  phone?: string
  created_at: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  refreshUser: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (authUser) {
      const metadata = authUser.user_metadata || {}
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        role: (metadata.role as UserRole) || 'adopter',
        display_name: (metadata.display_name as string) || '',
        phone: (metadata.phone as string) || undefined,
        created_at: authUser.created_at,
      })
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refreshUser()

    const supabase = getSupabaseBrowserClient()

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const metadata = session.user.user_metadata || {}
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: (metadata.role as UserRole) || 'adopter',
          display_name: (metadata.display_name as string) || '',
          phone: (metadata.phone as string) || undefined,
          created_at: session.user.created_at,
        })
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      } else if (event === 'USER_UPDATED' && session?.user) {
        const metadata = session.user.user_metadata || {}
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: (metadata.role as UserRole) || 'adopter',
          display_name: (metadata.display_name as string) || '',
          phone: (metadata.phone as string) || undefined,
          created_at: session.user.created_at,
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshUser])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
