import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlite';
import crypto from 'crypto';

// 忽略统计的路径前缀
const IGNORE_PATHS = ['/api/', '/admin', '/_next/', '/favicon.ico', '/static/'];

function shouldTrack(path: string): boolean {
  return !IGNORE_PATHS.some((prefix) => path.startsWith(prefix));
}

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

function getOrCreateSessionId(request: NextRequest, response: NextResponse): string {
  let sessionId = request.cookies.get('shane_sid')?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    response.cookies.set('shane_sid', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 60, // 30 分钟
      path: '/',
    });
  } else {
    // 续期
    response.cookies.set('shane_sid', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 60,
      path: '/',
    });
  }

  return sessionId;
}

// 记录访问（前端调用）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referer, duration = 0 } = body;

    if (!path || !shouldTrack(path)) {
      return NextResponse.json({ success: true, data: null });
    }

    const db = getDb();
    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || '';

    const response = NextResponse.json({ success: true, data: null });
    const sessionId = getOrCreateSessionId(request, response);

    // 记录访问
    db.prepare(
      `INSERT INTO visits (session_id, ip, path, referer, user_agent, duration)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(sessionId, ip, path, referer || '', userAgent, duration);

    // 维护每日统计
    const today = new Date().toISOString().slice(0, 10);
    const existing = db
      .prepare('SELECT * FROM page_stats WHERE date = ? AND path = ?')
      .get(today, path) as { page_views: number; unique_visitors: number } | undefined;

    if (existing) {
      db.prepare(
        `UPDATE page_stats SET page_views = page_views + 1 WHERE date = ? AND path = ?`,
      ).run(today, path);

      // 检查是否新访客
      const visitorCount = db
        .prepare(
          `SELECT COUNT(DISTINCT session_id) as cnt FROM visits
           WHERE date(created_at) = ? AND path = ?`,
        )
        .get(today, path) as { cnt: number };

      if (visitorCount.cnt !== existing.unique_visitors) {
        db.prepare(
          `UPDATE page_stats SET unique_visitors = ? WHERE date = ? AND path = ?`,
        ).run(visitorCount.cnt, today, path);
      }
    } else {
      db.prepare(
        `INSERT INTO page_stats (date, path, page_views, unique_visitors)
         VALUES (?, ?, 1, 1)`,
      ).run(today, path);
    }

    return response;
  } catch (err) {
    console.error('[visit] record error:', err);
    return NextResponse.json({ success: false, error: '记录失败' }, { status: 500 });
  }
}
