import test from 'node:test'
import assert from 'node:assert/strict'
import { zones } from './zones.js'
import { renderZoneShareCardSvg } from './zone-share-svg.js'

test('renders share-card lettering as font-independent vector outlines', async () => {
  const svg = await renderZoneShareCardSvg([zones[5], zones[4]])

  assert.doesNotMatch(svg, /<text\b/)
  assert.match(svg, /<path\b[^>]*\bd=/)
  assert.match(svg, /<title>Build and create \/ Manage resources<\/title>/)
})
