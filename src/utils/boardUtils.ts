import type { Board, TileValue } from '../types/types';

/**
 * Helpers for board operations.
 * - Pure functions (no side effects)
 * - Works for any NxN board
 */

/** Create an empty board */
export const createEmptyBoard = (size: number): Board =>
  Array.from({ length: size }, () => Array<TileValue>(size).fill(null));

/** Add a random tile (2 with 90% or 4 with 10%) at a random empty spot */
export const addRandomTile = (board: Board): Board => {
  const empty: [number, number][] = [];
  board.forEach((r, i) => r.forEach((c, j) => { if (c === null) empty.push([i, j]); }));
  if (empty.length === 0) return board;
  const [i, j] = empty[Math.floor(Math.random() * empty.length)];
  const copy = board.map(row => [...row]);
  copy[i][j] = Math.random() < 0.9 ? 2 : 4;
  return copy;
};

/** Compress a row left (remove nulls), e.g. [2,null,2,4] -> [2,2,4] */
const compressRow = (row: TileValue[]): number[] =>
  row.filter((v): v is number => v !== null) as number[];

/** Merge a compressed left row (numbers only), returning merged row and score gained */
const mergeCompressedRow = (nums: number[], length: number): { row: TileValue[]; score: number } => {
  const merged: TileValue[] = [];
  let score = 0;
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const newValue = nums[i] * 2;
      merged.push(newValue);
      score += newValue;
      i += 2;
    } else {
      merged.push(nums[i]);
      i += 1;
    }
  }
  // pad with nulls to restore length
  while (merged.length < length) merged.push(null);
  return { row: merged, score };
};

/** Move a single row left (handles compress + merge + pad) */
export const moveRowLeft = (row: TileValue[]) => {
  const nums = compressRow(row);
  return mergeCompressedRow(nums, row.length);
};

/** Move a row right by reversing, using left logic, then reversing back */
export const moveRowRight = (row: TileValue[]) => {
  const reversed = [...row].reverse();
  const { row: moved, score } = moveRowLeft(reversed);
  return { row: moved.reverse(), score };
};

/** Transpose board (rows <-> cols) */
export const transpose = (board: Board): Board => {
  const n = board.length;
  const t: Board = createEmptyBoard(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      t[j][i] = board[i][j];
    }
  }
  return t;
};

/** Move whole board left (apply moveRowLeft to each row) */
export const moveLeft = (board: Board): { board: Board; score: number; moved: boolean } => {
  let moved = false;
  let totalScore = 0;
  const newBoard = board.map((row) => {
    const { row: newRow, score } = moveRowLeft(row);
    if (!rowsEqual(row, newRow)) moved = true;
    totalScore += score;
    return newRow;
  });
  return { board: newBoard, score: totalScore, moved };
};

/** Move right */
export const moveRight = (board: Board) => {
  let moved = false;
  let totalScore = 0;
  const newBoard = board.map((row) => {
    const { row: newRow, score } = moveRowRight(row);
    if (!rowsEqual(row, newRow)) moved = true;
    totalScore += score;
    return newRow;
  });
  return { board: newBoard, score: totalScore, moved };
};

/** Move up = transpose -> moveLeft -> transpose */
export const moveUp = (board: Board) => {
  const t = transpose(board);
  const { board: movedT, score, moved } = moveLeft(t);
  return { board: transpose(movedT), score, moved };
};

/** Move down = transpose -> moveRight -> transpose */
export const moveDown = (board: Board) => {
  const t = transpose(board);
  const { board: movedT, score, moved } = moveRight(t);
  return { board: transpose(movedT), score, moved };
};

/** Utility: compare rows (tile-by-tile) */
const rowsEqual = (a: TileValue[], b: TileValue[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};

/** Check if any move is possible:
 * - If any cell is null => can move
 * - If any adjacent horizontal or vertical pair equals => can move
 */
export const canMove = (board: Board): boolean => {
  const n = board.length;
  // any empty?
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === null) return true;
    }
  }
  // any horizontal adjacent equal?
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - 1; j++) {
      if (board[i][j] === board[i][j + 1]) return true;
    }
  }
  // any vertical adjacent equal?
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n - 1; i++) {
      if (board[i][j] === board[i + 1][j]) return true;
    }
  }
  return false;
};
