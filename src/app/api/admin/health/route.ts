import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { hasSupabaseConfig, supabase } from '@/lib/supabase';
import { createRequestContext, logError, logInfo } from '@/lib/server-observability';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const ctx = createRequestContext(request, '/api/admin/health');
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
        logInfo(ctx, 'auth_required');
        return NextResponse.json(
            { ok: false, error: '未授权访问', code: 'AUTH_REQUIRED', requestId: ctx.requestId },
            { status: 401 }
        );
    }

    if (!hasSupabaseConfig) {
        logError(ctx, 'config_missing', 'supabase_config_missing');
        return NextResponse.json(
            {
                ok: false,
                code: 'DB_CONFIG_MISSING',
                message: 'Supabase 环境变量未配置完整。',
                requestId: ctx.requestId,
                checks: {
                    config: false,
                    database: false,
                    storage: false,
                },
            },
            { status: 500 }
        );
    }

    let database = false;
    let storage = false;
    let details = '';

    try {
        const { error } = await supabase.from('posts').select('slug').limit(1);
        if (!error) {
            database = true;
        } else {
            details = `db:${error.message}`;
        }
    } catch (error) {
        details = `db:${String(error)}`;
    }

    try {
        const { data, error } = await supabase.storage.listBuckets();
        if (!error && Array.isArray(data) && data.some((b) => b.name === 'blog-assets')) {
            storage = true;
        } else if (!details) {
            details = error ? `storage:${error.message}` : 'storage:blog-assets bucket not found';
        }
    } catch (error) {
        if (!details) {
            details = `storage:${String(error)}`;
        }
    }

    const ok = database && storage;
    if (!ok) {
        logError(ctx, 'health_failed', details || 'unknown', { database, storage });
    } else {
        logInfo(ctx, 'health_ok');
    }
    return NextResponse.json(
        {
            ok,
            code: ok ? 'OK' : 'HEALTH_CHECK_FAILED',
            message: ok ? '服务连接正常。' : '服务连接异常，请检查 Supabase 配置或网络。',
            requestId: ctx.requestId,
            checks: {
                config: true,
                database,
                storage,
            },
            details,
        },
        { status: ok ? 200 : 500 }
    );
}
