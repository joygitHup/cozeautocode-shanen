'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, RefreshCw, ChevronLeft, ChevronRight, Trash2, Eye, X, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

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

const domainLabels: Record<string, string> = {
  reservoir: '水库监测',
  forest: '森林监测',
  land: '国土监测',
  environment: '环境监测',
  other: '其他',
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: '待处理', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: Clock },
  processing: { label: '处理中', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', icon: Loader2 },
  completed: { label: '已完成', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle },
  closed: { label: '已关闭', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30', icon: AlertCircle },
};

export default function AdminPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<Consultation | null>(null);
  const pageSize = 15;

  const fetchData = useCallback(async () => {
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
    fetchData();
  }, [fetchData]);

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
          prev.map((item) => (item.id === id ? { ...item, status } : item))
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
              <h1 className="text-base font-bold tracking-wide">咨询管理后台</h1>
              <p className="text-xs text-slate-500">杉恩科技 · 客户咨询管理系统</p>
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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: '总咨询数', value: total, color: 'text-cyan-400' },
            { label: '待处理', value: consultations.filter((c) => c.status === 'pending').length, color: 'text-amber-400' },
            { label: '处理中', value: consultations.filter((c) => c.status === 'processing').length, color: 'text-blue-400' },
            { label: '已完成', value: consultations.filter((c) => c.status === 'completed').length, color: 'text-emerald-400' },
          ].map((stat, i) => (
            <div key={i} className="p-4 border border-[#1e293b] rounded-sm bg-[#111827]/30">
              <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
              <div className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</div>
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
            onClick={fetchData}
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
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 tracking-wider">姓名</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 tracking-wider">电话</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 tracking-wider hidden md:table-cell">公司</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 tracking-wider hidden lg:table-cell">领域</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 tracking-wider">状态</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 tracking-wider hidden sm:table-cell">时间</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 tracking-wider">操作</th>
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
                        <td className="px-4 py-3 text-slate-200 font-medium">{item.name}</td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-xs">{item.phone}</td>
                        <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{item.company || '-'}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs text-slate-400">
                            {item.domain ? domainLabels[item.domain] || item.domain : '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded-sm text-xs ${statusInfo.color}`}>
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
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          />
          <div className="relative w-full max-w-lg bg-[#111827] border border-[#1e293b] rounded-sm p-6">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-6">咨询详情</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">姓名</div>
                  <div className="text-sm text-slate-200">{selectedItem.name}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">电话</div>
                  <div className="text-sm text-slate-200 font-mono">{selectedItem.phone}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">公司名称</div>
                <div className="text-sm text-slate-200">{selectedItem.company || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">需求领域</div>
                <div className="text-sm text-slate-200">
                  {selectedItem.domain ? domainLabels[selectedItem.domain] || selectedItem.domain : '-'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">需求描述</div>
                <div className="text-sm text-slate-300 leading-relaxed p-3 bg-[#0a0e17] border border-[#1e293b] rounded-sm">
                  {selectedItem.message || '无'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">提交时间</div>
                  <div className="text-sm text-slate-200">{formatDate(selectedItem.created_at)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">状态</div>
                  <select
                    value={selectedItem.status}
                    onChange={(e) => handleStatusChange(selectedItem.id, e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-300 focus:border-cyan-500/40 focus:outline-none"
                  >
                    <option value="pending">待处理</option>
                    <option value="processing">处理中</option>
                    <option value="completed">已完成</option>
                    <option value="closed">已关闭</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
