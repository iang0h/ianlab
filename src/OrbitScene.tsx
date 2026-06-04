import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group, Mesh } from 'three'

type OrbitItem = {
  id: string
  name: string
  color: string
}

function OrbitScene({ items }: { items: OrbitItem[] }) {
  const group = useRef<Group>(null)
  const core = useRef<Mesh>(null)

  useFrame(({ clock, pointer }) => {
    if (!group.current) return
    group.current.rotation.y = clock.getElapsedTime() * 0.08 + pointer.x * 0.16
    group.current.rotation.x = -0.12 + pointer.y * 0.08

    if (core.current) {
      core.current.rotation.x = clock.getElapsedTime() * 0.18
      core.current.rotation.z = clock.getElapsedTime() * 0.12
    }
  })

  return (
    <>
      <ambientLight intensity={1.25} />
      <pointLight color="#D9FF4A" intensity={45} position={[-4, 3.4, 4]} />
      <pointLight color="#58E6FF" intensity={38} position={[4, -1.5, 3]} />
      <pointLight color="#FF7A1A" intensity={20} position={[0, 4, -4]} />
      <group ref={group}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.1, 0.008, 18, 180]} />
          <meshBasicMaterial color="#D9FF4A" transparent opacity={0.25} />
        </mesh>
        <mesh rotation={[Math.PI / 2.28, 0.18, 0.8]}>
          <torusGeometry args={[2.25, 0.006, 18, 180]} />
          <meshBasicMaterial color="#58E6FF" transparent opacity={0.24} />
        </mesh>
        <mesh rotation={[Math.PI / 2.52, -0.28, -0.7]}>
          <torusGeometry args={[3.78, 0.006, 18, 180]} />
          <meshBasicMaterial color="#FF7A1A" transparent opacity={0.16} />
        </mesh>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.74, 2]} />
          <meshStandardMaterial
            color="#F7FAEF"
            emissive="#1A260C"
            metalness={0.62}
            roughness={0.2}
          />
        </mesh>
        {items.map((item, index) => (
          <ProjectOrb key={item.id} index={index} item={item} total={items.length} />
        ))}
      </group>
    </>
  )
}

function ProjectOrb({ index, item, total }: { index: number; item: OrbitItem; total: number }) {
  const angle = (index / total) * Math.PI * 2
  const radius = index % 2 === 0 ? 3.08 : 2.28
  const y = ((index % 3) - 1) * 0.62

  return (
    <group position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}>
      <mesh>
        <sphereGeometry args={[0.105, 28, 28]} />
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={0.34}
          metalness={0.35}
          roughness={0.22}
        />
      </mesh>
    </group>
  )
}

export default function HeroOrbit({ items }: { items: OrbitItem[] }) {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 48 }} dpr={[1, 1.6]}>
      <OrbitScene items={items} />
    </Canvas>
  )
}
