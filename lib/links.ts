import { createHash } from 'crypto'

export function sanitizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isValidDestinationUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')
}

export function getShortUrl(slug: string) {
  return `${getBaseUrl()}/${slug}`
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
