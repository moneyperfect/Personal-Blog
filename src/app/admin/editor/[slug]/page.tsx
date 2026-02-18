import { notFound, redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { verifyAdminAuth } from '@/lib/admin-auth';
import Editor from '@/components/admin/Editor';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function EditNotePage({ params }: PageProps) {
    // 验证权限 (Server Component verify)
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
        redirect('/admin');
    }

    const { slug } = await params;

    // Fetch note from Supabase
    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !post) {
        console.error('Error fetching note:', error);
        notFound();
    }

    // Transform to Editor Note format
    const note = {
        title: post.title,
        slug: post.slug,
        category: post.category || '',
        content: post.content || '',
        tags: post.tags || [],
        excerpt: post.excerpt || '',
        coverImage: post.cover_image || '',
        seoTitle: post.seo_title || '',
        seoDescription: post.seo_description || '',
        lifecycleStatus: post.lifecycle_status || (post.published ? 'published' : 'draft'),
        published: post.published,
        lang: post.lang || 'zh',
    };

    return <Editor initialNote={note} isNew={false} />;
}
