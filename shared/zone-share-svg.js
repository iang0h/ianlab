import { readFileSync } from 'node:fs'
import satori from 'satori'

const WIDTH = 1200
const HEIGHT = 630
const FONT_FAMILY = 'IBM Plex Sans'
const FONT_REGULAR = readFileSync(new URL('../assets/fonts/IBMPlexSans-Regular.ttf', import.meta.url))
const FONT_BOLD = readFileSync(new URL('../assets/fonts/IBMPlexSans-Bold.ttf', import.meta.url))

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

function textNode(text, x, baseline, fontSize, color, weight, options = {}) {
  const width = options.width ?? WIDTH - x
  const left = options.align === 'right' ? x - width : options.align === 'center' ? x - width / 2 : x

  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        left,
        top: baseline - fontSize,
        width,
        height: fontSize,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: options.align === 'right' ? 'flex-end' : options.align === 'center' ? 'center' : 'flex-start',
        color,
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight: weight >= 600 ? 700 : 400,
        letterSpacing: options.letterSpacing ?? 0,
        lineHeight: `${fontSize}px`,
        textAlign: options.align ?? 'left',
        whiteSpace: 'nowrap',
      },
      children: text,
    },
  }
}

function zonePanelText(zone, rank, x) {
  const color = colorValue(zone.color)

  return [
    textNode(rank, x + 30, 216, 13, color, 700, { letterSpacing: 2 }),
    textNode(String(zone.id).padStart(2, '0'), x + 478, 231, 23, color, 800, { align: 'center', width: 70 }),
    textNode(zone.name, x + 30, 278, 29, '#F4F7EA', 800),
    ...wrapText(zone.description, 52, 3).map((line, index) => (
      textNode(line, x + 30, 316 + index * 25, 16, '#C1C7C2', 400)
    )),
    textNode('YOU MAY RECOGNIZE THIS IN', x + 30, 434, 10, '#888F89', 700, { letterSpacing: 1.4 }),
    ...wrapText(zone.signal, 52, 2).map((line, index) => (
      textNode(line, x + 30, 458 + index * 19, 13, '#DCE1D9', 600)
    )),
  ]
}

function renderZoneShareCardBackgroundSvg(pair) {
  const [lead, close] = pair

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1A2220"/><stop offset=".55" stop-color="#101211"/><stop offset="1" stop-color="#1C1D15"/></linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#EAF0E9" stroke-opacity=".045"/></pattern>
    <radialGradient id="glow"><stop stop-color="#58E6FF" stop-opacity=".14"/><stop offset="1" stop-color="#58E6FF" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#background)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <ellipse cx="1040" cy="100" rx="350" ry="240" fill="url(#glow)"/>
  <path d="M58 48l11 11-11 11-11-11z" fill="none" stroke="#D9FF4A" stroke-width="2"/>
  <rect x="48" y="170" width="540" height="322" rx="16" fill="#171b19" stroke="${colorValue(lead.color)}" stroke-opacity=".62"/>
  <path d="M64 170h508" stroke="${colorValue(lead.color)}" stroke-width="2" stroke-opacity=".85"/>
  <circle cx="526" cy="222" r="29" fill="${colorValue(lead.color)}" fill-opacity=".13" stroke="${colorValue(lead.color)}" stroke-opacity=".65"/>
  <path d="M78 409h480" stroke="#FFFFFF" stroke-opacity=".12"/>
  <rect x="612" y="170" width="540" height="322" rx="16" fill="#171b19" stroke="${colorValue(close.color)}" stroke-opacity=".62"/>
  <path d="M628 170h508" stroke="${colorValue(close.color)}" stroke-width="2" stroke-opacity=".85"/>
  <circle cx="1090" cy="222" r="29" fill="${colorValue(close.color)}" fill-opacity=".13" stroke="${colorValue(close.color)}" stroke-opacity=".65"/>
  <path d="M642 409h480" stroke="#FFFFFF" stroke-opacity=".12"/>
  <path d="M58 548h1084" stroke="#FFFFFF" stroke-opacity=".16"/>
</svg>`
}

export async function renderZoneShareCardSvg(pair) {
  if (!Array.isArray(pair) || pair.length !== 2) throw new TypeError('A lead and close zone are required')

  const [lead, close] = pair
  const text = [
    textNode('IAN GOH LAB', 82, 65, 17, '#D9FF4A', 800, { letterSpacing: 1.1 }),
    textNode('FIND YOUR ZONE  /  REFLECTION', 1142, 64, 12, '#A7AEA8', 700, { letterSpacing: 1.8, align: 'right', width: 500 }),
    textNode('TWO SIGNALS TO EXPLORE', 58, 124, 28, '#F4F7EA', 800),
    textNode('Not a fixed label. A starting point for reflection.', 1142, 124, 13, '#858D87', 500, { align: 'right', width: 542 }),
    ...zonePanelText(lead, '01 / LEAD SIGNAL', 48),
    ...zonePanelText(close, '02 / CLOSE SIGNAL', 612),
    textNode('Explore the work that gives you energy.', 58, 586, 14, '#A8B0A9', 500),
    textNode('LAB.IANGOH.COM', 1142, 586, 14, '#D9FF4A', 800, { letterSpacing: 1.2, align: 'right', width: 400 }),
  ]
  const textSvg = await satori({
    type: 'div',
    props: {
      style: { display: 'flex', position: 'relative', width: WIDTH, height: HEIGHT, fontFamily: FONT_FAMILY },
      children: text,
    },
  }, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: FONT_FAMILY, data: FONT_REGULAR, weight: 400, style: 'normal' },
      { name: FONT_FAMILY, data: FONT_BOLD, weight: 700, style: 'normal' },
    ],
  })

  const title = `<title>${escapeXml(lead.name)} / ${escapeXml(close.name)}</title>`
  return renderZoneShareCardBackgroundSvg(pair).replace('</svg>', `${title}${textSvg}</svg>`)
}
