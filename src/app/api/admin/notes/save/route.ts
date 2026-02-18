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

        const body = await request.json();
        const { note, isNew } = body;

        // Basic Validation
        if (!note.title || !note.slug) {
            return NextResponse.json(
                { error: '标题和 Slug 必填' },
                { status: 400 }
            );
        }

        // Prepare data for Supabase
        const postData = {
            slug: note.slug,
            title: note.title,
            category: note.category,
            content: note.content,
            excerpt: note.excerpt,
            tags: note.tags,
            published: note.published,
            lang: note.lang,
            updated_at: new Date().toISOString(),
            // For new posts, set date to now if not provided
            ...(isNew ? { date: new Date().toISOString() } : {}),
            source: 'supabase', // Ensure source is set
        };

        let data, error;

        if (isNew) {
            // Check if slug exists
            const { data: existing } = await supabase
                .from('posts')
                .select('slug')
                .eq('slug', note.slug)
                .single();

            if (existing) {
                return NextResponse.json(
                    { error: 'Slug 已存在，请更换' },
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
            console.error('Save error:', error);
            return NextResponse.json(
                { error: '保存失败: ' + error.message },
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
        return NextResponse.json(
            { error: '服务器内部错误' },
            { status: 500 }
        );
    }
}
