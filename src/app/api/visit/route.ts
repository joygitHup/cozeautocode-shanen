import { NextRequest, NextResponse } from 'next/server';
import { getDb, nowLocalDate, nowLocalDateTime } from '@/lib/sqlite';
import crypto from 'crypto';

export const runtime = 'nodejs';

const IGNORE_PATHS = ['/api/', '/shanenadmin', '/_next/', '/favicon.ico', '/static/'];
const PRIVATE_IP =
  /^(?:127\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|::1$|localhost$|unknown$)/i;
const regionCache = new Map<string, string>();

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

function formatRegion(parts: Array<string | undefined>): string | null {
  const unique = parts.filter((part, index, arr): part is string => {
    return Boolean(part) && arr.indexOf(part) === index;
  });
  if (unique.length === 0) return null;
  if (unique[0] === '中国') {
    unique.shift();
  }
  return unique.join('') || null;
}

async function lookupRegion(ip: string): Promise<string | null> {
  if (!ip || PRIVATE_IP.test(ip)) return '本地';
  const cached = regionCache.get(ip);
  if (cached) return cached;

  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?lang=zh-CN&fields=status,country,regionName,city`,
      { signal: AbortSignal.timeout(2000) },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      status?: string;
      country?: string;
      regionName?: string;
      city?: string;
    };
    if (data.status !== 'success') return null;
    const region = formatRegion([data.country, data.regionName, data.city]);
    if (region) regionCache.set(ip, region);
    return region;
  } catch {
    return null;
  }
}

function getOrCreateSessionId(request: NextRequest, response: NextResponse): string {
  let sessionId = request.cookies.get('shane_sid')?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }

  response.cookies.set('shane_sid', sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 60,
    path: '/',
  });

  return sessionId;
}

function upsertPageStats(path: string): void {
  const db = getDb();
  const today = nowLocalDate();
  const existing = db
    .prepare('SELECT * FROM page_stats WHERE date = ? AND path = ?')
    .get(today, path) as { page_views: number; unique_visitors: number } | undefined;

  if (existing) {
    db.prepare(
      `UPDATE page_stats SET page_views = page_views + 1 WHERE date = ? AND path = ?`,
    ).run(today, path);

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
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      path?: string;
      referer?: string;
      duration?: number;
    };
    const { path, referer, duration = 0 } = body;

    if (!path || !shouldTrack(path)) {
      return NextResponse.json({ success: true, data: null });
    }

    const db = getDb();
    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || '';
    const cachedRegion = PRIVATE_IP.test(ip) ? '本地' : (regionCache.get(ip) ?? null);

    const response = NextResponse.json({ success: true, data: null });
    const sessionId = getOrCreateSessionId(request, response);

    // duration > 0 表示停留时长回传：只更新已有访问记录，不再新增 PV
    if (duration > 0) {
      db.prepare(
        `UPDATE visits SET duration = ?
         WHERE id = (
           SELECT id FROM visits
           WHERE session_id = ? AND path = ?
           ORDER BY id DESC LIMIT 1
         )`,
      ).run(duration, sessionId, path);
      return response;
    }

    const insertResult = db.prepare(
      `INSERT INTO visits (session_id, ip, region, path, referer, user_agent, duration, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
    ).run(
      sessionId,
      ip,
      cachedRegion,
      path,
      referer || '',
      userAgent,
      nowLocalDateTime(),
    );

    if (!cachedRegion) {
      const visitId = insertResult.lastInsertRowid;
      void lookupRegion(ip).then((region) => {
        if (!region) return;
        try {
          getDb()
            .prepare('UPDATE visits SET region = ? WHERE id = ?')
            .run(region, visitId);
        } catch {
          // 地区回填失败不影响主流程
        }
      });
    }

    upsertPageStats(path);

    return response;
  } catch (err) {
    console.error('[visit] record error:', err);
    return NextResponse.json({ success: false, error: '记录失败' }, { status: 500 });
  }
}
