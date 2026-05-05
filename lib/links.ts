import { createHash } from 'crypto'
import { buildShortUrl, normalizeAppBaseUrl, normalizeHttpUrl } from '@/lib/urls'

export function sanitizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isValidDestinationUrl(value: string) {
  try {
    normalizeHttpUrl(value)
    return true
  } catch {
    return false
  }
}

export function normalizeDestinationUrl(value: string) {
  return normalizeHttpUrl(value)
}

export function getBaseUrl() {
  return normalizeAppBaseUrl(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
}

export function getShortLinkBaseUrl() {
  return normalizeAppBaseUrl(
    process.env.NEXT_PUBLIC_SHORTLINK_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000'
  )
}

export function getShortUrl(slug: string) {
  return buildShortUrl(getShortLinkBaseUrl(), slug)
}

export function hashIp(ip: string) {
  if (!ip) return null
  return createHash('sha256').update(ip).digest('hex')
}

export function detectDeviceType(userAgent: string | null) {
  const value = (userAgent || '').toLowerCase()

  if (/mobile|iphone|android/.test(value)) return 'mobile'
  if (/ipad|tablet/.test(value)) return 'tablet'
  return 'desktop'
}

export function formatDateTime(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('pt-BR')
}
