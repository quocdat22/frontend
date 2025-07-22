"use client";

import { type AuthChangeEvent, type Session, type User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { ReactNode } from 'react'

export type Role = 'admin' | 'moderator' | 'user'

interface AuthContextType {
  user: User | null
  role: Role | null
  isAdmin: boolean
  isModerator: boolean
  isUser: boolean
  hasRole: (roles: Role[]) => boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserAndRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      //console.log('[AuthContext] getUser', user)
      setUser(user ?? null)
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        //console.log('[AuthContext] getUser profile', profile)
        setRole((profile?.role as Role) ?? 'user')
      } else {
        setRole(null)
      }
      setLoading(false)
      //console.log('[AuthContext] getUserAndRole done', { user, role, loading: false })
    }

    getUserAndRole()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('[AuthContext] onAuthStateChange', _event, session)
        setUser(session?.user ?? null)
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
          console.log('[AuthContext] onAuthStateChange profile', profile)
          setRole((profile?.role as Role) ?? 'user')
        } else {
          setRole(null)
        }
        setLoading(false)
        console.log('[AuthContext] onAuthStateChange done', { user: session?.user, role, loading: false })
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const hasRole = (roles: Role[]) => (role ? roles.includes(role) : false)

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin: role === 'admin',
        isModerator: role === 'moderator',
        isUser: role === 'user',
        hasRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 