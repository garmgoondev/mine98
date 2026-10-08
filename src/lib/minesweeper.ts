import { Cell, DifficultyConfig, Difficulty } from './types';

export const DIFFICULTY_PRESETS: Record<Exclude<Difficulty, 'custom'>, DifficultyConfig> = {
  beginner: {
    name: 'Beginner',
    nameKo: '초급',
    cols: 9,
    rows: 9,
    mines: 10,
  },
  intermediate: {
    name: 'Intermediate',
    nameKo: '중급',
    cols: 16,
    rows: 16,
    mines: 40,
  },
  expert: {
    name: 'Expert',
    nameKo: '고급',
    cols: 30,
    rows: 16,
    mines: 99,
  },
};

export function createEmptyBoard(cols: number, rows: number): Cell[][] {
  const board: Cell[][] = [];
  for (let y = 0; y < rows; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < cols; x++) {
      row.push({
        x,
        y,
        isMine: false,
        revealed: false,
        flagged: false,
        neighborMines: 0,
      });
    }
    board.push(row);
  }
  return board;
}

export function populateMines(
  board: Cell[][],
  cols: number,
  rows: number,
  totalMines: number,
  safeX: number,
  safeY: number
): Cell[][] {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  // Generate safe zone around first click (3x3 area guaranteed mine-free)
  const safeCoords = new Set<string>();
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = safeX + dx;
      const ny = safeY + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        safeCoords.add(`${nx},${ny}`);
      }
    }
  }

  // Collect candidate locations
  const candidates: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!safeCoords.has(`${x},${y}`)) {
        candidates.push({ x, y });
      }
    }
  }

  // Fisher-Yates shuffle
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  // Place mines
  const minesToPlace = Math.min(totalMines, candidates.length);
  for (let i = 0; i < minesToPlace; i++) {
    const { x, y } = candidates[i];
    newBoard[y][x].isMine = true;
  }

  // Calculate neighboring mines for all cells
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (newBoard[y][x].isMine) continue;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            if (newBoard[ny][nx].isMine) count++;
          }
        }
      }
      newBoard[y][x].neighborMines = count;
    }
  }

  return newBoard;
}

export function revealCell(
  board: Cell[][],
  x: number,
  y: number,
  cols: number,
  rows: number
): { newBoard: Cell[][]; hitMine: boolean } {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  const target = newBoard[y][x];

  if (target.flagged || target.revealed) {
    return { newBoard, hitMine: false };
  }

  if (target.isMine) {
    target.revealed = true;
    target.exploded = true;
    // Reveal all mines and mark incorrect flags
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = newBoard[r][c];
        if (cell.isMine && !cell.flagged) {
          cell.revealed = true;
        } else if (!cell.isMine && cell.flagged) {
          cell.revealed = true;
          cell.wrongFlag = true;
        }
      }
    }
    return { newBoard, hitMine: true };
  }

  // Flood fill algorithm for empty clusters (0 neighbor mines)
  const queue: Array<{ x: number; y: number }> = [{ x, y }];
  target.revealed = true;

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const currCell = newBoard[curr.y][curr.x];

    if (currCell.neighborMines === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = curr.x + dx;
          const ny = curr.y + dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            const neighbor = newBoard[ny][nx];
            if (!neighbor.revealed && !neighbor.flagged && !neighbor.isMine) {
              neighbor.revealed = true;
              if (neighbor.neighborMines === 0) {
                queue.push({ x: nx, y: ny });
              }
            }
          }
        }
      }
    }
  }

  return { newBoard, hitMine: false };
}

// Chording: Clicking on a revealed number when neighbor flags match number
export function chordCell(
  board: Cell[][],
  x: number,
  y: number,
  cols: number,
  rows: number
): { newBoard: Cell[][]; hitMine: boolean; chorded: boolean } {
  const cell = board[y][x];
  if (!cell.revealed || cell.neighborMines === 0) {
    return { newBoard: board, hitMine: false, chorded: false };
  }

  // Count flagged neighbors
  let flagCount = 0;
  const neighbors: Array<{ x: number; y: number }> = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        neighbors.push({ x: nx, y: ny });
        if (board[ny][nx].flagged) flagCount++;
      }
    }
  }

  if (flagCount !== cell.neighborMines) {
    return { newBoard: board, hitMine: false, chorded: false };
  }

  // Reveal all unflagged neighbors
  let currentBoard = board;
  let hit = false;
  for (const n of neighbors) {
    if (!currentBoard[n.y][n.x].revealed && !currentBoard[n.y][n.x].flagged) {
      const res = revealCell(currentBoard, n.x, n.y, cols, rows);
      currentBoard = res.newBoard;
      if (res.hitMine) {
        hit = true;
        break;
      }
    }
  }

  return { newBoard: currentBoard, hitMine: hit, chorded: true };
}

export function toggleFlag(board: Cell[][], x: number, y: number): Cell[][] {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  const cell = newBoard[y][x];
  if (!cell.revealed) {
    cell.flagged = !cell.flagged;
  }
  return newBoard;
}

export function checkWinCondition(board: Cell[][], totalMines: number, cols: number, rows: number): boolean {
  let unrevealedSafeCells = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = board[y][x];
      if (!cell.isMine && !cell.revealed) {
        unrevealedSafeCells++;
      }
      if (cell.isMine && cell.revealed) {
        return false;
      }
    }
  }
  return unrevealedSafeCells === 0;
}
