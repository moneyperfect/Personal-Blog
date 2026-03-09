'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AdminShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

const navItems = [
  { label: '控制台', href: '/admin/dashboard' },
  { label: '产品管理', href: '/admin/products' },
];

export default function AdminShell({ title, description, actions, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="admin-shell relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top_left,_rgba(66,133,244,0.18),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(52,168,83,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.92)_0%,_rgba(246,247,249,0)_100%)]" />

      <header className="admin-topbar">
        <div className="page-container page-width">
          <div className="admin-topbar-inner">
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard" className="flex items-center gap-3 text-surface-900">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-google-lg bg-primary-50 text-primary-700 shadow-card">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                </span>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-700">Admin</div>
                  <div className="text-sm font-semibold text-surface-900">内容与产品后台</div>
                </div>
              </Link>

              <nav className="hidden items-center gap-1 md:flex">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/admin/editor" className="btn btn-tonal hidden lg:inline-flex">
                新建笔记
              </Link>
              <Link href="/admin/products/editor" className="btn btn-primary hidden lg:inline-flex">
                新建产品
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="btn btn-text"
              >
                {loggingOut ? '退出中...' : '退出登录'}
              </button>
            </div>
          </div>

          <nav className="flex items-center gap-2 pb-3 md:hidden">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="admin-content relative">
        <section className="mb-6 overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
          <div className="section-header mb-0">
            <div className="max-w-content">
              <span className="admin-badge">后台管理</span>
              <h1 className="page-title mt-3">{title}</h1>
              {description ? <p className="page-description">{description}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
          </div>
        </section>

        {children}
      </main>
    </div>
  );
}
