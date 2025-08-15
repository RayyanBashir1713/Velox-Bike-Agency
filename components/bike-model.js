'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cylinder } from '@react-three/drei'

export function BikeModel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation} 
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Bike Frame */}
      <group>
        {/* Main Triangle Frame */}
        <Box
          args={[0.1, 2, 0.1]}
          position={[0, 0, 0]}
          rotation={[0, 0, Math.PI / 6]}
        >
          <meshStandardMaterial color={hovered ? "#4f46e5" : "#1f2937"} metalness={0.8} roughness={0.2} />
        </Box>
        
        <Box
          args={[0.1, 1.5, 0.1]}
          position={[0.5, -0.3, 0]}
          rotation={[0, 0, -Math.PI / 4]}
        >
          <meshStandardMaterial color={hovered ? "#4f46e5" : "#1f2937"} metalness={0.8} roughness={0.2} />
        </Box>
        
        <Box
          args={[0.1, 1.2, 0.1]}
          position={[-0.3, -0.2, 0]}
          rotation={[0, 0, Math.PI / 3]}
        >
          <meshStandardMaterial color={hovered ? "#4f46e5" : "#1f2937"} metalness={0.8} roughness={0.2} />
        </Box>

        {/* Seat Post */}
        <Box
          args={[0.08, 0.8, 0.08]}
          position={[-0.8, 0.5, 0]}
        >
          <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
        </Box>

        {/* Handlebars */}
        <Box
          args={[0.08, 0.6, 0.08]}
          position={[1.2, 0.8, 0]}
        >
          <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
        </Box>
        
        <Box
          args={[0.8, 0.06, 0.06]}
          position={[1.2, 1.1, 0]}
        >
          <meshStandardMaterial color="#1a202c" />
        </Box>
      </group>

      {/* Wheels */}
      <group>
        {/* Front Wheel */}
        <Cylinder
          args={[0.8, 0.8, 0.1, 32]}
          position={[1.2, -0.8, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#1a202c" metalness={0.9} roughness={0.1} />
        </Cylinder>
        
        {/* Front Wheel Spokes */}
        {[...Array(8)].map((_, i) => (
          <Box
            key={`front-spoke-${i}`}
            args={[0.02, 1.4, 0.02]}
            position={[1.2, -0.8, 0]}
            rotation={[0, 0, (i * Math.PI) / 4]}
          >
            <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
          </Box>
        ))}

        {/* Rear Wheel */}
        <Cylinder
          args={[0.8, 0.8, 0.1, 32]}
          position={[-0.8, -0.8, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#1a202c" metalness={0.9} roughness={0.1} />
        </Cylinder>
        
        {/* Rear Wheel Spokes */}
        {[...Array(8)].map((_, i) => (
          <Box
            key={`rear-spoke-${i}`}
            args={[0.02, 1.4, 0.02]}
            position={[-0.8, -0.8, 0]}
            rotation={[0, 0, (i * Math.PI) / 4]}
          >
            <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
          </Box>
        ))}
      </group>

      {/* Seat */}
      <Box
        args={[0.4, 0.1, 0.6]}
        position={[-0.8, 0.9, 0]}
      >
        <meshStandardMaterial color="#2d3748" />
      </Box>

      {/* Pedals and Chain */}
      <group>
        {/* Chain Ring */}
        <Cylinder
          args={[0.3, 0.3, 0.05, 16]}
          position={[0, -0.5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
        </Cylinder>
        
        {/* Pedals */}
        <Box
          args={[0.3, 0.1, 0.8]}
          position={[0, -0.5, 0.5]}
        >
          <meshStandardMaterial color="#1a202c" />
        </Box>
        
        <Box
          args={[0.3, 0.1, 0.8]}
          position={[0, -0.5, -0.5]}
        >
          <meshStandardMaterial color="#1a202c" />
        </Box>
      </group>

      {/* Floating particles for effect */}
      {hovered && [...Array(10)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial 
            color="#4f46e5" 
            emissive="#4f46e5" 
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}