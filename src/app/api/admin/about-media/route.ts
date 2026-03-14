import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { hasSupabaseAdminConfig, supabaseAdmin } from '@/lib/supabase';

const ABOUT_PROFILE_MEDIA_ID = 1;

function getConfigErrorMessage() {
    return {
        error: 'Supabase 未配置，暂时无法保存 About 页面头像与照片。',
        code: 'SUPABASE_CONFIG_MISSING',
    };
}

function isMissingAboutProfileMediaTable(error: unknown) {
    return typeof error === 'object'
        && error !== null
        && 'code' in error
        && error.code === 'PGRST205';
}

export async function GET() {
    try {
        const isAuthenticated = await verifyAdminAuth();
        if (!isAuthenticated) {
            return NextResponse.json({ error: '未授权访问。' }, { status: 401 });
        }

        if (!hasSupabaseAdminConfig) {
            return NextResponse.json(getConfigErrorMessage(), { status: 500 });
        }

        const { data, error } = await supabaseAdmin
            .from('about_profile_media')
            .select('avatar_url, portrait_url, updated_at')
            .eq('id', ABOUT_PROFILE_MEDIA_ID)
            .maybeSingle();

        if (error) {
            if (isMissingAboutProfileMediaTable(error)) {
                return NextResponse.json(
                    { error: '缺少 about_profile_media 表，请先执行最新 Supabase migration。' },
                    { status: 500 },
                );
            }

            console.error('Failed to read about profile media:', error);
            return NextResponse.json({ error: '读取 About 图片配置失败。' }, { status: 500 });
        }

        return NextResponse.json({
            media: {
                avatarUrl: data?.avatar_url ?? null,
                portraitUrl: data?.portrait_url ?? null,
                updatedAt: data?.updated_at ?? null,
            },
        });
    } catch (error) {
        console.error('Unexpected about media GET failure:', error);
        return NextResponse.json({ error: '读取 About 图片配置失败。' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const isAuthenticated = await verifyAdminAuth();
        if (!isAuthenticated) {
            return NextResponse.json({ error: '未授权访问。' }, { status: 401 });
        }

        if (!hasSupabaseAdminConfig) {
            return NextResponse.json(getConfigErrorMessage(), { status: 500 });
        }

        const body = await request.json();
        const avatarUrl = typeof body.avatarUrl === 'string' && body.avatarUrl.trim() ? body.avatarUrl.trim() : null;
        const portraitUrl = typeof body.portraitUrl === 'string' && body.portraitUrl.trim() ? body.portraitUrl.trim() : null;
        const updatedAt = new Date().toISOString();

        const { data, error } = await supabaseAdmin
            .from('about_profile_media')
            .upsert(
                {
                    id: ABOUT_PROFILE_MEDIA_ID,
                    avatar_url: avatarUrl,
                    portrait_url: portraitUrl,
                    updated_at: updatedAt,
                },
                { onConflict: 'id' },
            )
            .select('avatar_url, portrait_url, updated_at')
            .single();

        if (error) {
            if (isMissingAboutProfileMediaTable(error)) {
                return NextResponse.json(
                    { error: '缺少 about_profile_media 表，请先执行最新 Supabase migration。' },
                    { status: 500 },
                );
            }

            console.error('Failed to save about profile media:', error);
            return NextResponse.json({ error: '保存 About 图片配置失败。' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            media: {
                avatarUrl: data.avatar_url ?? null,
                portraitUrl: data.portrait_url ?? null,
                updatedAt: data.updated_at ?? null,
            },
        });
    } catch (error) {
        console.error('Unexpected about media POST failure:', error);
        return NextResponse.json({ error: '保存 About 图片配置失败。' }, { status: 500 });
    }
}
