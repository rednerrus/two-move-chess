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
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    };
    board = Chessboard('myBoard', config);
}

// Prevent dragging pieces when it's not legal
function onDragStart(source, piece, position, orientation) {
    // Don't pick up pieces if the game is over
    if (game.game_over()) return false;

    // Only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
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
    handleTurnEndLogic();
}

// Update board position after piece snap
function onSnapEnd() {
    board.position(game.fen());
}

// Handle turn end logic for two-move chess
function handleTurnEndLogic() {
    // Check if game is over
    if (game.game_over()) {
        updateStatus();
        return;
    }

    // Get the current turn (after the move was made)
    var currentTurn = game.turn();
    
    // Check if we're in a double move scenario
    if (playerIsOnDoubleMove && currentDoubleMoveTurn && movesMadeThisTurn < 2) {
        // Player should get another move - we need to switch back to them
        var tempGame = new Chess(game.fen());
        // Switch turn back to the double-move player
        if (currentDoubleMoveTurn === 'w') {
            tempGame.load(game.fen().replace(' b ', ' w '));
        } else {
            tempGame.load(game.fen().replace(' w ', ' b '));
        }
        game = tempGame;
        updateStatus();
        return;
    }

    // Turn officially ends
    movesMadeThisTurn = 0;
    currentDoubleMoveTurn = null;

    // Check if the NEW current player should get a double move
    if (opponentGetsNextDoubleMove) {
        playerIsOnDoubleMove = true;
        currentDoubleMoveTurn = currentTurn;
        opponentGetsNextDoubleMove = false;
    } else {
        playerIsOnDoubleMove = false;
    }

    updateStatus();
}

// Update game status display
function updateStatus() {
    var status = '';
    var moveColor = 'White';
    
    if (game.turn() === 'b') {
        moveColor = 'Black';
    }

    // Check for game over conditions
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    } else if (game.in_draw()) {
        status = 'Game over, drawn position';
    } else {
        // Game still on - show appropriate status for two-move chess
        if (playerIsOnDoubleMove) {
            if (movesMadeThisTurn === 0) {
                status = moveColor + ' to move (1 of 2 moves)';
            } else if (movesMadeThisTurn === 1) {
                status = moveColor + ' to move (2 of 2 moves)';
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

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initBoard();
    updateStatus();
    
    // Add reset button event listener
    document.getElementById('resetButton').addEventListener('click', resetGame);
});