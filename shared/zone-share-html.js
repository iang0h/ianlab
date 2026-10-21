import { getZonePair, ZONE_SHARE_VERSION } from './zone-share.js'

const canonicalOrigin = 'https://lab.iangoh.com'

function safeOrigin(value) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return canonicalOrigin
    if (url.username || url.password) return canonicalOrigin
    if (url.hostname === 'lab.iangoh.com' || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return url.origin
    }
  } catch {
    return canonicalOrigin
  }
  return canonicalOrigin
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

export function renderZoneShareHtml(leadId, closeId, origin) {
  const pair = getZonePair(leadId, closeId)
  if (!pair) return null

  const [lead, close] = pair
  const base = safeOrigin(origin)
  const query = new URLSearchParams({
    lead: String(lead.id),
    close: String(close.id),
    v: ZONE_SHARE_VERSION,
  }).toString()
  const canonical = `${base}/zone-result?${query}`
  const image = `${base}/zone-result.png?${query}`
  const title = `${lead.name} + ${close.name} | Find Your Zone`
  const description = `Explore your leading signal, ${lead.name}, and close signal, ${close.name}. A reflection result from Ian Goh Lab, not a fixed label.`

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,follow">
    <title>My Find Your Zone result | Ian Goh Lab</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Ian Goh Lab">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
    <style>
      :root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#101211;color:#f4f7ea}
      *{box-sizing:border-box}
      body{min-height:100vh;margin:0;background:radial-gradient(ellipse at 82% 8%,rgba(88,230,255,.12),transparent 38%),radial-gradient(ellipse at 8% 86%,rgba(217,255,74,.08),transparent 36%),#101211}
      main{width:min(100% - 40px,980px);margin:0 auto;padding:36px 0 72px}
      header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding-bottom:24px;border-bottom:1px solid rgba(244,247,234,.13)}
      .brand{color:#d9ff4a;font-size:14px;font-weight:850;letter-spacing:.02em;text-decoration:none}
      .eyebrow{margin:0;color:#d9ff4a;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
      .frame{margin-top:54px;padding:clamp(24px,5vw,56px);border:1px solid rgba(244,247,234,.17);border-radius:18px;background:rgba(20,24,22,.92);box-shadow:0 32px 100px rgba(0,0,0,.28)}
      h1{max-width:780px;margin:18px 0 12px;font-size:clamp(40px,8vw,76px);line-height:.98;letter-spacing:-.04em;text-transform:uppercase}
      .intro{max-width:720px;color:rgba(244,247,234,.68);font-size:18px;line-height:1.65}
      .pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:36px}
      article{min-width:0;padding:24px;border:1px solid var(--zone);border-radius:12px;background:rgba(255,255,255,.035)}
      .rank{color:var(--zone);font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
      h2{margin:16px 0 12px;font-size:clamp(23px,4vw,34px);line-height:1.05}
      article p{margin:0;color:rgba(244,247,234,.7);font-size:15px;line-height:1.65}
      .signal{display:block;margin-top:18px;color:rgba(244,247,234,.55);font-size:12px;line-height:1.5}
      .note{margin:26px 0 0;padding-left:15px;border-left:2px solid #d9ff4a;color:rgba(244,247,234,.58);font-size:14px;line-height:1.6}
      .cta{display:inline-flex;align-items:center;min-height:48px;margin-top:30px;padding:0 20px;border-radius:999px;background:#d9ff4a;color:#101211;font-size:13px;font-weight:850;letter-spacing:.04em;text-decoration:none;text-transform:uppercase}
      @media(max-width:640px){main{width:min(100% - 28px,980px);padding-top:20px}.frame{margin-top:28px}.pair{grid-template-columns:1fr}.intro{font-size:16px}}
    </style>
  </head>
  <body>
    <main>
      <header><a class="brand" href="${base}/">IAN GOH LAB</a><span>FIND YOUR ZONE</span></header>
      <section class="frame">
        <p class="eyebrow">A reflection exercise</p>
        <h1>${escapeHtml(lead.name)}</h1>
        <p class="intro">Your leading signal is <strong>${escapeHtml(lead.name)}</strong>. Your close signal is <strong>${escapeHtml(close.name)}</strong>. Explore both as clues about the work that gives you energy.</p>
        <div class="pair">
          <article style="--zone:${escapeHtml(lead.color)}"><span class="rank">01 / Lead signal</span><h2>${escapeHtml(lead.name)}</h2><p>${escapeHtml(lead.description)}</p><span class="signal">${escapeHtml(lead.signal)}</span></article>
          <article style="--zone:${escapeHtml(close.color)}"><span class="rank">02 / Close signal</span><h2>${escapeHtml(close.name)}</h2><p>${escapeHtml(close.description)}</p><span class="signal">${escapeHtml(close.signal)}</span></article>
        </div>
        <p class="note">This is a reflection exercise, not a scientific or psychological test, and it is not a fixed label.</p>
        <a class="cta" href="${base}/#find-your-zone">Try the reflection exercise</a>
      </section>
    </main>
  </body>
</html>`
}
