'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Box, Cylinder, Text, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Fallback procedural bike model when GLTF fails to load
function ProceduralBike({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], hovered, selectedColor = "#4f46e5" }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15
    }
  })

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation} 
      scale={scale}
    >
      {/* Enhanced Bike Frame with more realistic proportions */}
      <group>
        {/* Main Frame Tubes */}
        <Cylinder args={[0.03, 0.03, 1.8]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
          <meshStandardMaterial 
            color={hovered ? selectedColor : "#1f2937"} 
            metalness={0.9} 
            roughness={0.1}
            envMapIntensity={1.5}
          />
        </Cylinder>
        
        <Cylinder args={[0.03, 0.03, 1.4]} position={[0.4, -0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <meshStandardMaterial 
            color={hovered ? selectedColor : "#1f2937"} 
            metalness={0.9} 
            roughness={0.1}
          />
        </Cylinder>
        
        <Cylinder args={[0.03, 0.03, 1.0]} position={[-0.2, -0.1, 0]} rotation={[0, 0, Math.PI / 3]}>
          <meshStandardMaterial 
            color={hovered ? selectedColor : "#1f2937"} 
            metalness={0.9} 
            roughness={0.1}
          />
        </Cylinder>

        {/* Seat Tube */}
        <Cylinder args={[0.025, 0.025, 0.7]} position={[-0.7, 0.4, 0]}>
          <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.2} />
        </Cylinder>

        {/* Head Tube and Fork */}
        <Cylinder args={[0.025, 0.025, 0.5]} position={[1.1, 0.7, 0]}>
          <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.2} />
        </Cylinder>
        
        {/* Enhanced Handlebars */}
        <Cylinder args={[0.4, 0.4, 0.03]} position={[1.1, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#1a202c" metalness={0.7} roughness={0.3} />
        </Cylinder>
        
        {/* Handlebar Grips */}
        <Cylinder args={[0.04, 0.04, 0.15]} position={[1.1, 1.0, 0.35]}>
          <meshStandardMaterial color="#8b5cf6" />
        </Cylinder>
        <Cylinder args={[0.04, 0.04, 0.15]} position={[1.1, 1.0, -0.35]}>
          <meshStandardMaterial color="#8b5cf6" />
        </Cylinder>
      </group>

      {/* Enhanced Wheels with better spokes */}
      <group>
        {/* Front Wheel */}
        <group position={[1.1, -0.7, 0]}>
          <Cylinder args={[0.7, 0.7, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#1a202c" metalness={0.95} roughness={0.05} />
          </Cylinder>
          
          {/* Rim */}
          <Cylinder args={[0.72, 0.72, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
          </Cylinder>
          
          {/* Enhanced Spokes */}
          {[...Array(12)].map((_, i) => (
            <Cylinder
              key={`front-spoke-${i}`}
              args={[0.008, 0.008, 1.3]}
              rotation={[0, 0, (i * Math.PI) / 6]}
            >
              <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.1} />
            </Cylinder>
          ))}
          
          {/* Hub */}
          <Cylinder args={[0.1, 0.1, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
          </Cylinder>
        </group>

        {/* Rear Wheel */}
        <group position={[-0.7, -0.7, 0]}>
          <Cylinder args={[0.7, 0.7, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#1a202c" metalness={0.95} roughness={0.05} />
          </Cylinder>
          
          {/* Rim */}
          <Cylinder args={[0.72, 0.72, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
          </Cylinder>
          
          {/* Enhanced Spokes */}
          {[...Array(12)].map((_, i) => (
            <Cylinder
              key={`rear-spoke-${i}`}
              args={[0.008, 0.008, 1.3]}
              rotation={[0, 0, (i * Math.PI) / 6]}
            >
              <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.1} />
            </Cylinder>
          ))}
          
          {/* Hub with Cassette */}
          <Cylinder args={[0.1, 0.1, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
          </Cylinder>
          
          {/* Cassette */}
          <Cylinder args={[0.12, 0.08, 0.04]} position={[0, 0, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
          </Cylinder>
        </group>
      </group>

      {/* Enhanced Seat */}
      <Box args={[0.35, 0.08, 0.5]} position={[-0.7, 0.75, 0]}>
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </Box>

      {/* Enhanced Drivetrain */}
      <group>
        {/* Crankset */}
        <Cylinder args={[0.25, 0.25, 0.03]} position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
        </Cylinder>
        
        {/* Crank Arms */}
        <Cylinder args={[0.02, 0.02, 0.35]} position={[0.15, -0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
          <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.02, 0.02, 0.35]} position={[-0.15, -0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
        </Cylinder>
        
        {/* Pedals */}
        <Box args={[0.25, 0.06, 0.1]} position={[0.25, -0.65, 0]}>
          <meshStandardMaterial color="#8b5cf6" />
        </Box>
        <Box args={[0.25, 0.06, 0.1]} position={[-0.25, -0.15, 0]}>
          <meshStandardMaterial color="#8b5cf6" />
        </Box>
      </group>

      {/* Chain */}
      <group>
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            args={[0.03, 0.01, 0.01]}
            position={[
              Math.cos((i / 20) * Math.PI * 2) * 0.4 - 0.2,
              Math.sin((i / 20) * Math.PI * 2) * 0.1 - 0.4,
              0
            ]}
          >
            <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
          </Box>
        ))}
      </group>

      {/* Particle effects when hovered */}
      {hovered && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          {[...Array(15)].map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <MeshDistortMaterial
                color={selectedColor}
                speed={2}
                distort={0.3}
                radius={1}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </Float>
      )}
    </group>
  )
}

export function EnhancedBikeModel({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1],
  modelUrl = null,
  bikeType = "road",
  onInteraction
}) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [gltfModel, setGltfModel] = useState(null)
  const [loadError, setLoadError] = useState(false)

  // Color schemes for different bike types
  const colorSchemes = {
    road: "#4f46e5",
    mountain: "#059669", 
    electric: "#dc2626",
    racing: "#f59e0b"
  }

  const selectedColor = colorSchemes[bikeType] || "#4f46e5"

  // Try to load GLTF model if URL provided
  useEffect(() => {
    if (modelUrl) {
      const loader = new GLTFLoader()
      loader.load(
        modelUrl,
        (gltf) => {
          setGltfModel(gltf)
          setLoadError(false)
        },
        (progress) => {
          console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%')
        },
        (error) => {
          console.log('Error loading model:', error)
          setLoadError(true)
        }
      )
    }
  }, [modelUrl])

  const handleInteraction = (type) => {
    if (type === 'hover') {
      setHovered(true)
    } else if (type === 'unhover') {
      setHovered(false)
    } else if (type === 'click') {
      setClicked(!clicked)
      onInteraction?.(bikeType)
    }
  }

  // Use GLTF model if loaded, otherwise use procedural model
  if (gltfModel && !loadError) {
    return (
      <primitive
        object={gltfModel.scene}
        position={position}
        rotation={rotation}
        scale={scale}
        onPointerOver={() => handleInteraction('hover')}
        onPointerOut={() => handleInteraction('unhover')}
        onClick={() => handleInteraction('click')}
      />
    )
  }

  // Fallback to enhanced procedural model
  return (
    <group
      onPointerOver={() => handleInteraction('hover')}
      onPointerOut={() => handleInteraction('unhover')}
      onClick={() => handleInteraction('click')}
    >
      <ProceduralBike
        position={position}
        rotation={rotation}
        scale={scale}
        hovered={hovered}
        selectedColor={selectedColor}
      />
      
      {/* Bike Type Label */}
      {hovered && (
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <Text
            position={[0, 2, 0]}
            fontSize={0.3}
            color={selectedColor}
            anchorX="center"
            anchorY="middle"
          >
            {bikeType.toUpperCase()} BIKE
          </Text>
        </Float>
      )}
    </group>
  )
}