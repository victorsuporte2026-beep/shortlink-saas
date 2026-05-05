import Link from 'next/link'

export function QRLyticsMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="qr-corner top-left" />
      <span className="qr-corner bottom-right" />
      <span className="qr-dot dot-1" />
      <span className="qr-dot dot-2" />
      <span className="qr-dot dot-3" />
      <span className="analytics-bars">
        <span />
        <span />
        <span />
      </span>
    </span>
  )
}

export function BrandLockup({
  href,
  size = 'default',
}: {
  href?: string
  size?: 'default' | 'large'
}) {
  const content = (
    <>
      <QRLyticsMark />
      <span className="brand-text">
        <strong>QRLytics</strong>
        <small>Escaneie. Analise. Evolua.</small>
      </span>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={`brand-lockup ${size === 'large' ? 'large' : ''}`}>
        {content}
      </Link>
    )
  }

  return <span className={`brand-lockup ${size === 'large' ? 'large' : ''}`}>{content}</span>
}
