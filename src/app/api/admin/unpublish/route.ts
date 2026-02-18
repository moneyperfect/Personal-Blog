import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json(
        {
            success: false,
            error: '旧版 GitHub 下架接口已下线，请在 Supabase 后台直接切换生命周期状态。',
            code: 'UNPUBLISH_ROUTE_DEPRECATED',
        },
        { status: 410 }
    );
}
