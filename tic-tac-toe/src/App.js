import React from 'react';
import './App.css';

function useLocalStorageState(
  key,
  defaultValue ='',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage){
      return deserialize(valueInLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const PrevKey = prevKeyRef.current
    if (PrevKey !== key) {
      window.localStorage.removeItem(PrevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])
  
  return [state, setState]
}

export {useLocalStorageState}

function Board() {
  const [squares, setSquares] = React.useState(Array(9).fill(null))

  const nextValue = calculateNextValue(squares)
  const Winner = calculateWinner(squares)
  const status = calculateStatus(Winner, squares, nextValue)

  function selectSquare(square) {
    if (Winner || squares[square]) {
      return
  }
  const squaresCopy = [...squares]
  squaresCopy[square] = nextValue
  setSquares(squaresCopy)
  }

  function restart() {
    setSquares(Array(9).fill(null))
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}
  
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: {winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next Player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}
  
function calculateWinner(squares) {
  const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 6],
  [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App