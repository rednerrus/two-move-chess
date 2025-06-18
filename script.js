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
    
    console.log('Move made:', move.san, 'movesMadeThisTurn:', movesMadeThisTurn, 'playerIsOnDoubleMove:', playerIsOnDoubleMove);

    // Check if this move was a capture
    if (move.flags && move.flags.includes('c')) {
        opponentGetsNextDoubleMove = true;
        console.log('Capture detected, opponent gets double move');
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

    // Check if current player is on a double move and hasn't used both moves yet
    if (playerIsOnDoubleMove && movesMadeThisTurn < 2) {
        console.log('Player continues double move, moves made:', movesMadeThisTurn);
        // Player gets another move - switch turn back to them
        var fen = game.fen();
        var fenParts = fen.split(' ');
        // Switch the active color back to the double-move player
        fenParts[1] = currentDoubleMoveTurn;
        game.load(fenParts.join(' '));
        updateStatus();
        return;
    }

    // Turn officially ends - reset for next player
    movesMadeThisTurn = 0;
    playerIsOnDoubleMove = false;
    currentDoubleMoveTurn = null;

    // Check if the opponent should get a double move next
    if (opponentGetsNextDoubleMove) {
        playerIsOnDoubleMove = true;
        currentDoubleMoveTurn = game.turn(); // Current turn after the move
        opponentGetsNextDoubleMove = false;
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