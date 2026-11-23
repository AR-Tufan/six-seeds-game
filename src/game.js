// Pure game logic: no React in this file.

// The 13 board points and their drawing coordinates
export const P = {
  T0: [120, 60], T1: [300, 60], T2: [480, 60],
  A: [210, 130], M: [300, 130], B: [390, 130],
  C: [300, 200],
  A2: [210, 270], M2: [300, 270], B2: [390, 270],
  U0: [120, 340], U1: [300, 340], U2: [480, 340],
};

// The 7 straight lines
export const LINES = [
  ["T0", "A", "C", "B2", "U2"],
  ["T2", "B", "C", "A2", "U0"],
  ["T1", "M", "C", "M2", "U1"],
  ["T0", "T1", "T2"],
  ["U0", "U1", "U2"],
  ["A", "M", "B"],
  ["A2", "M2", "B2"],
];

// Neighbours (steps) and jump triples are derived from LINES
const adj = {};
const jumps = [];
Object.keys(P).forEach((k) => (adj[k] = []));
LINES.forEach((l) => {
  for (let i = 0; i < l.length - 1; i++) {
    adj[l[i]].push(l[i + 1]);
    adj[l[i + 1]].push(l[i]);
  }
  for (let i = 0; i < l.length - 2; i++) {
    jumps.push([l[i], l[i + 1], l[i + 2]], [l[i + 2], l[i + 1], l[i]]);
  }
});

export const other = (t) => (t === "R" ? "B" : "R");
export const name = (t) => (t === "R" ? "Red" : "Blue");
export const count = (b, t) => Object.values(b).filter((v) => v === t).length;

// Legal moves for the bead on point p (cap = the point being captured)
export function movesFrom(p, b, capsOnly = false) {
  const opp = other(b[p]);
  const r = [];
  if (!capsOnly) adj[p].forEach((n) => { if (!b[n]) r.push({ from: p, to: n }); });
  jumps.forEach(([a, q, c]) => {
    if (a === p && b[q] === opp && !b[c]) r.push({ from: p, to: c, cap: q });
  });
  return r;
}

export function allMoves(t, b) {
  let r = [];
  Object.keys(b).forEach((k) => { if (b[k] === t) r = r.concat(movesFrom(k, b)); });
  return r;
}

// Total captures if this capture is played and the same bead keeps jumping
function chainLen(b, m) {
  const c = { ...b };
  c[m.to] = c[m.from]; c[m.from] = null; c[m.cap] = null;
  let best = 0;
  movesFrom(m.to, c, true).forEach((x) => { best = Math.max(best, chainLen(c, x)); });
  return 1 + best;
}

const blank = () => ({ moves: 0, caps: 0, best: 0 });

export function init() {
  const board = {};
  Object.keys(P).forEach((k) => (board[k] = null));
  ["T0", "T1", "T2", "A", "M", "B"].forEach((k) => (board[k] = "R"));
  ["U0", "U1", "U2", "A2", "M2", "B2"].forEach((k) => (board[k] = "B"));
  return {
    board, turn: "R", sel: null, chain: null, run: 0,
    over: false, winner: null, t0: Date.now(), t1: 0,
    stats: { R: blank(), B: blank() },
  };
}

// Returns a NEW game state after move m
export function applyMove(g, m) {
  const b = { ...g.board };
  const S = { ...g.stats[g.turn] };
  const nx = other(g.turn);
  let run = g.run;
  if (g.chain === null) S.moves++;
  if (m.cap) { S.caps++; run++; S.best = Math.max(S.best, run); }
  b[m.to] = b[m.from]; b[m.from] = null;
  if (m.cap) b[m.cap] = null;
  const stats = { ...g.stats, [g.turn]: S };

  // forced chain: same bead must keep capturing
  if (m.cap && count(b, nx) > 0 && movesFrom(m.to, b, true).length)
    return { ...g, board: b, stats, run, chain: m.to, sel: m.to };

  const r = { ...g, board: b, stats, run: 0, chain: null, sel: null };
  if (count(b, nx) === 0) return { ...r, over: true, winner: g.turn, t1: Date.now() };
  if (allMoves(nx, b).length) return { ...r, turn: nx };
  if (!allMoves(g.turn, b).length) return { ...r, over: true, t1: Date.now() };
  return r; // opponent has no move: turn skipped
}

// Computer (Blue): prefers the capture path with the most captures
export function aiPick(g) {
  const ms = g.chain !== null ? movesFrom(g.chain, g.board, true) : allMoves("B", g.board);
  const caps = ms.filter((m) => m.cap);
  let pool = ms;
  if (caps.length) {
    const s = caps.map((m) => chainLen(g.board, m));
    const mx = Math.max(...s);
    pool = caps.filter((m, i) => s[i] === mx);
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
