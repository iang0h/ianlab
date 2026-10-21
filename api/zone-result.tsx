import { getZonePairFromSearch } from '../shared/zone-share.js'
import { renderZoneShareHtml } from '../shared/zone-share-html.js'

export const config = { runtime: 'edge' }

export default function handler(request: Request) {
  const url = new URL(request.url)
  const pair = getZonePairFromSearch(url.search)

  if (!pair) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  }

  const html = renderZoneShareHtml(pair[0].id, pair[1].id, url.origin)
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  })
}
