import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  createSessionToken,
  getAdminPassword,
  getSessionCookieOptions,
  safeEqual,
} from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password ?? '';

    const expected = getAdminPassword();
    if (!expected) {
      return NextResponse.json(
        { success: false, error: '后台未配置 ADMIN_PASSWORD' },
        { status: 500 },
      );
    }

    if (!password || !safeEqual(password, expected)) {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 },
      );
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, getSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ success: false, error: '登录失败' }, { status: 500 });
  }
}
