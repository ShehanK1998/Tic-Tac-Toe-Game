const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const difficultySelect = document.getElementById('difficulty');

let currentPlayer = 'X'; // 'X' is the player, 'O' is the computer
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let difficulty = 'easy';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = clickedCell.getAttribute('data-index');

    if (gameState[clickedCellIndex] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    if (checkWin()) {
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
    } else if (gameState.every(cell => cell !== '')) {
        statusDisplay.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = 'O'; // Switch to computer's turn
        statusDisplay.textContent = `Computer's turn (O)`;
        setTimeout(computerMove, 500); // Delay computer move for a more natural effect
    }
}

function computerMove() {
    let move;
    if (difficulty === 'easy') {
        move = getRandomMove();
    } else if (difficulty === 'medium') {
        // 50% chance to use Minimax, 50% random
        move = Math.random() < 0.5 ? getRandomMove() : getBestMove();
    } else {
        // Hard difficulty: always use Minimax
        move = getBestMove();
    }

    gameState[move] = 'O';
    cells[move].textContent = 'O';

    if (checkWin()) {
        statusDisplay.textContent = `Computer wins!`;
        gameActive = false;
    } else if (gameState.every(cell => cell !== '')) {
        statusDisplay.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = 'X'; // Switch back to player's turn
        statusDisplay.textContent = `Your turn (X)`;
    }
}

function getRandomMove() {
    let emptyCells = gameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getBestMove() {
    return minimax(gameState, 'O').index;
}

function minimax(newGameState, player) {
    const availableMoves = newGameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

    if (checkWinState(newGameState, 'X')) {
        return { score: -10 };
    } else if (checkWinState(newGameState, 'O')) {
        return { score: 10 };
    } else if (availableMoves.length === 0) {
        return { score: 0 };
    }

    let moves = [];

    availableMoves.forEach(move => {
        let moveData = {};
        moveData.index = move;
        newGameState[move] = player;

        if (player === 'O') {
            let result = minimax(newGameState, 'X');
            moveData.score = result.score;
        } else {
            let result = minimax(newGameState, 'O');
            moveData.score = result.score;
        }

        newGameState[move] = '';
        moves.push(moveData);
    });

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(move => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }

    return bestMove;
}

function checkWin() {
    return checkWinState(gameState, currentPlayer);
}

function checkWinState(boardState, player) {
    return winningConditions.some(condition => {
        return condition.every(index => boardState[index] === player);
    });
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusDisplay.textContent = `Your turn (X)`;
    cells.forEach(cell => (cell.textContent = ''));
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value;
    resetGame();
});
