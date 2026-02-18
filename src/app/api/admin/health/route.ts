import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { hasSupabaseConfig, supabase } from '@/lib/supabase';

export async function GET() {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
        return NextResponse.json(
            { ok: false, error: '未授权访问', code: 'AUTH_REQUIRED' },
            { status: 401 }
        );
    }

    if (!hasSupabaseConfig) {
        return NextResponse.json(
            {
                ok: false,
                code: 'DB_CONFIG_MISSING',
                message: 'Supabase 环境变量未配置完整。',
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
    return NextResponse.json(
        {
            ok,
            code: ok ? 'OK' : 'HEALTH_CHECK_FAILED',
            message: ok ? '服务连接正常。' : '服务连接异常，请检查 Supabase 配置或网络。',
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
