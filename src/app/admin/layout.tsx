import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // 不在这里保护，由各个页面自己处理
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}