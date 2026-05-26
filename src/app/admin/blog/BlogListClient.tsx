'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';

type LifecycleStatus = 'draft' | 'review' | 'published';

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    category?: string;
    description: string;
    lang?: string;
  };
  lifecycleStatus?: LifecycleStatus;
  published?: boolean;
  wordCount: number;
}

const STATUS_META: Record<LifecycleStatus, { label: string; badgeClass: string }> = {
  draft: { label: '草稿', badgeClass: 'bg-slate-100 text-slate-600' },
  review: { label: '待审', badgeClass: 'bg-amber-50 text-amber-700' },
  published: { label: '已发布', badgeClass: 'bg-emerald-50 text-emerald-700' },
};

const CATEGORY_OPTIONS = ['', 'AI', '开发', '产品', '增长', '自动化', '随笔', '技术', '思考', '复盘'];

function normalizeStatus(post: BlogPost): LifecycleStatus {
  if (post.lifecycleStatus) return post.lifecycleStatus;
  return post.published ? 'published' : 'draft';
}

export default function BlogListClient() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LifecycleStatus | 'all'>('all');
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [updatingSlug, setUpdatingSlug] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/blog/posts');
      if (!response.ok) {
        throw new Error('获取博客列表失败');
      }
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('获取博客列表失败:', error);
      alert('获取博客列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const updatePostStatus = async (post: BlogPost, lifecycleStatus: LifecycleStatus) => {
    setUpdatingSlug(post.slug);
    try {
      const response = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-status',
          slug: post.slug,
          updates: { lifecycleStatus },
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        alert(`更新状态失败: ${data.error || '未知错误'}`);
        return;
      }
      setPosts((prev) =>
        prev.map((p) =>
          p.slug === post.slug
            ? { ...p, lifecycleStatus, published: lifecycleStatus === 'published' }
            : p
        )
      );
    } catch {
      alert('请求失败，请检查网络');
    } finally {
      setUpdatingSlug(null);
    }
  };

  const updatePostCategory = async (post: BlogPost, category: string) => {
    setUpdatingSlug(post.slug);
    try {
      const response = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-category',
          slug: post.slug,
          updates: { category },
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        alert(`更新分类失败: ${data.error || '未知错误'}`);
        return;
      }
      setPosts((prev) =>
        prev.map((p) =>
          p.slug === post.slug ? { ...p, frontmatter: { ...p.frontmatter, category } } : p
        )
      );
    } catch {
      alert('请求失败，请检查网络');
    } finally {
      setUpdatingSlug(null);
    }
  };

  const deletePost = async (post: BlogPost) => {
    const confirmed = window.confirm(
      `确认删除「${post.frontmatter.title}」吗？\n\n删除后不可恢复。`
    );
    if (!confirmed) return;

    setDeletingSlug(post.slug);
    try {
      const response = await fetch(`/api/admin/blog/posts/${post.slug}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '删除失败');
      }
      setPosts((prev) => prev.filter((p) => p.slug !== post.slug));
    } catch (error) {
      alert(error instanceof Error ? error.message : '删除失败');
    } finally {
      setDeletingSlug(null);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (statusFilter !== 'all' && normalizeStatus(post) !== statusFilter) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.frontmatter.title.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query) ||
      post.frontmatter.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <AdminShell title="博客管理">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-surface-900" />
          <span className="ml-3 text-surface-600">加载中...</span>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="博客管理"
      description={`共 ${posts.length} 篇文章。管理博客文章的发布、编辑和删除。`}
      actions={
        <button
          type="button"
          onClick={() => router.push('/admin/blog/new')}
          className="px-4 py-2 bg-surface-900 text-white rounded-md text-sm font-medium hover:bg-surface-800 transition-colors"
        >
          新建文章
        </button>
      }
    >
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="搜索标题、slug 或标签..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-400 bg-surface-200"
        />
        <div className="flex gap-1.5">
          {(['all', 'published', 'draft', 'review'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-surface-900 text-white'
                  : 'bg-surface-200 text-surface-600 hover:bg-surface-300'
              }`}
            >
              {status === 'all' ? '全部' : STATUS_META[status].label}
            </button>
          ))}
        </div>
        <span className="text-xs text-surface-500">
          显示 {filteredPosts.length} / {posts.length}
        </span>
      </div>

      {/* Posts Table */}
      <div className="bg-surface-200 rounded-google-xl border border-surface-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-300 bg-surface-100 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                <th className="px-6 py-4">标题</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4">分类</th>
                <th className="px-6 py-4">日期</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-300">
              {filteredPosts.map((post) => {
                const status = normalizeStatus(post);
                const meta = STATUS_META[status];
                return (
                  <tr key={post.slug} className="group hover:bg-surface-100/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-surface-900">
                        {post.frontmatter.title}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.frontmatter.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] text-accent font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={status}
                        onChange={(e) => updatePostStatus(post, e.target.value as LifecycleStatus)}
                        disabled={updatingSlug === post.slug}
                        className={`appearance-none border text-xs rounded-full py-1 pl-2.5 pr-7 focus:outline-none focus:ring-2 focus:ring-surface-400 cursor-pointer transition-colors ${meta.badgeClass} border-current/20`}
                      >
                        <option value="draft">草稿</option>
                        <option value="review">待审</option>
                        <option value="published">已发布</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={post.frontmatter.category || ''}
                        onChange={(e) => updatePostCategory(post, e.target.value)}
                        disabled={updatingSlug === post.slug}
                        className="appearance-none bg-surface-100 border border-surface-300 text-surface-700 text-xs rounded-full py-1 pl-2.5 pr-7 focus:outline-none focus:ring-2 focus:ring-surface-400 cursor-pointer"
                      >
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>{cat || '未分类'}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-500">
                      {new Date(post.frontmatter.date).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/blog/${post.slug}`)}
                          className="px-3 py-1.5 text-xs font-medium text-surface-700 bg-surface-100 border border-surface-300 rounded-full hover:bg-surface-200 transition-colors"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePost(post)}
                          disabled={deletingSlug === post.slug}
                          className="px-3 py-1.5 text-xs font-medium text-red-700 bg-surface-100 border border-red-200 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deletingSlug === post.slug ? '...' : '删除'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-surface-500">
                    {searchQuery || statusFilter !== 'all' ? '没有匹配的文章' : '暂无博客文章'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
