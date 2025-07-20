import { NextRequest, NextResponse } from 'next/server';

// Middleware xác thực Supabase cho API
export async function middleware(request: NextRequest) {

  // Lấy access token từ header Authorization (Bearer ...) hoặc cookie (sb-access-token)
  let token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    token = request.cookies.get('sb-access-token')?.value;
  }

  // Kiểm tra nếu là truy cập trang /profile (frontend)
  if (request.nextUrl.pathname === '/profile') {
    if (!token) {
      // Redirect về trang đăng nhập nếu chưa đăng nhập
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Xác thực token với Supabase
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
    });
    if (!res.ok) {
      // Redirect về trang đăng nhập nếu token không hợp lệ
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Các route API private khác vẫn trả về JSON 401 nếu không hợp lệ
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    },
  });
  if (!res.ok) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/api/private/:path*'], // Chỉ áp dụng cho /profile và các API private
};
