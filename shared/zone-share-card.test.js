import test from 'node:test'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { zones } from './zones.js'
import { renderZoneShareCardPng } from './zone-share-card.js'

test('renders a social preview as a 1200 by 630 PNG', async () => {
  const image = await renderZoneShareCardPng([zones[5], zones[4]])
  const metadata = await sharp(image).metadata()

  assert.equal(metadata.format, 'png')
  assert.equal(metadata.width, 1200)
  assert.equal(metadata.height, 630)
})
