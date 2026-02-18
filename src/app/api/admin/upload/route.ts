import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { hasSupabaseConfig, supabase } from '@/lib/supabase';
import { createRequestContext, logError, logInfo } from '@/lib/server-observability';

function classifyUploadError(error: unknown, runtime: 'cloud' | 'local'): { code: string; message: string } {
    const raw = typeof error === 'string'
        ? error
        : JSON.stringify(error ?? {});
    const lower = raw.toLowerCase();

    if (lower.includes('fetch failed') || lower.includes('eacces') || lower.includes('enotfound')) {
        return {
            code: 'STORAGE_NETWORK_ERROR',
            message: runtime === 'cloud'
                ? '存储服务连接失败（服务端网络异常），请稍后重试或检查部署环境配置。'
                : '存储服务连接失败，请检查本机网络或代理设置后重试。',
        };
    }

    return {
        code: 'STORAGE_UPLOAD_FAILED',
        message: '上传失败，请稍后重试。',
    };
}

export async function POST(request: NextRequest) {
    const ctx = createRequestContext(request, '/api/admin/upload');

    try {
        if (!hasSupabaseConfig) {
            logError(ctx, 'config_missing', 'supabase_storage_config_missing');
            return NextResponse.json(
                {
                    error: ctx.runtime === 'cloud'
                        ? '存储配置缺失，请在部署平台补充 Supabase 环境变量。'
                        : '本地缺少 Supabase 环境变量，请检查 .env.local。',
                    code: 'STORAGE_CONFIG_MISSING',
                    requestId: ctx.requestId,
                },
                { status: 500 }
            );
        }

        const isAuthenticated = await verifyAdminAuth();
        if (!isAuthenticated) {
            logInfo(ctx, 'auth_required');
            return NextResponse.json(
                { error: '未授权访问，请重新登录。', code: 'AUTH_REQUIRED', requestId: ctx.requestId },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            logInfo(ctx, 'validation_failed', { reason: 'missing_file' });
            return NextResponse.json(
                { error: '未找到文件。', code: 'NO_FILE', requestId: ctx.requestId },
                { status: 400 }
            );
        }

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `uploads/${timestamp}-${safeName}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { error } = await supabase
            .storage
            .from('blog-assets')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            const classified = classifyUploadError(error, ctx.runtime);
            logError(ctx, 'upload_failed', error, { code: classified.code, fileName });
            return NextResponse.json(
                { error: classified.message, code: classified.code, requestId: ctx.requestId },
                { status: 500 }
            );
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from('blog-assets').getPublicUrl(fileName);

        logInfo(ctx, 'upload_success', { fileName });
        return NextResponse.json({
            success: true,
            url: publicUrl,
            requestId: ctx.requestId,
        });
    } catch (error) {
        const classified = classifyUploadError(error, ctx.runtime);
        logError(ctx, 'upload_exception', error, { code: classified.code });
        return NextResponse.json(
            { error: classified.message, code: classified.code, requestId: ctx.requestId },
            { status: 500 }
        );
    }
}
