import { ChevronDown } from 'lucide-react'
import { zones } from '../shared/zones.js'
import type { Zone } from '../shared/zones.js'

export function ZoneExplanation({ zone }: { zone: Zone }) {
  return (
    <div className="zone-explanation">
      <p className="zone-explanation-depth">{zone.inDepth}</p>
      <div className="zone-explanation-grid">
        <div>
          <span>For example</span>
          <p>{zone.example}</p>
        </div>
        <div>
          <span>Ask yourself</span>
          <p>{zone.askYourself}</p>
        </div>
      </div>
      <p className="zone-explanation-distinction"><strong>How it differs:</strong> {zone.distinction}</p>
    </div>
  )
}

export function ZoneGuide() {
  return (
    <section className="zone-guide" id="zone-guide" aria-labelledby="zone-guide-title">
      <div className="zone-guide-heading">
        <div>
          <span className="zone-overline">A quick guide</span>
          <h3 id="zone-guide-title">What does each zone mean?</h3>
        </div>
        <p>Each zone describes one way you may enjoy helping. Open any zone to see what it can look like in everyday work.</p>
      </div>
      <div className="zone-guide-grid">
        {zones.map((zone) => (
          <details className="zone-guide-item" key={zone.id} style={{ borderColor: zone.color }}>
            <summary>
              <span className="zone-guide-index" style={{ color: zone.color }}>ZONE 0{zone.id}</span>
              <strong>{zone.name}</strong>
              <span className="zone-guide-summary">{zone.description}</span>
              <ChevronDown className="zone-guide-chevron" size={18} aria-hidden="true" />
            </summary>
            <ZoneExplanation zone={zone} />
          </details>
        ))}
      </div>
    </section>
  )
}
