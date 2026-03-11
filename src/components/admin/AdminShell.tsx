'use client';

import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
  hideSidebar?: boolean;
}

const navItems = [
  { label: '统一视图 (概览)', href: '/admin/dashboard' },
  { label: '内容管理 (笔记)', href: '/admin/notes' }, // Updated default if we separate it later, but using anchor link pattern below
  { label: '业务中心 (产品)', href: '/admin/products' },
];

export default function AdminShell({ title, description, actions, children, fullWidth = false, hideSidebar = false }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  // Reused Sidebar Content
  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-slate-50 border-r border-slate-200">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200 shrink-0">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
          </svg>
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-slate-900 leading-none">NAS ADMIN</span>
          <span className="text-[10px] text-slate-500 font-medium leading-none mt-1">v0.1.0</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">主菜单</div>
        {[
          { label: '数据与笔记', href: '/admin/dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { label: '产品与服务', href: '/admin/products', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
        ].map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <svg className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="shrink-0 border-t border-slate-200 p-4 space-y-2">
        <Link href="/admin/editor" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          写新笔记
        </Link>
        <Link href="/admin/products/editor" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          发新产品
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 relative selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Desktop Sidebar Width: 260px */}
      <aside className={`hidden lg:flex flex-col w-[260px] fixed inset-y-0 z-20 transition-transform duration-300 ease-in-out ${hideSidebar ? '-translate-x-full' : 'translate-x-0'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${hideSidebar ? 'lg:pl-0' : 'lg:pl-[260px]'}`}>
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-16 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
              <span className="font-bold text-xs">NA</span>
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -mr-2 text-slate-500 hover:text-slate-900 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] bg-white lg:hidden shadow-2xl"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Page Topbar (Header within Content) */}
        <header className="flex-none bg-white border-b border-slate-200">
          <div className={`flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 ${fullWidth ? '' : 'max-w-7xl mx-auto w-full'}`}>
            <div className="flex items-center overflow-hidden mr-4">
              <h1 className="text-lg font-bold text-slate-900 truncate tracking-tight">{title}</h1>
            </div>
            <div className="flex items-center gap-3 shrink-0">
               {actions ? <div className="hidden sm:flex items-center gap-2 mr-2 border-r border-slate-200 pr-4">{actions}</div> : null}
               <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {loggingOut ? '退出中...' : '退出登录'}
                </button>
            </div>
          </div>
          {/* Mobile Actions Ribbon if actions exist but hidden above */}
          {actions && (
            <div className="sm:hidden px-4 py-3 bg-slate-50 border-t border-slate-200 flex overflow-x-auto gap-2">
              {actions}
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${fullWidth ? '' : 'max-w-7xl mx-auto w-full'}`}>
          {description && (
             <p className="text-sm text-slate-500 mb-6 max-w-3xl">{description}</p>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
