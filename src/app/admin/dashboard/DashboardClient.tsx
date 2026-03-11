'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';

type LifecycleStatus = 'draft' | 'review' | 'published';

interface Note {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  language: string;
  date: string;
  enabled: boolean;
  lifecycleStatus?: LifecycleStatus;
  source: 'supabase';
}

interface Stats {
  totalNotes: number;
  publishedNotes: number;
  draftNotes: number;
  topCategory: string;
}

interface HealthStatus {
  ok: boolean;
  message: string;
  requestId?: string;
  checks?: {
    config?: boolean;
    database?: boolean;
    storage?: boolean;
    schema?: boolean;
  };
}

interface AnalyticsSummary {
  pageViews7d: number;
  noteViews7d: number;
  ctaClicks7d: number;
  avgReadDepth7d: number;
  events30d: number;
}

interface TopNote {
  slug: string;
  views: number;
}

const EMPTY_STATS: Stats = {
  totalNotes: 0,
  publishedNotes: 0,
  draftNotes: 0,
  topCategory: '未分类',
};

const EMPTY_ANALYTICS: AnalyticsSummary = {
  pageViews7d: 0,
  noteViews7d: 0,
  ctaClicks7d: 0,
  avgReadDepth7d: 0,
  events30d: 0,
};

const STATUS_META: Record<LifecycleStatus, { label: string; badgeClass: string }> = {
  draft: {
    label: '草稿',
    badgeClass: 'bg-slate-100 text-slate-700',
  },
  review: {
    label: '待审核',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  published: {
    label: '已发布',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
};

function normalizeStatus(note: Note): LifecycleStatus {
  if (note.lifecycleStatus) return note.lifecycleStatus;
  return note.enabled ? 'published' : 'draft';
}

export default function DashboardClient() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(EMPTY_ANALYTICS);
  const [topNotes, setTopNotes] = useState<TopNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const computeStats = useCallback((nextNotes: Note[]) => {
    const publishedNotes = nextNotes.filter((note) => normalizeStatus(note) === 'published').length;
    const draftNotes = nextNotes.length - publishedNotes;

    const categoryCount: Record<string, number> = {};
    nextNotes.forEach((note) => {
      const category = note.category || '未分类';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const [topCategory] = Object.entries(categoryCount)
      .sort((left, right) => right[1] - left[1])[0] || ['未分类'];

    setStats({
      totalNotes: nextNotes.length,
      publishedNotes,
      draftNotes,
      topCategory,
    });
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/health');
      const data = await response.json();
      setHealth({
        ok: response.ok && data.ok,
        message: data.message || data.error || '健康检查失败',
        requestId: data.requestId,
        checks: data.checks,
      });
    } catch {
      setHealth({
        ok: false,
        message: '无法获取服务健康状态',
      });
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    const response = await fetch('/api/admin/notes');
    if (!response.ok) {
      throw new Error(`fetch notes failed: ${response.status}`);
    }

    const data = await response.json();
    const notesData = (data.notes || []) as Note[];
    setNotes(notesData);
    computeStats(notesData);
  }, [computeStats]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setAnalytics(EMPTY_ANALYTICS);
        setTopNotes([]);
        return;
      }

      setAnalytics({
        pageViews7d: data.summary?.pageViews7d || 0,
        noteViews7d: data.summary?.noteViews7d || 0,
        ctaClicks7d: data.summary?.ctaClicks7d || 0,
        avgReadDepth7d: data.summary?.avgReadDepth7d || 0,
        events30d: data.summary?.events30d || 0,
      });
      setTopNotes((data.topNotes || []) as TopNote[]);
    } catch {
      setAnalytics(EMPTY_ANALYTICS);
      setTopNotes([]);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchNotes(), fetchHealth(), fetchAnalytics()]);
    } catch (error) {
      console.error('加载后台数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchAnalytics, fetchHealth, fetchNotes]);

  useEffect(() => {
    void refreshDashboard();
  }, [refreshDashboard]);

  const updateNoteCategory = async (note: Note, category: string) => {
    try {
      const response = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-category',
          slug: note.slug,
          updates: { category },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        alert(`更新分类失败: ${data.error || '未知错误'}`);
        return;
      }

      setNotes((prev) => {
        const next = prev.map((item) => (item.id === note.id ? { ...item, category } : item));
        computeStats(next);
        return next;
      });
    } catch (error) {
      console.error('更新笔记分类失败:', error);
      alert('请求失败，请检查网络');
    }
  };

  const updateNoteStatus = async (note: Note, lifecycleStatus: LifecycleStatus) => {
    try {
      const response = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-status',
          slug: note.slug,
          updates: { lifecycleStatus },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        alert(`更新状态失败: ${data.error || '未知错误'}`);
        return;
      }

      setNotes((prev) => {
        const next = prev.map((item) => (
          item.id === note.id
            ? {
                ...item,
                lifecycleStatus,
                enabled: lifecycleStatus === 'published',
              }
            : item
        ));
        computeStats(next);
        return next;
      });

      fetchAnalytics();
    } catch (error) {
      console.error('更新状态失败:', error);
      alert('请求失败，请检查网络');
    }
  };

  const deleteNote = async (note: Note) => {
    const status = normalizeStatus(note);
    const confirmed = window.confirm(
      `确认删除「${note.title}」吗？\n状态：${STATUS_META[status].label}\n\n删除后不可恢复。`
    );

    if (!confirmed) return;

    setDeletingSlug(note.slug);
    try {
      const response = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          slug: note.slug,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        alert(`删除失败: ${data.error || '未知错误'}`);
        return;
      }

      setNotes((prev) => {
        const next = prev.filter((item) => item.slug !== note.slug);
        computeStats(next);
        return next;
      });
      fetchAnalytics();
    } catch (error) {
      console.error('删除笔记失败:', error);
      alert('请求失败，请检查网络');
    } finally {
      setDeletingSlug(null);
    }
  };

  const overviewCards = useMemo(
    () => [
      { label: '总笔记数', value: stats.totalNotes, hint: `主分类：${stats.topCategory}` },
      { label: '已发布', value: stats.publishedNotes, hint: `草稿/待审：${stats.draftNotes}` },
      { label: '近 7 天页面浏览', value: analytics.pageViews7d, hint: '全站 page_view 事件' },
      { label: '近 7 天笔记浏览', value: analytics.noteViews7d, hint: 'note_view 事件' },
      { label: '近 7 天 CTA 点击', value: analytics.ctaClicks7d, hint: '文章页 CTA 点击' },
      { label: '平均阅读进度', value: `${analytics.avgReadDepth7d}%`, hint: `近 30 天事件数：${analytics.events30d}` },
    ],
    [analytics, stats]
  );

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-container page-width py-20 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
          <p className="mt-4 text-surface-600">正在加载后台数据...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminShell
      title="数据与笔记"
      description="管理您的内容发布状态、分类与内容入口，保持发布节奏清晰可控。"
      actions={(
        <>
          <button type="button" onClick={() => void refreshDashboard()} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            刷新同步
          </button>
          <button type="button" onClick={() => router.push('/admin/editor')} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            新建笔记
          </button>
        </>
      )}
    >
      {health ? (
        <div className={`mb-8 p-4 rounded-xl border ${health.ok ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/50'}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-surface-900">
                {health.ok ? '服务状态正常' : '服务状态异常'}
              </div>
              <div className="mt-1 text-sm text-surface-700">{health.message}</div>
            </div>
            <button type="button" onClick={fetchHealth} className="btn btn-tonal">
              重新检查
            </button>
          </div>
          {health.checks ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${health.checks.config ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>配置: {health.checks.config ? 'OK' : 'FAIL'}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${health.checks.database ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>数据库: {health.checks.database ? 'OK' : 'FAIL'}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${health.checks.storage ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>存储: {health.checks.storage ? 'OK' : 'FAIL'}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${health.checks.schema ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>表结构: {health.checks.schema ? 'OK' : 'FAIL'}</span>
              {health.requestId ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">请求 ID: {health.requestId}</span> : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-8">
        {/* Analytics Bento Grid */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900 mb-4 px-1">数据大盘概览</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Primary Stat */}
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-center shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg className="w-24 h-24 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /></svg>
               </div>
               <p className="text-sm font-medium text-slate-500 mb-1 relative z-10">总笔记数</p>
               <div className="flex items-baseline gap-2 relative z-10">
                 <p className="text-4xl font-bold tracking-tight text-slate-900">{stats.totalNotes}</p>
                 <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+{stats.publishedNotes} 发布</span>
               </div>
               <p className="text-xs text-slate-400 mt-4 relative z-10">主分类专注方向: {stats.topCategory}</p>
            </div>

            {/* Smaller Stats */}
            {overviewCards.slice(2).map((card, idx) => (
              <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{card.value}</p>
                <div className="mt-auto pt-4">
                  <p className="text-xs text-slate-400">{card.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Table Area (Notes) */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
               <h2 className="text-sm font-semibold text-slate-900">内容管理</h2>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">标题与路径</th>
                      <th className="px-6 py-4 font-semibold">分类状态</th>
                      <th className="px-6 py-4 font-semibold text-right">管理</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {notes.map((note) => {
                      const status = normalizeStatus(note);
                      const statusMeta = STATUS_META[status];

                      return (
                        <tr key={note.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900 mb-1">{note.title}</div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                               <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600">/{note.slug}</span>
                               <span className="text-slate-300">•</span>
                               <span>{new Date(note.date).toLocaleDateString()}</span>
                               <span className="text-slate-300">•</span>
                               <span className="uppercase">{note.language}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2 max-w-[160px]">
                              <div className="relative">
                                <select
                                  value={note.category}
                                  onChange={(event) => updateNoteCategory(note, event.target.value)}
                                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer hover:bg-slate-100 transition-colors"
                                >
                                  <option value="">未分类</option>
                                  <option value="AI">AI</option>
                                  <option value="Bug修复">Bug修复</option>
                                  <option value="MVP">MVP</option>
                                  <option value="SOP">SOP</option>
                                  <option value="上线">上线</option>
                                  <option value="产品">产品</option>
                                  <option value="代码审查">代码审查</option>
                                  <option value="写作">写作</option>
                                  <option value="开发">开发</option>
                                  <option value="效率">效率</option>
                                  <option value="文案">文案</option>
                                  <option value="检查清单">检查清单</option>
                                  <option value="模板">模板</option>
                                  <option value="用户研究">用户研究</option>
                                  <option value="竞品分析">竞品分析</option>
                                  <option value="编程">编程</option>
                                  <option value="营销">营销</option>
                                  <option value="访谈">访谈</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                              </div>
                              <div className="relative">
                                <select
                                  value={status}
                                  onChange={(event) => updateNoteStatus(note, event.target.value as LifecycleStatus)}
                                  className={`w-full appearance-none border text-xs rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors ${
                                    status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                                    status === 'review' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' :
                                    'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <option value="draft">🟡 设为草稿</option>
                                  <option value="review">🟠 设为待审</option>
                                  <option value="published">🟢 设为发布</option>
                                </select>
                                <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${status === 'published' ? 'text-emerald-500' : status === 'review' ? 'text-amber-500' : 'text-slate-400'}`}>
                                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => router.push(`/admin/editor/${note.slug}`)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                title="编辑"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteNote(note)}
                                disabled={deletingSlug === note.slug}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50"
                                title="删除"
                              >
                                {deletingSlug === note.slug ? (
                                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {notes.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-sm text-slate-500">
                          没有找到笔记记录
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Sidebar / Top Notes */}
          <section className="space-y-4">
             <div className="flex items-center justify-between px-1">
               <h2 className="text-sm font-semibold text-slate-900">最热阅读榜</h2>
             </div>
             
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
               {topNotes.length === 0 ? (
                  <div className="p-5 text-sm text-slate-500 text-center">暂无足够的数据生成热度榜单</div>
               ) : (
                  <ul className="divide-y divide-slate-100">
                    {topNotes.slice(0, 5).map((item, index) => (
                      <li key={item.slug} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-slate-200 text-slate-700' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">/{item.slug}</p>
                        </div>
                        <div className="text-xs font-semibold text-slate-500 whitespace-nowrap bg-slate-100 px-2 py-1 rounded-md">
                          {item.views} 阅
                        </div>
                      </li>
                    ))}
                  </ul>
               )}
             </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
