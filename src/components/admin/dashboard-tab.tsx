'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  Eye as EyeIcon,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  Activity,
  MapPin,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { formatDate, type StatsData, type VisitRecord } from '@/components/admin/types';

const formatDuration = (sec: number | null) => {
  if (!sec || sec < 1) return '< 1 秒';
  if (sec < 60) return `${sec} 秒`;
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${min} 分 ${s} 秒` : `${min} 分钟`;
};

const formatShortDate = (dateStr: string) => {
  return dateStr.slice(5); // MM-DD
};

const ChangeBadge = ({ value }: { value: number }) => {
  if (value === 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-slate-500 text-xs">
        <Minus className="w-3 h-3" />
        0%
      </span>
    );
  if (value > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-400 text-xs">
        <TrendingUp className="w-3 h-3" />
        {value}%
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-red-400 text-xs">
      <TrendingDown className="w-3 h-3" />
      {value}%
    </span>
  );
};

export default function DashboardTab() {
  const router = useRouter();
  const [range, setRange] = useState<number>(7);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // 访问记录相关 state
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [visitsTotal, setVisitsTotal] = useState(0);
  const [visitsPage, setVisitsPage] = useState(1);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [visitsKeyword, setVisitsKeyword] = useState('');
  const visitsPageSize = 20;

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`/api/stats?range=${range}`);
      if (res.status === 401) {
        router.replace('/shanenadmin/login');
        return;
      }
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [range, router]);

  const fetchVisits = useCallback(async () => {
    setVisitsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(visitsPage),
        pageSize: String(visitsPageSize),
      });
      if (visitsKeyword) params.set('keyword', visitsKeyword);

      const res = await fetch(`/api/visits?${params}`);
      if (res.status === 401) {
        router.replace('/shanenadmin/login');
        return;
      }
      const result = await res.json();
      if (result.success) {
        setVisits(result.data);
        setVisitsTotal(result.total);
      }
    } catch (err) {
      console.error('Failed to fetch visits:', err);
    } finally {
      setVisitsLoading(false);
    }
  }, [visitsPage, visitsKeyword, router]);

  useEffect(() => {
    fetchStats();
    fetchVisits();
  }, [fetchStats, fetchVisits]);

  const visitsTotalPages = Math.ceil(visitsTotal / visitsPageSize);

  // 趋势图最大值用于计算比例
  const maxPageViews = useMemo(() => {
    if (!stats?.daily_trend.length) return 1;
    return Math.max(...stats.daily_trend.map((d) => d.page_views), 1);
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Range selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Activity className="w-3.5 h-3.5" />
          <span>最近</span>
          <select
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="px-2 py-1 bg-[#111827] border border-[#1e293b] rounded-sm text-slate-300 focus:border-cyan-500/40 focus:outline-none"
          >
            <option value={7}>7 天</option>
            <option value={14}>14 天</option>
            <option value={30}>30 天</option>
          </select>
          <span>数据</span>
        </div>
        <button
          onClick={fetchStats}
          className="px-3 py-1.5 bg-[#111827] border border-[#1e293b] rounded-sm text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3 h-3 ${statsLoading ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>

      {/* Overview Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 border border-[#1e293b] rounded-sm bg-[#111827]/30 animate-pulse"
            >
              <div className="h-4 w-20 bg-[#1e293b] rounded mb-3" />
              <div className="h-7 w-24 bg-[#1e293b] rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: '访问量 (PV)',
              value: stats?.overview.total_visits ?? 0,
              today: stats?.overview.today_visits ?? 0,
              change: stats?.overview.visits_change ?? 0,
              color: 'text-cyan-400',
              icon: EyeIcon,
            },
            {
              label: '访客数 (UV)',
              value: stats?.overview.total_visitors ?? 0,
              today: stats?.overview.today_visitors ?? 0,
              change: stats?.overview.visitors_change ?? 0,
              color: 'text-emerald-400',
              icon: Users,
            },
            {
              label: '浏览页面',
              value: stats?.overview.total_pages ?? 0,
              today: 0,
              change: 0,
              color: 'text-violet-400',
              icon: Globe,
            },
            {
              label: '咨询数',
              value: stats?.overview.total_consultations ?? 0,
              today: stats?.overview.today_consultations ?? 0,
              change: stats?.overview.consultations_change ?? 0,
              color: 'text-amber-400',
              icon: MessageSquare,
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-5 border border-[#1e293b] rounded-sm bg-[#111827]/30 relative overflow-hidden group hover:border-cyan-500/20 transition-colors"
              >
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-xs text-slate-500 mb-2">{stat.label}</div>
                <div className={`text-2xl font-mono font-bold ${stat.color}`}>
                  {stat.value.toLocaleString()}
                </div>
                <div className="mt-2 pt-2 border-t border-[#1e293b] flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    今日 <span className="text-slate-300 font-mono">{stat.today}</span>
                  </span>
                  {stat.today > 0 && <ChangeBadge value={stat.change} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Trend Chart + Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Chart */}
        <div className="lg:col-span-2 border border-[#1e293b] rounded-sm bg-[#111827]/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-200">访问趋势</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-cyan-500/60" />
                访问量
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-emerald-500/60" />
                访客数
              </span>
            </div>
          </div>
          {statsLoading ? (
            <div className="h-56 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
            </div>
          ) : stats?.daily_trend.length ? (
            <div className="h-56 flex items-end gap-1">
              {stats.daily_trend.map((day) => (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center justify-end gap-1 h-full"
                >
                  <div className="w-full flex gap-0.5 items-end justify-center flex-1">
                    <div
                      className="w-2/3 bg-cyan-500/60 rounded-t-sm transition-all hover:bg-cyan-400/80"
                      style={{ height: `${(day.page_views / maxPageViews) * 100}%`, minHeight: day.page_views > 0 ? '2px' : '0' }}
                      title={`访问量: ${day.page_views}`}
                    />
                    <div
                      className="w-1/3 bg-emerald-500/50 rounded-t-sm transition-all hover:bg-emerald-400/70"
                      style={{ height: `${(day.unique_visitors / maxPageViews) * 100}%`, minHeight: day.unique_visitors > 0 ? '2px' : '0' }}
                      title={`访客数: ${day.unique_visitors}`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono">
                    {formatShortDate(day.date)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-slate-600 text-sm">
              暂无数据
            </div>
          )}
        </div>

        {/* Top Pages */}
        <div className="border border-[#1e293b] rounded-sm bg-[#111827]/30 p-5">
          <h3 className="text-sm font-medium text-slate-200 mb-4">热门页面 TOP 10</h3>
          {statsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-5 bg-[#1e293b] rounded animate-pulse" />
              ))}
            </div>
          ) : stats?.top_pages.length ? (
            <div className="space-y-2">
              {stats.top_pages.map((page, i) => {
                const max = stats.top_pages[0]?.page_views || 1;
                return (
                  <div key={page.path} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-5 h-5 flex items-center justify-center rounded-sm text-[10px] font-bold ${
                            i < 3
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : 'bg-[#1e293b] text-slate-500'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="text-slate-300 truncate max-w-[120px]" title={page.path}>
                          {page.path}
                        </span>
                      </div>
                      <span className="font-mono text-cyan-400">{page.page_views}</span>
                    </div>
                    <div className="h-1 bg-[#1e293b] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500/60 to-cyan-400/40 rounded-full transition-all"
                        style={{ width: `${(page.page_views / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-600 text-sm">
              暂无数据
            </div>
          )}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="border border-[#1e293b] rounded-sm bg-[#111827]/30 p-5">
        <h3 className="text-sm font-medium text-slate-200 mb-4">流量来源 TOP 10</h3>
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-[#1e293b]/50 rounded-sm animate-pulse">
                <div className="h-4 w-24 bg-[#1e293b] rounded mb-2" />
                <div className="h-6 w-16 bg-[#1e293b] rounded" />
              </div>
            ))}
          </div>
        ) : stats?.top_referrers.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {stats.top_referrers.map((ref) => (
              <div
                key={ref.referer}
                className="p-3 border border-[#1e293b] rounded-sm bg-[#0a0e17]/50 hover:border-cyan-500/20 transition-colors"
              >
                <div className="text-xs text-slate-500 mb-1 truncate" title={ref.referer}>
                  {ref.referer}
                </div>
                <div className="text-lg font-mono font-bold text-cyan-400">
                  {ref.visits.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center text-slate-600 text-sm">
            暂无数据
          </div>
        )}
      </div>

      {/* Visit Records Table */}
      <div className="border border-[#1e293b] rounded-sm bg-[#111827]/30 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-slate-200">访问明细</h3>
            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-sm text-xs font-mono">
              {visitsTotal} 条记录
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={visitsKeyword}
                onChange={(e) => {
                  setVisitsKeyword(e.target.value);
                  setVisitsPage(1);
                }}
                placeholder="搜索 IP/路径/地区..."
                className="pl-8 pr-3 py-1.5 w-56 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-xs text-slate-300 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={fetchVisits}
              className="p-1.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${visitsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#0a0e17]/50 border-b border-[#1e293b]">
                <th className="text-left px-4 py-2.5 font-medium text-slate-500 tracking-wider w-10">
                  #
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500 tracking-wider">
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    IP 地址
                  </div>
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500 tracking-wider hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    地区
                  </div>
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500 tracking-wider">
                  访问页面
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500 tracking-wider hidden lg:table-cell">
                  来源地址
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500 tracking-wider hidden sm:table-cell">
                  停留时长
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500 tracking-wider">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    访问时间
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {visitsLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                    加载中...
                  </td>
                </tr>
              ) : visits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-600">
                    暂无访问记录
                  </td>
                </tr>
              ) : (
                visits.map((visit, idx) => (
                  <tr
                    key={visit.id}
                    className="border-b border-[#1e293b]/50 hover:bg-[#0a0e17]/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-slate-600 font-mono">
                      {(visitsPage - 1) * visitsPageSize + idx + 1}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-cyan-400/90">{visit.ip}</span>
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      {visit.region ? (
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-600" />
                          {visit.region}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-slate-300 font-mono">{visit.path}</span>
                    </td>
                    <td className="px-4 py-2.5 hidden lg:table-cell">
                      {visit.referer ? (
                        <span
                          className="text-slate-500 truncate max-w-[200px] block"
                          title={visit.referer}
                        >
                          {visit.referer}
                        </span>
                      ) : (
                        <span className="text-slate-600">直接访问</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      <span className="text-emerald-400/80 font-mono">
                        {formatDuration(visit.duration)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-slate-500 font-mono whitespace-nowrap">
                        {formatDate(visit.created_at)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {visitsTotalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1e293b] bg-[#0a0e17]/30">
            <span className="text-xs text-slate-500">
              共 {visitsTotal} 条，第 {visitsPage}/{visitsTotalPages} 页
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisitsPage((p) => Math.max(1, p - 1))}
                disabled={visitsPage === 1}
                className="p-1 text-slate-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setVisitsPage((p) => Math.min(visitsTotalPages, p + 1))}
                disabled={visitsPage === visitsTotalPages}
                className="p-1 text-slate-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
