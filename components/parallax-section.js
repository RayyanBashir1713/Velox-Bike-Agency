'use client'

export function ParallaxSection({ children, offset = 0, className = "" }) {
  return (
    <div 
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  )
}