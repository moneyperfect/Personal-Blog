'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';

interface BlogFrontmatter {
  title: string;
  date: string;
  tags: string[];
  category?: string;
  description: string;
  lang?: string;
}

interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}

export default function BlogEditorClient({ slug }: { slug: string }) {
  const router = useRouter();
  const isNew = slug === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<BlogPost>({
    slug: '',
    frontmatter: {
      title: '',
      date: new Date().toISOString().split('T')[0],
      tags: [],
      category: '',
      description: '',
      lang: 'zh',
    },
    content: '',
  });

  const [newSlug, setNewSlug] = useState('');
  const [tagInput, setTagInput] = useState('');

  const fetchPost = useCallback(async () => {
    if (isNew) return;
    
    try {
      const response = await fetch(`/api/admin/blog/posts/${slug}`);
      if (!response.ok) {
        throw new Error('获取文章失败');
      }
      const data = await response.json();
      setPost(data.post);
    } catch (error) {
      console.error('获取文章失败:', error);
      alert('获取文章失败');
      router.push('/admin/blog');
    } finally {
      setLoading(false);
    }
  }, [slug, isNew, router]);

  useEffect(() => {
    void fetchPost();
  }, [fetchPost]);

  const handleSave = async () => {
    if (saving) return;

    // Validation
    const currentSlug = isNew ? newSlug : slug;
    if (!currentSlug) {
      alert('请输入文章 slug');
      return;
    }

    if (!post.frontmatter.title) {
      alert('请输入文章标题');
      return;
    }

    setSaving(true);
    try {
      const url = isNew
        ? '/api/admin/blog/posts'
        : `/api/admin/blog/posts/${slug}`;
      
      const method = isNew ? 'POST' : 'PUT';
      
      const body = isNew
        ? { slug: currentSlug, frontmatter: post.frontmatter, content: post.content }
        : { frontmatter: post.frontmatter, content: post.content };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '保存失败');
      }

      alert('保存成功');
      if (isNew) {
        router.push(`/admin/blog/${currentSlug}`);
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !post.frontmatter.tags.includes(tag)) {
      setPost({
        ...post,
        frontmatter: {
          ...post.frontmatter,
          tags: [...post.frontmatter.tags, tag],
        },
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost({
      ...post,
      frontmatter: {
        ...post.frontmatter,
        tags: post.frontmatter.tags.filter((tag) => tag !== tagToRemove),
      },
    });
  };

  if (loading) {
    return (
      <AdminShell title="加载中...">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900" />
          <span className="ml-3 text-slate-600">加载中...</span>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={isNew ? '新建文章' : `编辑: ${post.frontmatter.title || slug}`}
      description={isNew ? '创建一篇新的博客文章' : `编辑文章 ${slug}`}
      actions={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            返回列表
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      }
    >
      <div className="space-y-6 max-w-4xl">
        {/* Slug (only for new posts) */}
        {isNew && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              文章 Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="my-article-slug"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono"
            />
            <p className="mt-1 text-xs text-slate-500">
              只能包含小写字母、数字和连字符。将作为 URL 路径：/zh/blog/{newSlug || '...'}
            </p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={post.frontmatter.title}
            onChange={(e) =>
              setPost({
                ...post,
                frontmatter: { ...post.frontmatter, title: e.target.value },
              })
            }
            placeholder="文章标题"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>

        {/* Date & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              日期
            </label>
            <input
              type="date"
              value={post.frontmatter.date}
              onChange={(e) =>
                setPost({
                  ...post,
                  frontmatter: { ...post.frontmatter, date: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              分类
            </label>
            <select
              value={post.frontmatter.category || ''}
              onChange={(e) =>
                setPost({
                  ...post,
                  frontmatter: { ...post.frontmatter, category: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="">未分类</option>
              <option value="技术">技术</option>
              <option value="产品">产品</option>
              <option value="思考">思考</option>
              <option value="复盘">复盘</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            标签
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {post.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="输入标签后按回车"
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors"
            >
              添加
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            描述
          </label>
          <textarea
            value={post.frontmatter.description}
            onChange={(e) =>
              setPost({
                ...post,
                frontmatter: { ...post.frontmatter, description: e.target.value },
              })
            }
            placeholder="文章简介（用于 SEO 和列表展示）"
            rows={2}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            正文 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            placeholder="Markdown 格式的文章正文"
            rows={20}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono resize-y"
          />
          <p className="mt-1 text-xs text-slate-500">
            支持 Markdown 格式。保存后会在 content/posts/ 目录创建或更新 .md 文件。
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
