import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminSessionCookieOptions,
} from '@/lib/admin-auth';
import { checkRateLimit } from '@/lib/rate-limit';

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`admin-login:${clientIp}`, {
      limit: LOGIN_LIMIT,
      windowMs: LOGIN_WINDOW_MS,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: '尝试次数过多，请稍后再试。',
          retryAfter: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: '管理员密码未配置。' },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: '密码不正确。' },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(getAdminCookieName(), token, getAdminSessionCookieOptions());

    return response;
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: '服务端错误。' },
      { status: 500 }
    );
  }
}
