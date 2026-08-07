import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlite';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
    const keyword = searchParams.get('keyword') || '';
    const dateFrom = searchParams.get('from') || '';
    const dateTo = searchParams.get('to') || '';

    const offset = (page - 1) * pageSize;
    const conditions: string[] = [];
    const params: Record<string, string | number> = {};

    if (keyword) {
      conditions.push('(path LIKE @keyword OR ip LIKE @keyword OR region LIKE @keyword OR referer LIKE @keyword)');
      params.keyword = `%${keyword}%`;
    }
    if (dateFrom) {
      conditions.push("created_at >= @dateFrom");
      params.dateFrom = `${dateFrom} 00:00:00`;
    }
    if (dateTo) {
      conditions.push("created_at <= @dateTo");
      params.dateTo = `${dateTo} 23:59:59`;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const totalRow = db
      .prepare(`SELECT COUNT(*) as count FROM visits ${whereClause}`)
      .get(params) as { count: number };

    const rows = db
      .prepare(
        `SELECT id, ip, region, path, referer, duration, user_agent, created_at
         FROM visits ${whereClause}
         ORDER BY created_at DESC
         LIMIT @pageSize OFFSET @offset`
      )
      .all({ ...params, pageSize, offset }) as Record<string, unknown>[];

    return NextResponse.json({
      success: true,
      data: rows,
      total: totalRow.count,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Failed to fetch visits:', error);
    return NextResponse.json(
      { success: false, error: '查询失败' },
      { status: 500 }
    );
  }
}
