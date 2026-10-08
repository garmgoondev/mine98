'use client';

import React, { useId } from 'react';

interface BrandLogoProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
  title?: string;
}

export default function BrandLogo({
  width = 44,
  height = 44,
  title = 'WebMinesweeper Logo',
  className = '',
  ...props
}: BrandLogoProps) {
  const id = 'wms-' + useId().replace(/:/g, '');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={width}
      height={height}
      role="img"
      aria-label={title}
      className={className}
      {...props}
    >
      <defs>
        {/* Beveled tile gradients */}
        <linearGradient id={`${id}-tile-light`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dcdcdc" />
        </linearGradient>
        <linearGradient id={`${id}-tile-dark`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#808080" />
          <stop offset="100%" stopColor="#505050" />
        </linearGradient>
        <radialGradient id={`${id}-mine-body`} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#666666" />
          <stop offset="35%" stopColor="#222222" />
          <stop offset="85%" stopColor="#0d0d0d" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <radialGradient id={`${id}-mine-shine`} cx="35%" cy="30%" r="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-flag`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#ff4d4d" />
          <stop offset="60%" stopColor="#e60000" />
          <stop offset="100%" stopColor="#990000" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* 3D Classic Beveled Button Tile Frame */}
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#c0c0c0" stroke="#808080" strokeWidth="1" />
      {/* Top/Left highlight bevel */}
      <path d="M 2 14 A 12 12 0 0 1 14 2 L 50 2 L 44 8 L 14 8 A 6 6 0 0 0 8 14 L 8 44 L 2 50 Z" fill="#ffffff" opacity="0.9" />
      {/* Bottom/Right shadow bevel */}
      <path d="M 62 50 A 12 12 0 0 1 50 62 L 14 62 L 20 56 L 50 56 A 6 6 0 0 0 56 50 L 56 20 L 62 14 Z" fill="#707070" />

      {/* Main Naval Contact Mine */}
      <g filter={`url(#${id}-shadow)`}>
        {/* Mine Spikes / Horns */}
        <line x1="28" y1="18" x2="28" y2="44" stroke="#222" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="15" y1="31" x2="41" y2="31" stroke="#222" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="19" y1="22" x2="37" y2="40" stroke="#222" strokeWidth="4" strokeLinecap="round" />
        <line x1="19" y1="40" x2="37" y2="22" stroke="#222" strokeWidth="4" strokeLinecap="round" />

        {/* Spike Caps */}
        <circle cx="28" cy="17" r="2.5" fill="#111" />
        <circle cx="28" cy="45" r="2.5" fill="#111" />
        <circle cx="14" cy="31" r="2.5" fill="#111" />
        <circle cx="42" cy="31" r="2.5" fill="#111" />
        <circle cx="18" cy="21" r="2.2" fill="#111" />
        <circle cx="38" cy="41" r="2.2" fill="#111" />
        <circle cx="18" cy="41" r="2.2" fill="#111" />
        <circle cx="38" cy="21" r="2.2" fill="#111" />

        {/* Central Mine Sphere */}
        <circle cx="28" cy="31" r="11" fill={`url(#${id}-mine-body)`} />
        {/* Specular White Highlight */}
        <circle cx="24.5" cy="27.5" r="4.5" fill={`url(#${id}-mine-shine)`} />
      </g>

      {/* Red Victory / Safe Flag in foreground */}
      <g filter={`url(#${id}-shadow)`}>
        {/* Flag Pole */}
        <path d="M 46 16 L 46 48" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="46" cy="15" r="2" fill="#d97706" />
        {/* Flag Pennant */}
        <path d="M 46 17 L 31 24 L 46 31 Z" fill={`url(#${id}-flag)`} />
        {/* Pole Base */}
        <path d="M 42 48 L 50 48 L 48 46 L 44 46 Z" fill="#4b5563" />
      </g>
    </svg>
  );
}
