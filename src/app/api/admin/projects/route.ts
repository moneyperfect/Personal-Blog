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

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = getAllProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return NextResponse.json({ error: '获取项目列表失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { project } = body;

    if (!project || !project.slug) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(project.slug)) {
      return NextResponse.json({ error: 'slug 只能包含小写字母、数字和连字符' }, { status: 400 });
    }

    const projects = getAllProjects();
    
    // Check if project already exists
    if (projects.some((p: { slug: string }) => p.slug === project.slug)) {
      return NextResponse.json({ error: '项目已存在，请使用 PUT 更新' }, { status: 409 });
    }

    projects.push(project);
    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), 'utf8');

    return NextResponse.json({ success: true, slug: project.slug });
  } catch (error) {
    console.error('创建项目失败:', error);
    return NextResponse.json({ error: '创建项目失败' }, { status: 500 });
  }
}
