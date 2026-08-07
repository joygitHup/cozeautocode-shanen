'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  MessageSquare,
  Users,
  Eye as EyeIcon,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  Activity,
} from 'lucide-react';

interface Consultation {
  id: string;
  name: string;
  phone: string;
  company: string | null;
  domain: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface StatsData {
  overview: {
    total_visits: number;
    total_visitors: number;
    total_pages: number;
    total_consultations: number;
    today_visits: number;
    today_visitors: number;
    today_consultations: number;
    visits_change: number;
    visitors_change: number;
    consultations_change: number;
  };
  daily_trend: Array<{ date: string; page_views: number; unique_visitors: number }>;
  top_pages: Array<{ path: string; page_views: number; unique_visitors: number }>;
  top_referrers: Array<{ referer: string; visits: number }>;
}

const domainLabels: Record<string, string> = {
  reservoir: '水库监测',
  forest: '森林监测',
  land: '国土监测',
  environment: '环境监测',
  other: '其他',
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: {
    label: '待处理',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    icon: Clock,
  },
  processing: {
    label: '处理中',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    icon: Loader2,
  },
  completed: {
    label: '已完成',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    icon: CheckCircle,
  },
  closed: {
    label: '已关闭',
    color: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
    icon: AlertCircle,
  },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'consultations'>('dashboard');
  const [range, setRange] = useState<number>(7);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // 咨询列表相关 state
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<Consultation | null>(null);
  const pageSize = 15;

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`/api/stats?range=${range}`);
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [range]);

  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (keyword) params.set('keyword', keyword);

      const res = await fetch(`/api/consultation?${params}`);
      const result = await res.json();
      if (result.success) {
        setConsultations(result.data);
        setTotal(result.total);
      }
    } catch (err) {
      console.error('Failed to fetch consultations:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, keyword]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [activeTab, fetchStats]);

  useEffect(() => {
    if (activeTab === 'consultations') {
      fetchConsultations();
    }
  }, [activeTab, fetchConsultations]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/consultation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (result.success) {
        setConsultations((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item)),
        );
        if (selectedItem?.id === id) {
          setSelectedItem({ ...selectedItem, status });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条咨询记录吗？')) return;
    try {
      const res = await fetch(`/api/consultation/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setConsultations((prev) => prev.filter((item) => item.id !== id));
        setTotal((prev) => prev - 1);
        if (selectedItem?.id === id) setSelectedItem(null);
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatShortDate = (dateStr: string) => {
    return dateStr.slice(5); // MM-DD
  };

  // 趋势图最大值用于计算比例
  const maxPageViews = useMemo(() => {
    if (!stats?.daily_trend.length) return 1;
    return Math.max(...stats.daily_trend.map((d) => d.page_views), 1);
  }, [stats]);

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

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100">
      {/* Header */}
      <header className="border-b border-[#1e293b] bg-[#0a0e17]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-sm" />
              <div className="absolute inset-[3px] border border-cyan-500/60 rounded-sm" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-wide">运营管理后台</h1>
              <p className="text-xs text-slate-500">杉恩科技 · 数据管理系统</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
          >
            返回官网
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-[#111827]/50 border border-[#1e293b] rounded-sm w-fit">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-sm rounded-sm transition-all flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            数据概览
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-2 text-sm rounded-sm transition-all flex items-center gap-2 ${
              activeTab === 'consultations'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            咨询管理
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
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
          </div>
        )}

        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: '总咨询数', value: total, color: 'text-cyan-400' },
                {
                  label: '待处理',
                  value: consultations.filter((c) => c.status === 'pending').length,
                  color: 'text-amber-400',
                },
                {
                  label: '处理中',
                  value: consultations.filter((c) => c.status === 'processing').length,
                  color: 'text-blue-400',
                },
                {
                  label: '已完成',
                  value: consultations.filter((c) => c.status === 'completed').length,
                  color: 'text-emerald-400',
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-4 border border-[#1e293b] rounded-sm bg-[#111827]/30"
                >
                  <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                  <div className={`text-2xl font-mono font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setPage(1);
                  }}
                  placeholder="搜索姓名、公司、电话..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-sm text-sm text-slate-400 focus:border-cyan-500/40 focus:outline-none transition-colors"
              >
                <option value="all">全部状态</option>
                <option value="pending">待处理</option>
                <option value="processing">处理中</option>
                <option value="completed">已完成</option>
                <option value="closed">已关闭</option>
              </select>
              <button
                onClick={fetchConsultations}
                className="px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-sm text-sm text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                刷新
              </button>
            </div>

            {/* Table */}
            <div className="border border-[#1e293b] rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#111827] border-b border-[#1e293b]">
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 tracking-wider">
                        姓名
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 tracking-wider">
                        电话
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 tracking-wider hidden md:table-cell">
                        公司
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 tracking-wider hidden lg:table-cell">
                        领域
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 tracking-wider">
                        状态
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 tracking-wider hidden sm:table-cell">
                        时间
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-500">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                          加载中...
                        </td>
                      </tr>
                    ) : consultations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-500">
                          暂无咨询记录
                        </td>
                      </tr>
                    ) : (
                      consultations.map((item) => {
                        const statusInfo = statusConfig[item.status] || statusConfig.pending;
                        const StatusIcon = statusInfo.icon;
                        return (
                          <tr
                            key={item.id}
                            className="border-b border-[#1e293b] hover:bg-[#111827]/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-slate-200 font-medium">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                              {item.phone}
                            </td>
                            <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                              {item.company || '-'}
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className="text-xs text-slate-400">
                                {item.domain
                                  ? domainLabels[item.domain] || item.domain
                                  : '-'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded-sm text-xs ${statusInfo.color}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell">
                              {formatDate(item.created_at)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setSelectedItem(item)}
                                  className="p-1.5 text-slate-500 hover:text-cyan-400 transition-colors"
                                  title="查看详情"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                                  title="删除"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#1e293b] bg-[#111827]/30">
                  <span className="text-xs text-slate-500">
                    共 {total} 条记录，第 {page}/{totalPages} 页
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-lg bg-[#0a0e17] border border-[#1e293b] rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e293b]">
              <h3 className="text-sm font-medium text-slate-200">咨询详情</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">姓名</div>
                  <div className="text-sm text-slate-200">{selectedItem.name}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">电话</div>
                  <div className="text-sm text-slate-200 font-mono">
                    {selectedItem.phone}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">公司</div>
                  <div className="text-sm text-slate-200">
                    {selectedItem.company || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">意向领域</div>
                  <div className="text-sm text-slate-200">
                    {selectedItem.domain
                      ? domainLabels[selectedItem.domain] || selectedItem.domain
                      : '-'}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">需求描述</div>
                <div className="text-sm text-slate-200 bg-[#111827]/50 p-3 rounded-sm border border-[#1e293b] whitespace-pre-wrap">
                  {selectedItem.message || '-'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">状态</div>
                  <select
                    value={selectedItem.status}
                    onChange={(e) => handleStatusChange(selectedItem.id, e.target.value)}
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-sm text-sm text-slate-300 focus:border-cyan-500/40 focus:outline-none"
                  >
                    <option value="pending">待处理</option>
                    <option value="processing">处理中</option>
                    <option value="completed">已完成</option>
                    <option value="closed">已关闭</option>
                  </select>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">提交时间</div>
                  <div className="text-sm text-slate-400 font-mono">
                    {formatDate(selectedItem.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
