import { NextResponse } from 'next/server';
import { getAdminCookieName, getAdminSessionCookieOptions } from '@/lib/admin-auth';

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(getAdminCookieName(), '', {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });

  return response;
}
