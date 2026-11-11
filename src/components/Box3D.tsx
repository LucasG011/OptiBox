import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { SolveResult } from '../lib/solver'

export function Box3D({ result }: { result: SolveResult }) {
  const { x, y, z } = result
  const dist = 2.5 * Math.max(x, y, z)
  return (
    <Canvas camera={{ position: [dist * 0.8, dist * 0.7, dist * 0.8], fov: 40 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[1, 2, 1]} intensity={0.8} />
      <mesh>
        <boxGeometry args={[x, y, z]} />
        <meshStandardMaterial color="#d19a4a" />
      </mesh>
      <OrbitControls />
    </Canvas>
  )
}
