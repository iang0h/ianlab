import { Buffer } from 'node:buffer'
import sharp from 'sharp'
import { renderZoneShareCardSvg } from './zone-share-svg.js'

export async function renderZoneShareCardPng(pair) {
  const svg = await renderZoneShareCardSvg(pair)
  return sharp(Buffer.from(svg)).png().toBuffer()
}
