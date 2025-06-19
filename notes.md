## ✅ COMPLETED - Two-Move Chess Implementation

**Status: FULLY FUNCTIONAL & PRODUCTION READY**

Successfully built a complete Two-Move Chess game using AI-assisted development.
All critical bugs resolved, fully tested, and deployed to production.

### Final Implementation:
- **Files Created:** `index.html`, `script.js`
- **Libraries Used:** jQuery (required dependency), chess.js, chessboard.js
- **Repository:** https://github.com/rednerrus/two-move-chess
- **Live Site:** https://rednerrus.github.io/two-move-chess/
- **Deployment:** ✅ LIVE on GitHub Pages

### Key Technical Solutions:
1. **jQuery Dependency:** chessboard.js requires jQuery - critical missing piece initially
2. **Piece Images:** Used `https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png` 
3. **Two-Move Logic Fix:** Added `currentDoubleMoveTurn` tracking and FEN manipulation to properly handle turn switching during double moves

### Core Implementation Strategy (SUCCESSFUL):
1.  **✅ Leverage Existing Libraries:** `chess.js` for game logic + `chessboard.js` for UI
2.  **✅ Client-Side Logic:** Pure HTML/CSS/JavaScript - no backend needed
3.  **✅ AI for Scaffolding:** Claude Code generated structure and implemented two-move rule
4.  **✅ Iterative Development:** Fixed issues through debugging (jQuery, piece images, turn logic)

### Completed Priorities:
*   **✅ P0: Playable basic chess on a webpage (hotseat)**
*   **✅ P1: Implement the "two-move" capture rule** 
*   **✅ P2: Game end conditions (checkmate/draw detection)**
*   **✅ P3: Basic UI for status and reset**
*   **✅ P4: Deployment** (live on GitHub Pages)

### Two-Move Rule Implementation:
- Captures trigger `opponentGetsNextDoubleMove = true`
- Turn switching managed via `currentDoubleMoveTurn` and FEN manipulation
- Status displays "1 of 2 moves" / "2 of 2 moves" correctly
- Game logic properly handles consecutive moves for same player

### ✅ DEBUGGING SESSION - Two-Move Logic Fixes
**Date:** 2025-06-19

**Issues Found & Fixed:**
1. **Status Display Bug:** Status was incorrectly showing move counts (showed "2 of 2" when it should show "1 of 2")
   - **Root Cause:** Logic error in `updateStatus()` function checking `movesMadeThisTurn` values
   - **Fix:** Corrected conditional logic in script.js:123-127
   - **Commit:** c0a45e0

2. **Pawn Double Move Turn Switching Bug:** When a player moved a pawn two spaces (or any capture), the turn would incorrectly switch to the opponent instead of allowing the same player to continue their double move
   - **Root Cause:** Status display logic was using `game.turn()` instead of `currentDoubleMoveTurn` during double moves
   - **Fix:** Updated `updateStatus()` function to check `currentDoubleMoveTurn` during double moves
   - **Commit:** cac2f1f (debugging version), 83557fe (clean version)

3. **✅ CRITICAL: Double Move Snapback Issue** - Second move of double move would snap back
   - **Root Cause:** Complex state synchronization issue between custom two-move logic and chess.js turn system
   - **Technical Details:**
     - `onDragStart` was checking `game.turn()` before custom double-move logic
     - En passant squares from pawn two-square moves prevented subsequent moves
     - FEN manipulation required to clear en passant state and set correct turn
   - **Solution:** 
     - Fixed `onDragStart` to prioritize `currentDoubleMoveTurn` over `game.turn()`
     - Added FEN manipulation in `handleTurnEndLogic` to clear en passant and set turn
     - Proper handling of both pawn two-square and regular moves during double turns
   - **Commit:** 9a74b36

4. **GitHub Pages Caching Issue:** Changes weren't reflected on hosted version due to browser caching
   - **Solution:** Hard refresh with Ctrl+Shift+R or use incognito mode
   - **Workflow:** Local changes must be committed and pushed to GitHub for hosted version to update

**✅ FINAL STATUS: FULLY FUNCTIONAL**
- ✅ Two-move rule working correctly for all move types
- ✅ En passant handling during double moves
- ✅ Status display accurate for all game states  
- ✅ No piece snapback issues
- ✅ Clean production code (debugging logs removed)
- ✅ Deployed to GitHub Pages

Here's the plan:

**Phase 1: Foundational Chess Game (Approx 15-20 mins with AI)**

We'll instruct Claude Code to build the basic chess game.

*   **AI Tool:** Claude Code (with your MCP integration)
*   **Goal:** Get a standard chess game working in the browser.

**Instructions for Claude Code (Batch 1):**

```prompt
Objective: Create a simple web-based chess game using HTML, CSS, and JavaScript.
Libraries:
- Use chessboard.js for the visual board (CDN: https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js and https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css)
- Use chess.js for game logic and validation (CDN: https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js)

Requirements:
1.  **HTML (index.html):**
    *   Include a `div` with `id="myBoard"` for the chessboard.
    *   Include a `div` with `id="status"` to display game status (e.g., whose turn, check, checkmate).
    *   Include a `button` with `id="resetButton"` labeled "Reset Game".
    *   Link the chessboard.js CSS and include script tags for chess.js and chessboard.js from CDNs, and a local `script.js`.

2.  **CSS (inline in HTML or `style.css` linked):**
    *   Basic styling to center the board and make status messages clear.
    *   Ensure the board is a reasonable size.

3.  **JavaScript (script.js):**
    *   Initialize `chess.js` instance: `var game = new Chess();`
    *   Initialize `chessboard.js` instance, linking it to the `game` state.
        *   Pieces should be draggable.
        *   Set `pieceTheme` to `img/chesspieces/wikipedia/{piece}.png` (chessboard.js default path, ensure pieces are shown). You might need to tell chessboard.js where to find pieces if it doesn't default correctly.
    *   **Core Game Logic Functions:**
        *   `onDragStart(source, piece, position, orientation)`:
            *   Prevent dragging if game is over, or if it's not the piece's turn, or if the piece color doesn't match the current player's turn.
        *   `onDrop(source, target)`:
            *   Attempt to make the move using `game.move({ from: source, to: target, promotion: 'q' })`. (Default to queen promotion for simplicity).
            *   If the move is illegal, return `'snapback'`.
            *   Update status display.
        *   `onSnapEnd()`:
            *   Update the board position from `game.fen()`.
        *   `updateStatus()`:
            *   Display whose turn it is (White or Black).
            *   Indicate if the current player is in check.
            *   If game over:
                *   Announce checkmate and winner.
                *   Announce stalemate, draw by threefold repetition, insufficient material, etc.
    *   **Reset Button Functionality:**
        *   When "Reset Game" is clicked, call `game.reset()` and update the board and status.
    *   Initial call to `updateStatus()`.

Output:
Provide the content for `index.html` and `script.js`. If CSS is substantial, provide `style.css`.
I will handle getting the piece images if the CDN path for chessboard.js doesn't fetch them automatically (e.g., by downloading them and putting them in an `img/chesspieces/wikipedia/` folder).
```

**Why this approach for Batch 1:**
*   This gets the bulk of standard chess functionality done quickly.
*   `chess.js` handles all complex chess rules, FEN, check/checkmate.
*   `chessboard.js` handles the UI.
*   Claude Code is excellent at integrating libraries and generating this boilerplate.

**Phase 2: Implementing "Two-Move Chess" Logic (Approx 15-20 mins with AI)**

Once we have a working standard chess game, we'll modify it.

*   **AI Tool:** Claude Code
*   **Goal:** Modify the JavaScript to incorporate the two-move rule.

**Instructions for Claude Code (Batch 2 - to modify `script.js` from Batch 1):**

```prompt
Context: We have a working `script.js` from the previous step that implements a standard chess game using `chess.js` and `chessboard.js`. Now, we need to modify it to implement the "Two-Move Chess" rules.

Two-Move Chess Rule:
- If a player captures an opponent's piece, their opponent gets two moves on their *next* turn.
- A player never gets more than two consecutive moves, even if they make multiple captures in their own multi-move turn. The "two-move bonus" is only awarded based on a capture made by the *previous* player.
- The game ends when a king is captured (or checkmated).

Modifications to `script.js`:
1.  **New State Variables:**
    *   `let playerIsOnDoubleMove = false;` (tracks if the current player is currently taking their 1st or 2nd move of a double-move turn)
    *   `let movesMadeThisTurn = 0;`
    *   `let opponentGetsNextDoubleMove = false;` (flag set when a capture occurs, to grant the *other* player a double move on their *actual next turn*)

2.  **Modify `onDrop(source, target)` function:**
    *   After a successful `game.move(moveObject)`:
        *   Let `moveResult = game.move(...)`.
        *   `movesMadeThisTurn++;`
        *   Check if `moveResult.flags` contains 'c' (for capture). If yes, set `opponentGetsNextDoubleMove = true;`.
        *   Call a new function `handleTurnEndLogic()`.

3.  **New Function `handleTurnEndLogic()`:**
    *   This function will decide if the turn switches or if the current player gets another move.
    *   **Game Over Check:**
        *   If `game.game_over()` is true:
            *   Call `updateStatus()` (which should already handle game over messages).
            *   Disable further moves.
            *   Return.
    *   **Check for Second Move:**
        *   If `playerIsOnDoubleMove` is true AND `movesMadeThisTurn < 2`:
            *   It's still the current player's turn (they are taking their second move).
            *   Update status to indicate it's their 2nd move (e.g., "White's 2nd move").
            *   Board interaction should remain enabled for the current player.
        *   Else (turn officially ends for the current player):
            *   `playerIsOnDoubleMove = false;` // Reset for the player whose turn just ended.
            *   The game's turn will already have been switched by `game.move()`.
            *   `movesMadeThisTurn = 0;`
            *   If `opponentGetsNextDoubleMove` is true:
                *   `playerIsOnDoubleMove = true;` // The *new* current player gets a double move.
                *   `opponentGetsNextDoubleMove = false;` // Consume the flag.
            *   Call `updateStatus()`.

4.  **Modify `updateStatus()` function:**
    *   Update status messages to reflect the new state:
        *   If `playerIsOnDoubleMove` and `movesMadeThisTurn === 0`: Indicate "Player X's Turn (1 of 2 moves)".
        *   If `playerIsOnDoubleMove` and `movesMadeThisTurn === 1`: Indicate "Player X's Turn (2 of 2 moves)".
        *   Otherwise, standard turn indication.
    *   The game end condition: `chess.js`'s `game.game_over()` will be true if a king is checkmated. We should also explicitly check if a king has been captured if `chess.js` doesn't end the game on direct king capture (it usually prevents such moves if the king is left in check, but a final capture of the king is effectively a checkmate). *Self-correction: `game.in_checkmate()` is the most reliable. If `game.game_over()` is true and it's not a draw, then it's a win.* Let's rely on `game.in_checkmate()` and other draw conditions from `chess.js`.

5.  **Modify `onDragStart(source, piece, position, orientation)`:**
    *   Ensure this function correctly uses the game state. It should already prevent moving opponent's pieces. The core logic of whose turn it is (White or Black) is managed by `game.turn()`. Our `playerIsOnDoubleMove` logic manages *how many* moves that player gets.

6.  **Initialize Game State:**
    *   Ensure `playerIsOnDoubleMove`, `movesMadeThisTurn`, and `opponentGetsNextDoubleMove` are correctly initialized/reset when the game starts or `resetButton` is clicked.
    *   For reset:
        ```javascript
        // In reset button handler, after game.reset() and board.position(game.fen()):
        playerIsOnDoubleMove = false;
        movesMadeThisTurn = 0;
        opponentGetsNextDoubleMove = false;
        updateStatus();
        ```

Output:
Provide the fully modified `script.js`.
```

**Why this approach for Batch 2:**
*   It clearly defines the new state variables needed.
*   It breaks down the logic modifications into manageable chunks tied to existing functions or new helper functions.
*   The logic for "opponent gets two moves on *their next* turn" is tricky, so `opponentGetsNextDoubleMove` acts as a buffer. `playerIsOnDoubleMove` is for the *active* player's current multi-move sequence.

**Phase 3: Testing, Debugging, and Deployment Prep (Approx 10-15 mins)**

*   **Manual Testing:** Play through scenarios:
    *   No capture -> normal turn.
    *   Capture -> opponent gets two moves.
    *   Player with two moves captures on their first move -> opponent still only gets two moves (not four).
    *   Player with two moves captures on their second move -> opponent gets two moves.
    *   Checkmate.
*   **AI for Debugging:** If issues arise, feed problematic code snippets and observed behavior to Claude Code.
    *   Example prompt: "My `handleTurnEndLogic` isn't correctly giving the second move. Here's the code [snippet] and here's what happens [describe bug]. How can I fix it?"
*   **Deployment:**
    1.  Create a new public repository on GitHub.
    2.  Upload `index.html`, `script.js` (and `style.css` if separate).
    3.  If chessboard.js needs local images, create `img/chesspieces/wikipedia/` and upload standard chess piece images (e.g., `wK.png`, `bP.png`). Many sets are available online or I can provide them. Alternatively, chessboard.js might have a way to point to a different CDN for pieces if the default fails.
    4.  Enable GitHub Pages for the `main` branch in repository settings.

**PRD (Product Requirements Document) - Minimal Version**

**1. Introduction**
   "Two-Move Chess" is a web-based chess variant where capturing an opponent's piece grants the opponent two moves on their subsequent turn. This document outlines the MVP for a playable hotseat version.

**2. Goals**
   *   Create a functional and playable "Two-Move Chess" game.
   *   Deployable as a simple web application.
   *   Demonstrate rapid development leveraging AI.

**3. Game Rules**
   *   Standard chess rules apply for piece movement, check, and checkmate (as per `chess.js`).
   *   **Two-Move Rule:** If Player A captures a piece from Player B, Player B gets to make two consecutive moves on their next turn.
   *   **No Stacking Bonus:** A player never gets more than two consecutive moves per turn, regardless of how many pieces were captured by their opponent or if they make a capture during their own two-move turn. The bonus is granted *for the next turn* based on the *previous opponent's action*.
   *   **Win Conditions:** The game ends when a King is checkmated. (`chess.js` handles this).

**4. Functional Requirements (MVP - Hotseat Play)**
   *   **FR1:** Display an 8x8 chessboard with standard piece setup.
   *   **FR2:** Allow users to move pieces via drag-and-drop.
   *   **FR3:** Enforce legal chess moves and turn order (White, then Black).
   *   **FR4:** Implement the "Two-Move" rule:
        *   FR4.1: Detect piece captures.
        *   FR4.2: Grant the non-capturing player two moves on their subsequent turn.
        *   FR4.3: Manage the execution of one or two moves per player turn based on FR4.2.
   *   **FR5:** Detect and announce checkmate.
   *   **FR6:** Display game status: current player's turn (indicating if it's 1 of 2 or 2 of 2 moves), check, checkmate.
   *   **FR7:** Provide a "Reset Game" button to start a new game.

**5. Technical Stack**
   *   Frontend: HTML, CSS, JavaScript.
   *   Libraries: `chess.js`, `chessboard.js`.
   *   Deployment: GitHub Pages (or similar free static hosting).

**6. Out of Scope (for 50-min MVP)**
   *   Networked multiplayer.
   *   AI opponent.
   *   Advanced UI features (move lists, captured pieces display, highlighting legal moves beyond basic validation).
   *   En passant, castling, pawn promotion variants (use `chess.js` defaults; promotion to Queen is fine).

This plan is ambitious for 50 minutes but focuses AI on the heavy lifting. The key is clear, iterative prompting and relying on the power of the chosen libraries. Let's get started! I'm ready when you are to feed the first batch of instructions to Claude Code.