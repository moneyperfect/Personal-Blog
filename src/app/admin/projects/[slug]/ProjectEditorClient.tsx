'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';

interface Project {
  slug: string;
  name: { zh: string; ja: string };
  description: { zh: string; ja: string };
  techStack: string[];
  link: string;
  github?: string;
  image: string;
  detailPage?: string;
  content: { zh: string; ja: string };
}

const emptyProject: Project = {
  slug: '',
  name: { zh: '', ja: '' },
  description: { zh: '', ja: '' },
  techStack: [],
  link: '',
  github: '',
  image: '',
  detailPage: '',
  content: { zh: '', ja: '' },
};

export default function ProjectEditorClient({
  slug,
  initialTab,
}: {
  slug: string;
  initialTab?: string;
}) {
  const router = useRouter();
  const isNew = slug === 'new';
  const [activeTab, setActiveTab] = useState(initialTab === 'html' ? 'html' : 'info');
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState<Project>({ ...emptyProject });
  const [newSlug, setNewSlug] = useState('');
  const [techInput, setTechInput] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [loadingHtml, setLoadingHtml] = useState(false);

  const fetchProject = useCallback(async () => {
    if (isNew) return;
    
    try {
      const response = await fetch(`/api/admin/projects/${slug}`);
      if (!response.ok) {
        throw new Error('获取项目失败');
      }
      const data = await response.json();
      setProject(data.project);
    } catch (error) {
      console.error('获取项目失败:', error);
      alert('获取项目失败');
      router.push('/admin/projects');
    } finally {
      setLoading(false);
    }
  }, [slug, isNew, router]);

  const fetchHtml = useCallback(async () => {
    if (isNew) return;
    
    setLoadingHtml(true);
    try {
      const response = await fetch(`/api/admin/projects/${slug}/html`);
      if (response.ok) {
        const data = await response.json();
        setHtmlContent(data.content || '');
      }
    } catch (error) {
      console.error('获取 HTML 内容失败:', error);
    } finally {
      setLoadingHtml(false);
    }
  }, [slug, isNew]);

  useEffect(() => {
    void fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (activeTab === 'html') {
      void fetchHtml();
    }
  }, [activeTab, fetchHtml]);

  const handleSaveInfo = async () => {
    if (saving) return;

    const currentSlug = isNew ? newSlug : slug;
    if (!currentSlug) {
      alert('请输入项目 slug');
      return;
    }

    if (!project.name.zh) {
      alert('请输入项目名称');
      return;
    }

    setSaving(true);
    try {
      const url = isNew
        ? '/api/admin/projects'
        : `/api/admin/projects/${slug}`;
      
      const method = isNew ? 'POST' : 'PUT';
      
      const body = isNew
        ? { project: { ...project, slug: currentSlug } }
        : { project };

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
        router.push(`/admin/projects/${currentSlug}`);
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHtml = async () => {
    if (saving || isNew) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/projects/${slug}/html`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: htmlContent }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '保存失败');
      }

      alert('HTML 详情页保存成功');
    } catch (error) {
      console.error('保存 HTML 失败:', error);
      alert(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const addTech = () => {
    const tech = techInput.trim();
    if (tech && !project.techStack.includes(tech)) {
      setProject({
        ...project,
        techStack: [...project.techStack, tech],
      });
      setTechInput('');
    }
  };

  const removeTech = (techToRemove: string) => {
    setProject({
      ...project,
      techStack: project.techStack.filter((tech) => tech !== techToRemove),
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

  const hasHtml = project.detailPage || !isNew;

  return (
    <AdminShell
      title={isNew ? '新建项目' : `编辑: ${project.name.zh || slug}`}
      description={isNew ? '创建一个新的项目展示' : `编辑项目 ${slug}`}
      actions={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            返回列表
          </button>
          {activeTab === 'info' ? (
            <button
              type="button"
              onClick={handleSaveInfo}
              disabled={saving}
              className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存信息'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveHtml}
              disabled={saving || isNew}
              className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存 HTML'}
            </button>
          )}
        </div>
      }
    >
      {/* Tabs */}
      {hasHtml && (
        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'info'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            项目信息
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'html'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            HTML 详情页
          </button>
        </div>
      )}

      {/* Info Tab */}
      {activeTab === 'info' && (
        <div className="space-y-6 max-w-4xl">
          {/* Slug (only for new projects) */}
          {isNew && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                项目 Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="my-project"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono"
              />
              <p className="mt-1 text-xs text-slate-500">
                只能包含小写字母、数字和连字符。
              </p>
            </div>
          )}

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                名称（中文）<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={project.name.zh}
                onChange={(e) =>
                  setProject({
                    ...project,
                    name: { ...project.name, zh: e.target.value },
                  })
                }
                placeholder="项目名称"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                名称（日文）
              </label>
              <input
                type="text"
                value={project.name.ja}
                onChange={(e) =>
                  setProject({
                    ...project,
                    name: { ...project.name, ja: e.target.value },
                  })
                }
                placeholder="プロジェクト名"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                描述（中文）
              </label>
              <textarea
                value={project.description.zh}
                onChange={(e) =>
                  setProject({
                    ...project,
                    description: { ...project.description, zh: e.target.value },
                  })
                }
                placeholder="项目简介"
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                描述（日文）
              </label>
              <textarea
                value={project.description.ja}
                onChange={(e) =>
                  setProject({
                    ...project,
                    description: { ...project.description, ja: e.target.value },
                  })
                }
                placeholder="プロジェクトの説明"
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                项目链接
              </label>
              <input
                type="url"
                value={project.link}
                onChange={(e) =>
                  setProject({ ...project, link: e.target.value })
                }
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                GitHub 链接
              </label>
              <input
                type="url"
                value={project.github || ''}
                onChange={(e) =>
                  setProject({ ...project, github: e.target.value })
                }
                placeholder="https://github.com/..."
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              封面图片路径
            </label>
            <input
              type="text"
              value={project.image}
              onChange={(e) =>
                setProject({ ...project, image: e.target.value })
              }
              placeholder="/images/projects/xxx.webp"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              技术栈
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
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
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                placeholder="输入技术名称后按回车"
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTech}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors"
              >
                添加
              </button>
            </div>
          </div>

          {/* Detail Page */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              详情页路径
            </label>
            <input
              type="text"
              value={project.detailPage || ''}
              onChange={(e) =>
                setProject({ ...project, detailPage: e.target.value })
              }
              placeholder="/projects/xxx.html"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-slate-500">
              如果有独立 HTML 详情页，填写路径（如 /projects/vibeimg.html）。
            </p>
          </div>
        </div>
      )}

      {/* HTML Tab */}
      {activeTab === 'html' && (
        <div className="max-w-6xl">
          {loadingHtml ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-slate-900" />
              <span className="ml-3 text-slate-600">加载 HTML 内容...</span>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                HTML 内容
              </label>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                rows={30}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono resize-y"
              />
              <p className="mt-2 text-xs text-slate-500">
                编辑 HTML 详情页内容。保存后会更新 public/projects/{slug}.html 文件。
              </p>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
