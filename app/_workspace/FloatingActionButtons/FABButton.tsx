'use client'

import React from 'react'

interface FABButtonProps {
  label: string
  icon: React.ReactNode
  isActive: boolean
  onClick: () => void
  index: number
  controlsId: string
}

export function FABButton({ label, icon, isActive, onClick, index, controlsId }: FABButtonProps) {
  return (
    <button
      data-fab-button
      aria-label={label}
      aria-expanded={isActive}
      aria-controls={controlsId}
      aria-haspopup="dialog"
      onClick={onClick}
      className="w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-150 ease-out hover:scale-110 hover:shadow-lg focus:outline-none"
      style={{
        animationDelay: `${index * 100}ms`,
        backgroundColor: isActive ? '#B34D49' : '#ffffff',
        borderColor: isActive ? '#B34D49' : 'rgba(0,0,0,0.1)',
        borderWidth: '1px',
        borderStyle: 'solid',
        color: isActive ? '#ffffff' : '#000000',
      }}
    >
      {icon}
    </button>
  )
}
