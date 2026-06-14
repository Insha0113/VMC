import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  showText?: boolean;
  light?: boolean;
  className?: string;
}

export default function Logo({
  width,
  height = 55,
  showText = true, // Ignored since the logo image contains both VMC graphic and text
  light = false,
  className = ''
}: LogoProps) {
  return (
    <div 
      className={`logo-container ${className}`} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        height: `${height}px`,
        userSelect: 'none'
      }}
    >
      <img
        src="/images/vmc logo.png"
        alt="VMC Medical Center Logo"
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          // If light is true (e.g. for footer), invert colors to make it white/accessible
          filter: light ? 'brightness(0) invert(1)' : 'none',
          transition: 'filter 0.3s ease'
        }}
      />
    </div>
  );
}
