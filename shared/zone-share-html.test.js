import test from 'node:test'
import assert from 'node:assert/strict'
import { renderZoneShareHtml } from './zone-share-html.js'

test('renders readable lead and close zones with safe result metadata', () => {
  const html = renderZoneShareHtml(6, 5, 'https://lab.iangoh.com')

  assert.match(html, /<title>My Find Your Zone result \| Ian Goh Lab<\/title>/)
  assert.match(html, /property="og:title" content="Build and create \+ Manage resources/)
  assert.match(html, /property="og:type" content="website"/)
  assert.match(html, /name="twitter:card" content="summary_large_image"/)
  assert.match(html, /rel="canonical" href="https:\/\/lab\.iangoh\.com\/zone-result\?lead=6&amp;close=5&amp;v=3"/)
  assert.match(html, /https:\/\/lab\.iangoh\.com\/zone-share-cards\/6-5\.png\?v=3/)
  assert.match(html, /You make value by bringing people and resources together/)
  assert.match(html, /You make value by coordinating people, time, talent/)
  assert.match(html, /reflection exercise, not a scientific or psychological test/)
  assert.match(html, /href="https:\/\/lab\.iangoh\.com\/#find-your-zone"/)
})

test('does not render malformed or repeated zone IDs', () => {
  assert.equal(renderZoneShareHtml('<script>', 5, 'https://lab.iangoh.com'), null)
  assert.equal(renderZoneShareHtml(6, 6, 'https://lab.iangoh.com'), null)
})

test('uses a safe canonical origin instead of reflecting an untrusted host', () => {
  const html = renderZoneShareHtml(6, 5, 'https://evil.example')

  assert.match(html, /https:\/\/lab\.iangoh\.com\/zone-result\?lead=6&amp;close=5/)
  assert.doesNotMatch(html, /evil\.example/)
})
