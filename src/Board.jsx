import { P, LINES, movesFrom } from "./game.js";

export default function Board({ g, onPoint }) {
  const targets = g.sel
    ? movesFrom(g.sel, g.board).filter((m) => g.chain === null || m.cap)
    : [];

  return (
    <svg viewBox="70 20 460 360" role="img" aria-label="Six Seeds Game board">
      {LINES.map((l, i) => (
        <polyline
          key={i}
          points={l.map((k) => P[k].join(",")).join(" ")}
          fill="none" stroke="var(--line)" strokeWidth="3" strokeLinecap="round"
        />
      ))}
      {Object.keys(P).map((k) => {
        const [x, y] = P[k];
        const v = g.board[k];
        const t = targets.find((m) => m.to === k);
        return (
          <g key={k} className="pt" onClick={() => onPoint(k)}>
            <circle cx={x} cy={y} r="32" fill="transparent" />
            <circle cx={x} cy={y} r="22" fill="var(--node)" stroke="var(--line)" strokeWidth="2" />
            {v && (
              <circle
                cx={x} cy={y} r="16"
                fill={v === "R" ? "var(--red)" : "var(--blue)"}
                stroke={k === g.sel ? "var(--fg)" : "none"} strokeWidth="4"
              />
            )}
            {t && (
              <circle
                cx={x} cy={y} r={t.cap ? 20 : 9}
                fill={t.cap ? "none" : "var(--hint)"} stroke="var(--hint)" strokeWidth="4"
                strokeDasharray={t.cap ? "6 4" : "0"}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
