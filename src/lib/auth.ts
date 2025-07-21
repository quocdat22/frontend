import { createClient } from '@/lib/supabase/server'

export type UserRole = 'user' | 'admin'

export interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

/**
 * Get current user with their profile including role
 */
export async function getCurrentUserWithProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  try {
    const { data: profileData, error } = await supabase
      .rpc('get_user_profile_with_role', { user_id: user.id })
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return { user, profile: null }
    }
    
    const profile = profileData?.[0] as UserProfile | null
    
    return {
      user,
      profile
    }
  } catch (error) {
    console.error('Error in getCurrentUserWithProfile:', error)
    return { user, profile: null }
  }
}

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  try {
    const { data, error } = await supabase
      .rpc('check_user_is_admin', { check_user_id: user.id })
    
    if (error) {
      console.error('Error checking admin status:', error)
      return false
    }
    
    return data === true
  } catch (error) {
    console.error('Error in isCurrentUserAdmin:', error)
    return false
  }
}

/**
 * Get current user role
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const userWithProfile = await getCurrentUserWithProfile()
  return userWithProfile?.profile?.role || null
}

/**
 * Require admin role - throws error if not admin
 */
export async function requireAdmin() {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    throw new Error('Admin access required')
  }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const userWithProfile = await getCurrentUserWithProfile()
  if (!userWithProfile?.user) {
    throw new Error('Authentication required')
  }
  return userWithProfile
}
