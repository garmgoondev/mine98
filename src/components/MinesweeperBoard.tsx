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

// Windows 98 standard number colors
const NUMBER_COLORS: Record<number, string> = {
  1: 'text-[#0000ff]', // Blue
  2: 'text-[#008000]', // Green
  3: 'text-[#ff0000]', // Red
  4: 'text-[#000080]', // Dark Navy
  5: 'text-[#800000]', // Maroon
  6: 'text-[#008080]', // Teal
  7: 'text-[#000000] dark:text-slate-100', // Black
  8: 'text-[#808080]', // Gray
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

  return (
    <div
      className={`border-4 select-none inline-block max-w-full overflow-x-auto p-1 ${
        isDark
          ? 'bg-slate-900 border-slate-700 border-t-slate-800 border-l-slate-800 border-b-slate-600 border-r-slate-600'
          : 'bg-[#c0c0c0] border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff]'
      }`}
      style={{
        boxShadow: isDark ? 'inset 0 2px 4px rgba(0,0,0,0.5)' : 'inset 1px 1px 0px #000',
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
                      ? 'bg-red-600 text-white border border-red-700'
                      : isDark
                      ? 'bg-slate-800 border border-slate-700/60 shadow-inner'
                      : 'bg-[#bdbdbd] border border-[#7b7b7b]/50'
                    : isDark
                    ? 'bg-slate-700 hover:bg-slate-650 border-t border-l border-slate-500 border-b-2 border-r-2 border-b-slate-900 border-r-slate-900 active:border-slate-800 shadow-sm'
                    : 'bg-[#c0c0c0] hover:bg-[#c8c8c8] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-[#ffffff] active:border-r-[#ffffff]'
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
                    <Flag className="w-4 h-4 fill-red-600" />
                  </div>
                )}

                {/* 2. Wrong Flag on GameOver */}
                {isWrongFlag && (
                  <div className="relative flex items-center justify-center">
                    <Bomb className="w-4 h-4 text-slate-700 opacity-60" />
                    <span className="absolute text-red-600 font-extrabold text-xs">✕</span>
                  </div>
                )}

                {/* 3. Revealed Mine */}
                {isRevealed && isMine && !isWrongFlag && (
                  <div className="flex items-center justify-center">
                    <Bomb className={`w-4 h-4 sm:w-5 sm:h-5 ${isExploded ? 'text-white' : 'text-black dark:text-white fill-black dark:fill-white'}`} />
                  </div>
                )}

                {/* 4. Revealed Number (1~8) */}
                {isRevealed && !isMine && number > 0 && (
                  <span className={`${NUMBER_COLORS[number] || 'text-slate-900'} font-black text-sm sm:text-base`}>
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
