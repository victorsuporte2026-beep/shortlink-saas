const URL_BOUNDARY_CHARS =
  /^[\s\u0000-\u001f\u007f-\u009f\u200b-\u200d\u2060\ufeff]+|[\s\u0000-\u001f\u007f-\u009f\u200b-\u200d\u2060\ufeff]+$/g

export function cleanUrlText(value: string) {
  return value.replace(URL_BOUNDARY_CHARS, '')
}

export function normalizeHttpUrl(value: string) {
  const url = new URL(cleanUrlText(value))

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('URL must start with http:// or https://')
  }

  return url.href
}

export function normalizeAppBaseUrl(value: string) {
  const url = new URL(cleanUrlText(value))

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Base URL must start with http:// or https://')
  }

  const pathname = url.pathname.replace(/\/+$/, '')
  return `${url.origin}${pathname}`
}

export function buildShortUrl(baseUrl: string, slug: string) {
  const base = normalizeAppBaseUrl(baseUrl)
  const cleanSlug = cleanUrlText(slug).replace(/^\/+/, '')
  return new URL(cleanSlug, `${base}/`).href
}

export function normalizeQrPayload(value: string) {
  const cleaned = cleanUrlText(value)

  try {
    return normalizeHttpUrl(cleaned)
  } catch {
    return cleaned
  }
}
