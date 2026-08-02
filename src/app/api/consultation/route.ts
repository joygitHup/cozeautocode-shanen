import { NextRequest, NextResponse } from 'next/server';
import { getDb, generateId } from '@/lib/sqlite';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, company, domain, message } = body as {
      name?: string;
      phone?: string;
      company?: string;
      domain?: string;
      message?: string;
    };

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: '姓名和电话为必填项' },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = generateId();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO consultations (id, name, phone, company, domain, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`
    ).run(id, name, phone, company || null, domain || null, message || null, now);

    const data = db
      .prepare('SELECT * FROM consultations WHERE id = ?')
      .get(id);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '提交失败';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const status = searchParams.get('status');
    const keyword = searchParams.get('keyword');

    const db = getDb();
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (keyword) {
      conditions.push('(name LIKE ? OR company LIKE ? OR phone LIKE ?)');
      const kw = `%${keyword}%`;
      params.push(kw, kw, kw);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRow = db
      .prepare(`SELECT COUNT(*) as total FROM consultations ${where}`)
      .get(...params) as { total: number };
    const total = countRow.total;

    const offset = (page - 1) * pageSize;
    const data = db
      .prepare(
        `SELECT * FROM consultations ${where}
         ORDER BY created_at DESC LIMIT ? OFFSET ?`
      )
      .all(...params, pageSize, offset);

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      pageSize,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '查询失败';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
