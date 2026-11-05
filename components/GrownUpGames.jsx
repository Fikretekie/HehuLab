"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "./Icons";
import { SpeakButton, stop, useVoice } from "./Voice";

// Step 2: games for grown-ups. They use whole phrases and sentences (Rodas recorded them), not single letters.
//   Phrase match    – tap a phrase, then its meaning.
//   Sentence builder – tap the words in the right order to build the sentence.
//   Listen & choose  – Rodas says a phrase; pick what it means.
// Native track: the phrase is in the learner's language, the meaning in English.
// English track: the phrase is in English, the meaning in their language (the browser reads the English for now).

const ROUNDS = 5;

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

// What the learner is learning (`learn`) and what they already know (`know`).
// English is written one way everywhere: capital first letter, no full stop at the end ("Good evening", "How are you?").
const tidy = (s) => {
  const t = s.trim().replace(/\.$/, "");
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const sides = (w, english) => (english ? { learn: tidy(w.english), know: w.native } : { learn: w.native, know: tidy(w.english) });
const learnFont = (english) => (english ? "font-display" : "font-geez");
const knowFont = (english) => (english ? "font-geez" : "font-display");

// Rodas reads a phrase: her recording in the native track, the browser's English voice in the English track.
function useSay(english) {
  const voice = useVoice();
  return (w) => voice(english ? { text: w.english, lang: "en" } : { word: w.word, text: w.english });
}

function Stars({ score, of }) {
  return (
    <div className="flex gap-2" aria-label={`${score} of ${of}`}>
      {Array.from({ length: of }, (_, i) => (
        <span key={i} className={i < score ? "" : "opacity-25 grayscale"}>
          <Star width="28" height="28" />
        </span>
      ))}
    </div>
  );
}

function Win({ game, title, note, onAgain }) {
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

const Empty = () => <p className="m-auto text-lg text-muted">No phrases in this unit yet.</p>;

// ---------- Phrase match: 5 phrases on the left, their meanings mixed up on the right ----------
export function PhraseMatch({ game, pool, english, onWin }) {
  const say = useSay(english);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [pick, setPick] = useState(null); // the phrase tapped on the left
  const [found, setFound] = useState([]);
  const [wrong, setWrong] = useState(null);
  const won = left.length > 0 && found.length === left.length;

  function deal() {
    const five = shuffle(pool).slice(0, ROUNDS);
    setLeft(five);
    setRight(shuffle(five));
    setPick(null);
    setFound([]);
  }
  useEffect(deal, [pool]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (won) onWin?.();
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => stop, []);

  if (!pool.length) return <Empty />;
  if (won) return <Win game={game} title="All matched!" note={`You know all ${left.length} phrases.`} onAgain={deal} />;

  function tapLeft(w) {
    if (found.includes(w.key)) return;
    setPick(w);
    say(w);
  }
  function tapRight(w) {
    if (!pick || found.includes(w.key)) return;
    if (w.key === pick.key) {
      setFound((f) => [...f, w.key]);
      setPick(null);
    } else {
      setWrong(w.key);
      setTimeout(() => setWrong(null), 700);
    }
  }

  const box = "w-full rounded-2xl border-4 px-4 py-3 text-left font-bold transition";
  return (
    <div className="flex flex-1 flex-col gap-5 pt-2">
      <div className="self-end">
        <Stars score={found.length} of={left.length} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          {left.map((w) => (
            <button
              key={w.key}
              type="button"
              onClick={() => tapLeft(w)}
              className={`${box} text-xl ${learnFont(english)} ${
                found.includes(w.key) ? "border-good bg-good-soft text-good" : pick?.key === w.key ? "border-brand bg-soft" : "border-line bg-white hover:border-brand/50"
              }`}
            >
              {found.includes(w.key) && "✓ "}
              {sides(w, english).learn}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {right.map((w) => (
            <button
              key={w.key}
              type="button"
              onClick={() => tapRight(w)}
              className={`${box} text-lg ${knowFont(english)} ${
                found.includes(w.key) ? "border-good bg-good-soft text-good" : wrong === w.key ? "border-accent bg-accent-soft text-accent" : "border-line bg-white hover:border-brand/50"
              }`}
            >
              {found.includes(w.key) && "✓ "}
              {sides(w, english).know}
            </button>
          ))}
        </div>
      </div>
      <p className="min-h-[1.5em] text-center font-bold text-accent">{wrong ? "Not that one. Try again!" : ""}</p>
    </div>
  );
}

// ---------- Sentence builder: tap the words in order ----------
// Only sentences of 3 or more words. One extra word from another sentence makes it harder.
export function SentenceBuilder({ game, pool, english, onWin }) {
  const say = useSay(english);
  const sentences = useMemo(
    () => pool.map((w) => ({ ...w, parts: sides(w, english).learn.split(/\s+/).filter(Boolean) })).filter((w) => w.parts.length >= 3),
    [pool, english],
  );
  const [round, setRound] = useState(null);
  const [placed, setPlaced] = useState([]);
  const [wrong, setWrong] = useState(null);
  const [score, setScore] = useState(0);
  const won = score >= ROUNDS;

  function next(last) {
    const fresh = sentences.filter((w) => w.key !== last?.key);
    const w = fresh[Math.floor(Math.random() * fresh.length)] || sentences[0];
    if (!w) return;
    const extra = shuffle(sentences.filter((x) => x.key !== w.key).flatMap((x) => x.parts).filter((p) => !w.parts.includes(p)))[0];
    setRound({ w, tiles: shuffle([...w.parts, ...(extra ? [extra] : [])].map((p, i) => ({ id: i, p }))) });
    setPlaced([]);
    setWrong(null);
  }
  useEffect(() => next(), [sentences]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (won) onWin?.();
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => stop, []);

  if (!sentences.length) return <Empty />;
  if (won)
    return (
      <Win
        game={game}
        title="You built them all!"
        note={`All ${ROUNDS} sentences.`}
        onAgain={() => {
          setScore(0);
          next();
        }}
      />
    );
  if (!round) return null;

  const { w, tiles } = round;
  const done = placed.length === w.parts.length;
  function tap(t) {
    if (done || placed.includes(t)) return;
    if (t.p !== w.parts[placed.length]) {
      setWrong(t.id);
      return setTimeout(() => setWrong(null), 700);
    }
    const now = [...placed, t];
    setPlaced(now);
    if (now.length === w.parts.length) {
      say(w);
      setTimeout(() => {
        setScore((s) => s + 1);
        next(w);
      }, 2200);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 pt-2">
      <div className="self-end">
        <Stars score={score} of={ROUNDS} />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-5xl" aria-hidden="true">
          {w.pic}
        </span>
        <p className={`text-2xl font-bold ${knowFont(english)}`}>{sides(w, english).know}</p>
      </div>

      {/* The sentence so far */}
      <div className={`flex min-h-[4.5rem] w-full flex-wrap items-center justify-center gap-2 rounded-3xl border-4 px-4 py-3 ${done ? "border-good bg-good-soft" : "border-dashed border-line bg-white/60"}`}>
        {placed.map((t) => (
          <span key={t.id} className={`text-3xl font-bold ${learnFont(english)} ${done ? "text-good" : ""}`}>
            {t.p}
          </span>
        ))}
      </div>

      {/* The words to tap */}
      <div className="flex flex-wrap justify-center gap-3">
        {tiles.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => tap(t)}
            disabled={placed.includes(t)}
            className={`rounded-2xl border-4 px-5 py-3 text-2xl font-bold transition ${learnFont(english)} ${
              placed.includes(t)
                ? "border-dashed border-line bg-transparent text-transparent"
                : wrong === t.id
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-brand bg-white hover:-translate-y-1"
            }`}
          >
            {t.p}
          </button>
        ))}
      </div>
      <p className="min-h-[1.5em] font-bold text-accent">{wrong !== null ? "Not that word yet. Which comes next?" : done ? "Yes! Listen to Rodas say it." : ""}</p>
    </div>
  );
}

// ---------- Listen & choose: hear a phrase, pick its meaning (the words stay hidden until you answer) ----------
export function ListenChoose({ game, pool, english, onWin }) {
  const say = useSay(english);
  const [round, setRound] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [ok, setOk] = useState(false);
  const [score, setScore] = useState(0);
  const won = score >= ROUNDS;

  function next(last) {
    const fresh = pool.filter((w) => w.key !== last?.key);
    const answer = fresh[Math.floor(Math.random() * fresh.length)] || pool[0];
    if (!answer) return;
    setRound({ answer, options: shuffle([answer, ...shuffle(pool.filter((x) => x.key !== answer.key)).slice(0, 3)]) });
    setWrong([]);
    setOk(false);
  }
  useEffect(() => next(), [pool]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (round && !won) say(round.answer);
  }, [round]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (won) onWin?.();
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => stop, []);

  if (!pool.length) return <Empty />;
  if (won)
    return (
      <Win
        game={game}
        title="Great listening!"
        note={`You understood all ${ROUNDS} phrases.`}
        onAgain={() => {
          setScore(0);
          next();
        }}
      />
    );
  if (!round) return null;

  function choose(w) {
    if (ok) return;
    if (w.key !== round.answer.key) return setWrong((x) => [...x, w.key]);
    setOk(true);
    setTimeout(() => {
      setScore((s) => s + 1);
      next(round.answer);
    }, 1800);
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 pt-2">
      <div className="self-end">
        <Stars score={score} of={ROUNDS} />
      </div>
      <div className="flex flex-col items-center gap-3 text-center">
        <game.Pic size={110} />
        <div className="flex items-center gap-3">
          <p className="text-2xl font-bold">What did Rodas say?</p>
          <SpeakButton onClick={() => say(round.answer)} label="Hear it again" />
        </div>
        <p className={`min-h-[2.5rem] text-3xl font-bold text-good ${learnFont(english)}`}>{ok ? sides(round.answer, english).learn : ""}</p>
      </div>
      <div className="grid w-full grid-cols-2 gap-4">
        {round.options.map((w) => (
          <button
            key={w.key}
            type="button"
            onClick={() => choose(w)}
            disabled={wrong.includes(w.key)}
            className={`rounded-2xl border-4 px-4 py-4 text-xl font-bold transition ${knowFont(english)} ${
              ok && w.key === round.answer.key
                ? "border-good bg-good-soft text-good"
                : wrong.includes(w.key)
                  ? "border-accent bg-accent-soft text-accent opacity-60"
                  : "border-line bg-white hover:border-brand/50"
            }`}
          >
            {sides(w, english).know}
          </button>
        ))}
      </div>
      <p className="min-h-[1.5em] font-bold text-accent">{wrong.length && !ok ? "Not that one. Listen again!" : ""}</p>
    </div>
  );
}
