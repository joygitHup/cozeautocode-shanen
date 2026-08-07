import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlite';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get('range') || '7') as string;
    const days = parseInt(range, 10) || 7;

    const db = getDb();

    // 概览数据
    const overview = db
      .prepare(
        `SELECT
          (SELECT COUNT(*) FROM visits WHERE date(created_at) >= date('now', ?)) as total_visits,
          (SELECT COUNT(DISTINCT session_id) FROM visits WHERE date(created_at) >= date('now', ?)) as total_visitors,
          (SELECT COUNT(DISTINCT path) FROM visits WHERE date(created_at) >= date('now', ?)) as total_pages,
          (SELECT COUNT(*) FROM consultations WHERE date(created_at) >= date('now', ?)) as total_consultations`,
      )
      .get(
        `-${days - 1} days`,
        `-${days - 1} days`,
        `-${days - 1} days`,
        `-${days - 1} days`,
      ) as {
      total_visits: number;
      total_visitors: number;
      total_pages: number;
      total_consultations: number;
    };

    // 日访问趋势
    const dailyTrend = db
      .prepare(
        `SELECT
          date(created_at) as date,
          COUNT(*) as page_views,
          COUNT(DISTINCT session_id) as unique_visitors
         FROM visits
         WHERE date(created_at) >= date('now', ?)
         GROUP BY date(created_at)
         ORDER BY date ASC`,
      )
      .all(`-${days - 1} days`) as Array<{
      date: string;
      page_views: number;
      unique_visitors: number;
    }>;

    // 填充没有数据的日期
    const trendMap = new Map(dailyTrend.map((d) => [d.date, d]));
    const filledTrend: typeof dailyTrend = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      filledTrend.push(
        trendMap.get(dateStr) || {
          date: dateStr,
          page_views: 0,
          unique_visitors: 0,
        },
      );
    }

    // 热门页面 TOP 10
    const topPages = db
      .prepare(
        `SELECT
          path,
          page_views,
          unique_visitors
         FROM page_stats
         WHERE date >= date('now', ?)
         GROUP BY path
         ORDER BY page_views DESC
         LIMIT 10`,
      )
      .all(`-${days - 1} days`) as Array<{
      path: string;
      page_views: number;
      unique_visitors: number;
    }>;

    // 流量来源（Referer）TOP 10
    const topReferrers = db
      .prepare(
        `SELECT
          CASE
            WHEN referer = '' OR referer IS NULL THEN '直接访问'
            ELSE referer
          END as referer,
          COUNT(*) as visits
         FROM visits
         WHERE date(created_at) >= date('now', ?)
         GROUP BY referer
         ORDER BY visits DESC
         LIMIT 10`,
      )
      .all(`-${days - 1} days`) as Array<{ referer: string; visits: number }>;

    // 今日与昨日对比
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    const todayData = db
      .prepare(
        `SELECT
          (SELECT COUNT(*) FROM visits WHERE date(created_at) = ?) as visits,
          (SELECT COUNT(DISTINCT session_id) FROM visits WHERE date(created_at) = ?) as visitors,
          (SELECT COUNT(*) FROM consultations WHERE date(created_at) = ?) as consultations`,
      )
      .get(today, today, today) as { visits: number; visitors: number; consultations: number };

    const yesterdayData = db
      .prepare(
        `SELECT
          (SELECT COUNT(*) FROM visits WHERE date(created_at) = ?) as visits,
          (SELECT COUNT(DISTINCT session_id) FROM visits WHERE date(created_at) = ?) as visitors,
          (SELECT COUNT(*) FROM consultations WHERE date(created_at) = ?) as consultations`,
      )
      .get(yesterday, yesterday, yesterday) as { visits: number; visitors: number; consultations: number };

    function calcChange(today: number, yesterday: number): number {
      if (yesterday === 0) return today > 0 ? 100 : 0;
      return Math.round(((today - yesterday) / yesterday) * 1000) / 10;
    }

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          total_visits: overview.total_visits,
          total_visitors: overview.total_visitors,
          total_pages: overview.total_pages,
          total_consultations: overview.total_consultations,
          today_visits: todayData.visits,
          today_visitors: todayData.visitors,
          today_consultations: todayData.consultations,
          visits_change: calcChange(todayData.visits, yesterdayData.visits),
          visitors_change: calcChange(todayData.visitors, yesterdayData.visitors),
          consultations_change: calcChange(todayData.consultations, yesterdayData.consultations),
        },
        daily_trend: filledTrend,
        top_pages: topPages,
        top_referrers: topReferrers,
      },
    });
  } catch (err) {
    console.error('[stats] error:', err);
    return NextResponse.json({ success: false, error: '查询失败' }, { status: 500 });
  }
}
