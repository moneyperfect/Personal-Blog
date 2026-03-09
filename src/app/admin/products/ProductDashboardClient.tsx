'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminProductSummary } from '@/lib/admin-products';
import AdminShell from '@/components/admin/AdminShell';

interface ProductListResponse {
  products?: AdminProductSummary[];
  error?: string;
  success?: boolean;
}

export default function ProductDashboardClient() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const refreshProducts = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/admin/products');
      const data = (await response.json()) as ProductListResponse;

      if (!response.ok) {
        setNotice(data.error || '加载产品列表失败。');
        return;
      }

      setProducts(data.products || []);
      setNotice('');
    } catch (error) {
      console.error(error);
      setNotice('加载产品列表失败。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProducts();
  }, [refreshProducts]);

  const updateFlags = async (item: AdminProductSummary, updates: { published?: boolean; featured?: boolean }) => {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-flags',
        slug: item.slug,
        lang: item.lang,
        updates,
      }),
    });

    const data = (await response.json()) as ProductListResponse;
    if (!response.ok || !data.success) {
      setNotice(data.error || '更新产品状态失败。');
      return;
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.slug === item.slug && product.lang === item.lang
          ? {
              ...product,
              published: updates.published ?? product.published,
              featured: updates.featured ?? product.featured,
            }
          : product
      )
    );
  };

  const deleteProduct = async (item: AdminProductSummary) => {
    const confirmed = window.confirm(`确认删除「${item.title}」(${item.lang}) 吗？`);
    if (!confirmed) {
      return;
    }

    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete',
        slug: item.slug,
        lang: item.lang,
      }),
    });

    const data = (await response.json()) as ProductListResponse;
    if (!response.ok || !data.success) {
      setNotice(data.error || '删除产品失败。');
      return;
    }

    setProducts((prev) => prev.filter((product) => !(product.slug === item.slug && product.lang === item.lang)));
  };

  return (
    <AdminShell
      title="产品管理"
      description="统一维护产品内容、发布状态、首页推荐位。当前前台支付入口已切换为临时二维码收款方案。"
      actions={(
        <>
          <button type="button" onClick={() => void refreshProducts()} className="btn btn-tonal">
            刷新列表
          </button>
          <button type="button" onClick={() => router.push('/admin/products/editor')} className="btn btn-primary">
            新建产品
          </button>
        </>
      )}
    >
      {notice ? (
        <div className="mb-6 rounded-google border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notice}
        </div>
      ) : null}

      {loading ? (
        <div className="admin-card text-center text-surface-600">正在加载产品数据...</div>
      ) : (
        <div className="admin-table-wrap">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200 px-6 py-5">
            <div>
              <h2 className="section-title">产品列表</h2>
              <p className="section-description mt-1">支持数据库产品与历史 MDX 产品并行展示。</p>
            </div>
            <span className="admin-badge">共 {products.length} 个产品</span>
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>标题</th>
                  <th>语言</th>
                  <th>价格</th>
                  <th>来源</th>
                  <th>状态</th>
                  <th>更新时间</th>
                  <th className="text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 bg-white">
                {products.map((item) => (
                  <tr key={`${item.slug}:${item.lang}`}>
                    <td>
                      <div className="font-medium text-surface-900">{item.title}</div>
                      <div className="mt-1 text-xs text-surface-600">{item.slug}</div>
                    </td>
                    <td>{item.lang === 'zh' ? '中文' : '日语'}</td>
                    <td>{item.price}</td>
                    <td>
                      <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${item.source === 'supabase' ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-100 text-surface-700'}`}>
                        {item.source === 'supabase' ? '后台' : 'MDX'}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => updateFlags(item, { published: !item.published })}
                          className={`rounded-pill px-3 py-1 text-xs font-semibold ${item.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}
                        >
                          {item.published ? '已发布' : '未发布'}
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFlags(item, { featured: !item.featured })}
                          className={`rounded-pill px-3 py-1 text-xs font-semibold ${item.featured ? 'bg-primary-50 text-primary-700' : 'bg-surface-100 text-surface-700'}`}
                        >
                          {item.featured ? '首页推荐' : '普通'}
                        </button>
                      </div>
                    </td>
                    <td>{new Date(item.updatedAt).toLocaleString()}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/products/editor/${item.slug}?lang=${item.lang}`)}
                          className="btn btn-tonal"
                        >
                          编辑
                        </button>
                        <button type="button" onClick={() => deleteProduct(item)} className="btn btn-text text-accent-red">
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-surface-600">还没有产品，请先创建一个。</div>
            ) : null}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
