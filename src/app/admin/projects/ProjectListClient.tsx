'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';

interface Project {
  slug: string;
  name: { zh: string; ja: string };
  description: { zh: string; ja: string };
  techStack: string[];
  link: string;
  image: string;
  detailPage?: string;
}

export default function ProjectListClient() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (!response.ok) {
        throw new Error('获取项目列表失败');
      }
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('获取项目列表失败:', error);
      alert('获取项目列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const deleteProject = async (project: Project) => {
    const confirmed = window.confirm(
      `确认删除项目「${project.name.zh}」吗？\n\n删除后不可恢复。`
    );

    if (!confirmed) return;

    setDeletingSlug(project.slug);
    try {
      const response = await fetch(`/api/admin/projects/${project.slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '删除失败');
      }

      setProjects((prev) => prev.filter((p) => p.slug !== project.slug));
      alert('删除成功');
    } catch (error) {
      console.error('删除项目失败:', error);
      alert(error instanceof Error ? error.message : '删除失败');
    } finally {
      setDeletingSlug(null);
    }
  };

  if (loading) {
    return (
      <AdminShell title="项目管理" description="管理项目展示和详情页。">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900" />
          <span className="ml-3 text-slate-600">加载中...</span>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="项目管理"
      description={`共 ${projects.length} 个项目。管理项目展示和详情页。`}
      actions={
        <button
          type="button"
          onClick={() => router.push('/admin/projects/new')}
          className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          新建项目
        </button>
      }
    >
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Project Image */}
            {project.image && (
              <div className="aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name.zh}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 text-lg">
                {project.name.zh}
              </h3>
              <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                {project.description.zh}
              </p>
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1 mt-4">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="text-xs text-slate-500">
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => router.push(`/admin/projects/${project.slug}`)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  编辑信息
                </button>
                {project.detailPage && (
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/projects/${project.slug}?tab=html`)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    编辑详情页
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteProject(project)}
                  disabled={deletingSlug === project.slug}
                  className="px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deletingSlug === project.slug ? '...' : '删除'}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            暂无项目，点击「新建项目」开始创建。
          </div>
        )}
      </div>
    </AdminShell>
  );
}
