export default function Footer() {
  return (
    <footer className="relative border-t border-[#1e293b] bg-[#0a0e17]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 relative">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-sm" />
                <div className="absolute inset-[3px] border border-cyan-500/60 rounded-sm" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              </div>
              <span className="text-base font-bold tracking-wider text-slate-200">
                杉恩科技
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              万物互联，智慧感知。
              <br />
              专注于物联网系统研发与创新应用。
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-4 tracking-wider">
              解决方案
            </h4>
            <ul className="space-y-2.5">
              {['水库安全监测', '森林资源监测', '国土资源监测', '生态环境监测'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-slate-500 hover:text-cyan-400/70 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-4 tracking-wider">
              关于公司
            </h4>
            <ul className="space-y-2.5">
              {['公司介绍', '发展历程', '技术实力', '加入我们'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-slate-500 hover:text-cyan-400/70 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-4 tracking-wider">
              联系方式
            </h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-slate-500">电话：400-888-8888</li>
              <li className="text-sm text-slate-500">邮箱：info@shane-tech.com</li>
              <li className="text-sm text-slate-500">地址：高新技术产业园区</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#1e293b] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            &copy; 2024 杉恩科技 版权所有
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
              隐私政策
            </span>
            <span className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
              服务条款
            </span>
            <span className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
              网站地图
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
