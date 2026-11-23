# Six Seeds Game
Six Seeds Game, a classic village game from Bangladesh, now on your screen. Six seeds, one board, and one goal: capture them all.

A two-player (or vs computer) bead-capture board game built with React + Vite.

## Run it
```
npm install
npm run dev
```
Open the address Vite prints (usually http://localhost:5173).

## Build for production
```
npm run build
```
The output goes to `dist/`.

## Project structure
- `src/game.js`   – pure game logic (board, rules, chain captures, computer player)
- `src/App.jsx`   – game state, modes, computer turn timer
- `src/Board.jsx` – SVG board drawing
- `src/Result.jsx`– winner dashboard
- `src/styles.css`– styling (light/dark mode)

## Rules
Move a bead along a line to an empty neighbouring point, or jump over an adjacent
opponent bead into the empty point behind it to capture it. After a capture the same
bead must keep jumping if it can. Capture all 6 enemy beads to win.
