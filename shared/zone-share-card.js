import { Buffer } from 'node:buffer'
import sharp from 'sharp'
import { renderZoneShareCardSvg } from './zone-share-svg.js'

export function renderZoneShareCardPng(pair) {
  return sharp(Buffer.from(renderZoneShareCardSvg(pair))).png().toBuffer()
}
