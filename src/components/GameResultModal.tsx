'use client';

import React from 'react';
import { Trophy, RotateCcw, Share2, Eye, X, Flame } from 'lucide-react';
import { GameStatus } from '../lib/types';

interface GameResultModalProps {
  status: GameStatus;
  timeSeconds: number;
  clicks: number;
  difficultyNameKo: string;
  isNewRecord: boolean;
  bestTime: number;
  onRestart: () => void;
  onClose: () => void;
  onShare: () => void;
}

export default function GameResultModal({
  status,
  timeSeconds,
  clicks,
  difficultyNameKo,
  isNewRecord,
  bestTime,
  onRestart,
  onClose,
  onShare,
}: GameResultModalProps) {
  if (status !== 'won' && status !== 'lost') return null;

  const isWon = status === 'won';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl space-y-5 text-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
          title="판 살펴보기 (닫기)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Badge */}
        <div
          className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg border-2 ${
            isWon
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
              : 'bg-rose-500/20 border-rose-500/50 text-rose-400'
          }`}
        >
          {isWon ? <Trophy className="w-10 h-10" /> : '💣'}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black">
            {isWon ? '지뢰 제거 성공! 🎉' : '지뢰가 폭발했습니다! 💥'}
          </h3>
          <p className="text-sm text-slate-300">
            {isWon
              ? `${difficultyNameKo} 난이도를 완벽하게 클리어했습니다!`
              : '아쉽게도 지뢰를 밟았습니다. 다시 도전해보세요!'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-sm text-slate-300">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">클리어 타임</span>
            <span className="font-mono font-extrabold text-base text-amber-400">{timeSeconds}초</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">클릭 수</span>
            <span className="font-mono font-bold text-slate-200">{clicks}회</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">개인 최고 기록</span>
            <span className="font-mono font-bold text-slate-200">
              {bestTime > 0 ? `${bestTime}초` : '-'}
            </span>
          </div>
          {isNewRecord && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-1.5 text-xs font-black text-emerald-400">
              <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>새로운 개인 최고 기록 달성! 🚀</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={onRestart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-base hover:from-amber-400 hover:to-amber-500 transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>새 게임 시작하기</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>판 둘러보기</span>
            </button>
            <button
              onClick={onShare}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-sm transition border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>결과 공유</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
