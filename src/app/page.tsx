'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Share2,
  Trophy,
  HelpCircle,
  EyeOff,
  Sun,
  Moon,
  Flame,
  Flag,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import DigitDisplay from '../components/DigitDisplay';
import FaceButton from '../components/FaceButton';
import MinesweeperBoard from '../components/MinesweeperBoard';
import BossKeyModal from '../components/BossKeyModal';
import GameResultModal from '../components/GameResultModal';
import SeoGuideSection from '../components/SeoGuideSection';
import {
  Difficulty,
  DifficultyConfig,
  Cell,
  GameStatus,
  FaceMood,
  ThemeMode,
  HighScores,
} from '../lib/types';
import {
  DIFFICULTY_PRESETS,
  createEmptyBoard,
  populateMines,
  revealCell,
  chordCell,
  toggleFlag,
  checkWinCondition,
} from '../lib/minesweeper';
import { soundManager } from '../lib/audio';
import {
  loadHighScores,
  saveHighScore,
  loadTheme,
  saveTheme,
  loadSoundMuted,
  saveSoundMuted,
} from '../lib/storage';

export default function Home() {
  const [difficulty, setDifficulty] = useState<Exclude<Difficulty, 'custom'>>('beginner');
  const [config, setConfig] = useState<DifficultyConfig>(DIFFICULTY_PRESETS.beginner);
  const [board, setBoard] = useState<Cell[][]>(() =>
    createEmptyBoard(DIFFICULTY_PRESETS.beginner.cols, DIFFICULTY_PRESETS.beginner.rows)
  );
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [faceMood, setFaceMood] = useState<FaceMood>('smile');
  const [timer, setTimer] = useState<number>(0);
  const [flagCount, setFlagCount] = useState<number>(0);
  const [clicks, setClicks] = useState<number>(0);
  const [theme, setTheme] = useState<ThemeMode>('classic');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [mobileFlagMode, setMobileFlagMode] = useState<boolean>(false);
  const [isBossKeyOpen, setIsBossKeyOpen] = useState<boolean>(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [highScores, setHighScores] = useState<HighScores>({
    beginner: null,
    intermediate: null,
    expert: null,
  });
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCloseBossKey = useCallback(() => {
    setIsBossKeyOpen(false);
  }, []);

  // Initialize saved preferences
  useEffect(() => {
    const savedTheme = loadTheme();
    setTheme(savedTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
    const muted = loadSoundMuted();
    setIsMuted(muted);
    soundManager.setMuted(muted);
    setHighScores(loadHighScores());
  }, []);

  // Timer interval effect (pauses when Boss Key is open)
  useEffect(() => {
    if (gameStatus === 'playing' && !isBossKeyOpen) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => Math.min(999, prev + 1));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus, isBossKeyOpen]);

  // Start / Reset Game
  const restartGame = useCallback(
    (newDiff?: Exclude<Difficulty, 'custom'>) => {
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
        resultTimeoutRef.current = null;
      }
      const activeDiff = newDiff || difficulty;
      const targetConfig = DIFFICULTY_PRESETS[activeDiff];
      if (newDiff) {
        setDifficulty(newDiff);
        setConfig(targetConfig);
      }
      setBoard(createEmptyBoard(targetConfig.cols, targetConfig.rows));
      setGameStatus('idle');
      setFaceMood('smile');
      setTimer(0);
      setFlagCount(0);
      setClicks(0);
      setIsResultModalOpen(false);
      setIsNewRecord(false);
    },
    [difficulty]
  );

  // Global Keyboard Shortcuts (F2 restart, ESC / ~ boss key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsBossKeyOpen((prev) => !prev);
      } else if (e.key === 'F2') {
        if (!isBossKeyOpen) {
          e.preventDefault();
          restartGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBossKeyOpen, restartGame]);

  // Change Difficulty
  const handleDifficultyChange = (newDiff: Exclude<Difficulty, 'custom'>) => {
    restartGame(newDiff);
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'classic' ? 'dark' : 'classic';
    setTheme(nextTheme);
    saveTheme(nextTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
    saveSoundMuted(nextMuted);
  };

  // Handle Win Event
  const handleGameWin = (finalClicks?: number) => {
    const totalClicks = finalClicks !== undefined ? finalClicks : clicks;
    soundManager.playWin();
    setGameStatus('won');
    setFaceMood('cool');

    // Automatically flag all remaining unflagged mine cells and set flag count
    setBoard((prev) =>
      prev.map((row) =>
        row.map((cell) => (cell.isMine ? { ...cell, flagged: true } : cell))
      )
    );
    setFlagCount(config.mines);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    const { isNewRecord: recordAchieved } = saveHighScore(difficulty, timer, totalClicks);
    setIsNewRecord(recordAchieved);
    setHighScores(loadHighScores());

    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    resultTimeoutRef.current = setTimeout(() => setIsResultModalOpen(true), 500);
  };

  // Cell Click (Left Click)
  const handleCellClick = (x: number, y: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    // Mobile Flag Mode override
    if (mobileFlagMode) {
      handleCellRightClick(null, x, y);
      return;
    }

    const nextClicks = clicks + 1;
    setClicks(nextClicks);

    let currentBoard = board;

    // If first move, generate board with 100% safe opening cluster
    if (gameStatus === 'idle') {
      currentBoard = populateMines(board, config.cols, config.rows, config.mines, x, y);
      setGameStatus('playing');
    }

    const { newBoard, hitMine } = revealCell(currentBoard, x, y, config.cols, config.rows);
    setBoard(newBoard);

    if (hitMine) {
      // Game Over / Lost
      soundManager.playExplode();
      setGameStatus('lost');
      setFaceMood('dead');
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
      resultTimeoutRef.current = setTimeout(() => setIsResultModalOpen(true), 600);
      return;
    }

    soundManager.playClick();

    // Check Win
    if (checkWinCondition(newBoard, config.mines, config.cols, config.rows)) {
      handleGameWin(nextClicks);
    }
  };

  // Cell Right Click (Flag)
  const handleCellRightClick = (e: React.MouseEvent | null, x: number, y: number) => {
    if (e) e.preventDefault();
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    const cell = board[y][x];
    if (cell.revealed) return;

    soundManager.playFlag();

    const newBoard = toggleFlag(board, x, y);
    setBoard(newBoard);

    const newFlagCount = newBoard.reduce(
      (acc, row) => acc + row.filter((c) => c.flagged).length,
      0
    );
    setFlagCount(newFlagCount);
  };

  // Chording
  const handleCellChord = (x: number, y: number) => {
    if (gameStatus !== 'playing') return;

    const { newBoard, hitMine, chorded } = chordCell(board, x, y, config.cols, config.rows);
    if (!chorded) return;

    const nextClicks = clicks + 1;
    setBoard(newBoard);
    setClicks(nextClicks);

    if (hitMine) {
      soundManager.playExplode();
      setGameStatus('lost');
      setFaceMood('dead');
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
      resultTimeoutRef.current = setTimeout(() => setIsResultModalOpen(true), 600);
      return;
    }

    soundManager.playChord();

    if (checkWinCondition(newBoard, config.mines, config.cols, config.rows)) {
      handleGameWin(nextClicks);
    }
  };

  // Share Result
  const handleShareResult = () => {
    const shareUrl = 'https://mine98.com';
    const text = `[웹지뢰찾기] ${config.nameKo} 난이도를 ${timer}초 만에 클리어했습니다! 설치 없이 브라우저에서 바로 즐기는 무료 지뢰찾기`;
    if (navigator.share) {
      navigator.share({ title: '웹지뢰찾기 (mine98.com) 클리어 기록', text, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}: ${shareUrl}`);
      alert('클리어 기록 링크가 클립보드에 복사되었습니다!');
    }
  };

  const remainingMines = config.mines - flagCount;
  const currentBest = highScores[difficulty]?.timeSeconds || 0;

  return (
    <div
      className={`min-h-screen flex flex-col items-center selection:bg-amber-500 selection:text-slate-950 pb-20 transition-colors ${
        theme === 'dark'
          ? 'bg-[#090d16] text-slate-100'
          : 'bg-gradient-to-b from-[#1b626e] via-[#165662] to-[#11454f] text-white'
      }`}
    >
      {/* 1. Global Header Bar */}
      <header
        className={`w-full max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between border-b transition-colors ${
          theme === 'dark'
            ? 'border-slate-800/80 bg-slate-950/60 backdrop-blur-sm'
            : 'border-teal-700/60 bg-[#124b55]/60 backdrop-blur-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <BrandLogo width={42} height={42} className="shrink-0 drop-shadow-md" />
          <div>
            <h1 className="flex items-center gap-2 m-0 p-0 text-left">
              <span className="font-black text-2xl tracking-tight text-white">
                mine<span className="text-amber-400">98</span>
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-teal-200'}`}>
                  .com
                </span>
              </span>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-full border shadow-sm ${
                  theme === 'dark'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold'
                }`}
              >
                웹지뢰찾기
              </span>
            </h1>
            <p className={`text-xs sm:text-sm hidden sm:block font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-teal-100'}`}>
              설치 없는 무료 클래식 웹 지뢰찾기 &amp; 직장인 사내망 보스 키
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Boss Key Trigger */}
          <button
            onClick={() => setIsBossKeyOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer active:scale-95"
            title="상사나 선생님이 올 때 누르세요! (단축키: ESC)"
          >
            <EyeOff className="w-4 h-4" />
            <span className="hidden sm:inline">보스 키 (ESC)</span>
            <span className="sm:hidden">보스 키</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            className={`p-2 rounded-lg border transition cursor-pointer shadow-sm active:scale-95 ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                : 'bg-white/90 hover:bg-white border-teal-600/60 text-slate-800 font-bold'
            }`}
            title="테마 전환 (클래식 / 다크)"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-800" />}
          </button>

          {/* Audio Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-lg border transition cursor-pointer shadow-sm active:scale-95 ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'bg-white/90 hover:bg-white border-teal-600/60 text-slate-800 font-bold'
            }`}
            title={isMuted ? '소리 켜기' : '소리 끄기'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-slate-800 dark:text-slate-300" />}
          </button>
        </div>
      </header>

      {/* 2. Cross-Promotion Banner to 1호 WebOmok (High-Contrast & Beautiful) */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-3">
        <div
          className={`flex items-center justify-between border rounded-xl px-4 py-2.5 text-xs transition shadow-sm ${
            theme === 'dark'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : 'bg-white/95 border-amber-400/90 text-slate-900 shadow-md'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 shrink-0 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
            <span>
              <strong className={theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}>WebGame Network</strong>:
              {' '}설치 없이 브라우저에서 바로 즐기는 2인용 온라인 오목도 플레이해보세요!
            </span>
          </div>
          <a
            href="https://webomok.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`font-black underline shrink-0 ml-2 ${
              theme === 'dark'
                ? 'text-amber-400 hover:text-white'
                : 'text-amber-700 hover:text-amber-900'
            }`}
          >
            웹오목 대국실 가기 →
          </a>
        </div>
      </div>

      {/* 3. Main Minesweeper App Container */}
      <main className="w-full max-w-5xl mx-auto px-4 mt-5 flex flex-col items-center">
        {/* Difficulty Selection Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {(['beginner', 'intermediate', 'expert'] as const).map((diff) => {
            const p = DIFFICULTY_PRESETS[diff];
            const isSelected = difficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-2 border-amber-300 shadow-lg font-black scale-105'
                    : theme === 'dark'
                    ? 'bg-slate-900 border border-slate-700/80 text-slate-200 hover:bg-slate-800 shadow-sm'
                    : 'bg-[#c0c0c0] hover:bg-[#d4d4d4] text-slate-900 border-2 border-t-white border-l-white border-b-[#7a7a7a] border-r-[#7a7a7a] shadow-sm'
                }`}
              >
                <span>{p.nameKo}</span>
                <span className="text-[11px] opacity-80 ml-1">
                  ({p.cols}×{p.rows}, 💣{p.mines})
                </span>
              </button>
            );
          })}
        </div>

        {/* Best Record Pill (High-Contrast) */}
        {currentBest > 0 && (
          <div
            className={`flex items-center gap-2 mb-3 px-3.5 py-1 rounded-full text-xs font-black border shadow-sm transition ${
              theme === 'dark'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-white/95 border-amber-400 text-amber-800'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {config.nameKo} 최고 기록: <strong className="font-mono text-sm underline">{currentBest}초</strong>
            </span>
          </div>
        )}

        {/* Mobile Quick Flag Button Toggle */}
        <div className="sm:hidden mb-3 w-full max-w-xs flex justify-center">
          <button
            onClick={() => setMobileFlagMode(!mobileFlagMode)}
            className={`w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 ${
              mobileFlagMode
                ? 'bg-rose-600 text-white border-2 border-rose-400 shadow-md animate-pulse'
                : theme === 'dark'
                ? 'bg-slate-900 text-slate-200 border border-slate-700'
                : 'bg-[#c0c0c0] text-slate-900 border-2 border-t-white border-l-white border-b-[#7a7a7a] border-r-[#7a7a7a] shadow-sm'
            }`}
          >
            <Flag className="w-4 h-4 fill-current" />
            <span>모바일 터치 모드: {mobileFlagMode ? '🚩 깃발 꽂기 켬' : '👆 열기 켬'}</span>
          </button>
        </div>

        {/* Classic Windows Window Container Frame */}
        <div
          className={`border-4 p-2 sm:p-3 rounded-lg shadow-2xl inline-block max-w-full overflow-hidden transition-all ${
            theme === 'dark'
              ? 'bg-slate-900 border-t-slate-700 border-l-slate-700 border-b-slate-950 border-r-slate-950'
              : 'bg-[#c0c0c0] border-t-[#ffffff] border-l-[#ffffff] border-b-[#7a7a7a] border-r-[#7a7a7a]'
          }`}
        >
          {/* Classic Windows 98 Window Title Bar */}
          <div
            className={`px-2 py-1 mb-1.5 flex items-center justify-between font-bold text-xs select-none ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 text-slate-200 border-b border-slate-750'
                : 'bg-gradient-to-r from-[#000080] via-[#0000a8] to-[#1084d0] text-white shadow-sm'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-sm">💣</span>
              <span className="tracking-wide">지뢰찾기 - Classic Minesweeper</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <span className="w-4 h-4 bg-[#c0c0c0] text-black font-bold text-[10px] leading-none flex items-center justify-center border border-t-white border-l-white border-b-black border-r-black">
                _
              </span>
              <span className="w-4 h-4 bg-[#c0c0c0] text-black font-bold text-[10px] leading-none flex items-center justify-center border border-t-white border-l-white border-b-black border-r-black">
                □
              </span>
              <span className="w-4 h-4 bg-[#c0c0c0] text-black font-bold text-[10px] leading-none flex items-center justify-center border border-t-white border-l-white border-b-black border-r-black">
                ✕
              </span>
            </div>
          </div>

          {/* Retro Window Menu Bar */}
          <div
            className={`px-2 py-0.5 mb-2.5 flex items-center gap-4 text-xs font-semibold select-none border-b ${
              theme === 'dark'
                ? 'text-slate-300 border-slate-800'
                : 'text-slate-800 border-slate-400/50'
            }`}
          >
            <button
              onClick={() => restartGame()}
              className="hover:underline cursor-pointer"
              title="새 게임 (F2)"
            >
              게임(<span className="underline">G</span>)
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('guide-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:underline cursor-pointer"
              title="규칙 및 1-2-1 공략 보기"
            >
              도움말(<span className="underline">H</span>)
            </button>
            <button
              onClick={() => setIsBossKeyOpen(true)}
              className="hover:underline cursor-pointer text-emerald-600 dark:text-emerald-400 font-bold ml-auto"
              title="보스 키 즉시 실행 (ESC)"
            >
              보스 키(ESC)
            </button>
          </div>

          {/* Status Header (Mine Counter, Smiley, Timer) */}
          <div
            className={`border-4 px-3 sm:px-4 py-2.5 mb-3 flex items-center justify-between gap-4 ${
              theme === 'dark'
                ? 'bg-slate-950 border-t-slate-950 border-l-slate-950 border-b-slate-800 border-r-slate-800'
                : 'bg-[#c0c0c0] border-t-[#7a7a7a] border-l-[#7a7a7a] border-b-[#ffffff] border-r-[#ffffff]'
            }`}
          >
            {/* Mines Left LED */}
            <DigitDisplay value={remainingMines} />

            {/* Smiley Face Button */}
            <FaceButton mood={faceMood} onClick={() => restartGame()} />

            {/* Timer LED */}
            <DigitDisplay value={timer} />
          </div>

          {/* Minesweeper Board Grid */}
          <div className="flex justify-center overflow-x-auto max-w-full">
            <MinesweeperBoard
              board={board}
              cols={config.cols}
              rows={config.rows}
              theme={theme}
              onCellClick={handleCellClick}
              onCellRightClick={handleCellRightClick}
              onCellChord={handleCellChord}
              onCellMouseDown={() => {
                if (gameStatus === 'playing') setFaceMood('scared');
              }}
              onCellMouseUp={() => {
                if (gameStatus === 'playing') setFaceMood('smile');
              }}
            />
          </div>
        </div>

        {/* Game Bottom Bar Controls (Crystal Clear Contrast) */}
        <div
          className={`flex flex-wrap items-center justify-center gap-3 mt-4 text-xs font-semibold ${
            theme === 'dark' ? 'text-slate-300' : 'text-teal-100'
          }`}
        >
          <span>
            클릭 수: <strong className="font-mono text-white font-black text-sm drop-shadow">{clicks}</strong>
          </span>
          <span>•</span>
          <span>
            단축키: <strong className={theme === 'dark' ? 'text-amber-400' : 'text-amber-300'}>F2</strong> (재시작),{' '}
            <strong className={theme === 'dark' ? 'text-amber-400' : 'text-amber-300'}>ESC</strong> (보스 키)
          </span>
          {(gameStatus === 'won' || gameStatus === 'lost') && !isResultModalOpen && (
            <>
              <span>•</span>
              <button
                onClick={() => setIsResultModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-md transition cursor-pointer active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-amber-400 text-slate-950 border-amber-300 hover:bg-amber-300'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>결과 다시 보기</span>
              </button>
            </>
          )}
        </div>

        {/* 4. Comprehensive SEO Guide Section (Rules, 1-2-1 Patterns, FAQs) */}
        <div id="guide-section" className="w-full">
          <SeoGuideSection theme={theme} />
        </div>
      </main>

      {/* 5. Modals */}
      <BossKeyModal isOpen={isBossKeyOpen} onClose={handleCloseBossKey} />

      <GameResultModal
        isOpen={isResultModalOpen}
        status={gameStatus}
        timeSeconds={timer}
        clicks={clicks}
        difficultyNameKo={config.nameKo}
        isNewRecord={isNewRecord}
        bestTime={currentBest}
        onRestart={() => restartGame()}
        onClose={() => setIsResultModalOpen(false)}
        onShare={handleShareResult}
      />
    </div>
  );
}
