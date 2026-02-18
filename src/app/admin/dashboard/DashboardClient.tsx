'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Note {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  language: string;
  date: string;
  enabled: boolean;
  source: 'obsidian' | 'notion' | 'local';
}

interface Stats {
  totalNotes: number;
  publishedNotes: number;
  draftNotes: number;
  totalViews: number;
  viewsGrowth: number;
  topCategory: string;
}

export default function DashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'notes'>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalNotes: 0,
    publishedNotes: 0,
    draftNotes: 0,
    totalViews: 0,
    viewsGrowth: 0,
    topCategory: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
    fetchStats();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/admin/notes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const notesData = data.notes || [];
      setNotes(notesData);
    } catch (error) {
      console.error('获取笔记失败:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // 从真实笔记数据计算统计
      const notes = await fetchNotesForStats();
      const publishedNotes = notes.filter(note => note.enabled).length;
      const draftNotes = notes.filter(note => !note.enabled).length;

      // 计算类别分布
      const categoryCount: Record<string, number> = {};
      notes.forEach(note => {
        const category = note.category || '未分类';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      // 找出最常见的类别
      let topCategory = '未分类';
      let maxCount = 0;
      for (const [category, count] of Object.entries(categoryCount)) {
        if (count > maxCount) {
          maxCount = count;
          topCategory = category;
        }
      }

      setStats({
        totalNotes: notes.length,
        publishedNotes,
        draftNotes,
        totalViews: 0,
        viewsGrowth: 0,
        topCategory: topCategory === '' ? '未分类' : topCategory,
      });
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 辅助函数：获取笔记数据用于统计
  const fetchNotesForStats = async (): Promise<Note[]> => {
    try {
      const response = await fetch('/api/admin/notes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.notes || [];
    } catch (error) {
      console.error('获取笔记数据失败:', error);
      return [];
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const toggleNoteEnabled = async (note: Note) => {
    try {
      console.log('Toggling note:', note.slug, note.enabled);
      const response = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'toggle-enabled',
          slug: note.slug,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNotes(notes.map(n =>
          n.id === note.id ? { ...n, enabled: !n.enabled } : n
        ));
        fetchStats();
      } else {
        console.error('Toggle failed:', data.error);
        alert(`操作失败: ${data.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('请求失败，请检查网络');
    }
  };

  const handleUnpublish = async (note: Note) => {
    console.log('Requesting unpublish for:', note);
    if (!note.slug) {
      alert('错误：无法获取笔记标识 (Slug)');
      return;
    }

    if (!confirm(`确定要断开 "${note.title}" 的连接吗？\n这将从网站上移除该笔记，但保留 Obsidian 中的源文件。\n此操作不可逆（需要手动修改配置才能恢复）。`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/unpublish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: note.slug }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('已断开连接。请稍候等待 Vercel 自动重新构建。');
        // Optimistically remove from list or mark as disabled
        setNotes(notes.filter(n => n.id !== note.id));
        fetchStats();
      } else {
        console.error('Unpublish failed:', data.error);
        alert(`断开连接失败: ${data.error}`);
      }
    } catch (error) {
      console.error('Unpublish error:', error);
      alert('断开连接请求失败，请检查控制台日志。');
    }
  };

  const updateNoteCategory = async (id: string, category: string) => {
    try {
      const response = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-category',
          slug: id,
          updates: { category },
        }),
      });

      if (response.ok) {
        setNotes(notes.map(note =>
          note.id === id ? { ...note, category } : note
        ));
        fetchStats();
      } else {
        console.error('更新笔记分类失败');
      }
    } catch (error) {
      console.error('更新笔记分类失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
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
                  概览
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-lg">📝</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">总笔记数</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalNotes}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-lg">✅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">已发布</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.publishedNotes}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">笔记管理</h3>
              <p className="mt-1 text-sm text-gray-500">管理所有笔记的发布状态和分类</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">语言</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {notes.map((note) => (
                      <tr key={note.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{note.title}</div>
                          <div className="text-sm text-gray-500">{note.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={note.category}
                            onChange={(e) => updateNoteCategory(note.id, e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          >
                            <option value="">未分类</option>
                            <option value="AI">AI</option>
                            <option value="Bug修复">Bug修复</option>
                            <option value="MVP">MVP</option>
                            <option value="SOP">SOP</option>
                            <option value="ai">ai</option>
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
                          {note.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${note.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {note.enabled ? '已发布' : '未发布'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => toggleNoteEnabled(note)}
                              className={`text-sm ${note.enabled ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                            >
                              {note.enabled ? '下架' : '上架'}
                            </button>
                            <button
                              onClick={() => handleUnpublish(note)}
                              className="text-sm text-red-600 hover:text-red-900"
                              title="从网站彻底移除（保留源文件）"
                            >
                              断开连接
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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