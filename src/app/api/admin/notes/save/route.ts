import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { hasSupabaseConfig, supabase } from '@/lib/supabase';
import { createRequestContext, logError, logInfo } from '@/lib/server-observability';

function classifySaveError(error: unknown, runtime: 'cloud' | 'local'): { code: string; message: string } {
    const raw = typeof error === 'string'
        ? error
        : JSON.stringify(error ?? {});
    const lower = raw.toLowerCase();

    if (lower.includes('fetch failed') || lower.includes('eacces') || lower.includes('enotfound')) {
        return {
            code: 'DB_NETWORK_ERROR',
            message: runtime === 'cloud'
                ? '数据库连接失败（服务端网络异常），请稍后重试或检查部署环境配置。'
                : '数据库连接失败，请检查本机网络或代理设置后重试。',
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
    const optionalColumns = ['seo_title', 'seo_description', 'source', 'cover_image', 'lifecycle_status'];
    const next = { ...input };

    optionalColumns.forEach((column) => {
        if (text.includes(column)) {
            delete next[column];
        }
    });

    return next;
}

async function writePostHistory(
    slug: string,
    action: string,
    requestId: string,
    metadata: Record<string, unknown>
) {
    const { error } = await supabase
        .from('post_history')
        .insert([
            {
                post_slug: slug,
                action,
                actor: 'admin',
                metadata: {
                    ...metadata,
                    requestId,
                },
            },
        ]);

    return error;
}

export async function POST(request: NextRequest) {
    const ctx = createRequestContext(request, '/api/admin/notes/save');

    try {
        if (!hasSupabaseConfig) {
            logError(ctx, 'config_missing', 'supabase_config_missing');
            return NextResponse.json(
                {
                    error: ctx.runtime === 'cloud'
                        ? '数据库配置缺失，请在部署平台补充 Supabase 环境变量。'
                        : '本地缺少 Supabase 环境变量，请检查 .env.local。',
                    code: 'DB_CONFIG_MISSING',
                    requestId: ctx.requestId,
                },
                { status: 500 }
            );
        }

        // 验证权限
        const isAuthenticated = await verifyAdminAuth();
        if (!isAuthenticated) {
            logInfo(ctx, 'auth_required');
            return NextResponse.json(
                { error: '未授权访问，请重新登录。', code: 'AUTH_REQUIRED', requestId: ctx.requestId },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { note, isNew } = body;

        // Basic Validation
        if (!note.title || !note.slug) {
            logInfo(ctx, 'validation_failed', { reason: 'missing_title_or_slug' });
            return NextResponse.json(
                { error: '标题和 Slug 必填。', code: 'VALIDATION_ERROR', requestId: ctx.requestId },
                { status: 400 }
            );
        }

        // Prepare data for Supabase
        const lifecycleStatus = note.lifecycleStatus || (note.published ? 'published' : 'draft');
        const postData: Record<string, unknown> = {
            slug: note.slug,
            title: note.title,
            category: note.category,
            content: note.content,
            excerpt: note.excerpt,
            tags: note.tags,
            cover_image: note.coverImage || null,
            published: lifecycleStatus === 'published',
            lang: note.lang,
            updated_at: new Date().toISOString(),
            seo_title: note.seoTitle || null,
            seo_description: note.seoDescription || null,
            lifecycle_status: lifecycleStatus,
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
                .maybeSingle();

            if (existing) {
                logInfo(ctx, 'slug_exists', { slug: note.slug });
                return NextResponse.json(
                    { error: 'Slug 已存在，请更换。', code: 'SLUG_EXISTS', requestId: ctx.requestId },
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
            const classified = classifySaveError(error, ctx.runtime);
            logError(ctx, 'save_failed', error, { code: classified.code, slug: note.slug });
            return NextResponse.json(
                { error: classified.message, code: classified.code, requestId: ctx.requestId },
                { status: 500 }
            );
        }

        logInfo(ctx, 'save_success', { slug: note.slug, isNew: Boolean(isNew) });

        const historyError = await writePostHistory(
            note.slug,
            isNew ? 'create' : 'update',
            ctx.requestId,
            {
                lifecycleStatus,
                title: note.title,
            }
        );
        if (historyError) {
            logError(ctx, 'history_write_failed', historyError, { slug: note.slug });
        }

        return NextResponse.json({
            success: true,
            slug: note.slug,
            data,
            requestId: ctx.requestId,
        });

    } catch (error) {
        const classified = classifySaveError(error, ctx.runtime);
        logError(ctx, 'save_exception', error, { code: classified.code });
        return NextResponse.json(
            { error: classified.message, code: classified.code, requestId: ctx.requestId },
            { status: 500 }
        );
    }
}
