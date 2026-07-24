'use client';

import { useState, type FormEvent } from 'react';
import { MapPin, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    domain: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (result.success) {
        setSubmitResult('success');
        setFormData({ name: '', phone: '', company: '', domain: '', message: '' });
      } else {
        setSubmitResult('error');
      }
    } catch {
      setSubmitResult('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-[#0d1420] to-[#0a0e17]" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-cyan-500/40" />
            <span className="text-xs font-mono text-cyan-400/60 tracking-widest uppercase">
              Contact Us
            </span>
            <div className="w-8 h-px bg-cyan-500/40" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-100 tracking-wide">
            联系我们
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            期待与您携手，共建智慧物联新未来
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 border border-[#1e293b] rounded-sm bg-[#111827]/50">
                <MapPin className="w-5 h-5 text-cyan-400/70" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-200 mb-1">公司地址</h3>
                <p className="text-sm text-slate-400">
                  深圳市福田区车公庙天祥大厦4楼
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 border border-[#1e293b] rounded-sm bg-[#111827]/50">
                <Phone className="w-5 h-5 text-cyan-400/70" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-200 mb-1">联系电话</h3>
                <p className="text-sm text-slate-400">
                  业务咨询：13265424932<br />
                  技术交流：0755-83209287
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 border border-[#1e293b] rounded-sm bg-[#111827]/50">
                <Mail className="w-5 h-5 text-cyan-400/70" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-200 mb-1">电子邮箱</h3>
                <p className="text-sm text-slate-400">
                  shanenservice@163.com
                </p>
              </div>
            </div>

            {/* Decorative data block */}
            <div className="mt-8 p-4 border border-[#1e293b] rounded-sm bg-[#111827]/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-dot" />
                <span className="text-xs font-mono text-slate-500 tracking-wider">SYSTEM STATUS</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'API Response', value: '12ms' },
                  { label: 'Uptime', value: '99.97%' },
                  { label: 'Active Nodes', value: '8,432' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                    <div className="text-sm font-mono text-cyan-400/80">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-6 lg:p-8 border border-[#1e293b] rounded-sm bg-[#111827]/30">
            <h3 className="text-lg font-bold text-slate-100 mb-6 tracking-wide">
              在线咨询
            </h3>

            {submitResult === 'success' && (
              <div className="mb-6 flex items-center gap-3 p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-sm">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-emerald-400 font-medium">提交成功</p>
                  <p className="text-xs text-slate-400 mt-0.5">我们将在 1 个工作日内与您联系</p>
                </div>
              </div>
            )}

            {submitResult === 'error' && (
              <div className="mb-6 flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/5 rounded-sm">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-red-400 font-medium">提交失败</p>
                  <p className="text-xs text-slate-400 mt-0.5">请稍后重试或拨打电话联系我们</p>
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                    姓名 <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                    电话 <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
                    placeholder="请输入联系电话"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                  公司名称
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
                  placeholder="请输入公司名称"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                  需求领域
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-400 focus:border-cyan-500/40 focus:outline-none transition-colors"
                >
                  <option value="">请选择需求领域</option>
                  <option value="reservoir">水库监测</option>
                  <option value="forest">森林监测</option>
                  <option value="land">国土监测</option>
                  <option value="environment">环境监测</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                  需求描述
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors resize-none"
                  placeholder="请简要描述您的需求"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-sm font-medium tracking-wide rounded-sm hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '提交中...' : '提交咨询'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
