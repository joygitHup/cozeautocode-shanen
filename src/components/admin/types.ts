import { Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export interface Consultation {
  id: string;
  name: string;
  phone: string;
  company: string | null;
  domain: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export interface StatsData {
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

export interface VisitRecord {
  id: string;
  ip: string;
  region: string | null;
  path: string;
  referer: string | null;
  duration: number | null;
  user_agent: string | null;
  created_at: string;
}

export const domainLabels: Record<string, string> = {
  reservoir: '水库监测',
  forest: '森林监测',
  land: '国土监测',
  environment: '环境监测',
  other: '其他',
};

export const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
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

export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
