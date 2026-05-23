'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';

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
  wordCount: number;
}

export default function BlogListClient() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

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
      alert('删除成功');
    } catch (error) {
      console.error('删除博客文章失败:', error);
      alert(error instanceof Error ? error.message : '删除失败');
    } finally {
      setDeletingSlug(null);
    }
  };

  const filteredPosts = posts.filter((post) => {
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
      <AdminShell title="博客管理" description="管理博客文章的发布、编辑和删除。">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900" />
          <span className="ml-3 text-slate-600">加载中...</span>
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
          className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          新建文章
        </button>
      }
    >
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="搜索文章标题、slug 或标签..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        />
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">标题</th>
                <th className="px-6 py-4">标签</th>
                <th className="px-6 py-4">日期</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map((post) => (
                <tr
                  key={post.slug}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {post.frontmatter.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-mono">
                      /{post.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.frontmatter.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(post.frontmatter.date).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/blog/${post.slug}`)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePost(post)}
                        disabled={deletingSlug === post.slug}
                        className="px-3 py-1.5 text-xs font-medium text-red-700 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deletingSlug === post.slug ? '删除中...' : '删除'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    {searchQuery ? '没有找到匹配的文章' : '暂无博客文章'}
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
