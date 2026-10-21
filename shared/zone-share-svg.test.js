import test from 'node:test'
import assert from 'node:assert/strict'
import { zones } from './zones.js'
import { renderZoneShareCardSvg } from './zone-share-svg.js'

test('renders the lead and close zones in a 1200 by 630 share card', async () => {
  const svg = await renderZoneShareCardSvg([zones[5], zones[4]])

  assert.match(svg, /viewBox="0 0 1200 630"/)
  assert.match(svg, /<title>Build and create \/ Manage resources<\/title>/)
  assert.doesNotMatch(svg, /<text\b/)
})

test('escapes zone text before embedding it in SVG markup', async () => {
  const svg = await renderZoneShareCardSvg([
    { ...zones[0], name: '<script>&"' },
    zones[1],
  ])

  assert.match(svg, /&lt;script&gt;&amp;&quot;/)
  assert.doesNotMatch(svg, /<script>/)
})
