import type { Zone, ZoneId } from './zones.js'

export function getZonePair(leadId: unknown, closeId: unknown): [Zone, Zone] | null
export function getZonePairFromSearch(search: string): [Zone, Zone] | null
export function getZoneShareCardPath(leadId: unknown, closeId: unknown): string | null
export function selectSharePair(rankedZones: ReadonlyArray<Zone & { selected: number }>): ZoneId[]
export function buildZoneShareUrl(origin: string, leadId: unknown, closeId: unknown): string | null
