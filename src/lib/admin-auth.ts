import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * 验证管理员是否已登录
 */
export async function verifyAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return false;
    }

    // 简单的令牌验证（在生产环境中应使用更安全的方法）
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, timestamp] = decoded.split(':');
    
    if (username !== 'admin') {
      return false;
    }

    // 检查令牌是否过期（24小时）
    const tokenTime = parseInt(timestamp, 10);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24小时

    if (now - tokenTime > maxAge) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * 保护路由，如果未登录则重定向到登录页
 */
export async function protectAdminRoute() {
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    redirect('/admin');
  }
}

/**
 * 获取认证状态，用于客户端组件
 */
export function getAdminAuthStatus(): boolean {
  // 注意：这是一个客户端函数，不能使用 cookies()
  // 实际实现应该在客户端检查 localStorage 或 cookie
  // 这里返回 false，实际状态由组件自己管理
  return false;
}