'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  source: 'obsidian' | 'supabase';
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

  const computeStats = (nextNotes: Note[]) => {
    const publishedNotes = nextNotes.filter((note) => normalizeStatus(note) === 'published').length;
    const draftNotes = nextNotes.length - publishedNotes;

    const categoryCount: Record<string, number> = {};
    nextNotes.forEach((note) => {
      const category = note.category || '未分类';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const [topCategory] = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])[0] || ['未分类'];

    setStats({
      totalNotes: nextNotes.length,
      publishedNotes,
      draftNotes,
      topCategory,
    });
  };

  const fetchHealth = async () => {
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
  };

  const fetchNotes = async () => {
    const response = await fetch('/api/admin/notes');
    if (!response.ok) {
      throw new Error(`fetch notes failed: ${response.status}`);
    }

    const data = await response.json();
    const notesData = (data.notes || []) as Note[];
    setNotes(notesData);
    computeStats(notesData);
  };

  const fetchAnalytics = async () => {
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
  };

  const loadDashboard = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchNotes(), fetchHealth(), fetchAnalytics()]);
    } catch (error) {
      console.error('加载后台数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

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

  const overviewCards = useMemo(
    () => [
      { label: '总笔记数', value: stats.totalNotes, hint: `主分类：${stats.topCategory}` },
      { label: '已发布', value: stats.publishedNotes, hint: `草稿/待审：${stats.draftNotes}` },
      { label: '近7天页面浏览', value: analytics.pageViews7d, hint: '全站 page_view 事件' },
      { label: '近7天笔记浏览', value: analytics.noteViews7d, hint: 'note_view 事件' },
      { label: '近7天 CTA 点击', value: analytics.ctaClicks7d, hint: '文章页 CTA 点击' },
      { label: '平均阅读进度', value: `${analytics.avgReadDepth7d}%`, hint: `近30天事件数：${analytics.events30d}` },
    ],
    [analytics, stats]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">内容管理控制台</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'notes'
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  笔记管理
                </button>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'overview'
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  数据概览
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadDashboard}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                刷新
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {health && (
          <div className={`mb-5 rounded-lg border px-4 py-3 text-sm ${health.ok
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}>
            <div className="flex items-center justify-between gap-3">
              <span>{health.ok ? '服务状态正常' : '服务状态异常'}：{health.message}</span>
              <button
                onClick={fetchHealth}
                className="rounded border border-amber-300 px-2 py-1 text-xs hover:bg-amber-100"
              >
                重新检查
              </button>
            </div>
            {health.checks && (
              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                <span>配置: {health.checks.config ? 'OK' : 'FAIL'}</span>
                <span>数据库: {health.checks.database ? 'OK' : 'FAIL'}</span>
                <span>存储: {health.checks.storage ? 'OK' : 'FAIL'}</span>
                <span>表结构: {health.checks.schema ? 'OK' : 'FAIL'}</span>
                {health.requestId && <span>请求ID: {health.requestId}</span>}
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {overviewCards.map((card) => (
                <div key={card.label} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{card.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{card.hint}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-3">近 7 天热门笔记</h2>
              {topNotes.length === 0 ? (
                <p className="text-sm text-gray-500">暂无阅读数据。</p>
              ) : (
                <ul className="space-y-2">
                  {topNotes.map((item) => (
                    <li key={item.slug} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">/{item.slug}</span>
                      <span className="font-medium text-gray-900">{item.views} 次浏览</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">笔记管理</h3>
                <p className="mt-1 text-sm text-gray-500">管理笔记状态、分类和发布节奏</p>
              </div>
              <button
                onClick={() => router.push('/admin/editor')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                新建笔记
              </button>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">语言</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">生命周期</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {notes.map((note) => {
                      const status = normalizeStatus(note);
                      const statusMeta = STATUS_META[status];
                      return (
                        <tr key={note.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{note.title}</div>
                            <div className="text-sm text-gray-500">{note.slug}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={note.category}
                              onChange={(e) => updateNoteCategory(note, e.target.value)}
                              className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {note.language === 'zh' ? '中文' : '日语'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(note.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMeta.badgeClass}`}>
                                {statusMeta.label}
                              </span>
                              <select
                                value={status}
                                onChange={(e) => updateNoteStatus(note, e.target.value as LifecycleStatus)}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="draft">草稿</option>
                                <option value="review">待审核</option>
                                <option value="published">已发布</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center gap-3">
                              <button
                                onClick={() => router.push(`/admin/editor/${note.slug}`)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => updateNoteStatus(note, status === 'published' ? 'draft' : 'published')}
                                className={`text-sm ${status === 'published' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                              >
                                {status === 'published' ? '撤回' : '发布'}
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
          </div>
        )}
      </div>
    </div>
  );
}
