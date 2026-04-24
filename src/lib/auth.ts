import { createHmac } from 'crypto';

export const COOKIE = 'ya_session';
const SECRET = process.env.AUTH_SECRET ?? 'dev-secret';
const PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin';

function makeToken(password: string): string {
  return createHmac('sha256', SECRET).update(password).digest('hex');
}

export function expectedToken(): string {
  return makeToken(PASSWORD);
}

export function checkPassword(input: string): boolean {
  return input === PASSWORD;
}
