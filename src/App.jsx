import { useState, useEffect } from "react";
import Board from "./Board.jsx";
import Result from "./Result.jsx";
import { init, applyMove, aiPick, movesFrom, count, name } from "./game.js";

export default function App() {
  const [g, setG] = useState(init);        // whole game state
  const [mode, setMode] = useState(1);     // 1 = vs computer, 2 = two players
  const [hidden, setHidden] = useState(false); // result card dismissed

  const reset = () => { setG(init()); setHidden(false); };

  // Computer plays Blue after a short delay
  useEffect(() => {
    if (mode !== 1 || g.turn !== "B" || g.over) return;
    const t = setTimeout(() => setG(applyMove(g, aiPick(g))), 600);
    return () => clearTimeout(t);
  }, [g, mode]);

  const onPoint = (k) => {
    if (g.over || (mode === 1 && g.turn === "B")) return;
    if (g.chain !== null) { // forced chain: only the jumping bead's captures
      const m = movesFrom(g.chain, g.board, true).find((x) => x.to === k);
      if (m) setG(applyMove(g, m));
      return;
    }
    const m = g.sel && movesFrom(g.sel, g.board).find((x) => x.to === k);
    if (m) setG(applyMove(g, m));
    else setG({ ...g, sel: g.board[k] === g.turn ? k : null });
  };

  const status = g.over
    ? g.winner ? name(g.winner) + " wins!" : "Draw"
    : `${name(g.turn)}’s turn${g.chain !== null ? " (keep jumping!)" : ""} — Red ${count(g.board, "R")} · Blue ${count(g.board, "B")}`;

  return (
    <>
      <h1>Six Seeds Game</h1>
      <div className="bar">
        <button className={mode === 2 ? "on" : ""} onClick={() => { setMode(2); reset(); }}>Two players</button>
        <button className={mode === 1 ? "on" : ""} onClick={() => { setMode(1); reset(); }}>vs Computer</button>
        <button onClick={reset}>New game</button>
      </div>
      <div className="status">{status}</div>
      <Board g={g} onPoint={onPoint} />
      <div className="rules">
        <p>
          Move a bead along a line to an empty neighbouring point, or jump over an adjacent
          opponent bead into the empty point behind it to capture it. After a capture, the same
          bead must keep jumping if it can. Capture all 6 of your opponent’s beads to win. If a
          player has no legal move, their turn is skipped. Red starts.
        </p>
      </div>
      {g.over && !hidden && <Result g={g} onAgain={reset} onClose={() => setHidden(true)} />}
    </>
  );
}
