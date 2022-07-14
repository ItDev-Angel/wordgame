import { useState , useEffect} from 'react'
import './App.css'

const API_URL = 'https://api.frontendexpert.io/api/fe/wordle-words';
const WORD_LENGHT = 5; 

export default function App() {
  const [solution, setSolution] = useState('worms');
  const [guesses, setGuesses] = useState(Array(6).fill(null ));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver) {return;}

      if (event.key === 'Enter') {
        if(currentGuess.length !== 5){
          return;
        }
        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex(val => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess('');

        const isCorrect = solution === currentGuess; 
        if (isCorrect) { 
          setIsGameOver(true);
        }
      }
      if (event.key === 'Backspace'){
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }
      if (currentGuess.length >= 5){
        return; 
      }
    
        setCurrentGuess(oldGuess => oldGuess + event.key);
    };  
    
    window.addEventListener('keydown', handleType);
    return () => window.removeEventListener('keydown', handleType);
  },[currentGuess, isGameOver, solution, guesses]);

  useEffect(() => {
      const fetchWord = async () => {
      const response = await fetch(API_URL);
      const words = await response.json();
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setSolution(randomWord);
    };
    fetchWord();
  },[]);

  return (
    <div className="board">
    <h1>Word-Game</h1>
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex(val => val == null);
        return (
          <Line 
          guess={isCurrentGuess ? currentGuess : guess ?? "" } 
          isFinal={!isCurrentGuess && guess != null }
          solution={solution} 
          />
          );
        })}
    <div className="rules">
      <p className="center">Guess word with 5 letters</p>
      <p className="center">---Rules----</p>
      <p>Write a word with 5 letters on the keyboard</p>
      <p className="green">GREEN - letter matched</p>
      <p className="gray">GRAY - no matching letters</p>
      <p className="yellow">YELLOW - letter matched, but sequence of letters in a word did not match</p>
    </div>
    
    </div>
  );
}
  function Line({guess, isFinal, solution}) {
    const tiles = [];

    for (let i = 0; i < WORD_LENGHT; i++) {
      const char = guess[i];
      let className = 'tile';
      if(isFinal) {  
        if (char === solution[i]) {
          className += ' correct';
        }
        else if (solution.includes(char)){
          className += ' close';
        } else {
          className += ' incorrect';
        }
      }
      tiles.push(
      <div key={i} className={className}>
      {char}
      </div>
      );
    }
    return <div className="line">{tiles}</div>;
  }