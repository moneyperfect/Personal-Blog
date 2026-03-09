'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '登录失败。');
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('网络请求失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container page-width-content py-14 sm:py-20">
        <div className="mx-auto max-w-xl">
          <div className="mb-6 text-center">
            <span className="admin-badge">Admin Access</span>
            <h1 className="page-title mt-4">后台登录</h1>
            <p className="page-description mx-auto">
              统一管理笔记、产品和支付配置。使用管理员密码进入控制台。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-surface-700">
                  管理员密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input mt-2"
                  placeholder="输入后台密码"
                />
              </div>

              {error ? (
                <div className="rounded-google border border-accent-red/20 bg-accent-red/10 px-4 py-3 text-sm text-accent-red">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-surface-600">
                  登录后可继续管理笔记、产品发布和支付展示。
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary min-w-[132px] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? '登录中...' : '进入后台'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
