import type { Buffer } from 'node:buffer'
import type { Zone } from './zones.js'

export function renderZoneShareCardPng(pair: readonly [Zone, Zone]): Promise<Buffer>
