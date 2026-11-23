import { count, name } from "./game.js";

function Row({ label, a, b }) {
  return (
    <tr><td>{a}</td><th>{label}</th><td>{b}</td></tr>
  );
}

export default function Result({ g, onAgain, onClose }) {
  const w = g.winner;
  const secs = Math.round((g.t1 - g.t0) / 1000);
  const time = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
  const colors = w ? [w === "R" ? "#e5594e" : "#5b8ae6", "#f2c14e", "#fff"] : [];

  return (
    <div className="ov">
      {colors.length > 0 &&
        Array.from({ length: 40 }, (_, i) => (
          <i key={i} style={{
            left: (i * 37 % 100) + "%", background: colors[i % 3],
            animationDelay: (i % 7) * 0.2 + "s", animationDuration: 2 + (i % 5) * 0.5 + "s",
          }} />
        ))}
      <div className="card">
        <div className="crown">{w ? "🏆" : "🤝"}</div>
        <h2 style={{ color: w ? (w === "R" ? "var(--red)" : "var(--blue)") : "var(--fg)" }}>
          {w ? name(w) + " wins!" : "It’s a draw"}
        </h2>
        <p className="sub">{w ? "All six beads captured." : "No moves left for either side."}</p>
        <table>
          <tbody>
            <tr>
              <td style={{ color: "var(--red)" }}>Red</td><th />
              <td style={{ color: "var(--blue)" }}>Blue</td>
            </tr>
            <Row label="Beads left" a={count(g.board, "R")} b={count(g.board, "B")} />
            <Row label="Captures" a={g.stats.R.caps} b={g.stats.B.caps} />
            <Row label="Best chain" a={g.stats.R.best} b={g.stats.B.best} />
            <Row label="Turns" a={g.stats.R.moves} b={g.stats.B.moves} />
          </tbody>
        </table>
        <p className="sub">Game time {time}</p>
        <button onClick={onAgain}>Play again</button>
        <button onClick={onClose}>View board</button>
      </div>
    </div>
  );
}
