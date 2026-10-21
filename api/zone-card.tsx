import { ImageResponse } from '@vercel/og'
import { getZonePairFromSearch } from '../shared/zone-share.js'

export const config = { runtime: 'edge' }

function brandMark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#D9FF4A', fontSize: 18, fontWeight: 800 }}>
      <div style={{ width: 18, height: 18, border: '2px solid #D9FF4A', transform: 'rotate(45deg)' }} />
      IAN GOH LAB
    </div>
  )
}

function zonePanel({ zone, rank }: { zone: { id: number; name: string; description: string; color: string }; rank: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: 510,
      height: 290,
      padding: 28,
      border: `1px solid ${zone.color}`,
      borderRadius: 16,
      background: 'rgba(255,255,255,0.035)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: zone.color, fontSize: 16, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>{rank}</span>
        <span style={{ color: zone.color, fontSize: 22, fontWeight: 800 }}>ZONE {zone.id}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          display: 'flex',
          width: 92,
          height: 92,
          alignItems: 'center',
          justifyContent: 'center',
          border: `2px solid ${zone.color}`,
          borderRadius: 46,
          background: `linear-gradient(135deg, ${zone.color}44, rgba(16,18,17,0.2))`,
          color: zone.color,
          fontSize: 36,
          fontWeight: 800,
        }}>
          {String(zone.id).padStart(2, '0')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          <div style={{ color: '#F4F7EA', fontSize: 32, fontWeight: 800, lineHeight: 1.1 }}>{zone.name}</div>
          <div style={{ color: 'rgba(244,247,234,0.68)', fontSize: 16, lineHeight: 1.45 }}>{zone.description}</div>
        </div>
      </div>
    </div>
  )
}

export default function handler(request: Request) {
  const pair = getZonePairFromSearch(new URL(request.url).search)

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '38px 48px',
        background: 'linear-gradient(135deg, #17201e 0%, #101211 48%, #191b12 100%)',
        color: '#F4F7EA',
        fontFamily: 'Arial, sans-serif',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {brandMark()}
          <span style={{ color: 'rgba(244,247,234,0.62)', fontSize: 15, fontWeight: 700, letterSpacing: '2px' }}>A REFLECTION EXERCISE</span>
        </div>
        {pair ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
              {zonePanel({ zone: pair[0], rank: '01 / Lead signal' })}
              <div style={{ color: '#D9FF4A', fontSize: 30, fontWeight: 700 }}>+</div>
              {zonePanel({ zone: pair[1], rank: '02 / Close signal' })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(244,247,234,0.6)', fontSize: 14 }}>
              <span>Explore the work that gives you energy.</span>
              <span style={{ color: '#D9FF4A', fontWeight: 800 }}>LAB.IANGOH.COM</span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: '#F4F7EA', fontSize: 52, fontWeight: 800 }}>
            FIND YOUR ZONE
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    },
  )
}
