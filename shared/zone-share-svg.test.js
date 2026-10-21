import test from 'node:test'
import assert from 'node:assert/strict'
import { zones } from './zones.js'
import { renderZoneShareCardSvg } from './zone-share-svg.js'

test('renders the lead and close zones in a 1200 by 630 share card', () => {
  const svg = renderZoneShareCardSvg([zones[5], zones[4]])
  const text = svg.replace(/<\/tspan><tspan[^>]*>/g, ' ').replace(/<[^>]+>/g, '')

  assert.match(svg, /viewBox="0 0 1200 630"/)
  assert.match(svg, /01 \/ LEAD SIGNAL/)
  assert.match(svg, /Build and create/)
  assert.match(svg, /02 \/ CLOSE SIGNAL/)
  assert.match(svg, /Manage resources/)
  assert.match(text, /You make value by bringing people and resources together/)
})

test('escapes zone text before embedding it in SVG markup', () => {
  const svg = renderZoneShareCardSvg([
    { ...zones[0], name: '<script>&"' },
    zones[1],
  ])

  assert.match(svg, /&lt;script&gt;&amp;&quot;/)
  assert.doesNotMatch(svg, /<script>/)
})
