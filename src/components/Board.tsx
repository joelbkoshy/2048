import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { move } from '../store/gameSlice';
import './Board.css';

export const Board: React.FC = () => {
    const { board, size } = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch();
    const boardRef = useRef<HTMLDivElement>(null);

    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

    // Keyboard movement
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const keyMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
            ArrowUp: 'up',
            ArrowDown: 'down',
            ArrowLeft: 'left',
            ArrowRight: 'right',
        };
        if (keyMap[e.key]) {
            e.preventDefault();
            dispatch(move(keyMap[e.key]));
        }
    };

    // Pointer or touch start
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    // Pointer or touch end (detect swipe direction)
    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!startPos) return;

        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (Math.max(absX, absY) > 30) {
            if (absX > absY) {
                dispatch(move(dx > 0 ? 'right' : 'left'));
            } else {
                dispatch(move(dy > 0 ? 'down' : 'up'));
            }
        }

        setStartPos(null);
    };

    // Auto-focus for keyboard input
    useEffect(() => {
        if (boardRef.current) {
            boardRef.current.focus();
        }
    }, [boardRef]);

    const cellSize = 80 - size * 5;

    return (
        <div
            ref={boardRef}
            className="board"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            style={{ touchAction: 'none' }} // prevents scroll on mobile
        >
            {board.map((row, i) => (
                <div key={i} className="row">
                    {row.map((cell, j) => (
                        <div
                            key={j}
                            className={`cell cell-${cell || 0}`}
                            style={{
                                width: `${cellSize}px`,
                                height: `${cellSize}px`,
                                fontSize: `${Math.max(10, 30 - size)}px`,
                            }}
                        >
                            {cell !== 0 ? cell : ''}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
