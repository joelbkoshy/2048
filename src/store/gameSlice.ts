import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameState } from '../types/types';
import {
    createEmptyBoard,
    addRandomTile,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    canMove,
} from '../utils/boardUtils';

const DEFAULT_SIZE = 4;

const initialState: GameState = {
    board: addRandomTile(addRandomTile(createEmptyBoard(DEFAULT_SIZE))),
    score: 0,
    bestScore: 0,
    gameOver: false,
    gameWon: false,
    size: DEFAULT_SIZE,
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        restartGame(state, action: PayloadAction<number | undefined>) {
            const size = action.payload ?? state.size;
            state.size = size;
            state.board = addRandomTile(addRandomTile(createEmptyBoard(size)));
            state.score = 0;
            state.gameOver = false;
            state.gameWon = false;
        },

        setBoardSize(state, action: PayloadAction<number>) {
            const size = action.payload;
            state.size = size;
            state.board = addRandomTile(addRandomTile(createEmptyBoard(size)));
            state.score = 0;
            state.gameOver = false;
            state.gameWon = false;
        },

        move(state, action: PayloadAction<'up' | 'down' | 'left' | 'right'>) {
            if (state.gameOver) return;

            let result: { board: typeof state.board; score: number; moved: boolean } = {
                board: state.board,
                score: 0,
                moved: false,
            };

            switch (action.payload) {
                case 'left':
                    result = moveLeft(state.board);
                    break;
                case 'right':
                    result = moveRight(state.board);
                    break;
                case 'up':
                    result = moveUp(state.board);
                    break;
                case 'down':
                    result = moveDown(state.board);
                    break;
            }

            if (result.moved) {
                // add a new tile after a successful move
                state.board = addRandomTile(result.board);
                state.score += result.score;
                if (state.board.flat().includes(2048)) state.gameWon = true;
                // Game over if no possible moves remain
                state.gameOver = !canMove(state.board);
            }

            if (state.score > state.bestScore) {
                state.bestScore = state.score;
            }

        },
    },
});

export const { restartGame, move, setBoardSize } = gameSlice.actions;
export default gameSlice.reducer;
