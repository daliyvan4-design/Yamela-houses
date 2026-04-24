const COOKIE = 'ya_session';
const SECRET = process.env.AUTH_SECRET ?? 'dev-secret';
const PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin';

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function expectedToken(): Promise<string> {
  return hmac(PASSWORD);
}

export async function checkPassword(input: string): Promise<boolean> {
  return input === PASSWORD;
}

export { COOKIE };
