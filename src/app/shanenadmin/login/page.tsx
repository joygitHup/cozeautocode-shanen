'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = (await res.json()) as { success?: boolean; error?: string };

      if (res.ok && result.success) {
        router.replace('/shanenadmin');
        router.refresh();
        return;
      }
      setError(result.error || '登录失败，请重试');
    } catch {
      setError('网络异常，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0e17] flex items-center justify-center px-6">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <div className="relative w-full max-w-sm p-8 border border-[#1e293b] rounded-sm bg-[#111827]/60 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 relative" aria-hidden="true">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-sm" />
            <div className="absolute inset-[3px] border border-cyan-500/60 rounded-sm" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wider text-slate-100">杉恩科技</h1>
            <p className="text-xs font-mono text-slate-500 tracking-wider">ADMIN CONSOLE</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs text-slate-500 mb-2 tracking-wider"
            >
              管理员密码
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
              placeholder="请输入后台密码"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            className="w-full py-3 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-sm font-medium tracking-wide rounded-sm hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '登录中...' : '进入控制台'}
          </button>
        </form>
      </div>
    </main>
  );
}
