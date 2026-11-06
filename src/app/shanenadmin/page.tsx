'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, MessageSquare } from 'lucide-react';
import DashboardTab from '@/components/admin/dashboard-tab';
import ConsultationsTab from '@/components/admin/consultations-tab';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'consultations'>('dashboard');

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      router.replace('/shanenadmin/login');
      router.refresh();
    }
  }, [router]);

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
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              返回官网
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-red-400 transition-colors"
            >
              退出登录
            </button>
          </div>
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
        {activeTab === 'dashboard' && <DashboardTab />}

        {/* Consultations Tab */}
        {activeTab === 'consultations' && <ConsultationsTab />}
      </div>
    </div>
  );
}
