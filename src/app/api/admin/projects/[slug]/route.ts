import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminAuth } from '@/lib/admin-auth';

const projectsPath = path.join(process.cwd(), 'config', 'projects.json');

function getAllProjects() {
  if (!fs.existsSync(projectsPath)) {
    return [];
  }

  const data = fs.readFileSync(projectsPath, 'utf8');
  return JSON.parse(data);
}

function saveProjects(projects: unknown[]) {
  fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), 'utf8');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const projects = getAllProjects();
    const project = projects.find((p: { slug: string }) => p.slug === slug);

    if (!project) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('获取项目详情失败:', error);
    return NextResponse.json({ error: '获取项目详情失败' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const { project } = body;

    if (!project) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    const projects = getAllProjects();
    const index = projects.findIndex((p: { slug: string }) => p.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }

    // Update project, preserving slug
    projects[index] = { ...project, slug };
    saveProjects(projects);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('更新项目失败:', error);
    return NextResponse.json({ error: '更新项目失败' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const projects = getAllProjects();
    const index = projects.findIndex((p: { slug: string }) => p.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }

    projects.splice(index, 1);
    saveProjects(projects);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('删除项目失败:', error);
    return NextResponse.json({ error: '删除项目失败' }, { status: 500 });
  }
}
