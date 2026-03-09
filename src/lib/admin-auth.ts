import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_COOKIE_NAME = 'admin_token';
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60;

interface AdminSessionPayload {
  sub: 'admin';
  iat: number;
  exp: number;
  nonce: string;
}

function getAdminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be configured');
  }
  return secret;
}

function encodeBase64Url(input: string) {
  return Buffer.from(input, 'utf-8').toString('base64url');
}

function decodeBase64Url(input: string) {
  return Buffer.from(input, 'base64url').toString('utf-8');
}

function signAdminPayload(payload: string) {
  return crypto
    .createHmac('sha256', getAdminSessionSecret())
    .update(payload)
    .digest('base64url');
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export function createAdminSessionToken(now = Date.now()) {
  const payload: AdminSessionPayload = {
    sub: 'admin',
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signAdminPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function decodeAdminSessionToken(token: string): AdminSessionPayload | null {
  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signAdminPayload(encodedPayload);
  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as Partial<AdminSessionPayload>;
    if (
      payload.sub !== 'admin'
      || typeof payload.iat !== 'number'
      || typeof payload.exp !== 'number'
      || typeof payload.nonce !== 'string'
    ) {
      return null;
    }

    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    path: '/',
  };
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export async function verifyAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return false;
    }

    const payload = decodeAdminSessionToken(token);
    if (!payload) {
      return false;
    }

    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function protectAdminRoute() {
  const isAuthenticated = await verifyAdminAuth();

  if (!isAuthenticated) {
    redirect('/admin');
  }
}

export function getAdminAuthStatus(): boolean {
  return false;
}
