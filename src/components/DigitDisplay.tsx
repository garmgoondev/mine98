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
      className={`relative inline-flex items-center justify-center px-2 py-0.5 bg-black border-2 border-t-[#6b7280] border-l-[#6b7280] border-b-[#f3f4f6] border-r-[#f3f4f6] rounded-[2px] select-none shadow-inner ${className}`}
      aria-label={`Display: ${str}`}
    >
      {/* Faint 888 ghost background for authentic 7-segment display feel */}
      <span
        aria-hidden="true"
        className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-red-950/40 select-none absolute"
      >
        888
      </span>
      {/* Active bright red LED digits */}
      <span className="relative z-10 font-mono text-2xl sm:text-3xl font-black tracking-widest text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]">
        {str}
      </span>
    </div>
  );
}
