"use client";

import { useEffect, useRef, useState } from "react";
import { langOf, useKid } from "../../../components/KidState";
import { Check, Sheet, Star } from "../../../components/Icons";
import { NUMBER_WORDS, family, letterUnits, usesGeez } from "../../../components/curriculum";

// Screen 7 (web): Homework. This week's sheets on the left; the open sheet on the right.
// Sheets follow the child's path: trace the newest letter family, match letters, count. Do it on screen or print it.

const Printer = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
    <rect x="7" y="14" width="10" height="7" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Step 1 sheet: trace each form of the letter family with a finger or the mouse, over a faint guide.
function Trace({ letters, geez, onDone }) {
  const [i, setI] = useState(0);
  const [traced, setTraced] = useState(new Set());
  const canvas = useRef(null);
  const drawing = useRef(false);

  function clear() {
    const c = canvas.current;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
  }

  useEffect(clear, [i]);

  function point(e) {
    const r = canvas.current.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * canvas.current.width, ((e.clientY - r.top) / r.height) * canvas.current.height];
  }

  function down(e) {
    drawing.current = true;
    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1760CF";
    ctx.beginPath();
    ctx.moveTo(...point(e));
    canvas.current.setPointerCapture(e.pointerId);
  }

  function move(e) {
    if (!drawing.current) return;
    const ctx = canvas.current.getContext("2d");
    ctx.lineTo(...point(e));
    ctx.stroke();
  }

  function up() {
    if (!drawing.current) return;
    drawing.current = false;
    const next = new Set(traced).add(i);
    setTraced(next);
    if (next.size === letters.length) onDone();
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-80 w-80 rounded-[2.5rem] border-4 border-dashed border-line bg-white">
        <span
          className={`pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[13rem] font-bold leading-none text-line ${
            geez ? "font-geez" : "font-display"
          }`}
          aria-hidden="true"
        >
          {letters[i]}
        </span>
        <canvas
          ref={canvas}
          width={640}
          height={640}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          className="absolute inset-0 h-full w-full touch-none cursor-crosshair rounded-[2.5rem]"
          aria-label={`Trace ${letters[i]}`}
        />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={clear} className="btn-line">
          Clear
        </button>
        <button type="button" onClick={() => setI((i + 1) % letters.length)} className="btn-brand">
          Next letter
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {letters.map((l, j) => (
          <button
            key={l}
            type="button"
            onClick={() => setI(j)}
            aria-pressed={i === j}
            className={`relative flex h-14 w-14 items-center justify-center rounded-xl border-[3px] text-2xl font-bold ${geez ? "font-geez" : "font-display"} ${
              i === j ? "border-brand bg-soft" : "border-line bg-white"
            }`}
          >
            {l}
            {traced.has(j) && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-good text-white">
                <Check width="12" height="12" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 2 sheet: tap a letter on the left, then the same letter on the right.
const ORDER = [2, 0, 3, 1]; // the right column's order (fixed, so the sheet prints the same every time)

function Match({ letters, geez, onDone }) {
  const four = letters.slice(0, 4);
  const [pick, setPick] = useState(null);
  const [paired, setPaired] = useState(new Set());
  const [miss, setMiss] = useState(null);

  function right(l) {
    if (pick === null) return;
    if (l !== pick) {
      setMiss(l);
      return;
    }
    const next = new Set(paired).add(l);
    setPaired(next);
    setPick(null);
    setMiss(null);
    if (next.size === four.length) onDone();
  }

  const tile = (l, state) =>
    `flex h-20 w-24 items-center justify-center rounded-2xl border-[3px] text-4xl font-bold transition ${geez ? "font-geez" : "font-display"} ${
      state === "paired"
        ? "border-good bg-good-soft text-good"
        : state === "picked"
          ? "border-brand bg-soft"
          : state === "miss"
            ? "border-accent bg-accent-soft text-accent"
            : "border-line bg-white hover:border-brand/50"
    }`;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid grid-cols-[auto_120px_auto] items-center gap-y-4">
        {four.map((l, row) => {
          const r = four[ORDER[row]];
          return [
            <button
              key={`l${l}`}
              type="button"
              disabled={paired.has(l)}
              onClick={() => setPick(l)}
              className={tile(l, paired.has(l) ? "paired" : pick === l ? "picked" : "")}
            >
              {l}
            </button>,
            <span key={`d${row}`} className="mx-4 h-1 rounded-full border-t-4 border-dotted border-line" aria-hidden="true" />,
            <button
              key={`r${r}`}
              type="button"
              disabled={paired.has(r)}
              onClick={() => right(r)}
              className={tile(r, paired.has(r) ? "paired" : miss === r ? "miss" : "")}
            >
              {r}
            </button>,
          ];
        })}
      </div>
      <p className="min-h-[1.5em] font-bold text-muted">
        {pick ? "Now tap the same one on the right." : paired.size === four.length ? "All matched!" : "Tap a letter on the left."}
      </p>
    </div>
  );
}

// Step 3 sheet: count the stars in each row and tap the number.
const ROWS = [3, 5, 2, 4];

function Count({ words, onDone }) {
  const [answers, setAnswers] = useState({});

  function choose(row, n) {
    setAnswers((a) => ({ ...a, [row]: n }));
  }

  useEffect(() => {
    if (ROWS.every((c, r) => answers[r] === c)) onDone();
  }, [answers]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full max-w-2xl space-y-4">
      {ROWS.map((c, row) => (
        <div key={row} className="flex items-center gap-4 rounded-2xl border-2 border-line bg-white p-4">
          <div className="flex w-56 gap-1.5">
            {Array.from({ length: c }, (_, i) => (
              <Star key={i} width="36" height="36" />
            ))}
          </div>
          <div className="flex flex-1 justify-end gap-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const chosen = answers[row] === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => choose(row, n)}
                  className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl border-[3px] font-display text-2xl font-bold ${
                    chosen ? (n === c ? "border-good bg-good-soft text-good" : "border-accent bg-accent-soft text-accent") : "border-line hover:border-brand/50"
                  }`}
                  aria-label={words ? `${n}, ${words[n - 1]}` : String(n)}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {words && <p className="text-center font-geez text-lg text-muted">{words.slice(0, 5).join(" · ")}</p>}
    </div>
  );
}

export default function Homework() {
  const { kid } = useKid();
  const lang = langOf(kid);
  const geez = usesGeez(kid.lang);
  const words = NUMBER_WORDS[kid.lang];
  const learned = letterUnits(kid.lang).flatMap((u) => u.letters).slice(0, Math.max(kid.done ?? 4, 4));
  const newest = learned[learned.length - 1];

  const sheets = [
    { id: "trace", title: geez ? `Trace the ${newest} family` : `Trace the letter ${newest.toUpperCase()}`, note: "Follow the grey letter", letters: family(newest) },
    { id: "match", title: "Match the letters", note: "Find the same one", letters: learned.slice(-4) },
    ...(kid.math ? [{ id: "count", title: "Count the stars", note: `Numbers in ${lang.name}` }] : []),
  ];

  const [openId, setOpenId] = useState("trace");
  const [done, setDone] = useState(new Set());
  const open = sheets.find((s) => s.id === openId) || sheets[0];
  const finish = (id) => setDone((d) => new Set(d).add(id));

  return (
    <main>
      {/* When printing, only the open sheet goes on paper */}
      <style>{`@media print { header, footer, .no-print { display: none !important; } body, .bg-soft { background: #fff !important; } }`}</style>

      <div className="no-print mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand">Homework</p>
          <h1 className="mt-1 text-4xl font-bold">This week&apos;s sheets</h1>
          <p className="mt-2 text-lg text-muted">Made from the letters {kid.name} learned. Do them on screen, or print them.</p>
        </div>
        <span className="chip bg-white text-base">
          <Star /> {done.size} of {sheets.length} done · due Friday
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* This week's sheets */}
        <aside className="no-print space-y-4">
          {sheets.map((s, n) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setOpenId(s.id)}
              aria-pressed={s.id === open.id}
              className={`card flex w-full items-center gap-4 p-4 text-left transition ${s.id === open.id ? "border-brand bg-soft" : "hover:border-brand/50"}`}
            >
              <span
                className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl font-display text-xl font-bold ${
                  done.has(s.id) ? "bg-good text-white" : "bg-[#FFF4D6] text-[#B07D00]"
                }`}
              >
                {done.has(s.id) ? <Check /> : n + 1}
              </span>
              <span className="flex-1">
                <b className={`block text-lg leading-tight ${geez ? "font-geez" : ""}`}>{s.title}</b>
                <span className="text-sm text-muted">{done.has(s.id) ? "Done" : s.note}</span>
              </span>
            </button>
          ))}
          <div className="card flex items-start gap-3 p-4 text-sm text-muted">
            <span className="text-[#B07D00]">
              <Sheet width="24" height="24" />
            </span>
            New sheets come every Monday. Parents see the results in the Friday report.
          </div>
        </aside>

        {/* The open sheet */}
        <section className="card flex min-h-[600px] flex-col p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-[#B07D00]">Sheet {sheets.indexOf(open) + 1}</p>
              <h2 className={`mt-1 text-3xl font-bold ${geez ? "font-geez" : ""}`}>{open.title}</h2>
              <p className="text-muted">
                Name: <b className="text-ink">{kid.name}</b>
              </p>
            </div>
            <button type="button" onClick={() => window.print()} className="btn-line no-print">
              <Printer /> Print
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center">
            {open.id === "trace" && <Trace key={open.title} letters={open.letters} geez={geez} onDone={() => finish("trace")} />}
            {open.id === "match" && <Match key={open.letters.join("")} letters={open.letters} geez={geez} onDone={() => finish("match")} />}
            {open.id === "count" && <Count words={words} onDone={() => finish("count")} />}
          </div>

          {done.has(open.id) && (
            <p className="no-print mt-6 flex items-center justify-center gap-2 rounded-2xl bg-good-soft p-4 text-lg font-extrabold text-good">
              <Check /> Sheet done. Great work, {kid.name}!
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
