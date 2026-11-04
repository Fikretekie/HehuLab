"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { langOf, useKid } from "../../../components/KidState";
import { Camel, Goat, Kokob, Sheep } from "../../../components/Avatars";
import { Check, GamePad, Star } from "../../../components/Icons";
import { NUMBER_WORDS, letterUnits, usesGeez } from "../../../components/curriculum";
import { SpeakButton, stop, useFriendVoice, useVoice } from "../../../components/Voice";
import { KOKOB } from "../../../components/kokobLines";
import { gameText } from "../../../components/gameText";
import { AGE_GROUPS, ageGroup, findLesson, lessonItems, levelsFor } from "../../../components/courses";

// Screen 5 (web): Games. The game you're playing is big on the left; all games are listed on the right.
// Every game uses the child's language: letters from their path, numbers said with their number words, and the words
// of the unit ("Find the picture"). A "Play" stop on the path opens here with ?lesson=… and keeps the stars.

const ROUNDS = 5;

// Put a styled letter where "@" is in an instruction (Tigrinya puts the letter in the middle: "ፍየል @ ትደሊ!").
function fill(line, node) {
  const [a, b] = line.split("@");
  return (
    <>
      {a}
      {node}
      {b}
    </>
  );
}

const Cup = () => (
  <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M10 18h24l-3 18a4 4 0 0 1-4 3H17a4 4 0 0 1-4-3z" fill="#FFFFFF" stroke="#102542" strokeWidth="2.5" />
    <path d="M34 22h3a4 4 0 0 1 0 8h-4" stroke="#102542" strokeWidth="2.5" fill="none" />
    <path d="M14 22h16" stroke="#B8441C" strokeWidth="3" />
    <path d="M19 8c-2 3 2 4 0 7M26 8c-2 3 2 4 0 7" stroke="#4D5E78" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

// `ages`: who the game fits. small = Pre-K and K (no timers), mid = Grade 1–2, big = Grade 3, adult = grown-ups.
const GAMES = [
  { id: "goat", title: "Feed the goat", note: "Find the letter Fiyel asks for", Pic: Goat, kind: "letters", ages: ["small", "mid"] },
  { id: "cups", title: "Count the coffee cups", note: "How many cups for the coffee ceremony?", Pic: Camel, kind: "math", ages: ["small", "mid"] },
  { id: "pics", title: "Find the picture", note: "Bebe says a word. Tap its picture!", Pic: Sheep, kind: "words", ages: ["small", "mid", "big", "adult"] },
  { id: "memory", title: "Memory match", note: "Turn two cards: find each picture and its word", Pic: Kokob, kind: "words", ages: ["small", "mid", "big", "adult"] },
  { id: "build", title: "Build the word", note: "Look at the picture. Tap the letters in order!", Pic: Kokob, kind: "words", ages: ["mid", "big", "adult"] },
  { id: "pop", title: "Letter pop", note: "Pop only the balloons with Kokob's letter!", Pic: Kokob, kind: "letters", ages: ["small", "mid", "big"] },
  { id: "race", title: "Race the camel", note: "Count fast! Every right answer moves Gemel ahead of the goat.", Pic: Camel, kind: "math", ages: ["mid", "big"] },
  { id: "speed", title: "Speed round", note: "How many can you get in 30 seconds?", Pic: Sheep, kind: "mixed", ages: ["big", "adult"] },
  { id: "stars", title: "Star map", note: "Tap the stars in letter order to draw Kokob's map!", Pic: Kokob, kind: "letters", ages: ["mid", "big", "adult"] },
];

// How fast the moving games go for each age group.
const PACE = {
  small: { balloonSecs: 10, balloonEvery: 1500, goatSecs: 8 },
  mid: { balloonSecs: 7, balloonEvery: 1100, goatSecs: 6 },
  big: { balloonSecs: 5, balloonEvery: 800, goatSecs: 4 },
  adult: { balloonSecs: 5, balloonEvery: 800, goatSecs: 4 },
};

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

// One round: the answer plus three other choices (never the same answer twice in a row).
function makeRound(pool, last) {
  const fresh = pool.filter((x) => x.key !== last?.key);
  const answer = fresh[Math.floor(Math.random() * fresh.length)] || pool[0];
  return { answer, options: shuffle([answer, ...shuffle(pool.filter((x) => x.key !== answer.key)).slice(0, 3)]) };
}

// The playing area for "Feed the goat" and "Count the coffee cups". Same rules: 5 rounds, tap the right one.
function Stage({ game, pool, geez, words, english, onWin }) {
  // The first round is fixed so the server and the browser draw the same page; it's mixed once the page loads.
  const [round, setRound] = useState({ answer: pool[0], options: pool.slice(0, 4) });
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(null);
  const [ok, setOk] = useState(false);
  const won = score >= ROUNDS;

  useEffect(() => setRound(makeRound(pool)), [pool]);

  // Rodas reads each question out loud (the letter in her recorded voice) and cheers.
  const { kid } = useKid();
  const T = gameText(kid);
  const voice = useVoice();
  const talk = (line, text) => voice({ line, text });
  const ask = () =>
    game.id === "goat"
      ? voice(english ? { text: `Fiyel wants ${round.answer.key[0]}!` } : { word: round.answer.key, text: "Fiyel wants this letter! Can you find it?" })
      : game.id === "pics"
        ? voice(english ? { text: round.answer.english } : { word: round.answer.word, text: round.answer.english })
        : talk("howmany", "How many cups?");
  const cheerText = { goat: "Yum! Thank you!", pics: "Yes! That's it!", cups: "Yes, that's right!" }[game.id];
  const wonText = { goat: "Fiyel is full!", pics: "Bebe is so happy!", cups: "The coffee is ready!" }[game.id];

  useEffect(() => {
    if (won) {
      talk("welldone", `${wonText} Well done!`);
      onWin?.();
    } else ask();
    return stop;
  }, [round, won]); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(item) {
    if (ok || won) return;
    if (item.key !== round.answer.key) {
      talk("again", "Not that one. Try again!");
      return setWrong(item.key);
    }
    talk("welldone", cheerText);
    setWrong(null);
    setOk(true);
    setTimeout(() => {
      setScore((s) => s + 1);
      setOk(false);
      setRound((r) => makeRound(pool, r.answer));
    }, 800);
  }

  function again() {
    setScore(0);
    setRound(makeRound(pool));
  }

  if (won) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <game.Pic size={150} />
        <div className="flex gap-2">
          {Array.from({ length: ROUNDS }, (_, i) => (
            <Star key={i} width="40" height="40" />
          ))}
        </div>
        <h2 className="text-4xl font-bold">{wonText}</h2>
        <p className="text-lg text-muted">You got all {ROUNDS} right.</p>
        <button type="button" onClick={again} className="btn-brand text-lg">
          Play again
        </button>
      </div>
    );
  }

  const question =
    game.id === "goat" ? (
      <>
        {fill(T.goat("@"), <span className={geez ? "font-geez" : "font-display"}>{round.answer.big}</span>)}
      </>
    ) : game.id === "pics" ? (
      <>
        Find: <span className={english ? "" : "font-geez"}>{english ? round.answer.english : round.answer.native}</span>
      </>
    ) : (
      "How many cups?"
    );

  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-6">
      {/* Score: one star per right answer */}
      <div className="flex gap-2 self-end" aria-label={`${score} of ${ROUNDS}`}>
        {Array.from({ length: ROUNDS }, (_, i) => (
          <span key={i} className={i < score ? "" : "opacity-25 grayscale"}>
            <Star width="28" height="28" />
          </span>
        ))}
      </div>

      {/* The animal asks, in a speech bubble */}
      <div className="flex items-center gap-6">
        <div className={`transition ${ok ? "scale-110" : ""}`}>
          <game.Pic size={140} />
        </div>
        <div className={`relative rounded-3xl bg-white px-7 py-5 text-3xl font-bold ${T.geez && game.id === "goat" ? "font-geez" : ""}`}>
          <span className="absolute -left-2 top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 bg-white" aria-hidden="true" />
          {ok ? cheerText : question}
        </div>
        <SpeakButton onClick={ask} label="Hear the question again" />
      </div>

      {game.id === "cups" && (
        <div className="flex min-h-[64px] flex-wrap justify-center gap-2 rounded-3xl bg-white/70 px-6 py-3">
          {Array.from({ length: round.answer.count }, (_, i) => (
            <Cup key={i} />
          ))}
        </div>
      )}

      {/* The choices: bundles of grass with letters, or numbers */}
      <div className="grid grid-cols-4 gap-4">
        {round.options.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => choose(item)}
            className={`flex h-28 w-28 flex-col items-center justify-center rounded-3xl border-4 font-bold transition hover:-translate-y-1 ${
              ok && item.key === round.answer.key
                ? "border-good bg-good-soft text-good"
                : wrong === item.key
                  ? "border-accent bg-accent-soft text-accent"
                  : game.id === "goat"
                    ? "border-[#7DBE6A] bg-[#E6F4DC]"
                    : game.id === "pics"
                      ? "border-[#B9C8E8] bg-white"
                      : "border-line bg-white"
            }`}
          >
            <span className={`text-5xl ${geez && game.id === "goat" ? "font-geez" : "font-display"}`}>{item.big}</span>
            {game.id === "cups" && words && <span className="mt-1 font-geez text-sm text-muted">{words[item.count - 1]}</span>}
          </button>
        ))}
      </div>
      <p className={`min-h-[1.5em] font-bold text-accent ${T.geez ? "font-geez" : ""}`}>{wrong ? T.again : ""}</p>
    </div>
  );
}

// "Memory match": 6 words of the unit become 12 cards, a picture and its word. Turn two; if they belong together
// they stay open. Kokob hosts it in her own voice (Aki): she says the word of every card you turn. Words Aki hasn't
// recorded yet stay silent (never another person's voice).
const PAIRS = 6;

function Memory({ game, pool, english, onWin }) {
  const { kid } = useKid();
  const kokob = useFriendVoice("kokob");
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState([]); // the 1 or 2 cards turned right now
  const [found, setFound] = useState([]); // keys of the pairs found
  const [miss, setMiss] = useState(false);
  const won = cards.length > 0 && found.length === cards.length / 2;

  function deal() {
    const words = shuffle(pool).slice(0, PAIRS);
    setCards(shuffle(words.flatMap((w) => [{ id: `${w.key}-pic`, side: "pic", w }, { id: `${w.key}-word`, side: "word", w }])));
    setOpen([]);
    setFound([]);
  }
  useEffect(deal, [pool]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!won) return;
    kokob(KOKOB.allFound[kid.gender === "boy" ? "boy" : "girl"][0]);
    onWin?.();
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => stop, []);

  function turn(card) {
    if (open.length === 2 || open.includes(card) || found.includes(card.w.key)) return;
    if (!english) kokob(card.w.word); // Aki records the words in Tigrinya; the English track stays silent for now
    const now = [...open, card];
    setOpen(now);
    if (now.length < 2) return;
    const [a, b] = now;
    if (a.w.key === b.w.key) {
      setTimeout(() => {
        setFound((f) => [...f, a.w.key]);
        setOpen([]);
      }, 600);
    } else {
      setMiss(true);
      setTimeout(() => {
        setOpen([]);
        setMiss(false);
      }, 1200);
    }
  }

  if (won) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <game.Pic size={150} />
        <div className="flex gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Star key={i} width="40" height="40" />
          ))}
        </div>
        <h2 className="text-4xl font-bold">You found them all!</h2>
        <p className="text-lg text-muted">All {PAIRS} pictures and their words.</p>
        <button type="button" onClick={deal} className="btn-brand text-lg">
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-6 pt-4">
      <p className="self-end font-extrabold text-muted">
        {found.length} of {PAIRS} found
      </p>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => {
          const isFound = found.includes(card.w.key);
          const up = isFound || open.includes(card);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => turn(card)}
              aria-label={up ? (card.side === "pic" ? `Picture: ${card.w.english}` : card.w.native) : "A card, turned over"}
              className={`flex h-32 w-36 items-center justify-center rounded-3xl border-4 p-2 text-center font-bold transition ${
                isFound
                  ? "border-good bg-good-soft text-good"
                  : up
                    ? miss && open.length === 2
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-brand bg-white"
                    : "border-brand bg-brand text-white hover:-translate-y-1"
              }`}
            >
              {!up ? (
                <span className="font-display text-4xl">?</span>
              ) : card.side === "pic" ? (
                <span className="text-6xl">{card.w.pic}</span>
              ) : (
                <span className={english ? "font-display text-2xl" : "font-geez text-2xl"}>{english ? card.w.english : card.w.native}</span>
              )}
            </button>
          );
        })}
      </div>
      <p className="min-h-[1.5em] font-bold text-accent">{miss ? "Not a pair. Try again!" : ""}</p>
    </div>
  );
}

// "Build the word": a picture and empty boxes; tap its letters in the right order (ከ ል ቢ = ከልቢ). Two extra
// letters make it harder. 5 words to win. Kokob hosts it: she says the word once it's built (Aki's voice only).
// Words with spaces or marks are left out; the English track builds the English word.
const BUILD_ROUNDS = 5;

function buildable(pool, english) {
  return pool
    .map((w) => ({ ...w, letters: Array.from(english ? w.english : w.native) }))
    .filter((w) => (english ? /^[a-z]{3,6}$/.test(w.english) : w.letters.length >= 2 && w.letters.length <= 5 && !/[\s!?።፣.]/.test(w.native)));
}

function Build({ game, pool, english, onWin }) {
  const { kid } = useKid();
  const kokob = useFriendVoice("kokob");
  const words = useMemo(() => buildable(pool, english), [pool, english]);
  const [round, setRound] = useState(null);
  const [placed, setPlaced] = useState([]); // the tiles tapped so far, in order
  const [wrong, setWrong] = useState(null);
  const [score, setScore] = useState(0);
  const won = score >= BUILD_ROUNDS;

  function next(last) {
    const fresh = words.filter((w) => w.key !== last?.key);
    const w = fresh[Math.floor(Math.random() * fresh.length)] || words[0];
    const others = shuffle(words.filter((x) => x.key !== w.key).flatMap((x) => x.letters).filter((l) => !w.letters.includes(l)));
    const tiles = shuffle([...w.letters, ...new Set(others)].slice(0, w.letters.length + 2).map((l, i) => ({ id: i, l })));
    setRound({ w, tiles });
    setPlaced([]);
    setWrong(null);
  }
  useEffect(() => next(), [words]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!won) return;
    kokob(KOKOB.allFound[kid.gender === "boy" ? "boy" : "girl"][0]);
    onWin?.();
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => stop, []);

  if (!words.length) return <p className="m-auto text-lg text-muted">No words to build in this unit yet.</p>;
  if (won) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <game.Pic size={150} />
        <div className="flex gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Star key={i} width="40" height="40" />
          ))}
        </div>
        <h2 className="text-4xl font-bold">You built them all!</h2>
        <p className="text-lg text-muted">All {BUILD_ROUNDS} words.</p>
        <button
          type="button"
          onClick={() => {
            setScore(0);
            next();
          }}
          className="btn-brand text-lg"
        >
          Play again
        </button>
      </div>
    );
  }
  if (!round) return null;

  const { w, tiles } = round;
  const done = placed.length === w.letters.length;

  function tap(tile) {
    if (done || placed.includes(tile)) return;
    if (tile.l !== w.letters[placed.length]) return setWrong(tile.id);
    setWrong(null);
    const now = [...placed, tile];
    setPlaced(now);
    if (now.length === w.letters.length) {
      if (!english) kokob(w.word);
      setTimeout(() => {
        setScore((s) => s + 1);
        next(w);
      }, 1400);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-6 pt-2">
      <div className="flex gap-2 self-end" aria-label={`${score} of ${BUILD_ROUNDS}`}>
        {Array.from({ length: BUILD_ROUNDS }, (_, i) => (
          <span key={i} className={i < score ? "" : "opacity-25 grayscale"}>
            <Star width="28" height="28" />
          </span>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className={`text-8xl transition ${done ? "scale-110" : ""}`} aria-hidden="true">
          {w.pic}
        </span>
        <p className="font-bold text-muted">{english ? w.native : w.english}</p>
      </div>

      {/* The boxes the word goes in */}
      <div className="flex gap-3">
        {w.letters.map((l, i) => (
          <span
            key={i}
            className={`flex h-20 w-20 items-center justify-center rounded-2xl border-4 text-5xl font-bold ${
              done ? "border-good bg-good-soft text-good" : placed[i] ? "border-brand bg-white" : "border-dashed border-line bg-white/60"
            } ${english ? "font-display" : "font-geez"}`}
          >
            {placed[i]?.l || ""}
          </span>
        ))}
      </div>

      {/* The letters to tap */}
      <div className="flex flex-wrap justify-center gap-3">
        {tiles.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => tap(t)}
            disabled={placed.includes(t)}
            className={`h-20 w-20 rounded-2xl border-4 text-4xl font-bold transition ${english ? "font-display" : "font-geez"} ${
              placed.includes(t)
                ? "border-line bg-line/40 text-transparent"
                : wrong === t.id
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-brand bg-white hover:-translate-y-1"
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>
      <p className="min-h-[1.5em] font-bold text-accent">{wrong !== null ? "Not that one yet. Which letter comes next?" : done ? "Yes! You built it!" : ""}</p>
    </div>
  );
}

// "Letter pop": balloons with letters float up. Kokob shows one letter; pop only the balloons with that letter.
// After 3 pops she picks a new letter; 9 pops to win. Kokob says the letter in Aki's voice (silent until recorded).
const POP_WIN = 9;
const POP_EACH = 3;
const BALLOON_COLORS = ["#1760CF", "#B8441C", "#1F8A4C", "#FFC93C", "#7B4BC9", "#E0567A"];

const Balloon = ({ color }) => (
  <svg width="96" height="128" viewBox="0 0 96 128" aria-hidden="true" className="absolute inset-0">
    <path d="M48 96 C44 104 52 110 46 126" stroke="#4D5E78" strokeWidth="2" fill="none" />
    <ellipse cx="48" cy="48" rx="40" ry="46" fill={color} />
    <path d="M42 92 L54 92 L48 100 Z" fill={color} />
    <ellipse cx="34" cy="30" rx="8" ry="13" fill="#FFFFFF" opacity="0.35" />
  </svg>
);

function Pop({ game, pool, geez, english, pace, onWin }) {
  const { kid } = useKid();
  const T = gameText(kid);
  // Kokob says the letter: in English from Aki's English recordings ("B"), else in the child's language.
  const sayLetter = (l) => (english ? kokob(l[0], "en") : kokob(l));
  const kokob = useFriendVoice("kokob");
  const [target, setTarget] = useState(pool[0].key);
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [miss, setMiss] = useState(null);
  const nextId = useRef(0);
  const won = score >= POP_WIN;

  function newTarget(last) {
    const fresh = pool.filter((x) => x.key !== last);
    setTarget(fresh[Math.floor(Math.random() * fresh.length)].key);
    setBalloons([]);
  }
  useEffect(() => newTarget(), [pool]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!won) sayLetter(target);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => stop, []);

  // A new balloon every second or so (slower for the little ones). About 4 in 10 have Kokob's letter, so there's always one to find.
  useEffect(() => {
    if (won) return;
    const timer = setInterval(() => {
      const right = Math.random() < 0.4;
      const others = pool.filter((x) => x.key !== target);
      const letter = right ? target : others[Math.floor(Math.random() * others.length)].key;
      const id = nextId.current++;
      setBalloons((list) => [
        ...list.slice(-9),
        { id, letter, left: 4 + Math.random() * 80, secs: pace.balloonSecs + Math.random() * 2, color: BALLOON_COLORS[id % BALLOON_COLORS.length] },
      ]);
    }, pace.balloonEvery);
    return () => clearInterval(timer);
  }, [target, won, pool, pace]);

  useEffect(() => {
    if (!won) return;
    kokob(KOKOB.allFound[kid.gender === "boy" ? "boy" : "girl"][0]);
    onWin?.();
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps

  function tap(b) {
    if (b.popped) return;
    if (b.letter !== target) {
      setMiss(b.id);
      return setTimeout(() => setMiss(null), 500);
    }
    setBalloons((list) => list.map((x) => (x.id === b.id ? { ...x, popped: true } : x)));
    const now = score + 1;
    setScore(now);
    if (now < POP_WIN && now % POP_EACH === 0) setTimeout(() => newTarget(target), 700);
  }

  if (won) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <game.Pic size={150} />
        <div className="flex gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Star key={i} width="40" height="40" />
          ))}
        </div>
        <h2 className="text-4xl font-bold">You popped them all!</h2>
        <p className="text-lg text-muted">{POP_WIN} balloons with the right letter.</p>
        <button
          type="button"
          onClick={() => {
            setScore(0);
            newTarget(target);
          }}
          className="btn-brand text-lg"
        >
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 pt-2">
      <style>{`
        @keyframes popUp { from { transform: translateY(0); } to { transform: translateY(-560px); } }
        @keyframes popBurst { to { transform: scale(1.6); opacity: 0; } }
        @keyframes popShake { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
      `}</style>

      {/* Kokob shows the letter, and the stars count the pops */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Kokob size={90} />
          <div className={`relative rounded-3xl bg-white px-6 py-3 text-2xl font-bold ${T.geez ? "font-geez" : ""}`}>
            <span className="absolute -left-2 top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 bg-white" aria-hidden="true" />
            {fill(T.pop("@"), <span className={`text-4xl text-brand ${geez ? "font-geez" : "font-display"}`}>{target}</span>)}
          </div>
          <SpeakButton onClick={() => sayLetter(target)} label="Hear the letter again" />
        </div>
        <div className="flex gap-1" aria-label={`${score} of ${POP_WIN}`}>
          {Array.from({ length: POP_WIN }, (_, i) => (
            <span key={i} className={i < score ? "" : "opacity-25 grayscale"}>
              <Star width="22" height="22" />
            </span>
          ))}
        </div>
      </div>

      {/* The sky the balloons float up through */}
      <div className="relative h-[420px] overflow-hidden rounded-3xl bg-gradient-to-b from-[#CFE3FF] to-[#EEF5FF]">
        {balloons.map((b) => (
          <div
            key={b.id}
            className="absolute top-full"
            style={{ left: `${b.left}%`, animation: `popUp ${b.secs}s linear forwards` }}
            onAnimationEnd={(e) => e.animationName === "popUp" && setBalloons((list) => list.filter((x) => x.id !== b.id))}
          >
            <button
              type="button"
              onClick={() => tap(b)}
              aria-label={`Balloon ${b.letter}`}
              className="relative block h-32 w-24"
              style={b.popped ? { animation: "popBurst 0.3s forwards" } : miss === b.id ? { animation: "popShake 0.4s" } : undefined}
            >
              <Balloon color={b.color} />
              <span className={`relative -top-4 text-5xl font-bold text-white drop-shadow ${geez ? "font-geez" : "font-display"}`}>{b.letter}</span>
            </button>
          </div>
        ))}
      </div>
      <p className={`min-h-[1.5em] text-center font-bold text-accent ${T.geez ? "font-geez" : ""}`}>{miss !== null ? T.popMiss : ""}</p>
    </div>
  );
}

// The "you won" screen the newer games share.
function WinScreen({ game, title, note, onAgain }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <game.Pic size={150} />
      <div className="flex gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <Star key={i} width="40" height="40" />
        ))}
      </div>
      <h2 className="text-4xl font-bold">{title}</h2>
      <p className="text-lg text-muted">{note}</p>
      <button type="button" onClick={onAgain} className="btn-brand text-lg">
        Play again
      </button>
    </div>
  );
}

// Dots to count, in rows of 5 (so 7 = 5 + 2, easy to see).
const Dots = ({ n }) => (
  <div className="flex flex-wrap justify-center gap-2" style={{ width: 5 * 44 }}>
    {Array.from({ length: n }, (_, i) => (
      <span key={i} className="h-9 w-9 rounded-full bg-accent" />
    ))}
  </div>
);

// "Race the camel": count the dots and tap the number. Every right answer moves Gemel one step; the goat walks on
// its own every few seconds. Get Gemel to the finish first! Numbers 1 to 10, with the number word under each.
const RACE_STEPS = 6;

function numberRound(max, last) {
  let n;
  do n = 1 + Math.floor(Math.random() * max);
  while (n === last);
  const others = shuffle(Array.from({ length: max }, (_, i) => i + 1).filter((x) => x !== n)).slice(0, 3);
  return { n, options: shuffle([n, ...others]) };
}

// One lane of the race track, with the finish flag on the right.
const Lane = ({ pos, children }) => (
  <div className="relative h-24 rounded-2xl bg-[#F3E2BF]">
    <span className="absolute right-3 top-0 h-full border-r-4 border-dashed border-ink/40" aria-hidden="true" />
    <span className="absolute right-4 top-1 text-2xl" aria-hidden="true">🏁</span>
    <div className="absolute top-2 transition-all duration-700" style={{ left: `${(Math.min(pos, RACE_STEPS) / RACE_STEPS) * 82}%` }}>
      {children}
    </div>
  </div>
);

function Race({ game, words, pace, onWin }) {
  const { kid } = useKid();
  const T = gameText(kid);
  const [q, setQ] = useState(() => numberRound(10));
  const [camel, setCamel] = useState(0);
  const [goat, setGoat] = useState(0);
  const [wrong, setWrong] = useState(null);
  const [started, setStarted] = useState(false);
  const over = camel >= RACE_STEPS ? "win" : goat >= RACE_STEPS ? "lose" : null;

  // The goat walks on its own once the race starts.
  useEffect(() => {
    if (!started || over) return;
    const t = setInterval(() => setGoat((g) => g + 1), pace.goatSecs * 1000);
    return () => clearInterval(t);
  }, [started, over]);
  useEffect(() => {
    if (over === "win") onWin?.();
  }, [over]); // eslint-disable-line react-hooks/exhaustive-deps

  function again() {
    setCamel(0);
    setGoat(0);
    setQ((old) => numberRound(10, old.n));
    setStarted(true);
  }

  function choose(x) {
    if (over) return;
    if (x !== q.n) return setWrong(x);
    setWrong(null);
    setCamel((c) => c + 1);
    setQ(numberRound(10, q.n));
  }

  if (over === "win") return <WinScreen game={game} title="Gemel won the race!" note="You counted fast. Well done!" onAgain={again} />;

  return (
    <div className="flex flex-1 flex-col gap-5 pt-4">
      {/* The race track: Gemel on top, the goat below */}
      <div className="space-y-2">
        <Lane pos={camel}>
          <Camel size={80} />
        </Lane>
        <Lane pos={goat}>
          <Goat size={80} />
        </Lane>
      </div>

      {over === "lose" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <h2 className="text-3xl font-bold">The goat won this time!</h2>
          <p className="text-muted">Count fast and help Gemel win.</p>
          <button type="button" onClick={again} className="btn-brand text-lg">
            Race again
          </button>
        </div>
      ) : !started ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className={`text-xl font-bold ${T.geez ? "font-geez" : ""}`}>{T.raceHow}</p>
          <button type="button" onClick={() => setStarted(true)} className="btn-brand text-lg">
            {T.raceStart}
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-between gap-4">
          <Dots n={q.n} />
          <div className="grid grid-cols-4 gap-4">
            {q.options.map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => choose(x)}
                className={`flex h-24 w-24 flex-col items-center justify-center rounded-3xl border-4 font-bold transition hover:-translate-y-1 ${
                  wrong === x ? "border-accent bg-accent-soft text-accent" : "border-line bg-white"
                }`}
              >
                <span className="font-display text-4xl">{x}</span>
                {words && <span className="font-geez text-sm text-muted">{words[x - 1]}</span>}
              </button>
            ))}
          </div>
          <p className={`min-h-[1.5em] font-bold text-accent ${T.geez ? "font-geez" : ""}`}>{wrong ? T.countAgain : ""}</p>
        </div>
      )}
    </div>
  );
}

// "Speed round": 30 seconds. Each question is a letter to find or dots to count; get as many right as you can.
// Wrong answers cost nothing (just try again). Your best score is kept in this browser, one per language.
const SPEED_SECS = 30;

function speedQuestion(letters) {
  if (Math.random() < 0.5) {
    const r = makeRound(letters);
    return { kind: "letter", answer: r.answer.key, options: r.options.map((x) => x.key) };
  }
  const r = numberRound(5);
  return { kind: "count", answer: r.n, options: r.options };
}

function Speed({ game, letters, geez, lang, onWin }) {
  const { kid } = useKid();
  const T = gameText(kid);
  const bestKey = `hehu-speed-best-${lang}`;
  const [left, setLeft] = useState(0); // seconds left; 0 = not playing
  const [played, setPlayed] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [q, setQ] = useState(null);
  const [wrong, setWrong] = useState(null);

  useEffect(() => setBest(Number(localStorage.getItem(bestKey)) || 0), [bestKey]);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  // Time's up: keep the best score; 5 or more right finishes a path stop.
  useEffect(() => {
    if (!played || left > 0) return;
    if (score > best) {
      setBest(score);
      localStorage.setItem(bestKey, String(score));
    }
    if (score >= 5) onWin?.();
  }, [left]); // eslint-disable-line react-hooks/exhaustive-deps

  function start() {
    setScore(0);
    setWrong(null);
    setQ(speedQuestion(letters));
    setPlayed(true);
    setLeft(SPEED_SECS);
  }

  function choose(x) {
    if (x !== q.answer) return setWrong(x);
    setWrong(null);
    setScore((s) => s + 1);
    setQ(speedQuestion(letters));
  }

  if (left <= 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <game.Pic size={140} />
        {played ? (
          <>
            <h2 className="text-4xl font-bold">You got {score} right!</h2>
            <p className="text-lg text-muted">{score >= best && score > 0 ? "That's your best ever!" : `Your best: ${best}`}</p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold">Ready? You have {SPEED_SECS} seconds.</h2>
            <p className="text-lg text-muted">Find the letter or count the dots. As many as you can!{best ? ` Your best: ${best}` : ""}</p>
          </>
        )}
        <button type="button" onClick={start} className="btn-brand text-lg">
          {played ? "Play again" : "Start"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-5 pt-4">
      {/* The clock and the score */}
      <div className="flex w-full items-center gap-4">
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brand transition-all duration-1000 ease-linear" style={{ width: `${(left / SPEED_SECS) * 100}%` }} />
        </div>
        <span className={`w-14 text-right text-2xl font-bold ${left <= 5 ? "text-accent" : ""}`}>{left}s</span>
        <span className="rounded-full bg-good-soft px-4 py-1 text-xl font-bold text-good">{score}</span>
      </div>

      {q.kind === "letter" ? (
        <p className={`text-3xl font-bold ${T.geez ? "font-geez" : ""}`}>
          {T.find} <span className={`text-5xl text-brand ${geez ? "font-geez" : "font-display"}`}>{q.answer}</span>
        </p>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className={`text-3xl font-bold ${T.geez ? "font-geez" : ""}`}>{T.howMany}</p>
          <Dots n={q.answer} />
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {q.options.map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => choose(x)}
            className={`h-24 w-24 rounded-3xl border-4 text-5xl font-bold transition hover:-translate-y-1 ${
              q.kind === "letter" && geez ? "font-geez" : "font-display"
            } ${wrong === x ? "border-accent bg-accent-soft text-accent" : "border-line bg-white"}`}
          >
            {x}
          </button>
        ))}
      </div>
      <p className="min-h-[1.5em] font-bold text-accent">{wrong !== null ? T.again : ""}</p>
    </div>
  );
}

// "Star map": Kokob's night sky. The stars carry the letters of one unit; tap them in letter order (ሀ, ለ, ሐ…) and
// a line joins them into a star picture. Kokob says each letter in Aki's voice (silent until recorded).
// Play again moves on to the next unit's letters.
const SPOTS = [
  [12, 22], [32, 14], [55, 20], [80, 15], [20, 52], [44, 48],
  [68, 45], [88, 55], [10, 82], [34, 80], [60, 78], [84, 85],
];

function StarMap({ game, units, geez, english, onWin }) {
  const { kid } = useKid();
  const T = gameText(kid);
  const kokob = useFriendVoice("kokob");
  const [unit, setUnit] = useState(0);
  const [spots, setSpots] = useState(SPOTS.slice(0, 6));
  const [lit, setLit] = useState(0); // how many stars are joined so far
  const [wrong, setWrong] = useState(null);
  const letters = units[unit % units.length].letters;
  const won = lit === letters.length;

  useEffect(() => setSpots(shuffle(SPOTS).slice(0, letters.length)), [unit, letters.length]);
  useEffect(() => stop, []);
  useEffect(() => {
    if (won) onWin?.();
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps

  function tap(i) {
    if (won || i < lit) return;
    if (i !== lit) {
      setWrong(i);
      return setTimeout(() => setWrong(null), 500);
    }
    if (english) kokob(letters[i][0], "en");
    else kokob(letters[i]);
    setLit(i + 1);
  }

  if (won)
    return (
      <WinScreen
        game={game}
        title="You drew the star map!"
        note={`Map ${(unit % units.length) + 1} of ${units.length}: ${letters.join(" ")}`}
        onAgain={() => {
          setLit(0);
          setUnit((u) => u + 1);
        }}
      />
    );

  return (
    <div className="flex flex-1 flex-col gap-4 pt-2">
      <style>{`@keyframes starShake { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }`}</style>
      <div className="flex items-center justify-between">
        <p className={`text-xl font-bold ${T.geez ? "font-geez" : ""}`}>
          {T.nextStar} <span className={`text-3xl text-brand ${geez ? "font-geez" : "font-display"}`}>{letters[lit]}</span>
        </p>
        <p className="font-bold text-muted">
          Map {(unit % units.length) + 1} of {units.length}
        </p>
      </div>

      {/* The night sky */}
      <div className="relative h-[440px] overflow-hidden rounded-3xl bg-gradient-to-b from-[#0B1B3A] to-[#1B3A6B]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {spots.slice(0, lit).map((p, i) =>
            i === 0 ? null : (
              <line key={i} x1={spots[i - 1][0]} y1={spots[i - 1][1]} x2={p[0]} y2={p[1]} stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            ),
          )}
        </svg>
        {spots.map(([x, y], i) => (
          <button
            key={i}
            type="button"
            onClick={() => tap(i)}
            aria-label={`Star ${letters[i]}`}
            className="absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${x}%`, top: `${y}%`, animation: wrong === i ? "starShake 0.4s" : undefined }}
          >
            <span className={`absolute inset-0 transition ${i < lit ? "scale-125 drop-shadow-[0_0_14px_#FFC93C]" : "opacity-45"}`}>
              <Star width="80" height="80" />
            </span>
            <span className={`relative text-3xl font-bold ${i < lit ? "text-ink" : "text-ink/80"} ${geez ? "font-geez" : "font-display"}`}>{letters[i]}</span>
          </button>
        ))}
      </div>
      <p className={`min-h-[1.5em] text-center font-bold text-accent ${T.geez ? "font-geez" : ""}`}>{wrong !== null ? T.starMiss(letters[lit]) : ""}</p>
    </div>
  );
}

function GamesPage() {
  const { kid, update } = useKid();
  const lang = langOf(kid);
  const params = useSearchParams();
  const lessonId = params.get("lesson");
  const english = kid.track === "english";
  const course = useMemo(
    () => (lessonId ? findLesson(levelsFor(kid.learner, kid.track, kid.lang), lessonId) : null),
    [lessonId, kid.learner, kid.track, kid.lang],
  );
  // The games that fit this learner's age come first; the others wait under "Games for other ages".
  const group = ageGroup(kid);
  const fits = GAMES.filter((g) => g.ages.includes(group));
  const others = GAMES.filter((g) => !g.ages.includes(group));
  const [showOthers, setShowOthers] = useState(false);
  const [picked, setPicked] = useState(null);
  const gameId = picked || (course?.themes?.length || english ? "pics" : fits[0].id);
  const stageRef = useRef(null);
  // Picking a game shows it: on a narrow screen the list is below the game, so scroll up to it.
  function pick(id) {
    setPicked(id);
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const game = GAMES.find((g) => g.id === gameId);
  // The "Learn English" track plays with English letters and number words, not the language the learner speaks.
  const gameLang = english ? "en" : kid.lang;
  const geez = usesGeez(gameLang);
  const words = NUMBER_WORDS[gameLang];

  // Letters come from the first unit of the child's path; numbers are 1 to 5.
  const pools = useMemo(
    () => ({
      letters: letterUnits(gameLang)[0].letters.map((l) => ({ key: l, big: l })),
      math: Array.from({ length: 5 }, (_, i) => ({ key: String(i + 1), big: String(i + 1), count: i + 1 })),
      // The unit's words (from the path), or animals and colors. The picture is what you tap.
      words: lessonItems(course?.themes?.length ? course : { type: "game", themes: ["animals", "colors", "food"] }, kid.track)
        .filter((x, i, all) => all.findIndex((y) => y.pic === x.pic) === i)
        .map((x) => ({ ...x, key: x.word, big: x.pic })),
    }),
    [kid.track, course, gameLang],
  );

  // The game is drawn only in the browser: it depends on the lesson in the address and the child's saved choices,
  // which the server can't see (so the first round would not match).
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  // Winning a game from the path finishes that stop (3 stars).
  function onWin() {
    if (lessonId && !(kid.stars || {})[lessonId]) update({ stars: { ...(kid.stars || {}), [lessonId]: 3 } });
  }

  return (
    <main>
      <div className="mb-8">
        <p className="eyebrow text-brand">Games</p>
        <h1 className="mt-1 text-4xl font-bold">{english ? "Play and learn English" : `Play and learn in ${lang.name}`}</h1>
        <p className="mt-2 text-lg text-muted">
          {english ? `English letters, numbers and words, for ${lang.name} speakers.` : "Every game uses the letters and numbers from your path."}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* The game being played */}
        <section ref={stageRef} className={`card flex min-h-[560px] scroll-mt-40 flex-col p-8 ${game.id === "goat" ? "bg-[#F1F8EC]" : "bg-[#FFF6E9]"}`}>
          <h2 className="text-2xl font-bold">{game.title}</h2>
          <p className="text-muted">{game.note}</p>
          {ready &&
            (game.id === "memory" ? (
              <Memory key={`memory-${kid.lang}-${kid.track}`} game={game} pool={pools.words} english={english} onWin={onWin} />
            ) : game.id === "race" ? (
              <Race key={`race-${gameLang}-${group}`} game={game} words={words} pace={PACE[group]} onWin={onWin} />
            ) : game.id === "speed" ? (
              <Speed key={`speed-${gameLang}`} game={game} letters={pools.letters} geez={geez} lang={gameLang} onWin={onWin} />
            ) : game.id === "stars" ? (
              <StarMap key={`stars-${gameLang}`} game={game} units={letterUnits(gameLang)} geez={geez} english={english} onWin={onWin} />
            ) : game.id === "pop" ? (
              <Pop key={`pop-${kid.lang}-${kid.track}-${group}`} game={game} pool={pools.letters} geez={geez} english={english} pace={PACE[group]} onWin={onWin} />
            ) : game.id === "build" ? (
              <Build key={`build-${kid.lang}-${kid.track}`} game={game} pool={pools.words} english={english} onWin={onWin} />
            ) : (
              <Stage key={`${game.id}-${kid.lang}-${kid.track}`} game={game} pool={pools[game.kind]} geez={geez} words={words} english={english} onWin={onWin} />
            ))}
        </section>

        {/* All games */}
        <aside className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <span className="text-brand"><GamePad width="24" height="24" /></span> Best for {AGE_GROUPS[group]}
          </h2>
          {[...fits, ...(showOthers ? others : [])].map((g, i) => (
            <div key={g.id}>
              {i === fits.length && <p className="eyebrow mb-3 mt-6 text-muted">Games for other ages</p>}
            <button
              type="button"
              disabled={g.soon}
              onClick={() => pick(g.id)}
              aria-pressed={g.id === gameId}
              className={`card flex w-full items-center gap-4 p-4 text-left transition ${
                g.id === gameId ? "border-brand bg-soft" : g.soon ? "opacity-60" : "hover:border-brand/50"
              }`}
            >
              <g.Pic size={60} />
              <span className="flex-1">
                <b className="block text-lg leading-tight">{g.title}</b>
                <span className="text-sm text-muted">
                  {g.soon ? "Coming soon" : g.kind === "mixed" ? "Letters and numbers" : g.kind === "math" ? `Numbers in ${english ? "English" : lang.name}` : g.kind === "words" ? (english ? "English words" : `${lang.name} words`) : `${english ? "English" : lang.name} letters`}
                </span>
              </span>
              {g.id === gameId && (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
                  <Check width="16" height="16" />
                </span>
              )}
            </button>
            </div>
          ))}
          {others.length > 0 && (
            <button type="button" onClick={() => setShowOthers((v) => !v)} className="w-full rounded-2xl border-2 border-dashed border-line px-4 py-3 font-bold text-muted hover:border-brand/50">
              {showOthers ? "Hide games for other ages" : `Show games for other ages (${others.length})`}
            </button>
          )}
        </aside>
      </div>
    </main>
  );
}

// useSearchParams needs a Suspense wrapper when the site is built as static files.
export default function Games() {
  return (
    <Suspense fallback={null}>
      <GamesPage />
    </Suspense>
  );
}
