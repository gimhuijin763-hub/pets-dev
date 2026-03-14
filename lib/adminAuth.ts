import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_COOKIE_NAME = 'ptes_admin'
const ADMIN_SESSION_VALUE = 'admin'

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`)
  }
  return value
}

function signValue(value: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(value).digest('hex')
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}

export function isValidAdminPassword(password: string): boolean {
  const expected = getEnv('ADMIN_PASSWORD')
  return timingSafeEqual(password, expected)
}

export function createAdminToken(): string {
  const secret = getEnv('ADMIN_COOKIE_SECRET')
  const signature = signValue(ADMIN_SESSION_VALUE, secret)
  return `${ADMIN_SESSION_VALUE}.${signature}`
}

export function verifyAdminToken(token?: string | null): boolean {
  if (!token) return false
  const [value, signature] = token.split('.')
  if (!value || !signature || value !== ADMIN_SESSION_VALUE) return false
  const secret = getEnv('ADMIN_COOKIE_SECRET')
  const expected = signValue(value, secret)
  return timingSafeEqual(signature, expected)
}

export function setAdminCookie(response: NextResponse) {
  const token = createAdminToken()
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  })
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}

export function isAdminRequest(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  return verifyAdminToken(token)
}
