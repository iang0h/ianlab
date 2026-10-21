# Find Your Zone Share Card Design

## Goal

Make Find Your Zone results more memorable and easier to share. Use a collectible-card visual language without implying that results are scientific labels or blockchain NFTs.

## Experience

- Give each of the seven zones a distinct, restrained 3D emblem that reinforces its existing name, description, signal words, and color.
- On the result screen, show an illustrated card for the leading and close zones. Tied leaders use a stable ordering and show at most two zones on the share card.
- Add a share action using the native share sheet where available, with a copy-link fallback. Keep the existing copy-result action only if it remains useful alongside the new control.
- A shared link opens a branded, readable result page with the same two-zone card, an invitation to take the reflection, and the existing caveat that this is not a validated assessment.

## Sharing and privacy

- The share URL contains only validated lead and close zone IDs. It never contains selected answers, the full score distribution, names, or other personal data.
- Do not persist quiz answers or shared results. The result stays client-side until the visitor chooses to share the two zone IDs.
- Reject invalid zone IDs and render a safe fallback rather than interpolating untrusted query text into HTML or image markup.

## Social preview and implementation

- Preserve the Vite/React app and existing Vercel deployment. Add a share-page response that emits canonical, Open Graph, and Twitter metadata for the requested two zones.
- Generate a 1200 x 630 PNG preview from the same zone data and visual system. The image includes the zone names, short explanations, and Lab identity; it is an image preview, not a screenshot of the interactive canvas.
- Use the current zone data as the source of truth for the interactive result, share page, and social image to avoid copy drift.
- Use the Three.js dependencies already in the project for the emblems. Load the WebGL scene only when the result/art is visible; provide a static accessible fallback and honor reduced-motion preferences.
- Keep the experience usable when native sharing, image generation, or WebGL is unavailable. The share page still exposes its result text and retake link.

## Out of scope

- Blockchain minting, wallets, tokens, identity claims, storing results, or collecting answers.
- Changes to quiz questions, scoring, zone descriptions, or other Lab pages.
- Production deployment in this implementation cycle unless Ian separately requests it.

## Verification

- Test share payload validation, tied-result ordering, and omission of answer-level data.
- Build and lint the project.
- Complete a browser flow through quiz results, share-link creation, and the share landing page on desktop and mobile.
- Verify the actual HTML metadata and fetchable PNG for a representative lead/close pair, plus invalid and tied-zone cases.
- Inspect the 3D canvas for nonblank rendering and check keyboard, reduced-motion, and static-fallback behavior.
