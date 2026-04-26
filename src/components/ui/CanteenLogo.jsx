import React from 'react'

const CanteenLogo = ({ className = "w-16 h-16" }) => {
  return (
    <div className={`${className} animate-float`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="url(#gradient)" stroke="white" strokeWidth="2"/>
        <path d="M35 40 L65 40 L60 65 L40 65 L35 40Z" fill="white" fillOpacity="0.9"/>
        <circle cx="42" cy="50" r="3" fill="#4ecdc4"/>
        <circle cx="58" cy="50" r="3" fill="#ff6b6b"/>
        <path d="M48 55 L52 55 L51 62 L49 62 Z" fill="white"/>
        <line x1="35" y1="40" x2="30" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="65" y1="40" x2="70" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b"/>
            <stop offset="50%" stopColor="#4ecdc4"/>
            <stop offset="100%" stopColor="#45b7d1"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default CanteenLogo
