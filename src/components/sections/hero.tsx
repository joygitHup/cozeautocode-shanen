'use client';

import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const initParticles = () => {
      const count = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 15000);
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.opacity})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0e17_70%)]" />

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-scan" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* HUD decoration */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 border border-[#1e293b] rounded-sm bg-[#111827]/50 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse-dot" />
          <span className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase">
            IoT System Online
          </span>
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-dot" style={{ animationDelay: '0.5s' }} />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-wide text-slate-100 leading-tight">
          <span className="block">万物互联</span>
          <span className="block mt-2 text-glow-cyan text-cyan-400">智慧感知</span>
        </h1>

        <p className="mt-8 text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          杉恩科技专注于物联网系统研发，以精密传感与智能算法，
          <br className="hidden sm:block" />
          守护每一片水库、森林、国土与环境
        </p>

        {/* Data indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 lg:gap-16">
          {[
            { value: '4', unit: '大', label: '核心领域' },
            { value: '1000', unit: '+', label: '监测站点' },
            { value: '99.9', unit: '%', label: '系统可用率' },
            { value: '7x24', unit: '', label: '不间断运行' },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              <div className="flex items-baseline justify-center">
                <span className="text-3xl lg:text-4xl font-mono font-bold text-cyan-400">
                  {item.value}
                </span>
                <span className="text-sm text-cyan-400/60 ml-0.5">{item.unit}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#domains"
            className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-sm font-medium tracking-wide rounded-sm hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-all duration-200"
          >
            探索业务领域
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#111827] border border-[#1e293b] text-slate-300 text-sm font-medium tracking-wide rounded-sm hover:bg-[#1a2332] hover:border-[#334155] transition-all duration-200"
          >
            联系我们
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0e17] to-transparent" />
    </section>
  );
}
