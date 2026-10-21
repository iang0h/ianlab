function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[character])
}

function colorValue(value) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : '#D9FF4A'
}

function wrapText(value, limit, maxLines) {
  const words = String(value).split(/\s+/)
  const lines = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > limit && line) {
      lines.push(line)
      line = word
      if (lines.length === maxLines - 1) break
    } else {
      line = candidate
    }
  }

  if (line && lines.length < maxLines) lines.push(line)
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[.,;:]?$/, '')}...`
  }
  return lines
}

function textLines(value, x, y, lineHeight, limit, maxLines) {
  return wrapText(value, limit, maxLines)
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join('')
}

function zonePanel(zone, rank, x) {
  const color = colorValue(zone.color)
  const name = escapeXml(zone.name)
  const description = textLines(zone.description, x + 30, 316, 25, 52, 3)
  const signal = textLines(zone.signal, x + 30, 438, 19, 52, 2)

  return `<g>
    <rect x="${x}" y="170" width="540" height="322" rx="16" fill="#171b19" stroke="${color}" stroke-opacity=".62"/>
    <path d="M${x + 16} 170h508" stroke="${color}" stroke-width="2" stroke-opacity=".85"/>
    <text x="${x + 30}" y="216" fill="${color}" font-size="13" font-weight="700" letter-spacing="2">${rank}</text>
    <circle cx="${x + 478}" cy="222" r="29" fill="${color}" fill-opacity=".13" stroke="${color}" stroke-opacity=".65"/>
    <text x="${x + 478}" y="231" fill="${color}" font-size="23" font-weight="800" text-anchor="middle">${String(zone.id).padStart(2, '0')}</text>
    <text x="${x + 30}" y="278" fill="#F4F7EA" font-size="29" font-weight="800">${name}</text>
    <text x="${x + 30}" y="316" fill="#C1C7C2" font-size="16" font-weight="400">${description}</text>
    <path d="M${x + 30} 409h480" stroke="#FFFFFF" stroke-opacity=".12"/>
    <text x="${x + 30}" y="434" fill="#888F89" font-size="10" font-weight="700" letter-spacing="1.4">YOU MAY RECOGNIZE THIS IN</text>
    <text x="${x + 30}" y="458" fill="#DCE1D9" font-size="13" font-weight="600">${signal}</text>
  </g>`
}

export function renderZoneShareCardSvg(pair) {
  if (!Array.isArray(pair) || pair.length !== 2) throw new TypeError('A lead and close zone are required')

  const [lead, close] = pair
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1A2220"/><stop offset=".55" stop-color="#101211"/><stop offset="1" stop-color="#1C1D15"/></linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#EAF0E9" stroke-opacity=".045"/></pattern>
    <radialGradient id="glow"><stop stop-color="#58E6FF" stop-opacity=".14"/><stop offset="1" stop-color="#58E6FF" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#background)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <ellipse cx="1040" cy="100" rx="350" ry="240" fill="url(#glow)"/>
  <g font-family="Arial, Helvetica, sans-serif">
    <path d="M58 48l11 11-11 11-11-11z" fill="none" stroke="#D9FF4A" stroke-width="2"/>
    <text x="82" y="65" fill="#D9FF4A" font-size="17" font-weight="800" letter-spacing="1.1">IAN GOH LAB</text>
    <text x="1142" y="64" fill="#A7AEA8" font-size="12" font-weight="700" letter-spacing="1.8" text-anchor="end">FIND YOUR ZONE  /  REFLECTION</text>
    <text x="58" y="124" fill="#F4F7EA" font-size="28" font-weight="800">TWO SIGNALS TO EXPLORE</text>
    <text x="1142" y="124" fill="#858D87" font-size="13" font-weight="500" text-anchor="end">Not a fixed label. A starting point for reflection.</text>
    ${zonePanel(lead, '01 / LEAD SIGNAL', 48)}
    ${zonePanel(close, '02 / CLOSE SIGNAL', 612)}
    <path d="M58 548h1084" stroke="#FFFFFF" stroke-opacity=".16"/>
    <text x="58" y="586" fill="#A8B0A9" font-size="14" font-weight="500">Explore the work that gives you energy.</text>
    <text x="1142" y="586" fill="#D9FF4A" font-size="14" font-weight="800" letter-spacing="1.2" text-anchor="end">LAB.IANGOH.COM</text>
  </g>
</svg>`
}
