/**
 * 管理后台会话工具。
 * 生产环境必须配置 ADMIN_PASSWORD（必填）与 ADMIN_SESSION_SECRET（可选，默认复用密码）。
 */
export const ADMIN_COOKIE = 'shanen_admin';
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

/** 开发环境未配置 ADMIN_PASSWORD 时的兜底密码，生产环境不会生效 */
const DEV_PASSWORD = 'shanenadmin123';

export function getAdminPassword(): string | null {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV !== 'production') return DEV_PASSWORD;
  return null;
}

function getSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET?.trim() || getAdminPassword();
}

/** 恒定时间字符串比较，避免时序侧信道 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return toBase64Url(new Uint8Array(signature));
}

/** 生成 `过期时间戳.签名` 格式的会话令牌 */
export async function createSessionToken(): Promise<string> {
  const secret = getSessionSecret();
  if (!secret) throw new Error('未配置 ADMIN_PASSWORD');
  const expiresAt = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  return `${expiresAt}.${await hmac(secret, expiresAt)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = getSessionSecret();
  if (!secret) return false;

  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature) return false;

  const expires = Number(expiresAt);
  if (!Number.isFinite(expires) || expires <= Date.now()) return false;

  const expected = await hmac(secret, expiresAt);
  return safeEqual(signature, expected);
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}
