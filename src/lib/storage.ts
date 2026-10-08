import { HighScores, HighScoreRecord, Difficulty, ThemeMode } from './types';

const STORAGE_KEYS = {
  HIGH_SCORES: 'webminesweeper_high_scores_v1',
  THEME: 'webminesweeper_theme',
  SOUND_MUTED: 'webminesweeper_sound_muted',
};

function createDefaultScores(): HighScores {
  return {
    beginner: null,
    intermediate: null,
    expert: null,
  };
}

export function loadHighScores(): HighScores {
  if (typeof window === 'undefined') return createDefaultScores();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
    if (!raw) return createDefaultScores();
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return {
        beginner: parsed.beginner || null,
        intermediate: parsed.intermediate || null,
        expert: parsed.expert || null,
      };
    }
    return createDefaultScores();
  } catch {
    return createDefaultScores();
  }
}

export function saveHighScore(
  difficulty: Exclude<Difficulty, 'custom'>,
  timeSeconds: number,
  clicks: number
): { isNewRecord: boolean; currentBest: number } {
  const current = loadHighScores();
  const existing = current[difficulty];

  const record: HighScoreRecord = {
    timeSeconds,
    date: new Date().toLocaleDateString('ko-KR'),
    clicks,
  };

  let isNewRecord = false;
  if (!existing || timeSeconds < existing.timeSeconds) {
    current[difficulty] = record;
    isNewRecord = true;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(current));
      } catch {
        // ignore storage quota
      }
    }
  }

  return {
    isNewRecord,
    currentBest: current[difficulty]?.timeSeconds ?? timeSeconds,
  };
}

export function loadTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'classic';
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
    return saved === 'dark' ? 'dark' : 'classic';
  } catch {
    return 'classic';
  }
}

export function saveTheme(theme: ThemeMode) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch {
    // ignore
  }
}

export function loadSoundMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true';
  } catch {
    return false;
  }
}

export function saveSoundMuted(muted: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, String(muted));
  } catch {
    // ignore
  }
}
