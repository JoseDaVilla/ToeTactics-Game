import { useState } from 'react';
import './App.css';
import confetti from 'canvas-confetti';

const TURNS = {
  X: '⨉',
  O: '○',
};

const Square = ({ children, isSelected, updateBoard, index, turn, isWinningCombo }) => {
  const className = `square ${isSelected ? 'is-selected' : ''} ${turn === TURNS.X ? 'turn-x' : 'turn-o'} ${isWinningCombo ? 'win-square' : ''}`;

  const handleClick = () => {
    updateBoard(index);
  };

  return (
    <div
      onClick={handleClick}
      className={className}
      aria-label={children ? `Occupied by ${children}` : 'Empty'}
      role="button"
    >
      {children}
    </div>
  );
};

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const ScoreBar = ({ xWins, oWins }) => {
  return (
    <header className="scorebar">
      <h2>Score</h2>
      <div>
        <span className="score">{TURNS.X} : {xWins}</span>
        <span className="score">{TURNS.O} : {oWins}</span>
      </div>
    </header>
  );
};

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.X);
  const [winner, setWinner] = useState(null);
  const [winningCombo, setWinningCombo] = useState([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);

  // Estado para el tema (oscuro/claro)
  const [isDarkMode, setIsDarkMode] = useState(false);

  const checkWinner = (boardToCheck) => {
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (boardToCheck[a] && boardToCheck[a] === boardToCheck[b] && boardToCheck[a] === boardToCheck[c]) {
        setWinningCombo(combo);
        return boardToCheck[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    setWinningCombo([]);
    setShowWinnerModal(false);
  };

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null);
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti({
        particleCount: 200,
        spread: 200,
        origin: { y: 0.6 },
        shapes: ['star'],
        colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
      });
      setWinner(newWinner);
      if (newWinner === TURNS.X) setXWins(xWins + 1);
      if (newWinner === TURNS.O) setOWins(oWins + 1);

      setTimeout(() => setShowWinnerModal(true), 1000);
    } else if (checkEndGame(newBoard)) {
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.6 },
        shapes: ['star'],
        colors: ['FF3D00', 'FF6F00', 'D65D00', 'FF6F60', 'FFB8B0']
      });
      setWinner(false);
      setTimeout(() => setShowWinnerModal(true), 500);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <main className={`board-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="board">
        <h1>ToeTactics ⚔️</h1>
        <ScoreBar xWins={xWins} oWins={oWins} />
        <button className='mode-button' onClick={toggleDarkMode}>
          {isDarkMode ? '🌞 Light Mode' : '🌚 Dark Mode'}
        </button>
        <button onClick={resetGame}>Start Again</button>


        <section className="game">
          {board.map((cell, index) => (
            <Square
              key={index}
              index={index}
              updateBoard={updateBoard}
              turn={board[index]}
              isWinningCombo={winningCombo.includes(index)}
            >
              {board[index]}
            </Square>
          ))}
        </section>

        <section className="turn">
          <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
          <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
        </section>

        {winner !== null && showWinnerModal && (
          <section className="winner">
            <div className="text">
              <h2>{winner === false ? 'Draw' : 'Winner:'}</h2>
              <header className="win">
                {winner && <Square>{winner}</Square>}
              </header>
              <footer>
                <button onClick={resetGame}>Start Again</button>
              </footer>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
