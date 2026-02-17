import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: '管理员密码未配置' },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      // 创建简单的会话令牌（在生产环境中应使用更安全的方法）
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
      
      const response = NextResponse.json({ success: true, token });
      
      // 设置会话 cookie（1小时有效期）
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1小时
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json(
        { error: '密码不正确' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}