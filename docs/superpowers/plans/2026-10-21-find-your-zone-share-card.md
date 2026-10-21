# Find Your Zone Share Card Implementation Plan

> **For agentic workers:** Use inline execution with review checkpoints. Follow the tasks in order and preserve existing uncommitted quiz-copy edits.

**Goal:** Add seven collectible-style 3D zone emblems and a privacy-conscious, shareable result page with dynamic social previews.

**Architecture:** Move the seven-zone definitions into a small shared module used by the React quiz and Vercel Edge handlers. Share URLs carry only two validated zone IDs; a branded Edge response renders the user-facing result page and a second Edge route generates a 1200 x 630 PNG for social crawlers. The existing Vite SPA remains the primary site and the quiz answers remain client-side.

**Tech Stack:** React 19, Vite, TypeScript, Three.js, `@react-three/fiber`, Vercel Edge Functions, `@vercel/og`, Node's built-in test runner.

## Global Constraints

- The share URL contains only validated lead and close zone IDs; it never contains selected answers, the full score distribution, names, or other personal data.
- Do not persist quiz answers or shared results.
- Use the existing Three.js dependencies for emblems; load WebGL only when result art is visible, provide a static accessible fallback, and honor reduced-motion preferences.
- Generate a 1200 x 630 PNG preview from the same zone data and visual system.
- Do not deploy to production in this cycle.
- Preserve current quiz wording and all unrelated local changes.

## File Map

- `shared/zones.js` and `shared/zones.d.ts`: the single source of truth for zone copy, colors, and emblem identifiers.
- `shared/zone-share.js`: validated lead/close-pair parsing, stable ordering, and URL creation.
- `shared/zone-share.test.js`: unit tests using `node:test`.
- `shared/zone-share-html.js` and `shared/zone-share-html.test.js`: safe, deterministic result-page HTML and metadata generation.
- `src/FindYourZone.tsx` and `src/FindYourZone.css`: wire the result view to emblems and share actions without changing question copy or scoring.
- `src/ZoneEmblem.tsx` and `src/ZoneEmblem.css`: one lightweight Three.js emblem component with seven distinct zone motifs and a static fallback.
- `api/zone-result.tsx`: Vercel Edge response for the readable public result page and social metadata.
- `api/zone-card.tsx`: Vercel Edge response for the PNG Open Graph/Twitter preview.
- `vercel.json`: route `/zone-result` and `/zone-result.png` to the Edge handlers, then preserve Vite SPA deep-link fallback.
- `package.json` and `package-lock.json`: add the image-generation dependency only if the Edge image route requires it.

---

### Task 1: Share-safe zone data and URL model

**Files:**
- Create: `shared/zones.js`
- Create: `shared/zones.d.ts`
- Create: `shared/zone-share.js`
- Create: `shared/zone-share.test.js`
- Modify: `src/FindYourZone.tsx`

**Interfaces:**
- `zones` exports all seven current zone records with `id`, `name`, `description`, `signal`, `color`, and a unique `emblem` key.
- `getZonePair(leadId, closeId)` returns the corresponding two records in caller order, or `null` for a missing, invalid, or repeated ID.
- `getZonePairFromSearch(search)` reads only `lead` and `close` and delegates to `getZonePair`.
- `selectSharePair(rankedZones)` returns two distinct IDs: the first two ID-ordered leaders for a tie, otherwise the leader and first ID-ordered zone at the next score.
- `buildZoneShareUrl(origin, leadId, closeId)` returns an absolute `/zone-result?lead=<id>&close=<id>` URL, or `null` for an invalid pair.

- [x] **Step 1: Write failing tests** for valid zone pairs, repeated/out-of-range IDs, query parsing that ignores unrelated parameters, and a share URL that contains only the two zone IDs.

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { buildZoneShareUrl, getZonePair, getZonePairFromSearch, selectSharePair } from './zone-share.js'

test('builds a share URL with only the lead and close zone IDs', () => {
  assert.equal(
    buildZoneShareUrl('https://lab.iangoh.com', 6, 5),
    'https://lab.iangoh.com/zone-result?lead=6&close=5',
  )
})

test('rejects unknown or repeated zone IDs', () => {
  assert.equal(getZonePair(0, 5), null)
  assert.equal(getZonePair(6, 6), null)
})

test('reads only the two public zone IDs from a search string', () => {
  assert.deepEqual(
    getZonePairFromSearch('?lead=6&close=5&answers=secret')?.map((zone) => zone.id),
    [6, 5],
  )
})

test('selects the leader and its next-closest zone, or two stable tied leaders', () => {
  assert.deepEqual(selectSharePair([
    { id: 5, selected: 1 }, { id: 6, selected: 10 }, { id: 7, selected: 3 },
    { id: 1, selected: 2 }, { id: 2, selected: 0 }, { id: 3, selected: 0 }, { id: 4, selected: 0 },
  ]), [6, 7])
  assert.deepEqual(selectSharePair([
    { id: 6, selected: 10 }, { id: 5, selected: 10 }, { id: 1, selected: 3 },
  ]), [5, 6])
})
```

- [x] **Step 2: Run the focused tests and confirm the expected missing-module failure.**

Run: `node --test shared/zone-share.test.js`
Expected: FAIL because `shared/zone-share.js` does not exist yet.

- [x] **Step 3: Extract the existing seven zone records unchanged into `shared/zones.js`; add a `.d.ts` declaration so TypeScript consumes the shared JavaScript module; implement numeric ID validation and URL creation in `shared/zone-share.js`.**

```js
import { zones } from './zones.js'

const byId = new Map(zones.map((zone) => [zone.id, zone]))

export function getZonePair(leadId, closeId) {
  const lead = byId.get(Number(leadId))
  const close = byId.get(Number(closeId))
  return lead && close && lead.id !== close.id ? [lead, close] : null
}

export function getZonePairFromSearch(search) {
  const params = new URLSearchParams(search)
  return getZonePair(params.get('lead'), params.get('close'))
}

export function buildZoneShareUrl(origin, leadId, closeId) {
  if (!getZonePair(leadId, closeId)) return null
  const url = new URL('/zone-result', origin)
  url.searchParams.set('lead', String(leadId))
  url.searchParams.set('close', String(closeId))
  return url.toString()
}
```

- [x] **Step 4: Import the shared zone records in `src/FindYourZone.tsx`, removing only its duplicate local `zones` array and preserving all other current working-tree edits.**

- [x] **Step 5: Run `node --test shared/zone-share.test.js` and confirm all tests pass; run `npm run build` to verify the shared declaration resolves under TypeScript.**

---

### Task 2: Seven lazy, accessible 3D zone emblems

**Files:**
- Create: `src/ZoneEmblem.tsx`
- Create: `src/ZoneEmblem.css`
- Modify: `src/FindYourZone.tsx`
- Modify: `src/FindYourZone.css`

**Interfaces:**
- `ZoneEmblem` accepts `{ zoneId: ZoneId, label: string }` and exposes an accessible named illustration.
- A single component maps each shared `emblem` key to a unique, static 3D mesh composition and uses the zone's existing color.

- [x] **Step 1: Extend the shared-data tests to assert all seven zones have distinct, non-empty emblem keys; run the test and confirm it fails before adding those keys.**
- [ ] **Test code:**

```js
import { zones } from './zones.js'

test('defines one distinct emblem key for every zone', () => {
  assert.equal(zones.length, 7)
  assert.equal(new Set(zones.map((zone) => zone.emblem)).size, 7)
  assert.ok(zones.every((zone) => typeof zone.emblem === 'string' && zone.emblem.length > 0))
})
```

- [x] **Step 2: Add the seven keys to the shared zone definitions and pass; use the existing records without changing descriptions or colors.**
- [x] **Step 3: Create `ZoneEmblem.tsx` with a small `<Canvas>` and a deterministic mesh switch for compass, crafted block, open pages, connected people, stacked resources, building arch, and repaired link. Keep geometry within a fixed `1.6 x 1.6` viewport; use one ambient and one directional light; do not add camera controls or continuously rotating animation. Lazy-import the component from `FindYourZone.tsx` and render it only in result mode, so the intro and quiz do not load Three.js.**
- [x] **Step 4: Add a static CSS fallback with the same zone color and descriptive `aria-label`; use `prefers-reduced-motion` to disable any optional CSS entrance movement; keep the canvas non-interactive and hidden from assistive technology when the static label is present.**
- [x] **Step 5: Mount the lead/close emblems only in the visible result cards. Keep the all-seven score list lightweight rather than creating seven more WebGL contexts; the intro and quiz do not initialize WebGL.**
- [x] **Step 6: Run `npm run build` and `npm run lint`; verify no answer mapping or score calculation changed in the feature edits. Preserve the existing local quiz-copy changes.**

---

### Task 3: Safe HTML share page and metadata

**Files:**
- Create: `shared/zone-share-html.js`
- Create: `shared/zone-share-html.test.js`
- Create: `api/zone-result.tsx`
- Modify: `vercel.json`

**Interfaces:**
- `renderZoneShareHtml(pair, origin)` escapes all interpolated strings and returns a complete HTML document with a canonical URL, Open Graph tags, Twitter summary-large-image tags, a readable two-zone result, the reflection disclaimer, and a retake link.
- `/zone-result?lead=6&close=5` rewrites internally to `/api/zone-result` without changing the public URL.

- [x] **Step 1: Write failing tests** for all required metadata, readable result text, canonical path, and HTML escaping; invalid pairs must return `null` rather than render query text.
- [x] **Step 2: Run `node --test shared/zone-share-html.test.js` and confirm it fails because the renderer is absent.**
- [x] **Step 3: Implement `renderZoneShareHtml` from trusted zone records only; use a dedicated `escapeHtml` helper for text/attribute values and build the PNG URL from the validated numeric pair.**
- [x] **Step 4: Add `api/zone-result.tsx` as a Vercel Edge handler using `getZonePairFromSearch`; return the branded HTML with status 200 for valid pairs and a safe branded 404 page for invalid pairs.**
- [x] **Step 5: Add rewrites for `/zone-result.png` then `/zone-result`, followed by the catch-all `/(.*)` to `/index.html`. Keep any existing Vercel settings intact.**
- [x] **Step 6: Run the renderer tests and `npm run build`; inspect the final `vercel.json` with `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))"`.**

---

### Task 4: Dynamic 1200 x 630 social image

**Files:**
- Create: `api/zone-card.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- `/zone-result.png?lead=6&close=5` returns a `1200 x 630` PNG generated from the validated zone pair, using the same names, descriptions, colors, and brand identity as the result page.
- Invalid IDs return a generic branded image and never include untrusted text.

- [x] **Step 1: Add `@vercel/og` as a runtime dependency and pin its nested `fflate` dependency to patched `0.7.5`.**
- [x] **Step 2: Create `api/zone-card.tsx` as an Edge handler with `config.runtime = 'edge'`; parse the pair through the shared helper and return `ImageResponse` at exactly `1200 x 630`. Use the Lab's near-black background, lime identity accent, restrained cyan/gold zone accents, large readable zone names, and short explanatory copy; use only JSX/CSS properties supported by `@vercel/og`.**
- [x] **Step 3: Run `npm run build` and `npm run lint`; the checkout has no Vercel CLI or linked project, so the conditional local image-route request was unavailable. The Edge source type-checks; PNG runtime output remains unverified.**

---

### Task 5: Result share controls and card layout

**Files:**
- Modify: `src/FindYourZone.tsx`
- Modify: `src/FindYourZone.css`

**Interfaces:**
- The result view selects a deterministic pair: first and next score for a single leader; the first two ID-ordered tied leaders when top scores tie; the current result copy and scoring remain unchanged.
- `Share result` uses `navigator.share({ title, text, url })` when available. If native sharing is unavailable, it copies the safe result URL and reports “Link copied”; a separate copy-link control remains available where useful.

- [x] **Step 1: Reuse the `selectSharePair` tests from Task 1; verify they cover the normal next score and stable tied leaders.**
- [x] **Step 2: Use `selectSharePair(rankedZones)` to select the card pair without mutating the existing ranking array or changing scores. Render the pair in a separate collectible-style card; keep the existing tied-leader explanation and all-seven score list intact.**
- [x] **Step 3: Add `Share2` and link-copy controls to the result actions; generate URLs with `buildZoneShareUrl(window.location.origin, lead.id, close.id)` and never serialize `answers` or scores.**
- [x] **Step 4: Add a responsive collectible card treatment around the two featured emblems and descriptions; preserve the current dark Lab styling, heading hierarchy, and mobile single-column layout.**
- [x] **Step 5: Run `node --test shared/zone-share.test.js`, `node --test shared/zone-share-html.test.js`, `npm run lint`, and `npm run build`.**

---

### Task 6: End-to-end verification (no production deployment)

**Files:**
- No source changes unless a concrete verification failure requires a fix.

- [x] **Step 1: Start the Vite app and complete the 20-question flow in a browser; confirm the lead/close cards, all-seven score breakdown, and share controls. The deterministic link contents are covered by model tests; the clipboard and native share actions were not activated to avoid changing the user's clipboard or opening a system share sheet.**
- [x] **Step 2: No Vercel CLI or linked project is present. Compile and invoke the actual HTML Edge handler locally: valid pair returns branded HTML and metadata; malformed pair returns 404. The PNG route type-checks, but its Edge runtime output and dimensions remain unverified.**
- [x] **Step 3: Test malformed and repeated IDs; verify they produce a safe 404/fallback and no reflected query content.**
- [ ] **Step 4: Desktop/mobile screenshots show the nonblank WebGL emblems at 123 x 123 canvas dimensions, and the browser has no console errors. Direct pixel sampling is unavailable through the read-only browser bridge; keyboard focus, screen-reader, and reduced-motion checks remain for the Vercel/browser preview.**
- [x] **Step 5: Review `git diff` and confirm only this feature, its plan, and pre-existing local quiz-copy edits changed; leave the quiz copy intact and do not deploy to production.**

## Self-Review

- **Spec coverage:** The seven emblems and accessible fallback are Task 2; lead/close-only URLs and safe parsing are Tasks 1 and 5; native sharing and copy fallback are Task 5; the branded landing page and metadata are Task 3; the 1200 x 630 PNG is Task 4; no persistence, no quiz-copy changes, and no production deployment are global constraints and Task 6 checks.
- **Placeholders:** No task relies on unspecified content, IDs, route names, validation behavior, or verification commands.
- **Type consistency:** `ZoneId` stays `1 | 2 | 3 | 4 | 5 | 6 | 7`; `getZonePair` returns two `Zone` records or `null`; both Edge handlers consume this same pair contract.
