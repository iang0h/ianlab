import type { IncomingMessage, ServerResponse } from 'node:http'
import { getZonePairFromSearch, getZoneShareCardPath } from '../shared/zone-share.js'

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

  response.statusCode = 302
  response.setHeader('Location', getZoneShareCardPath(pair[0].id, pair[1].id))
  response.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
  response.end()
}
