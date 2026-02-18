import { NextResponse } from 'next/server';

const DEPRECATED_MESSAGE = 'GitHub 内容发布接口已下线，请使用 Supabase 发布链路。';

export async function GET() {
    return NextResponse.json(
        {
            success: false,
            error: DEPRECATED_MESSAGE,
            code: 'GITHUB_ROUTE_DEPRECATED',
        },
        { status: 410 }
    );
}

export async function POST() {
    return NextResponse.json(
        {
            success: false,
            error: DEPRECATED_MESSAGE,
            code: 'GITHUB_ROUTE_DEPRECATED',
        },
        { status: 410 }
    );
}
