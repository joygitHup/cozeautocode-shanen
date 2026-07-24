import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

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

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('consultations')
      .insert({
        name,
        phone,
        company: company || null,
        domain: domain || null,
        message: message || null,
      })
      .select()
      .single();

    if (error) throw new Error(`插入失败: ${error.message}`);

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

    const client = getSupabaseClient();
    let query = client
      .from('consultations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (keyword) {
      query = query.or(
        `name.ilike.%${keyword}%,company.ilike.%${keyword}%,phone.ilike.%${keyword}%`
      );
    }

    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;
    if (error) throw new Error(`查询失败: ${error.message}`);

    return NextResponse.json({
      success: true,
      data: data || [],
      total: count || 0,
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
