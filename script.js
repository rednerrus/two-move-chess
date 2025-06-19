// Initialize chess game
var game = new Chess();
var board = null;

// Two-move chess state variables
let playerIsOnDoubleMove = false;
let movesMadeThisTurn = 0;
let opponentGetsNextDoubleMove = false;
let currentDoubleMoveTurn = null; // 'w' or 'b' - tracks who is on double move

// Initialize the chessboard
function initBoard() {
    var config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: 'img/chesspieces/cburnett/{piece}.svg'
    };
    board = Chessboard('myBoard', config);
}

// Prevent dragging pieces when it's not legal
function onDragStart(source, piece, position, orientation) {
    
    // Don't pick up pieces if the game is over
    if (game.game_over()) return false;

    var pieceColor = piece.charAt(0); // 'w' or 'b'

    if (playerIsOnDoubleMove) {
        // If it's a double move, the currentDoubleMoveTurn variable is king
        if (currentDoubleMoveTurn === 'w' && pieceColor === 'b') return false;
        if (currentDoubleMoveTurn === 'b' && pieceColor === 'w') return false;
    } else {
        // Normal turn, use game.turn()
        if (game.turn() === 'w' && pieceColor === 'b') return false;
        if (game.turn() === 'b' && pieceColor === 'w') return false;
    }

    return true; // Explicitly return true if no conditions prevent dragging
}

// Handle piece drops
function onDrop(source, target) {
    
    // See if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote to queen for simplicity
    });

    // Illegal move
    if (move === null) return 'snapback';


    // Increment moves made this turn
    movesMadeThisTurn++;
    
    // Check if this move was a capture
    if (move.flags && move.flags.includes('c')) {
        opponentGetsNextDoubleMove = true;
    }

    // Handle turn end logic
    handleTurnEndLogic(move);
}

// Update board position after piece snap
function onSnapEnd() {
    board.position(game.fen());
}

// Handle turn end logic for two-move chess
function handleTurnEndLogic(move) {
    // Check if game is over
    if (game.game_over()) {
        updateStatus();
        return;
    }

    // Handle first move of double move - critical en passant and turn management
    if (playerIsOnDoubleMove && movesMadeThisTurn === 1) {

        const PAWN_TWO_SQUARE_FLAG = 'b';
        if (move.flags.includes(PAWN_TWO_SQUARE_FLAG)) {
            // Get FEN and clear en passant square + set correct turn
            let fen = game.fen();
            let parts = fen.split(" ");
            parts[3] = '-'; // Clear en passant square
            parts[1] = currentDoubleMoveTurn; // Set correct turn
            game.load(parts.join(" "));
        } else {
            // Fix turn for non-pawn moves
            let fen = game.fen();
            let parts = fen.split(" ");
            parts[1] = currentDoubleMoveTurn;
            game.load(parts.join(" "));
        }

        
        updateStatus();
        return;
    }

    // Handle second move of double move - end the double move
    if (playerIsOnDoubleMove && movesMadeThisTurn === 2) {
        playerIsOnDoubleMove = false;
        movesMadeThisTurn = 0;
        currentDoubleMoveTurn = null;
        // chess.js has already flipped the turn to the opponent, which is correct here
    }

    // Normal turn end - reset for next player
    if (!playerIsOnDoubleMove) {
        movesMadeThisTurn = 0;
    }
    currentDoubleMoveTurn = null;

    // Check if the opponent should get a double move next
    if (opponentGetsNextDoubleMove) {
        playerIsOnDoubleMove = true;
        currentDoubleMoveTurn = game.turn();
        opponentGetsNextDoubleMove = false;
    }

    updateStatus();
}

// Update game status display
function updateStatus() {
    var status = '';
    var moveColor = 'White';
    
    // During a double move, show the color of the player on the double move
    if (playerIsOnDoubleMove && currentDoubleMoveTurn) {
        moveColor = currentDoubleMoveTurn === 'w' ? 'White' : 'Black';
    } else {
        moveColor = game.turn() === 'w' ? 'White' : 'Black';
    }

    // Check for game over conditions
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    } else if (game.in_draw()) {
        status = 'Game over, drawn position';
    } else {
        // Game still on - show appropriate status for two-move chess
        if (playerIsOnDoubleMove) {
            if (movesMadeThisTurn === 1) {
                status = moveColor + ' to move (2 of 2 moves)';
            } else {
                status = moveColor + ' to move (1 of 2 moves)';
            }
        } else {
            status = moveColor + ' to move';
        }

        // Check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check';
        }
    }

    document.getElementById('status').innerHTML = status;
}

// Reset game
function resetGame() {
    game.reset();
    board.position('start');
    
    // Reset two-move chess state
    playerIsOnDoubleMove = false;
    movesMadeThisTurn = 0;
    opponentGetsNextDoubleMove = false;
    currentDoubleMoveTurn = null;
    
    updateStatus();
}

// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const themeButton = document.getElementById('themeToggle');
    const isDark = document.body.classList.contains('dark-theme');
    
    themeButton.innerHTML = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    
    // Save theme preference to localStorage
    localStorage.setItem('chess-theme', isDark ? 'dark' : 'light');
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('chess-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggle').innerHTML = '☀️ Light Mode';
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initBoard();
    updateStatus();
    
    // Add event listeners
    document.getElementById('resetButton').addEventListener('click', resetGame);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});