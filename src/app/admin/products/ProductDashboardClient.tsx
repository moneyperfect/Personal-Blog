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
      title="业务中心 (产品)"
      description="统一维护产品内容、发布状态、首页推荐位。当前前台支付入口已切换为临时二维码收款方案。"
      actions={(
        <>
          <button type="button" onClick={() => void refreshProducts()} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            刷新同步
          </button>
          <button type="button" onClick={() => router.push('/admin/products/editor')} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            发新产品
          </button>
        </>
      )}
    >
      {notice && (
        <div className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50 text-sm text-rose-800 flex items-center gap-2 shadow-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
          {notice}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
            <p className="mt-4 text-sm text-slate-500">正在加载产品数据...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-sm font-semibold text-slate-900">产品列表 <span className="text-slate-500 font-normal ml-2">({products.length} 个)</span></h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">基本信息</th>
                    <th className="px-6 py-4 font-semibold">价格/语言</th>
                    <th className="px-6 py-4 font-semibold">状态</th>
                    <th className="px-6 py-4 font-semibold">来源</th>
                    <th className="px-6 py-4 font-semibold text-right">时间与操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {products.map((item) => (
                    <tr key={`${item.slug}:${item.lang}`} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 mb-1">{item.title}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                           <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600">/{item.slug}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="text-sm font-medium text-slate-900">{item.price}</div>
                         <div className="text-xs text-slate-500 mt-0.5">{item.lang === 'zh' ? '中文 (zh)' : '日语 (ja)'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 relative">
                           <label className="flex items-center gap-2 cursor-pointer group/toggle">
                             <div className={`relative w-8 h-4 rounded-full transition-colors ${item.published ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                <div className={`absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${item.published ? 'translate-x-4' : 'translate-x-0'}`}></div>
                             </div>
                             <input type="checkbox" className="sr-only" checked={item.published} onChange={() => updateFlags(item, { published: !item.published })} />
                             <span className={`text-xs font-medium transition-colors ${item.published ? 'text-emerald-700' : 'text-slate-500'}`}>{item.published ? '已上架' : '已下架'}</span>
                           </label>
                           
                           <label className="flex items-center gap-2 cursor-pointer group/toggle">
                             <input type="checkbox" className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600 focus:ring-2 focus:ring-offset-1" checked={item.featured} onChange={() => updateFlags(item, { featured: !item.featured })} />
                             <span className={`text-xs font-medium transition-colors ${item.featured ? 'text-indigo-700' : 'text-slate-500'}`}>{item.featured ? '首页置顶推荐' : '标准展示'}</span>
                           </label>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${item.source === 'supabase' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {item.source === 'supabase' ? 'DB Admin' : 'Local MDX'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="text-xs text-slate-400 mb-2 truncate max-w-[120px] ml-auto" title={new Date(item.updatedAt).toLocaleString()}>
                           {new Date(item.updatedAt).toLocaleDateString()}
                         </div>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/products/editor/${item.slug}?lang=${item.lang}`)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="编辑产品"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(item)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="删除产品"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                        该分类下暂无产品内容
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
