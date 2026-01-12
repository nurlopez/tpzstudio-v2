'use client'

import React from 'react'
import Image from 'next/image'

/**
 * TPZ Studio Logo
 * 
 * Uses the SVG logo file to preserve original design and spacing.
 */
export function Logo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <Image
      src="/logo-tpz.svg"
      alt="tpz studio"
      width={120}
      height={40}
      className={className}
      style={{
        height: 'auto',
        width: 'auto',
        maxHeight: '32px',
        ...style,
      }}
      priority
    />
  )
}
