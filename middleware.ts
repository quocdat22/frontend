import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // First, update the session to keep it fresh
  const response = await updateSession(request)
  
  const pathname = request.nextUrl.pathname
  
  // Define protected routes
  const adminRoutes = ['/admin']
  const protectedRoutes = ['/profile', ...adminRoutes]
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  // If it's not a protected route, just continue
  if (!isProtectedRoute) {
    return response
  }
  
  // For protected routes, we need to check the user session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        // We don't need to set/remove cookies here as updateSession already does
        set: () => {},
        remove: () => {},
      },
    }
  )
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  // If no user is logged in, redirect to login page
  if (!user || userError) {
    console.log(`[Middleware] No user found for path: ${pathname}. Redirecting to /login.`)
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }
  
  // If it's an admin route, we need to verify the user's role
  if (isAdminRoute) {
    console.log(`[Middleware] Admin route accessed: ${pathname}. Checking role for user: ${user.id}`)
    try {
      // Use the RPC function to check for admin role
      const { data: isAdmin, error: rpcError } = await supabase
        .rpc('check_user_is_admin', { check_user_id: user.id })

      // --- START DEBUGGING ---
      console.log(`[DEBUG] RPC Result for user ${user.id}:`);
      console.log(`[DEBUG] isAdmin value:`, isAdmin);
      console.log(`[DEBUG] rpcError value:`, rpcError);
      // ---  END DEBUGGING  ---
      
      if (rpcError) {
        console.error(`[Middleware] RPC error checking admin status for user ${user.id}:`, rpcError)
        // return NextResponse.redirect(new URL('/', request.url)) // Temporarily disabled
      }
      
      if (isAdmin !== true) {
        console.log(`[Middleware] User ${user.id} is not an admin. Redirecting to home.`)
        // return NextResponse.redirect(new URL('/', request.url)) // Temporarily disabled
      }
      
      console.log(`[Middleware] Admin access granted for user ${user.id} to path ${pathname}.`)
    } catch (error) {
      console.error(`[Middleware] Exception checking admin status for user ${user.id}:`, error)
      // return NextResponse.redirect(new URL('/', request.url)) // Temporarily disabled
    }
  }
  
  // If all checks pass, allow the request to proceed
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}