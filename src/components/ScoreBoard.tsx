import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { restartGame, setBoardSize } from '../store/gameSlice';

export const ScoreBoard: React.FC = () => {
    const { score, bestScore, gameOver, gameWon, size } = useSelector(
        (state: RootState) => state.game
    );
    const dispatch = useDispatch();
    const [customSize, setCustomSize] = useState(size.toString());
    const [error, setError] = useState<string | null>(null);

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomSize(value);
        setError(null);
    };

    const applyCustomSize = () => {
        const newSize = parseInt(customSize, 10);
        if (!isNaN(newSize) && newSize >= 2 && newSize <= 10) {
            dispatch(setBoardSize(newSize));
            setError(null);
        } else {
            setError('⚠️ Please enter a valid board size between 2 and 10.');
        }
    };

    const handleRestart = () => {
        dispatch(restartGame(size));
        setError(null);
    };

    return (
        <div
            style={{
                marginBottom: '24px',
                textAlign: 'center',
                background: '#fffaf1',
                padding: '20px 28px',
                borderRadius: '16px',
                boxShadow: '4px 6px #000000',
                border: '2px solid #000000',
                display: 'inline-block',
            }}
        >
            <h2 style={{ margin: '0 0 12px', color: '#6c675d' }}>Score: {score}</h2>
            <h2 style={{ margin: '0 0 12px', color: '#6c675d' }}>Best: {bestScore}</h2>

            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="boardSize" style={{ color: '#6c675d', marginRight: '8px' }}>
                    Board Size:
                </label>
                <input
                    type="number"
                    id="boardSize"
                    value={customSize}
                    onChange={handleSizeChange}
                    min={2}
                    max={10}
                    style={{
                        width: '70px',
                        padding: '6px',
                        borderRadius: '6px',
                        border: '1px solid #aaa',
                        textAlign: 'center',
                        marginRight: '8px',
                    }}
                />
                <button
                    onClick={applyCustomSize}
                    style={{
                        backgroundColor: '#7b2f23',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9c3c2b')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7b2f23')}
                >
                    Apply
                </button>
            </div>

            {error && (
                <p style={{ color: '#b44a32', fontSize: '0.9rem', margin: '6px 0 0' }}>{error}</p>
            )}

            {gameWon && (
                <h3 style={{ color: '#ffcf3f', marginTop: '12px' }}>🎉 You Won! 🎉</h3>
            )}
            {gameOver && (
                <h3 style={{ color: '#b44a32', marginTop: '12px' }}>Game Over 😢</h3>
            )}

            <button
                onClick={handleRestart}
                style={{
                    marginTop: '16px',
                    backgroundColor: '#213547',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#324b6a')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#213547')}
            >
                Restart
            </button>
        </div>
    );
};
