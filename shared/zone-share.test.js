import test from 'node:test'
import assert from 'node:assert/strict'
import { zones } from './zones.js'
import {
  buildZoneShareUrl,
  getZonePair,
  getZonePairFromSearch,
  selectSharePair,
} from './zone-share.js'

test('builds a versioned share URL with only public result IDs', () => {
  assert.equal(
    buildZoneShareUrl('https://lab.iangoh.com', 6, 5),
    'https://lab.iangoh.com/zone-result?lead=6&close=5&v=2',
  )
})

test('rejects unknown, malformed, or repeated zone IDs', () => {
  assert.equal(getZonePair(0, 5), null)
  assert.equal(getZonePair('6x', 5), null)
  assert.equal(getZonePair('06', '5'), null)
  assert.equal(getZonePair(6, 6), null)
  assert.equal(buildZoneShareUrl('https://lab.iangoh.com', 6, 6), null)
})

test('reads only the two public zone IDs from a search string', () => {
  assert.deepEqual(
    getZonePairFromSearch('?lead=6&close=5&answers=secret')?.map((zone) => zone.id),
    [6, 5],
  )
  assert.equal(getZonePairFromSearch('?lead=6&lead=5&close=5'), null)
})

test('rejects origins with credentials or unsafe protocols', () => {
  assert.equal(buildZoneShareUrl('javascript:alert(1)', 6, 5), null)
  assert.equal(buildZoneShareUrl('https://user:pass@lab.iangoh.com', 6, 5), null)
})

test('selects the leader and next-closest zone without mutating ranking', () => {
  const ranked = [
    { id: 5, selected: 1 }, { id: 6, selected: 10 }, { id: 7, selected: 3 },
    { id: 1, selected: 2 }, { id: 2, selected: 0 }, { id: 3, selected: 0 }, { id: 4, selected: 0 },
  ]
  const original = [...ranked]

  assert.deepEqual(selectSharePair(ranked), [6, 7])
  assert.deepEqual(ranked, original)
})

test('selects two stable, ID-ordered zones when the leading score is tied', () => {
  assert.deepEqual(selectSharePair([
    { id: 6, selected: 10 }, { id: 5, selected: 10 }, { id: 1, selected: 3 },
  ]), [5, 6])
})

test('defines one distinct emblem key for every zone', () => {
  assert.equal(zones.length, 7)
  assert.equal(new Set(zones.map((zone) => zone.emblem)).size, 7)
  assert.ok(zones.every((zone) => typeof zone.emblem === 'string' && zone.emblem.length > 0))
})
