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
  const [activeTab, setActiveTab] = useState<'overview' | 'notes'>('notes');
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
      title="内容控制台"
      description="统一管理笔记、产品和站点健康状态，保持内容运营与销售入口在同一套后台中完成。"
      actions={(
        <>
          <button type="button" onClick={() => setActiveTab('notes')} className={activeTab === 'notes' ? 'btn btn-primary' : 'btn btn-tonal'}>
            笔记管理
          </button>
          <button type="button" onClick={() => setActiveTab('overview')} className={activeTab === 'overview' ? 'btn btn-primary' : 'btn btn-tonal'}>
            数据概览
          </button>
          <button type="button" onClick={() => void refreshDashboard()} className="btn btn-text">
            刷新数据
          </button>
          <button type="button" onClick={() => router.push('/admin/editor')} className="btn btn-primary">
            新建笔记
          </button>
        </>
      )}
    >
      {health ? (
        <div className={`admin-card mb-6 ${health.ok ? 'border-emerald-200 bg-emerald-50/70' : 'border-amber-200 bg-amber-50/80'}`}>
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
              <span className="admin-badge">配置: {health.checks.config ? 'OK' : 'FAIL'}</span>
              <span className="admin-badge">数据库: {health.checks.database ? 'OK' : 'FAIL'}</span>
              <span className="admin-badge">存储: {health.checks.storage ? 'OK' : 'FAIL'}</span>
              <span className="admin-badge">表结构: {health.checks.schema ? 'OK' : 'FAIL'}</span>
              {health.requestId ? <span className="admin-badge">请求 ID: {health.requestId}</span> : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {overviewCards.map((card) => (
              <div key={card.label} className="admin-stat">
                <p className="admin-stat-label">{card.label}</p>
                <p className="admin-stat-value">{card.value}</p>
                <p className="admin-stat-hint">{card.hint}</p>
              </div>
            ))}
          </div>

          <div className="admin-card">
            <div className="section-header mb-3">
              <h2 className="section-title">近 7 天热门笔记</h2>
            </div>
            {topNotes.length === 0 ? (
              <p className="text-sm text-surface-600">暂无阅读数据。</p>
            ) : (
              <ul className="space-y-3">
                {topNotes.map((item) => (
                  <li key={item.slug} className="flex items-center justify-between gap-3 rounded-google border border-surface-200 px-4 py-3">
                    <span className="text-sm text-surface-700">/{item.slug}</span>
                    <span className="text-sm font-semibold text-surface-900">{item.views} 次浏览</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200 px-6 py-5">
            <div>
              <h2 className="section-title">笔记管理</h2>
              <p className="section-description mt-1">管理状态、分类与内容入口，保持发布节奏清晰可控。</p>
            </div>
            <button type="button" onClick={() => router.push('/admin/editor')} className="btn btn-primary">
              新建笔记
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>标题</th>
                  <th>分类</th>
                  <th>语言</th>
                  <th>日期</th>
                  <th>状态</th>
                  <th className="text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 bg-white">
                {notes.map((note) => {
                  const status = normalizeStatus(note);
                  const statusMeta = STATUS_META[status];

                  return (
                    <tr key={note.id}>
                      <td>
                        <div className="font-medium text-surface-900">{note.title}</div>
                        <div className="mt-1 text-xs text-surface-600">{note.slug}</div>
                      </td>
                      <td>
                        <select
                          value={note.category}
                          onChange={(event) => updateNoteCategory(note, event.target.value)}
                          className="select w-full min-w-[140px]"
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
                      </td>
                      <td>{note.language === 'zh' ? '中文' : '日语'}</td>
                      <td>{new Date(note.date).toLocaleDateString()}</td>
                      <td>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${statusMeta.badgeClass}`}>
                            {statusMeta.label}
                          </span>
                          <select
                            value={status}
                            onChange={(event) => updateNoteStatus(note, event.target.value as LifecycleStatus)}
                            className="select min-w-[116px]"
                          >
                            <option value="draft">草稿</option>
                            <option value="review">待审核</option>
                            <option value="published">已发布</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => router.push(`/admin/editor/${note.slug}`)} className="btn btn-tonal">
                            编辑
                          </button>
                          <button
                            type="button"
                            onClick={() => updateNoteStatus(note, status === 'published' ? 'draft' : 'published')}
                            className="btn btn-text"
                          >
                            {status === 'published' ? '撤回' : '发布'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteNote(note)}
                            disabled={deletingSlug === note.slug}
                            className="btn btn-text text-accent-red disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingSlug === note.slug ? '删除中...' : '删除'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
