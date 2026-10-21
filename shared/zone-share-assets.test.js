import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'
import { zones } from './zones.js'

test('ships a valid 1200 by 630 PNG for every distinct zone pairing', async () => {
  for (const lead of zones) {
    for (const close of zones) {
      if (lead.id === close.id) continue
      const image = await readFile(new URL(`../public/zone-share-cards/${lead.id}-${close.id}.png`, import.meta.url))
      const metadata = await sharp(image).metadata()
      assert.equal(metadata.format, 'png')
      assert.equal(metadata.width, 1200)
      assert.equal(metadata.height, 630)
    }
  }
})
