import React from 'react'

const CanteenLogo = ({ className = "w-16 h-16" }) => {
  return (
    <div className={`${className} animate-float`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Plate background */}
        <circle cx="50" cy="50" r="48" fill="url(#plateGradient)" stroke="url(#borderGradient)" strokeWidth="2"/>
        
        {/* Plate rim */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        
        {/* Food items on plate */}
        {/* Burger/Bun top */}
        <ellipse cx="50" cy="52" rx="18" ry="8" fill="#F59E0B"/>
        <ellipse cx="50" cy="50" rx="16" ry="6" fill="#FBBF24"/>
        
        {/* Lettuce */}
        <ellipse cx="50" cy="53" rx="15" ry="3" fill="#10B981"/>
        
        {/* Tomato */}
        <ellipse cx="50" cy="55" rx="12" ry="2" fill="#EF4444"/>
        
        {/* Cheese */}
        <ellipse cx="50" cy="57" rx="14" ry="2" fill="#FCD34D"/>
        
        {/* Patty */}
        <ellipse cx="50" cy="60" rx="13" ry="3" fill="#78350F"/>
        
        {/* Steam lines */}
        <path d="M35 40 Q38 35 35 30" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round"/>
        <path d="M50 38 Q53 32 50 27" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>
        <path d="M65 40 Q68 35 65 30" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round"/>
        
        {/* Fork on left */}
        <line x1="25" y1="65" x2="18" y2="80" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
        <line x1="22" y1="68" x2="18" y2="75" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="25" y1="68" x2="24" y2="75" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
        
        {/* Knife on right */}
        <line x1="75" y1="65" x2="82" y2="80" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
        <path d="M77 65 L79 72" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
        
        <defs>
          <linearGradient id="plateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7"/>
            <stop offset="50%" stopColor="#FFFBEB"/>
            <stop offset="100%" stopColor="#FDE68A"/>
          </linearGradient>
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B"/>
            <stop offset="50%" stopColor="#EF4444"/>
            <stop offset="100%" stopColor="#F59E0B"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default CanteenLogo
