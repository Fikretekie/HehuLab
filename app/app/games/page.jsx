"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { langOf, useKid } from "../../../components/KidState";
import { Camel, Goat, Kokob, Sheep } from "../../../components/Avatars";
import { Check, GamePad, Star } from "../../../components/Icons";
import { NUMBER_WORDS, letterUnits, usesGeez } from "../../../components/curriculum";
import { SpeakButton, stop, useFriendVoice, useVoice } from "../../../components/Voice";
import { KOKOB } from "../../../components/kokobLines";
import { findLesson, lessonItems, levelsFor } from "../../../components/courses";

// Screen 5 (web): Games. The game you're playing is big on the left; all games are listed on the right.
// Every game uses the child's language: letters from their path, numbers said with their number words, and the words
// of the unit ("Find the picture"). A "Play" stop on the path opens here with ?lesson=… and keeps the stars.

const ROUNDS = 5;

const Cup = () => (
  <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M10 18h24l-3 18a4 4 0 0 1-4 3H17a4 4 0 0 1-4-3z" fill="#FFFFFF" stroke="#102542" strokeWidth="2.5" />
    <path d="M34 22h3a4 4 0 0 1 0 8h-4" stroke="#102542" strokeWidth="2.5" fill="none" />
    <path d="M14 22h16" stroke="#B8441C" strokeWidth="3" />
    <path d="M19 8c-2 3 2 4 0 7M26 8c-2 3 2 4 0 7" stroke="#4D5E78" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

const GAMES = [
  { id: "goat", title: "Feed the goat", note: "Find the letter Fiyel asks for", Pic: Goat, kind: "letters" },
  { id: "cups", title: "Count the coffee cups", note: "How many cups for the coffee ceremony?", Pic: Camel, kind: "math" },
  { id: "pics", title: "Find the picture", note: "Bebe says a word. Tap its picture!", Pic: Sheep, kind: "words" },
  { id: "memory", title: "Memory match", note: "Turn two cards: find each picture and its word", Pic: Kokob, kind: "words" },
  { id: "build", title: "Build the word", note: "Look at the picture. Tap the letters in order!", Pic: Kokob, kind: "words" },
  { id: "race", title: "Race the camel", note: "Coming soon", Pic: Camel, soon: true },
];

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
  const voice = useVoice();
  const talk = (line, text) => voice({ line, text });
  const ask = () =>
    game.id === "goat"
      ? voice({ word: round.answer.key, text: "Fiyel wants this letter! Can you find it?" })
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
        Fiyel wants <span className={geez ? "font-geez" : ""}>{round.answer.big}</span>!
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
        <div className="relative rounded-3xl bg-white px-7 py-5 text-3xl font-bold">
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
      <p className="min-h-[1.5em] font-bold text-accent">{wrong ? "Not that one. Try again!" : ""}</p>
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
  const [gameId, setGameId] = useState(course?.themes?.length || english ? "pics" : "goat");
  const game = GAMES.find((g) => g.id === gameId);
  const geez = usesGeez(kid.lang);
  const words = NUMBER_WORDS[kid.lang];

  // Letters come from the first unit of the child's path; numbers are 1 to 5.
  const pools = useMemo(
    () => ({
      letters: letterUnits(kid.lang)[0].letters.map((l) => ({ key: l, big: l })),
      math: Array.from({ length: 5 }, (_, i) => ({ key: String(i + 1), big: String(i + 1), count: i + 1 })),
      // The unit's words (from the path), or animals and colors. The picture is what you tap.
      words: lessonItems(course?.themes?.length ? course : { type: "game", themes: ["animals", "colors", "food"] }, kid.track)
        .filter((x, i, all) => all.findIndex((y) => y.pic === x.pic) === i)
        .map((x) => ({ ...x, key: x.word, big: x.pic })),
    }),
    [kid.lang, kid.track, course],
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
        <h1 className="mt-1 text-4xl font-bold">Play and learn in {lang.name}</h1>
        <p className="mt-2 text-lg text-muted">Every game uses the letters and numbers from your path.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* The game being played */}
        <section className={`card flex min-h-[560px] flex-col p-8 ${game.id === "goat" ? "bg-[#F1F8EC]" : "bg-[#FFF6E9]"}`}>
          <h2 className="text-2xl font-bold">{game.title}</h2>
          <p className="text-muted">{game.note}</p>
          {ready &&
            (game.id === "memory" ? (
              <Memory key={`memory-${kid.lang}-${kid.track}`} game={game} pool={pools.words} english={english} onWin={onWin} />
            ) : game.id === "build" ? (
              <Build key={`build-${kid.lang}-${kid.track}`} game={game} pool={pools.words} english={english} onWin={onWin} />
            ) : (
              <Stage key={`${game.id}-${kid.lang}-${kid.track}`} game={game} pool={pools[game.kind]} geez={geez} words={words} english={english} onWin={onWin} />
            ))}
        </section>

        {/* All games */}
        <aside className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <span className="text-brand"><GamePad width="24" height="24" /></span> All games
          </h2>
          {GAMES.map((g) => (
            <button
              key={g.id}
              type="button"
              disabled={g.soon}
              onClick={() => setGameId(g.id)}
              aria-pressed={g.id === gameId}
              className={`card flex w-full items-center gap-4 p-4 text-left transition ${
                g.id === gameId ? "border-brand bg-soft" : g.soon ? "opacity-60" : "hover:border-brand/50"
              }`}
            >
              <g.Pic size={60} />
              <span className="flex-1">
                <b className="block text-lg leading-tight">{g.title}</b>
                <span className="text-sm text-muted">
                  {g.soon ? "Coming soon" : g.kind === "math" ? `Numbers in ${lang.name}` : g.kind === "words" ? (english ? "English words" : `${lang.name} words`) : `${lang.name} letters`}
                </span>
              </span>
              {g.id === gameId && (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
                  <Check width="16" height="16" />
                </span>
              )}
            </button>
          ))}
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
