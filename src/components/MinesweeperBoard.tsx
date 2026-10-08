'use client';

import React from 'react';
import { Cell, ThemeMode } from '../lib/types';
import { Flag, Bomb } from 'lucide-react';

interface MinesweeperBoardProps {
  board: Cell[][];
  cols: number;
  rows: number;
  theme: ThemeMode;
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (e: React.MouseEvent, x: number, y: number) => void;
  onCellChord: (x: number, y: number) => void;
  onCellMouseDown?: () => void;
  onCellMouseUp?: () => void;
}

// Windows 98 classic authentic number colors (optimized for light gray tiles)
const NUMBER_COLORS_CLASSIC: Record<number, string> = {
  1: 'text-[#0000c8]', // Deep Royal Blue
  2: 'text-[#007e00]', // Crisp Forest Green
  3: 'text-[#cc0000]', // Crisp Crimson Red
  4: 'text-[#000075]', // Deep Navy Blue
  5: 'text-[#800000]', // Classic Maroon
  6: 'text-[#007b7b]', // Deep Teal
  7: 'text-[#111827]', // Crisp Charcoal
  8: 'text-[#374151]', // Dark Slate (Much clearer than washed-out gray)
};

// High-contrast modern number colors (optimized for dark slate tiles)
const NUMBER_COLORS_DARK: Record<number, string> = {
  1: 'text-[#60a5fa]', // Crisp Sky Blue (High contrast against dark)
  2: 'text-[#4ade80]', // Bright Emerald Mint
  3: 'text-[#f87171]', // Vivid Coral Red
  4: 'text-[#a78bfa]', // Vibrant Violet (Avoids invisible dark navy!)
  5: 'text-[#fb923c]', // Warm Amber Orange (Avoids invisible dark maroon!)
  6: 'text-[#2dd4bf]', // Bright Turquoise Teal
  7: 'text-[#f8fafc]', // Crisp Snow White
  8: 'text-[#cbd5e1]', // Light Silver Gray
};

export default function MinesweeperBoard({
  board,
  cols,
  rows,
  theme,
  onCellClick,
  onCellRightClick,
  onCellChord,
  onCellMouseDown,
  onCellMouseUp,
}: MinesweeperBoardProps) {
  const isDark = theme === 'dark';
  const numberColors = isDark ? NUMBER_COLORS_DARK : NUMBER_COLORS_CLASSIC;

  return (
    <div
      className={`border-4 select-none inline-block max-w-full overflow-x-auto p-1.5 transition-colors ${
        isDark
          ? 'bg-slate-900 border-t-slate-950 border-l-slate-950 border-b-slate-750 border-r-slate-750'
          : 'bg-[#c0c0c0] bevel-in'
      }`}
      style={{
        boxShadow: isDark
          ? 'inset 0 3px 6px rgba(0,0,0,0.6)'
          : 'inset 2px 2px 0px #808080, inset -2px -2px 0px #ffffff',
      }}
    >
      <div
        className="grid gap-[1px]"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          width: 'max-content',
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => {
            const isRevealed = cell.revealed;
            const isFlagged = cell.flagged;
            const isMine = cell.isMine;
            const isExploded = cell.exploded;
            const isWrongFlag = cell.wrongFlag;
            const number = cell.neighborMines;

            return (
              <button
                key={`${x}-${y}`}
                type="button"
                onMouseDown={onCellMouseDown}
                onMouseUp={onCellMouseUp}
                onClick={() => {
                  if (isRevealed) {
                    onCellChord(x, y);
                  } else {
                    onCellClick(x, y);
                  }
                }}
                onContextMenu={(e) => onCellRightClick(e, x, y)}
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-base sm:text-lg transition-colors cursor-pointer select-none font-mono ${
                  isRevealed
                    ? isExploded
                      ? 'bg-red-600 text-white border border-red-700 shadow-md'
                      : isDark
                      ? 'bg-slate-800/90 border border-slate-700/60 shadow-inner'
                      : 'bg-[#c4c4c4] border border-[#a3a3a3]'
                    : isDark
                    ? 'bg-slate-700 hover:bg-slate-600 border-t-2 border-l-2 border-slate-500 border-b-2 border-r-2 border-b-slate-950 border-r-slate-950 active:border-slate-800 shadow-sm'
                    : 'bg-[#c0c0c0] hover:bg-[#d0d0d0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#7a7a7a] border-r-[#7a7a7a] active:border-t-[#7a7a7a] active:border-l-[#7a7a7a] active:border-b-[#ffffff] active:border-r-[#ffffff]'
                }`}
                style={{
                  minWidth: cols > 16 ? '24px' : '28px',
                  minHeight: cols > 16 ? '24px' : '28px',
                }}
                aria-label={`Cell ${x}, ${y}`}
              >
                {/* 1. Flagged */}
                {isFlagged && !isRevealed && (
                  <div className="flex items-center justify-center text-red-600 drop-shadow-sm">
                    <Flag className="w-4 h-4 fill-red-600 stroke-red-700" />
                  </div>
                )}

                {/* 2. Wrong Flag on GameOver */}
                {isWrongFlag && (
                  <div className="relative flex items-center justify-center">
                    <Bomb className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-700'} opacity-70`} />
                    <span className="absolute text-red-600 font-extrabold text-sm drop-shadow">✕</span>
                  </div>
                )}

                {/* 3. Revealed Mine */}
                {isRevealed && isMine && !isWrongFlag && (
                  <div className="flex items-center justify-center">
                    <Bomb
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        isExploded
                          ? 'text-white fill-white'
                          : isDark
                          ? 'text-rose-400 fill-rose-500 drop-shadow'
                          : 'text-black fill-black'
                      }`}
                    />
                  </div>
                )}

                {/* 4. Revealed Number (1~8) */}
                {isRevealed && !isMine && number > 0 && (
                  <span
                    className={`${
                      numberColors[number] || (isDark ? 'text-white' : 'text-slate-900')
                    } font-black text-sm sm:text-base leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]`}
                  >
                    {number}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
