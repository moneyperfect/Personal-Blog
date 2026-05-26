'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import AboutMediaPanel from './AboutMediaPanel';

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
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-surface-900" />
          <p className="mt-4 text-surface-600">正在加载后台数据...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminShell
      title="概览"
      description="系统状态、数据概览与快速操作。"
      actions={(
        <button type="button" onClick={() => void refreshDashboard()} className="px-4 py-2 bg-surface-200 text-surface-700 border border-surface-300 rounded-full text-sm font-medium hover:bg-surface-300 transition-colors">
          刷新
        </button>
      )}
    >
      {health ? (
        <div className={`mb-8 p-4 rounded-google-xl border ${health.ok ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30'}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-surface-900">
                {health.ok ? '服务正常' : '服务异常'}
              </div>
              <div className="mt-1 text-xs text-surface-600">{health.message}</div>
            </div>
            <button type="button" onClick={fetchHealth} className="px-3 py-1.5 text-xs font-medium bg-surface-200 text-surface-700 border border-surface-300 rounded-full hover:bg-surface-300 transition-colors">
              重新检查
            </button>
          </div>
          {health.checks ? (
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              {Object.entries(health.checks).map(([key, ok]) => (
                <span key={key} className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {key === 'config' ? '配置' : key === 'database' ? '数据库' : key === 'storage' ? '存储' : '表结构'}: {ok ? 'OK' : 'FAIL'}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-8">
        <AboutMediaPanel />

        {/* Analytics Stats */}
        <section>
          <h2 className="text-sm font-semibold text-surface-900 mb-4 px-1">数据概览</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-surface-200 rounded-google-xl border border-surface-300 p-5">
              <p className="text-xs font-medium text-surface-500">总文章</p>
              <p className="text-3xl font-bold tracking-tight text-surface-900 mt-1">{stats.totalNotes}</p>
              <p className="text-[11px] text-surface-500 mt-1">{stats.publishedNotes} 已发布</p>
            </div>
            {overviewCards.slice(2).map((card) => (
              <div key={card.label} className="bg-surface-200 rounded-google-xl border border-surface-300 p-5">
                <p className="text-xs font-medium text-surface-500">{card.label}</p>
                <p className="text-2xl font-bold tracking-tight text-surface-900 mt-1">{card.value}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts Quick View */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
               <h2 className="text-sm font-semibold text-surface-900">最近内容</h2>
               <button
                 type="button"
                 onClick={() => router.push('/admin/blog')}
                 className="text-xs font-medium text-accent hover:underline"
               >
                 查看全部
               </button>
            </div>

            <div className="bg-surface-200 rounded-google-xl border border-surface-300 overflow-hidden">
              <div className="divide-y divide-surface-300">
                {notes.slice(0, 6).map((note) => {
                  const status = normalizeStatus(note);
                  const statusMeta = STATUS_META[status];

                  return (
                    <div key={note.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-100/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-surface-900 text-sm truncate">{note.title}</div>
                        <div className="text-[11px] text-surface-500 mt-0.5">
                          {new Date(note.date).toLocaleDateString()} &middot; {note.category || '未分类'}
                        </div>
                      </div>
                      <select
                        value={status}
                        onChange={(event) => updateNoteStatus(note, event.target.value as LifecycleStatus)}
                        className={`appearance-none border text-[11px] rounded-full py-1 pl-2.5 pr-7 focus:outline-none cursor-pointer transition-colors ${statusMeta.badgeClass} border-current/20`}
                      >
                        <option value="draft">草稿</option>
                        <option value="review">待审</option>
                        <option value="published">已发布</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/editor/${note.slug}`)}
                        className="text-xs text-surface-500 hover:text-accent transition-colors"
                      >
                        编辑
                      </button>
                    </div>
                  );
                })}
                {notes.length === 0 && (
                  <div className="px-5 py-8 text-center text-sm text-surface-500">
                    暂无内容
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Top Notes */}
          <section className="space-y-4">
             <h2 className="text-sm font-semibold text-surface-900 px-1">最热阅读</h2>
             <div className="bg-surface-200 rounded-google-xl border border-surface-300 p-1">
               {topNotes.length === 0 ? (
                  <div className="p-5 text-sm text-surface-500 text-center">暂无数据</div>
               ) : (
                  <ul className="divide-y divide-surface-300">
                    {topNotes.slice(0, 5).map((item, index) => (
                      <li key={item.slug} className="flex items-center gap-3 p-3 hover:bg-surface-100 rounded-google-lg transition-colors">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          index === 0 ? 'bg-accent/10 text-accent' : 'bg-surface-300 text-surface-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-900 truncate">/{item.slug}</p>
                        </div>
                        <div className="text-xs font-semibold text-surface-500 whitespace-nowrap bg-surface-300 px-2 py-1 rounded-full">
                          {item.views}
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
