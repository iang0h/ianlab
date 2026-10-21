import { Canvas } from '@react-three/fiber'
import type { CSSProperties } from 'react'
import type { ZoneEmblem as ZoneEmblemKey, ZoneId } from '../shared/zones.js'
import { zones } from '../shared/zones.js'
import './ZoneEmblem.css'

type ZoneEmblemProps = {
  zoneId: ZoneId
  label: string
}

function ZoneGeometry({ emblem, color }: { emblem: ZoneEmblemKey; color: string }) {
  const pale = '#F4F7EA'

  switch (emblem) {
    case 'compass':
      return (
        <>
          <mesh rotation={[0.2, 0.3, 0]}>
            <octahedronGeometry args={[0.48, 0]} />
            <meshStandardMaterial color={color} metalness={0.62} roughness={0.24} />
          </mesh>
          <mesh position={[0, 0, 0.42]} rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.12, 0.46, 4]} />
            <meshStandardMaterial color={pale} metalness={0.3} roughness={0.3} />
          </mesh>
        </>
      )
    case 'craft':
      return (
        <>
          <mesh rotation={[0.35, 0.5, 0.25]}>
            <dodecahedronGeometry args={[0.47, 0]} />
            <meshStandardMaterial color={color} metalness={0.54} roughness={0.28} />
          </mesh>
          <mesh scale={0.42} rotation={[0.35, 0.5, 0.25]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={pale} metalness={0.32} roughness={0.35} />
          </mesh>
        </>
      )
    case 'knowledge':
      return (
        <>
          <mesh position={[-0.19, 0, 0]} rotation={[0, 0.1, -0.12]}>
            <boxGeometry args={[0.36, 0.5, 0.08]} />
            <meshStandardMaterial color={color} metalness={0.42} roughness={0.34} />
          </mesh>
          <mesh position={[0.19, 0, 0]} rotation={[0, -0.1, 0.12]}>
            <boxGeometry args={[0.36, 0.5, 0.08]} />
            <meshStandardMaterial color={pale} metalness={0.3} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.06, 0.07]}>
            <boxGeometry args={[0.07, 0.52, 0.12]} />
            <meshStandardMaterial color={color} metalness={0.62} roughness={0.24} />
          </mesh>
        </>
      )
    case 'empower':
      return (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.32, 0.075, 12, 32]} />
            <meshStandardMaterial color={color} metalness={0.62} roughness={0.24} />
          </mesh>
          {[[0, 0.42, 0], [0.42, 0, 0], [0, -0.42, 0], [-0.42, 0, 0]].map(([x, y, z]) => (
            <mesh key={`${x}-${y}`} position={[x, y, z]}>
              <icosahedronGeometry args={[0.12, 0]} />
              <meshStandardMaterial color={pale} metalness={0.35} roughness={0.32} />
            </mesh>
          ))}
        </>
      )
    case 'resources':
      return (
        <>
          {[0, 1, 2].map((level) => (
            <mesh key={level} position={[0, (level - 1) * 0.23, 0]}>
              <cylinderGeometry args={[0.35 - level * 0.035, 0.35 - level * 0.035, 0.16, 6]} />
              <meshStandardMaterial color={level === 1 ? pale : color} metalness={0.55} roughness={0.28} />
            </mesh>
          ))}
        </>
      )
    case 'build':
      return (
        <>
          <mesh position={[-0.24, -0.05, 0]}>
            <boxGeometry args={[0.16, 0.66, 0.2]} />
            <meshStandardMaterial color={color} metalness={0.58} roughness={0.26} />
          </mesh>
          <mesh position={[0.24, -0.05, 0]}>
            <boxGeometry args={[0.16, 0.66, 0.2]} />
            <meshStandardMaterial color={color} metalness={0.58} roughness={0.26} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.62, 0.18, 0.2]} />
            <meshStandardMaterial color={pale} metalness={0.34} roughness={0.34} />
          </mesh>
        </>
      )
    case 'repair':
      return (
        <>
          <mesh rotation={[0.25, 0.4, 0.2]}>
            <torusKnotGeometry args={[0.29, 0.11, 80, 10, 2, 3]} />
            <meshStandardMaterial color={color} metalness={0.58} roughness={0.27} />
          </mesh>
          <mesh position={[0, 0, 0.4]}>
            <sphereGeometry args={[0.12, 20, 20]} />
            <meshStandardMaterial color={pale} metalness={0.38} roughness={0.3} />
          </mesh>
        </>
      )
  }
}

export default function ZoneEmblem({ zoneId, label }: ZoneEmblemProps) {
  const zone = zones.find((item) => item.id === zoneId)

  if (!zone) return null

  return (
    <div className="zone-emblem" role="img" aria-label={label} style={{ '--zone-emblem-color': zone.color } as CSSProperties}>
      <Canvas
        aria-hidden="true"
        fallback={<span className="zone-emblem-fallback" />}
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 2.4], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 3, 4]} intensity={2.1} />
        <directionalLight position={[-3, -1, -2]} intensity={0.65} color="#D9FF4A" />
        <group rotation={[0.12, -0.38, 0]}>
          <ZoneGeometry emblem={zone.emblem} color={zone.color} />
        </group>
      </Canvas>
    </div>
  )
}
