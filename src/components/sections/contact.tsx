'use client';

import { useState, type FormEvent } from 'react';
import { MapPin, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function ContactSection() {
  const { t } = useLanguage();
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
    <section
      id="contact"
      className="relative py-24 lg:py-32"
      aria-labelledby="contact-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-[#0d1420] to-[#0a0e17]" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-cyan-500/40" />
            <span className="text-xs font-mono text-cyan-400/60 tracking-widest uppercase">
              {t.contact.eyebrow}
            </span>
            <div className="w-8 h-px bg-cyan-500/40" />
          </div>
          <h2
            id="contact-heading"
            className="text-3xl lg:text-4xl font-bold text-slate-100 tracking-wide"
          >
            {t.contact.title}
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            {t.contact.subtitle}
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
                <h3 className="text-sm font-medium text-slate-200 mb-1">
                  {t.contact.addressLabel}
                </h3>
                <p className="text-sm text-slate-400">{t.contact.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 border border-[#1e293b] rounded-sm bg-[#111827]/50">
                <Phone className="w-5 h-5 text-cyan-400/70" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-200 mb-1">
                  {t.contact.phoneLabel}
                </h3>
                <p className="text-sm text-slate-400">
                  {t.contact.phoneBiz}
                  <br />
                  {t.contact.phoneTech}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 border border-[#1e293b] rounded-sm bg-[#111827]/50">
                <Mail className="w-5 h-5 text-cyan-400/70" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-200 mb-1">
                  {t.contact.emailLabel}
                </h3>
                <p className="text-sm text-slate-400">shanenservice@163.com</p>
              </div>
            </div>

            {/* Decorative data block */}
            <div className="mt-8 p-4 border border-[#1e293b] rounded-sm bg-[#111827]/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-dot" />
                <span className="text-xs font-mono text-slate-500 tracking-wider">
                  SYSTEM STATUS
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'API Response', value: '12ms' },
                  { label: 'Uptime', value: '99.97%' },
                  { label: 'Active Nodes', value: '8,432' },
                ].map((item) => (
                  <div key={item.label}>
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
              {t.contact.formTitle}
            </h3>

            {submitResult === 'success' && (
              <div className="mb-6 flex items-center gap-3 p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-sm">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-emerald-400 font-medium">
                    {t.contact.successTitle}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.contact.successDesc}</p>
                </div>
              </div>
            )}

            {submitResult === 'error' && (
              <div className="mb-6 flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/5 rounded-sm">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-red-400 font-medium">{t.contact.errorTitle}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.contact.errorDesc}</p>
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                    {t.contact.name} <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
                    placeholder={t.contact.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                    {t.contact.phone} <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
                    placeholder={t.contact.phonePlaceholder}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                  {t.contact.company}
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
                  placeholder={t.contact.companyPlaceholder}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                  {t.contact.domain}
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-400 focus:border-cyan-500/40 focus:outline-none transition-colors"
                >
                  <option value="">{t.contact.domainPlaceholder}</option>
                  {t.contact.domainOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2 tracking-wider">
                  {t.contact.message}
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#1e293b] rounded-sm text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors resize-none"
                  placeholder={t.contact.messagePlaceholder}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-sm font-medium tracking-wide rounded-sm hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? t.contact.submitting : t.contact.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
