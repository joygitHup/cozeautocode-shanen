import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-auth';

/** 无需登录即可访问的路径 */
function isPublic(pathname: string, method: string): boolean {
  if (pathname === '/shanenadmin/login') return true;
  if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') return true;
  // 官网咨询表单提交必须允许匿名
  if (pathname === '/api/consultation' && method === 'POST') return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublic(pathname, request.method)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (await verifySessionToken(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { success: false, error: '未登录或登录已过期' },
      { status: 401 },
    );
  }

  return NextResponse.redirect(new URL('/shanenadmin/login', request.url));
}

export const config = {
  matcher: [
    '/shanenadmin/:path*',
    '/api/consultation',
    '/api/consultation/:path*',
    '/api/stats/:path*',
    '/api/visits/:path*',
  ],
};
