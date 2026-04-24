import { NextResponse } from 'next/server';
import { checkPassword, expectedToken, COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { password } = await req.json() as { password: string };

  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }

  const token = expectedToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
