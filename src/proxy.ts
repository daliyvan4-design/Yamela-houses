import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'ya_session';
const SECRET = process.env.AUTH_SECRET ?? 'dev-secret';
const PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin';

async function makeToken(password: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(password));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE)?.value;
  const expected = await makeToken(PASSWORD);

  if (token !== expected) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
