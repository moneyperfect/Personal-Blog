import { notFound, redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminAuth } from '@/lib/admin-auth';
import Editor from '@/components/admin/Editor';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogEditorPage({ params }: PageProps) {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
        redirect('/admin');
    }

    const { slug } = await params;
    const isNew = slug === 'new';

    if (isNew) {
        return <Editor isNew={true} apiMode="blog" />;
    }

    const { data: post, error } = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !post) {
        notFound();
    }

    const note = {
        title: post.title || '',
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
        date: post.date ? new Date(post.date).toISOString().split('T')[0] : '',
    };

    return <Editor initialNote={note} isNew={false} apiMode="blog" />;
}
