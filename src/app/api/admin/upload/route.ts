import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        // 验证权限
        const isAuthenticated = await verifyAdminAuth();
        if (!isAuthenticated) {
            return NextResponse.json(
                { error: '未授权访问' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: '未找到文件' },
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
            return NextResponse.json(
                { error: '上传失败: ' + error.message },
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
        return NextResponse.json(
            { error: '服务器内部错误' },
            { status: 500 }
        );
    }
}
