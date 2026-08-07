'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startTimeRef = useRef<number>(0);
  const lastPathRef = useRef<string>('');

  // 上报访问记录
  const reportVisit = async (path: string, duration: number = 0) => {
    // 忽略管理后台和 API
    if (path.startsWith('/admin') || path.startsWith('/api')) return;
    if (path.startsWith('/_next')) return;

    try {
      await fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          referer: typeof document !== 'undefined' ? document.referrer : '',
          duration,
        }),
      });
    } catch {
      // 静默失败，不影响用户体验
    }
  };

  useEffect(() => {
    if (!pathname) return;

    // 初始化开始时间
    if (startTimeRef.current === 0) {
      startTimeRef.current = Date.now();
    }

    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // 如果是新路径
    if (lastPathRef.current && lastPathRef.current !== fullPath) {
      // 上报上一个页面的停留时长
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      reportVisit(lastPathRef.current, duration);
      startTimeRef.current = Date.now();
    }

    // 上报当前页面的 PV
    if (lastPathRef.current !== fullPath) {
      reportVisit(fullPath, 0);
    }

    lastPathRef.current = fullPath;

    // 页面卸载时上报停留时长
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      // 使用 sendBeacon 确保页面关闭时也能上报
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/visit',
          JSON.stringify({
            path: fullPath,
            referer: document.referrer,
            duration,
          }),
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pathname, searchParams]);

  return null;
}
