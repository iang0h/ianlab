import { mkdir, writeFile } from 'node:fs/promises'
import { zones } from '../shared/zones.js'
import { renderZoneShareCardPng } from '../shared/zone-share-card.js'

const output = new URL('../public/zone-share-cards/', import.meta.url)
await mkdir(output, { recursive: true })

for (const lead of zones) {
  for (const close of zones) {
    if (lead.id === close.id) continue
    const image = await renderZoneShareCardPng([lead, close])
    await writeFile(new URL(`${lead.id}-${close.id}.png`, output), image)
  }
}
