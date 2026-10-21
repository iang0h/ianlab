import assert from 'node:assert/strict'
import test from 'node:test'
import { zones } from './zones.js'

test('every zone includes a useful plain-language explanation', () => {
  assert.deepEqual(zones.map((zone) => zone.id), [1, 2, 3, 4, 5, 6, 7])

  for (const zone of zones) {
    assert.ok(zone.inDepth.length > 50, `Zone ${zone.id} needs an in-depth explanation`)
    assert.ok(zone.example.length > 30, `Zone ${zone.id} needs a concrete example`)
    assert.ok(zone.askYourself.endsWith('?'), `Zone ${zone.id} needs a reflection question`)
    assert.ok(zone.distinction.length > 30, `Zone ${zone.id} needs a plain-language distinction`)
  }

  assert.equal(new Set(zones.map((zone) => zone.example)).size, zones.length)
})
