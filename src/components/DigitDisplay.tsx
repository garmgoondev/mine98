'use client';

import React from 'react';

interface DigitDisplayProps {
  value: number; // e.g. -99 to 999
  className?: string;
}

export default function DigitDisplay({ value, className = '' }: DigitDisplayProps) {
  // Format to 3 characters, clamping between -99 and 999
  const clamped = Math.max(-99, Math.min(999, value));
  let str = '';
  if (clamped < 0) {
    str = '-' + Math.abs(clamped).toString().padStart(2, '0');
  } else {
    str = clamped.toString().padStart(3, '0');
  }

  return (
    <div
      className={`inline-flex items-center px-1.5 py-0.5 bg-black border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] rounded-sm select-none shadow-inner ${className}`}
      aria-label={`Display: ${str}`}
    >
      <span className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-red-600 drop-shadow-[0_0_6px_rgba(239,68,68,0.85)]">
        {str}
      </span>
    </div>
  );
}
