import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { verifyAdminAuth } from '@/lib/admin-auth';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

interface BlogFrontmatter {
  title: string;
  date: string;
  tags: string[];
  category?: string;
  description: string;
  lang?: string;
}

function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));
  
  return files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      frontmatter: {
        title: data.title || '',
        date: data.date || '',
        tags: data.tags || [],
        category: data.category || undefined,
        description: data.description || '',
        lang: data.lang || 'zh',
      } as BlogFrontmatter,
      content,
      wordCount: content.length,
    };
  }).sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
}

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('获取博客列表失败:', error);
    return NextResponse.json({ error: '获取博客列表失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, frontmatter, content } = body;

    if (!slug || !frontmatter || !content) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'slug 只能包含小写字母、数字和连字符' }, { status: 400 });
    }

    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: '文章已存在，请使用 PUT 更新' }, { status: 409 });
    }

    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    // Build markdown content with frontmatter
    const frontmatterStr = Object.entries(frontmatter)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n');

    const fileContent = `---\n${frontmatterStr}\n---\n\n${content}`;
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('创建博客文章失败:', error);
    return NextResponse.json({ error: '创建博客文章失败' }, { status: 500 });
  }
}
