export type TileValue = number | null;
export type Board = TileValue[][];

export interface GameState {
    board: Board;
    score: number;
    bestScore: number;
    gameOver: boolean;
    gameWon: boolean;
    size: number; // <= dynamic size support
}
