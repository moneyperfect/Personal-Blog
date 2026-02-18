import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

function classifySaveError(error: unknown): { code: string; message: string } {
    const raw = typeof error === 'string'
        ? error
        : JSON.stringify(error ?? {});
    const lower = raw.toLowerCase();

    if (lower.includes('fetch failed') || lower.includes('eacces') || lower.includes('enotfound')) {
        return {
            code: 'DB_NETWORK_ERROR',
            message: '数据库连接失败，请检查本机网络/代理后重试。',
        };
    }

    if (lower.includes('permission denied') || lower.includes('row-level security')) {
        return {
            code: 'DB_PERMISSION_DENIED',
            message: '数据库权限不足，无法保存当前内容。',
        };
    }

    return {
        code: 'DB_WRITE_FAILED',
        message: '数据库写入失败，请稍后重试。',
    };
}

function removeUnsupportedColumns(
    input: Record<string, unknown>,
    error: unknown
): Record<string, unknown> {
    const text = JSON.stringify(error ?? {}).toLowerCase();
    const optionalColumns = ['seo_title', 'seo_description', 'source', 'cover_image'];
    const next = { ...input };

    optionalColumns.forEach((column) => {
        if (text.includes(column)) {
            delete next[column];
        }
    });

    return next;
}

export async function POST(request: NextRequest) {
    try {
        // 验证权限
        const isAuthenticated = await verifyAdminAuth();
        if (!isAuthenticated) {
            return NextResponse.json(
                { error: '未授权访问，请重新登录。', code: 'AUTH_REQUIRED' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { note, isNew } = body;

        // Basic Validation
        if (!note.title || !note.slug) {
            return NextResponse.json(
                { error: '标题和 Slug 必填。', code: 'VALIDATION_ERROR' },
                { status: 400 }
            );
        }

        // Prepare data for Supabase
        const postData: Record<string, unknown> = {
            slug: note.slug,
            title: note.title,
            category: note.category,
            content: note.content,
            excerpt: note.excerpt,
            tags: note.tags,
            cover_image: note.coverImage || null,
            published: note.published,
            lang: note.lang,
            updated_at: new Date().toISOString(),
            seo_title: note.seoTitle || null,
            seo_description: note.seoDescription || null,
            // For new posts, set date to now if not provided
            ...(isNew ? { date: new Date().toISOString() } : {}),
            source: 'supabase', // Ensure source is set
        };

        let data: unknown = null;
        let error: unknown = null;

        if (isNew) {
            // Check if slug exists
            const { data: existing } = await supabase
                .from('posts')
                .select('slug')
                .eq('slug', note.slug)
                .single();

            if (existing) {
                return NextResponse.json(
                    { error: 'Slug 已存在，请更换。', code: 'SLUG_EXISTS' },
                    { status: 409 }
                );
            }

            // Insert
            ({ data, error } = await supabase
                .from('posts')
                .insert([postData])
                .select());
        } else {
            // Update
            // Security check: ensure we are updating the correct record
            // Ideally we should use ID, but slug is the key here.

            ({ data, error } = await supabase
                .from('posts')
                .update(postData)
                .eq('slug', note.slug) // Note: if slug calls change, this might be tricky. Ideally use ID.
                .select());
        }

        if (error) {
            const fallbackPostData = removeUnsupportedColumns(postData, error);
            const hasFallback = Object.keys(fallbackPostData).length !== Object.keys(postData).length;

            if (hasFallback) {
                if (isNew) {
                    ({ data, error } = await supabase
                        .from('posts')
                        .insert([fallbackPostData])
                        .select());
                } else {
                    ({ data, error } = await supabase
                        .from('posts')
                        .update(fallbackPostData)
                        .eq('slug', note.slug)
                        .select());
                }
            }
        }

        if (error) {
            console.error('Save error:', error);
            const classified = classifySaveError(error);
            return NextResponse.json(
                { error: classified.message, code: classified.code },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            slug: note.slug,
            data
        });

    } catch (error) {
        console.error('Save API error:', error);
        const classified = classifySaveError(error);
        return NextResponse.json(
            { error: classified.message, code: classified.code },
            { status: 500 }
        );
    }
}
