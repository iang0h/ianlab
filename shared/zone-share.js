import { zones } from './zones.js'

export const ZONE_SHARE_VERSION = '2'

const zonesById = new Map(zones.map((zone) => [zone.id, zone]))

function validId(value) {
  const isNumericId = typeof value === 'number'
    ? Number.isInteger(value)
    : typeof value === 'string' && /^[1-7]$/.test(value)
  if (!isNumericId) return null

  const id = Number(value)
  return Number.isInteger(id) && zonesById.has(id) ? id : null
}

export function getZonePair(leadId, closeId) {
  const lead = zonesById.get(validId(leadId))
  const close = zonesById.get(validId(closeId))
  return lead && close && lead.id !== close.id ? [lead, close] : null
}

export function getZonePairFromSearch(search) {
  const params = new URLSearchParams(search)
  const lead = params.getAll('lead')
  const close = params.getAll('close')
  if (lead.length !== 1 || close.length !== 1) return null
  return getZonePair(lead[0], close[0])
}

export function selectSharePair(rankedZones) {
  if (!Array.isArray(rankedZones)) return []

  const ranked = rankedZones
    .filter((zone) => Number.isInteger(zone.id) && zonesById.has(zone.id) && Number.isFinite(zone.selected))
    .sort((a, b) => b.selected - a.selected || a.id - b.id)

  if (ranked.length < 2) return []

  const leader = ranked[0]
  const tiedLeaders = ranked.filter((zone) => zone.selected === leader.selected)
  if (tiedLeaders.length > 1) return tiedLeaders.slice(0, 2).map((zone) => zone.id)

  const nextScore = ranked.find((zone) => zone.selected < leader.selected)?.selected
  if (nextScore === undefined) return []

  const close = ranked.find((zone) => zone.selected === nextScore)
  return close ? [leader.id, close.id] : []
}

export function buildZoneShareUrl(origin, leadId, closeId) {
  if (!getZonePair(leadId, closeId)) return null

  try {
    const parsedOrigin = new URL(origin)
    if (parsedOrigin.username || parsedOrigin.password) return null
    const url = new URL('/zone-result', parsedOrigin.origin)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    url.searchParams.set('lead', String(Number(leadId)))
    url.searchParams.set('close', String(Number(closeId)))
    url.searchParams.set('v', ZONE_SHARE_VERSION)
    return url.toString()
  } catch {
    return null
  }
}
