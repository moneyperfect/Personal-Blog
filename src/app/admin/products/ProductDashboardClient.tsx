'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminProductSummary } from '@/lib/admin-products';

interface ProductListResponse {
  products?: AdminProductSummary[];
  error?: string;
  success?: boolean;
}

export default function ProductDashboardClient() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string>('');

  const loadProducts = async () => {
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
  };

  useEffect(() => {
    loadProducts();
  }, []);

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
    const confirmed = window.confirm(`确认删除 ${item.title}（${item.lang}）吗？`);
    if (!confirmed) return;

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex flex-wrap justify-between items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">产品管理</h1>
              <p className="mt-1 text-sm text-gray-500">管理可售产品、推荐状态与双语版本。</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/admin/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                返回后台
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/products/editor')}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                新建产品
              </button>
            </div>
          </div>

          {notice && (
            <div className="mx-4 mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {notice}
            </div>
          )}

          <div className="border-t border-gray-200">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-500">加载中...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">语言</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">来源</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新时间</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((item) => (
                      <tr key={`${item.slug}:${item.lang}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-500">{item.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.lang === 'zh' ? '中文' : '日语'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${item.source === 'supabase' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                            {item.source === 'supabase' ? '后台' : 'MDX'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => updateFlags(item, { published: !item.published })}
                              className={`px-2 py-1 rounded text-xs ${item.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}
                            >
                              {item.published ? '已发布' : '未发布'}
                            </button>
                            <button
                              type="button"
                              onClick={() => updateFlags(item, { featured: !item.featured })}
                              className={`px-2 py-1 rounded text-xs ${item.featured ? 'bg-primary-50 text-primary-700' : 'bg-slate-50 text-slate-600'}`}
                            >
                              {item.featured ? '首页推荐' : '普通'}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.updatedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center gap-3">
                            <button
                              type="button"
                              onClick={() => router.push(`/admin/products/editor/${item.slug}?lang=${item.lang}`)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProduct(item)}
                              className="text-red-600 hover:text-red-800"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {products.length === 0 && (
                  <div className="p-8 text-center text-sm text-gray-500">还没有产品，请先创建一个。</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
