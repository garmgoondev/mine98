'use client';

import React from 'react';
import { FaceMood } from '../lib/types';

interface FaceButtonProps {
  mood: FaceMood;
  onClick: () => void;
  className?: string;
}

export default function FaceButton({ mood, onClick, className = '' }: FaceButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-11 h-11 sm:w-12 sm:h-12 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-[#ffffff] active:border-r-[#ffffff] flex items-center justify-center cursor-pointer transition active:translate-y-0.5 select-none shadow-sm ${className}`}
      title="새 게임 시작 (클릭)"
      aria-label="Restart Game"
    >
      <div className="w-8 h-8 rounded-full bg-[#fde047] border-2 border-black flex items-center justify-center relative shadow-inner">
        {/* Mood Faces */}
        {mood === 'smile' && (
          <>
            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-black rounded-full" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full" />
            <div className="absolute bottom-1.5 w-4 h-2 border-b-2 border-black rounded-b-full" />
          </>
        )}

        {mood === 'scared' && (
          <>
            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-black rounded-full" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full" />
            <div className="absolute bottom-1.5 w-2.5 h-2.5 bg-black rounded-full" />
          </>
        )}

        {mood === 'cool' && (
          <>
            {/* Sunglasses */}
            <div className="absolute top-2 left-1 right-1 flex justify-between items-center px-0.5">
              <div className="w-3 h-2 bg-black rounded-b-sm" />
              <div className="w-1 h-0.5 bg-black" />
              <div className="w-3 h-2 bg-black rounded-b-sm" />
            </div>
            {/* Grin */}
            <div className="absolute bottom-1.5 w-4 h-1.5 border-b-2 border-black rounded-b-full" />
          </>
        )}

        {mood === 'dead' && (
          <>
            {/* X eyes */}
            <div className="absolute top-1.5 left-1.5 text-[10px] font-black leading-none select-none">✕</div>
            <div className="absolute top-1.5 right-1.5 text-[10px] font-black leading-none select-none">✕</div>
            {/* Frown */}
            <div className="absolute bottom-2 w-3.5 h-1.5 border-t-2 border-black rounded-t-full" />
          </>
        )}
      </div>
    </button>
  );
}
