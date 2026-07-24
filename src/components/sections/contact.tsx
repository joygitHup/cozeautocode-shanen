'use client';

import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactSection() {
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
                  中国 · 高新技术产业园区<br />
                  科技创新大厦 A 座 18 层
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
                  业务咨询：400-888-8888<br />
                  技术支持：400-888-8889
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
                  商务合作：business@shane-tech.com<br />
                  人才招聘：hr@shane-tech.com
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
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                    姓名
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                    电话
                  </label>
                  <input
                    type="tel"
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
                  className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
                  placeholder="请输入公司名称"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                  需求领域
                </label>
                <select className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-400 focus:border-cyan-500/40 focus:outline-none transition-colors">
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
                  className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors resize-none"
                  placeholder="请简要描述您的需求"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-sm font-medium tracking-wide rounded-sm hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-all duration-200"
              >
                提交咨询
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
