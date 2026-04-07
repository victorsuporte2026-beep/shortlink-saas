'use client'

import { useState } from 'react'
import QRCode from 'qrcode'

export function LinkTools({ shortUrl, title }: { shortUrl: string; title: string }) {
  const [status, setStatus] = useState('')

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setStatus('Link copiado')
      setTimeout(() => setStatus(''), 1800)
    } catch {
      setStatus('Não foi possível copiar')
    }
  }

  async function downloadQr() {
    try {
      const dataUrl = await QRCode.toDataURL(shortUrl, {
        width: 320,
        margin: 2,
      })

      const anchor = document.createElement('a')
      anchor.href = dataUrl
      anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/gi, '-') || 'qrcode'}.png`
      anchor.click()
      setStatus('QR baixado')
      setTimeout(() => setStatus(''), 1800)
    } catch {
      setStatus('Falha ao gerar QR')
    }
  }

  return (
    <div className="inline-tools">
      <button className="button secondary small-btn" type="button" onClick={copyLink}>
        Copiar
      </button>
      <button className="button secondary small-btn" type="button" onClick={downloadQr}>
        Baixar QR
      </button>
      {status ? <span className="muted small">{status}</span> : null}
    </div>
  )
}
