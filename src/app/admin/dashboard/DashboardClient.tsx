'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'analytics'>('overview');
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

  // 图表数据状态
  const [trafficData, setTrafficData] = useState<{ date: string; visits: number; pageviews: number }[]>([
    { date: '1月1日', visits: 4000, pageviews: 2400 },
    { date: '1月2日', visits: 3000, pageviews: 1398 },
    { date: '1月3日', visits: 2000, pageviews: 9800 },
    { date: '1月4日', visits: 2780, pageviews: 3908 },
    { date: '1月5日', visits: 1890, pageviews: 4800 },
    { date: '1月6日', visits: 2390, pageviews: 3800 },
    { date: '1月7日', visits: 3490, pageviews: 4300 },
  ]);

  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [topNotesData, setTopNotesData] = useState<{ name: string; views: number }[]>([]);

  useEffect(() => {
    fetchNotes();
    fetchStats();
    updateChartData();
  }, []);

  // 根据笔记数据更新图表
  const updateChartData = () => {
    // 当notes数据加载后，这个函数会被调用
    // 实际的更新会在fetchNotes完成后进行
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/admin/notes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const notesData = data.notes || [];
      setNotes(notesData);
      
      // 更新基于笔记数据的图表
      updateChartsFromNotes(notesData);
    } catch (error) {
      console.error('获取笔记失败:', error);
    }
  };

  // 根据笔记数据更新图表
  const updateChartsFromNotes = (notesData: Note[]) => {
    // 更新分类分布图
    const categoryCount: Record<string, number> = {};
    notesData.forEach(note => {
      const category = note.category || '未分类';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const newCategoryData = Object.entries(categoryCount).map(([name, value]) => ({
      name: name === '' ? '未分类' : name,
      value,
    }));
    setCategoryData(newCategoryData);

    // 更新热门笔记图（模拟视图数据）
    const newTopNotesData = notesData
      .slice(0, 5) // 取前5个
      .map(note => ({
        name: note.title.length > 10 ? note.title.substring(0, 10) + '...' : note.title,
        views: Math.floor(Math.random() * 10000) + 1000, // 模拟视图数
      }));
    setTopNotesData(newTopNotesData);
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

      // 模拟视图数据（后续应该从Google Analytics获取）
      const totalViews = notes.length * 100;
      const viewsGrowth = 12.5;

      setStats({
        totalNotes: notes.length,
        publishedNotes,
        draftNotes,
        totalViews,
        viewsGrowth,
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

  const toggleNoteEnabled = async (id: string) => {
    try {
      const response = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'toggle-enabled',
          slug: id,
        }),
      });

      if (response.ok) {
        // 更新本地状态
        setNotes(notes.map(note => 
          note.id === id ? { ...note, enabled: !note.enabled } : note
        ));
        // 刷新统计数据
        fetchStats();
      } else {
        console.error('更新笔记状态失败');
      }
    } catch (error) {
      console.error('更新笔记状态失败:', error);
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
        // 更新本地状态
        setNotes(notes.map(note => 
          note.id === id ? { ...note, category } : note
        ));
        // 刷新统计数据
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
                  onClick={() => setActiveTab('overview')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  概览
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'notes'
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  笔记管理
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'analytics'
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  流量分析
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
            {/* 统计卡片 */}
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

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-yellow-600 text-lg">📊</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">总访问量</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalViews.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-lg">📈</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">增长</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.viewsGrowth}%</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* 流量趋势图 */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">流量趋势</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visits" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="pageviews" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 分类分布图 */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">笔记分类分布</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 热门笔记 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">热门笔记</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topNotesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        标题
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        分类
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        语言
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日期
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
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
                            <option value="template">模板</option>
                            <option value="checklist">清单</option>
                            <option value="sop">SOP</option>
                            <option value="prompt">Prompt</option>
                            <option value="note">笔记</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {note.language === 'zh' ? '中文' : '日语'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {note.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            note.enabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {note.enabled ? '已发布' : '未发布'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleNoteEnabled(note.id)}
                            className={`mr-3 ${
                              note.enabled
                                ? 'text-red-600 hover:text-red-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {note.enabled ? '取消发布' : '发布'}
                          </button>
                          <button className="text-primary-600 hover:text-primary-900">
                            编辑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* 实时流量 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">实时流量监控</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="visits" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 访问来源 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">访问来源</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                        data={[
                          { name: '直接访问', value: 400 },
                          { name: '搜索引擎', value: 300 },
                          { name: '社交媒体', value: 300 },
                          { name: '引荐链接', value: 200 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#00C49F" />
                        <Cell fill="#FFBB28" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">设备分布</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: '桌面端', value: 4000 },
                        { name: '移动端', value: 3000 },
                        { name: '平板', value: 2000 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}