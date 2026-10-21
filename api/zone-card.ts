import type { IncomingMessage, ServerResponse } from 'node:http'
import { renderZoneShareCardPng } from '../shared/zone-share-card.js'
import { getZonePairFromSearch } from '../shared/zone-share.js'

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  const url = new URL(request.url ?? '/', 'https://lab.iangoh.com')
  const pair = getZonePairFromSearch(url.search)

  if (!pair) {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/plain; charset=utf-8')
    response.setHeader('Cache-Control', 'no-store')
    response.end('Not found')
    return
  }

  try {
    const image = await renderZoneShareCardPng(pair)

    response.statusCode = 200
    response.setHeader('Content-Type', 'image/png')
    response.setHeader('Content-Length', image.length)
    response.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.end(image)
  } catch (error) {
    console.error('Could not render Find Your Zone share card', error)
    response.statusCode = 500
    response.setHeader('Content-Type', 'text/plain; charset=utf-8')
    response.setHeader('Cache-Control', 'no-store')
    response.end('Could not render the share card')
  }
}
