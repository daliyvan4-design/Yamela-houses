import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

const COOKIE = 'ya_session';
const SECRET = process.env.AUTH_SECRET ?? 'dev-secret';
const PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin';

function makeToken(password: string): string {
  return createHmac('sha256', SECRET).update(password).digest('hex');
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE)?.value;
  const expected = makeToken(PASSWORD);

  if (token !== expected) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
