"use client";

import { useEffect, useRef, useState } from "react";
import { family, LETTERS } from "./curriculum";
import { useVoice } from "./Voice";
import { Star } from "./Icons";

// Games made for Grade 3 (ages 8–9): harder thinking, not just faster.
//   CarRace  drive your car through the gate with the right picture (a word) or the right answer (× and +)
//   Rocket   fill in the missing letter of a word; every right letter fuels the rocket, 6 and it launches
// Each takes the word pool from the games page: { native, english, pic, word, key }.

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];

function Won({ pic, title, note, onAgain }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <p className="prize-pop text-8xl" aria-hidden="true">{pic}</p>
      <div className="flex gap-2">{[0, 1, 2].map((i) => <Star key={i} width="40" height="40" />)}</div>
      <h2 className="text-4xl font-bold">{title}</h2>
      <p className="text-lg text-muted">{note}</p>
      <button type="button" onClick={onAgain} className="btn-brand text-lg">Play again</button>
    </div>
  );
}

/* ------------------------------------------------------------------ Car race */

const LANES = [16.6, 50, 83.3]; // the middle of each lane, in % of the road's width
const CAR_Y = 78; // where your car drives, in % from the top
const FINISH = 100;

// A question: a word (gates show pictures) or a sum / times table (gates show numbers).
function raceQuestion(pool, english, last) {
  if (Math.random() < 0.5 && pool.length >= 3) {
    const fresh = pool.filter((p) => p.key !== last);
    const right = pickOne(fresh.length ? fresh : pool);
    const wrong = shuffle(pool.filter((p) => p.pic !== right.pic)).slice(0, 2);
    const gates = shuffle([right, ...wrong]).map((p) => ({ text: p.pic, ok: p === right }));
    return { key: right.key, ask: english ? right.english : right.native, geez: !english, say: right, gates };
  }
  const times = Math.random() < 0.6;
  const a = times ? 2 + Math.floor(Math.random() * 8) : 10 + Math.floor(Math.random() * 30);
  const b = times ? 2 + Math.floor(Math.random() * 8) : 5 + Math.floor(Math.random() * 20);
  const n = times ? a * b : a + b;
  const wrong = shuffle([n + 1, n - 1, n + 2, n + (times ? a : 10), n - (times ? b : 10)].filter((x) => x > 0 && x !== n)).slice(0, 2);
  return { key: `${a}${b}`, ask: `${a} ${times ? "×" : "+"} ${b}`, gates: shuffle([n, ...wrong]).map((x) => ({ text: String(x), ok: x === n })) };
}

const Car = ({ color, flip }) => (
  <svg width="56" height="92" viewBox="0 0 56 92" aria-hidden="true" style={flip ? { transform: "rotate(180deg)" } : undefined}>
    <rect x="4" y="14" width="8" height="18" rx="3" fill="#102542" />
    <rect x="44" y="14" width="8" height="18" rx="3" fill="#102542" />
    <rect x="4" y="60" width="8" height="18" rx="3" fill="#102542" />
    <rect x="44" y="60" width="8" height="18" rx="3" fill="#102542" />
    <path d="M14 8 Q28 0 42 8 L46 82 Q28 92 10 82 Z" fill={color} />
    <path d="M17 26 Q28 20 39 26 L37 40 H19 Z" fill="#BFE3FF" />
    <rect x="18" y="58" width="20" height="10" rx="3" fill="#BFE3FF" />
    <rect x="25" y="4" width="6" height="84" fill="#fff" opacity="0.55" />
  </svg>
);

export function CarRace({ game, pool, english, onWin }) {
  const voice = useVoice();
  const [lane, setLane] = useState(1);
  const [q, setQ] = useState(() => raceQuestion(pool, english));
  const [gateY, setGateY] = useState(-12);
  const [me, setMe] = useState(0);
  const [rivals, setRivals] = useState([0, 0]);
  const [speed, setSpeed] = useState(1);
  const [flash, setFlash] = useState(null); // "good" | "bad"
  const [road, setRoad] = useState(0);
  const [started, setStarted] = useState(false);
  const laneRef = useRef(lane);
  laneRef.current = lane;
  const over = me >= FINISH ? "win" : rivals.some((r) => r >= FINISH) ? "lose" : null;

  // Say the word when a word question comes up.
  useEffect(() => {
    if (started && q.say) voice({ word: q.say.word, text: q.say.english });
  }, [q, started]); // eslint-disable-line react-hooks/exhaustive-deps

  // Steer with the arrow keys.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setLane((l) => Math.max(0, l - 1));
      if (e.key === "ArrowRight") setLane((l) => Math.min(2, l + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The game clock: the gates come down the road, the rival cars drive on.
  useEffect(() => {
    if (!started || over) return;
    const t = setInterval(() => {
      setRoad((r) => (r + 6 * speed) % 80);
      setMe((m) => m + 0.18 * speed);
      setRivals((rs) => rs.map((r, i) => r + (i ? 0.2 : 0.17)));
      setGateY((y) => y + 0.9 * Math.max(0.8, speed));
    }, 40);
    return () => clearInterval(t);
  }, [started, over, speed]);

  // The gates reach your car: right gate = boost, wrong gate = slow down. Then the next question.
  useEffect(() => {
    if (gateY < CAR_Y - 6) return;
    const ok = q.gates[laneRef.current].ok;
    setFlash(ok ? "good" : "bad");
    setSpeed((s) => (ok ? Math.min(2.2, s + 0.35) : Math.max(0.6, s - 0.4)));
    if (ok) setMe((m) => m + 4);
    setTimeout(() => setFlash(null), 500);
    setQ(raceQuestion(pool, english, q.key));
    setGateY(-12);
  }, [gateY]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (over === "win") onWin?.();
  }, [over]); // eslint-disable-line react-hooks/exhaustive-deps

  function again() {
    setMe(0);
    setRivals([0, 0]);
    setSpeed(1);
    setGateY(-12);
    setQ(raceQuestion(pool, english));
    setStarted(true);
  }

  if (over === "win") return <Won pic="🏎️" title="You won the race!" note="First across the finish line. Fast thinking!" onAgain={again} />;

  return (
    <div className="mt-4 grid flex-1 gap-5 md:grid-cols-[1fr_170px]">
      <div>
        {/* The question */}
        <div className="mb-3 flex items-center justify-center gap-3 rounded-2xl bg-ink px-4 py-3 text-white">
          <span className="text-lg font-bold text-white/70">Drive to</span>
          <span className={`text-3xl font-bold ${q.geez ? "font-geez" : "font-display"}`}>{q.ask}</span>
          {q.say && (
            <button type="button" onClick={() => voice({ word: q.say.word, text: q.say.english })} aria-label="Hear the word"
              className="rounded-full bg-white/15 px-3 py-1 text-lg hover:bg-white/25">🔊</button>
          )}
        </div>

        {/* The road */}
        <div
          className={`relative h-[400px] overflow-hidden rounded-3xl border-4 ${flash === "bad" ? "border-accent" : flash === "good" ? "border-good" : "border-ink"}`}
          style={{
            background: `repeating-linear-gradient(to bottom, transparent 0 40px, #FFFFFF 40px 80px) 33.3% ${road}px / 6px 100% no-repeat,
              repeating-linear-gradient(to bottom, transparent 0 40px, #FFFFFF 40px 80px) 66.6% ${road}px / 6px 100% no-repeat,
              linear-gradient(to right, #1F8A4C 0 4%, #3B4A5E 4% 96%, #1F8A4C 96%)`,
          }}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setLane(Math.min(2, Math.floor(((e.clientX - r.left) / r.width) * 3)));
          }}
        >
          {/* the three gates */}
          {started && !over && q.gates.map((g, i) => (
            <div key={i} className="absolute -translate-x-1/2" style={{ left: `${LANES[i]}%`, top: `${gateY}%` }}>
              <div className="flex h-16 min-w-[84px] items-center justify-center rounded-2xl border-4 border-sun bg-white px-3 font-display text-3xl font-bold shadow-lg">
                {g.text}
              </div>
            </div>
          ))}

          {/* your car */}
          <div className="absolute -translate-x-1/2 transition-[left] duration-200" style={{ left: `${LANES[lane]}%`, top: `${CAR_Y}%` }}>
            <Car color="#E0313B" />
          </div>

          {!started && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/55 p-6 text-center text-white">
              <p className="text-2xl font-bold">Steer into the gate with the right answer!</p>
              <p className="text-white/85">Use ← → on the keyboard, or tap a lane. Right answers make you faster.</p>
              <button type="button" onClick={(e) => (e.stopPropagation(), setStarted(true))} className="btn-sun text-lg">🏁 Start the race</button>
            </div>
          )}
          {over === "lose" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/60 p-6 text-center text-white">
              <p className="text-3xl font-bold">So close!</p>
              <p>Think fast and pick the right gates to win.</p>
              <button type="button" onClick={(e) => (e.stopPropagation(), again())} className="btn-sun text-lg">Race again</button>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-center gap-3">
          <button type="button" onClick={() => setLane((l) => Math.max(0, l - 1))} className="btn-line px-8 text-xl">◀</button>
          <button type="button" onClick={() => setLane((l) => Math.min(2, l + 1))} className="btn-line px-8 text-xl">▶</button>
        </div>
      </div>

      {/* Who is ahead */}
      <div className="rounded-2xl bg-white p-4">
        <p className="mb-3 text-center font-extrabold">🏁 Race</p>
        {[["You", "#E0313B", me], ["Blue", "#1760CF", rivals[0]], ["Green", "#1F8A4C", rivals[1]]].map(([n, c, p]) => (
          <div key={n} className="mb-3">
            <div className="flex justify-between text-sm font-bold"><span>{n}</span><span className="tabular-nums">{Math.min(100, Math.round(p))}%</span></div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, p)}%`, background: c }} />
            </div>
          </div>
        ))}
        <p className="mt-4 text-center text-sm font-bold text-muted">Speed</p>
        <p className="text-center font-display text-3xl font-bold tabular-nums">{Math.round(speed * 60)} <span className="text-sm">km/h</span></p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Word rocket */

const FUEL = 6;

// The letters of a word (Ge'ez: each syllable is one letter). Spaces and punctuation are left out of the gaps.
const isLetter = (ch) => /[ሀ-፿]/.test(ch) || /[a-z]/i.test(ch);

// One round: a word with one letter hidden, and 4 letters to choose from (look-alikes from the same family).
function rocketRound(pool, english, last) {
  const words = pool.filter((p) => p.key !== last);
  const item = pickOne(words.length ? words : pool);
  const text = english ? item.english : item.native;
  const chars = [...text];
  const spots = chars.map((c, i) => (isLetter(c) ? i : -1)).filter((i) => i >= 0);
  const at = pickOne(spots);
  const right = chars[at];
  let others;
  if (/[ሀ-፿]/.test(right)) {
    // Ge'ez: the other forms of the same letter (ሀ ሁ ሂ …) — the hard part of reading
    const code = right.codePointAt(0);
    const base = String.fromCodePoint(code - ((code - 0x1200) % 8));
    others = shuffle(family(base).filter((f) => f !== right)).slice(0, 3);
  } else {
    const abc = LETTERS.en.map((x) => x.slice(-1));
    others = shuffle(abc.filter((x) => x !== right.toLowerCase())).slice(0, 3);
  }
  return { item, chars, at, right, choices: shuffle([right, ...others]) };
}

export function Rocket({ game, pool, english, onWin }) {
  const voice = useVoice();
  const usable = pool.filter((p) => [...(english ? p.english : p.native)].filter(isLetter).length >= 2);
  const [r, setR] = useState(() => rocketRound(usable, english));
  const [fuel, setFuel] = useState(0);
  const [wrong, setWrong] = useState(null);
  const [shown, setShown] = useState(false);
  const geez = !english;

  useEffect(() => {
    if (fuel >= FUEL) onWin?.();
  }, [fuel]); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(c) {
    if (shown) return;
    if (c !== r.right) return setWrong(c);
    setWrong(null);
    setShown(true);
    voice({ word: r.item.word, text: r.item.english });
    setTimeout(() => {
      setShown(false);
      setFuel((f) => f + 1);
      setR(rocketRound(usable, english, r.item.key));
    }, 1100);
  }

  if (fuel >= FUEL) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl bg-[#0F2240] p-8 text-center text-white">
        <span className="rocket-launch text-8xl" aria-hidden="true">🚀</span>
        <h2 className="mt-6 text-4xl font-bold">Blast off!</h2>
        <p className="mt-2 text-lg text-white/80">You spelled {FUEL} words. The rocket is in space!</p>
        <button type="button" onClick={() => (setFuel(0), setR(rocketRound(usable, english)))} className="btn-sun mt-6 text-lg">Fly again</button>
      </div>
    );
  }

  return (
    <div className="mt-4 grid flex-1 gap-6 md:grid-cols-[1fr_140px]">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <p className="text-lg font-bold text-muted">Which letter is missing?</p>
        <p className="text-7xl" aria-hidden="true">{r.item.pic}</p>
        <p className={`flex flex-wrap justify-center gap-1 text-5xl font-bold ${geez ? "font-geez" : "font-display"}`}>
          {r.chars.map((c, i) =>
            i === r.at ? (
              <span key={i} className={`inline-flex min-w-[64px] justify-center rounded-2xl border-4 border-dashed px-2 ${shown ? "border-good bg-good-soft text-good" : "border-brand bg-white text-brand"}`}>
                {shown ? c : "?"}
              </span>
            ) : (
              <span key={i}>{c === " " ? " " : c}</span>
            ),
          )}
        </p>
        <p className="text-muted">{english ? "" : r.item.english}</p>
        <div className="grid grid-cols-4 gap-4">
          {r.choices.map((c) => (
            <button key={c} type="button" onClick={() => choose(c)}
              className={`flex h-24 w-24 items-center justify-center rounded-3xl border-4 text-5xl font-bold transition hover:-translate-y-1 ${geez ? "font-geez" : "font-display"} ${
                wrong === c ? "border-accent bg-accent-soft text-accent" : shown && c === r.right ? "border-good bg-good-soft" : "border-line bg-white"
              }`}>
              {c}
            </button>
          ))}
        </div>
        <p className="min-h-[1.5em] font-bold text-accent">{wrong ? "Look closely: the shapes are almost the same!" : ""}</p>
      </div>

      {/* The rocket filling up with fuel */}
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-[#0F2240] p-4 text-white">
        <span className="text-5xl" aria-hidden="true">🚀</span>
        <div className="relative w-10 flex-1 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuemin={0} aria-valuemax={FUEL} aria-valuenow={fuel}>
          <div className="absolute bottom-0 w-full rounded-full bg-gradient-to-t from-accent to-sun transition-all duration-500" style={{ height: `${(fuel / FUEL) * 100}%` }} />
        </div>
        <span className="font-extrabold tabular-nums">{fuel} / {FUEL}</span>
        <span className="text-xs text-white/70">fuel</span>
      </div>
    </div>
  );
}
