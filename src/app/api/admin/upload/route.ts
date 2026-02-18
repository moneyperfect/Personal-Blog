import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { hasSupabaseConfig, supabase } from '@/lib/supabase';

function classifyUploadError(error: unknown, isCloudRuntime: boolean): { code: string; message: string } {
    const raw = typeof error === 'string'
        ? error
        : JSON.stringify(error ?? {});
    const lower = raw.toLowerCase();

    if (lower.includes('fetch failed') || lower.includes('eacces') || lower.includes('enotfound')) {
        return {
            code: 'STORAGE_NETWORK_ERROR',
            message: isCloudRuntime
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
    const isCloudRuntime = process.env.VERCEL === '1' || Boolean(request.headers.get('x-vercel-id'));

    try {
        if (!hasSupabaseConfig) {
            return NextResponse.json(
                {
                    error: isCloudRuntime
                        ? '存储配置缺失，请在部署平台补充 Supabase 环境变量。'
                        : '本地缺少 Supabase 环境变量，请检查 .env.local。',
                    code: 'STORAGE_CONFIG_MISSING',
                },
                { status: 500 }
            );
        }

        // 验证权限
        const isAuthenticated = await verifyAdminAuth();
        if (!isAuthenticated) {
            return NextResponse.json(
                { error: '未授权访问，请重新登录。', code: 'AUTH_REQUIRED' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: '未找到文件。', code: 'NO_FILE' },
                { status: 400 }
            );
        }

        // 生成文件名
        const timestamp = Date.now();
        // Sanitize filename
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `uploads/${timestamp}-${safeName}`;

        // 上传到 Supabase Storage
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { data, error } = await supabase
            .storage
            .from('blog-assets')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            const classified = classifyUploadError(error, isCloudRuntime);
            return NextResponse.json(
                { error: classified.message, code: classified.code },
                { status: 500 }
            );
        }

        // 获取公开链接
        const { data: { publicUrl } } = supabase
            .storage
            .from('blog-assets')
            .getPublicUrl(fileName);

        return NextResponse.json({
            success: true,
            url: publicUrl
        });

    } catch (error) {
        console.error('Upload API error:', error);
        const classified = classifyUploadError(error, isCloudRuntime);
        return NextResponse.json(
            { error: classified.message, code: classified.code },
            { status: 500 }
        );
    }
}
