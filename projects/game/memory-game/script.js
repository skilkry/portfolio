// Variables globales
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let moves = 0;
let timer = null;
let seconds = 0;
let minutes = 0;
let isPlaying = false;
let difficulty = 'easy';
let difficultySettings = {
    easy: { pairs: 6, columns: 3 },
    medium: { pairs: 8, columns: 4 },
    hard: { pairs: 12, columns: 4 }
};

// Elementos del DOM
const gameBoard = document.getElementById('game-board');
const startBtn = document.getElementById('start-btn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
const winModal = document.getElementById('win-modal');
const finalTimeDisplay = document.getElementById('final-time');
const finalMovesDisplay = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');



const emojis = ['🚀', '👾', '💕', '👽', '🎮', '💻', '🔮', '🎲', '🐣', '🎧', '📱', '🦥', '🖥️', '🕹️', '🙂‍↕️', '🛸'];


document.addEventListener('DOMContentLoaded', () => {

    startBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', resetGame);
    

    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
  
            difficultyBtns.forEach(b => b.classList.remove('active'));
            
      
            btn.classList.add('active');
            
           
            difficulty = btn.dataset.difficulty;
            console.log("Dificultad cambiada a:", difficulty);
            
        
            if (isPlaying) {
                resetGame();
                startGame();
            } else {
            
                updateBoardLayout();
            }
        });
    });
    
  
    updateBoardLayout();
});


function startGame() {
    if (isPlaying) return;
    
    isPlaying = true;
    moves = 0;
    seconds = 0;
    minutes = 0;
    matchedPairs = 0;
    flippedCards = [];
    
    // Actualizar displays
    movesDisplay.textContent = moves;
    timeDisplay.textContent = '00:00';
    

    totalPairs = difficultySettings[difficulty].pairs;
    

    generateCards();
    

    startTimer();
    
    // Cambiar texto del botón
    startBtn.textContent = 'Reset Game';
    startBtn.removeEventListener('click', startGame);
    startBtn.addEventListener('click', resetGame);
}

// Función para generar las cartas
function generateCards() {
    // Limpiar el tablero
    gameBoard.innerHTML = '';
    
    // Seleccionar emojis aleatorios según la dificultad
    const selectedEmojis = [...emojis]
        .sort(() => Math.random() - 0.5)
        .slice(0, totalPairs);
    
    // Crear array de pares
    cards = [...selectedEmojis, ...selectedEmojis]
        .sort(() => Math.random() - 0.5);
    
    // Actualizar layout del tablero
    updateBoardLayout();
    
  
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        
      
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = emoji;
        
       
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        

        card.addEventListener('click', () => flipCard(card, index));
        
   
        gameBoard.appendChild(card);
        

        card.style.transformStyle = 'preserve-3d';
    });
    

    const allCards = document.querySelectorAll('.card');
    allCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, index * 50);
    });
}

function updateBoardLayout() {

    if (!difficultySettings[difficulty]) {
        console.error("Dificultad no válida:", difficulty);
        difficulty = 'easy'; 
    }
    
    const columns = difficultySettings[difficulty].columns;
    console.log("Actualizando layout a", columns, "columnas para dificultad", difficulty);
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

// Función para voltear una carta
function flipCard(card, index) {
    // Verificar si el juego está en curso y si la carta ya está volteada o emparejada
    if (!isPlaying || flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    

    flippedCards.push({ card, index });
    

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        
        const [card1, card2] = flippedCards;
        
        if (cards[card1.index] === cards[card2.index]) {

            matchedPairs++;
            
        
            setTimeout(() => {
                card1.card.classList.add('matched');
                card2.card.classList.add('matched');
                
                // Efecto de brillo
                card1.card.style.boxShadow = '0 0 15px rgba(147, 51, 255, 0.8)';
                card2.card.style.boxShadow = '0 0 15px rgba(147, 51, 255, 0.8)';
                
                // Reiniciar flippedCards
                flippedCards = [];
                
                // Verificar si se completó el juego
                if (matchedPairs === totalPairs) {
                    gameCompleted();
                }
            }, 500);
        } else {
         
            setTimeout(() => {
                card1.card.classList.remove('flipped');
                card2.card.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }
}


function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        
  
        const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
        timeDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}


function resetGame() {

    stopTimer();
    

    isPlaying = false;
    moves = 0;
    seconds = 0;
    minutes = 0;
    matchedPairs = 0;
    flippedCards = [];
    
 
    movesDisplay.textContent = moves;
    timeDisplay.textContent = '00:00';
    
  
    startBtn.textContent = 'Start Game';
    startBtn.removeEventListener('click', resetGame);
    startBtn.addEventListener('click', startGame);

    winModal.classList.remove('show');
    
 
    gameBoard.innerHTML = '';
    updateBoardLayout();
}


function gameCompleted() {
    // Detener temporizador
    stopTimer();
    isPlaying = false;
    
   
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
    finalTimeDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
    finalMovesDisplay.textContent = moves;

    setTimeout(() => {
        winModal.classList.add('show');
    }, 1000);
    
    
    saveBestScore();
}


function saveBestScore() {
    const totalTime = minutes * 60 + seconds;
    const currentScore = {
        difficulty,
        time: totalTime,
        moves: moves,
        date: new Date().toISOString()
    };
    
    
    let scores = JSON.parse(localStorage.getItem('memoryGameScores')) || {};
    
 
    if (!scores[difficulty]) {
        scores[difficulty] = [];
    }
    

    scores[difficulty].push(currentScore);
    

    scores[difficulty].sort((a, b) => {
        if (a.time === b.time) {
            return a.moves - b.moves;
        }
        return a.time - b.time;
    });
    
    
    scores[difficulty] = scores[difficulty].slice(0, 5);
    
   
    localStorage.setItem('memoryGameScores', JSON.stringify(scores));
}


document.addEventListener('mousemove', (e) => {
    if (!isPlaying) return;
    
 
    const x = e.clientX;
    const y = e.clientY;
    

    if (Math.random() > 0.9) {
        const particle = document.createElement('div');
        particle.classList.add('cursor-particle');
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        document.body.appendChild(particle);
        
   
        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = `translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px) scale(0)`;
            setTimeout(() => {
                document.body.removeChild(particle);
            }, 1000);
        }, 10);
    }

    if(isPlaying){
        footer.classList.add('show');
    }else{
        footer.classList.remove('show');
    }

});