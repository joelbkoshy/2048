import React from 'react';
import { Board } from './components/Board';
import { ScoreBoard } from './components/ScoreBoard';
import './App.css'

const App: React.FC = () => {
    return (
        <div className='gameMainContainer'>
            <header className='gameHeader'>
                <h1 className='gameTitle'>2048</h1>
                <ScoreBoard />
            </header>
            <main className='boardContainer'>
                <Board />
            </main>
        </div>
    );
};

export default App;
