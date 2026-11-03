"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { langOf, useKid } from "../../../components/KidState";
import { Star } from "../../../components/Icons";
import RodasLive from "../../../components/RodasLive";
import { LINES, REACTIONS, AUDIO, line } from "../../../components/rodasLines";
import { MATH, NUMBER_WORDS, family, letterUnits, usesGeez } from "../../../components/curriculum";
import { findLesson, lessonItems, levelsFor } from "../../../components/courses";
import { playClip, recordingUrl, stop as stopVoice } from "../../../components/Voice";

// Screen 4 (web): a guided talk with Rodas. For each letter of one family (ሀ ሁ ሂ ሃ ሄ ህ ሆ):
// Rodas says it → asks "ሀ በሊ" → listens (microphone, sound bar, stops by itself after a short pause) →
// plays the child's own voice back → "ጽቡቕ ገይርኪ!" and a star. Nothing heard: she thinks, "ደጊምኪ በሊ", listens again.
// The child can cut in: if the microphone hears talking while Rodas speaks, she stops and listens.
// Everything runs in the browser. No accounts, no server.

const SPEAK = 0.06; // the child is talking when the sound level is above this (0 to 1)
const CUT_IN = 0.12; // louder, and for a moment, to stop Rodas mid-line (so her own voice doesn't stop her)
const QUIET_MS = 1200; // this much quiet after talking = the child is done
const WAIT_MS = 6000; // nobody said anything for this long = nothing heard
const TRIES = 3; // after 3 "say it again" she moves on

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

// Does a planned audio file (public/audio/...) exist yet? Asked once per file.
const exists = {};
function hasFile(url) {
  exists[url] ||= fetch(url, { method: "HEAD" })
    .then((r) => r.ok && (r.headers.get("content-type") || "").startsWith("audio"))
    .catch(() => false);
  return exists[url];
}

// The letters (or numbers, or words) of this lesson. `word` is the name of Rodas's recording for it.
// A word lesson from the course (?lesson=k0u1-w-animals): in "Learn my language" the big text is the word and the
// English is under it; in "Learn English" the big text is English (said by the browser's English voice) and the
// child's language is under it (said by Rodas).
function useLesson(kid, params) {
  return useMemo(() => {
    const id = params.get("lesson");
    const course = id && findLesson(levelsFor(kid.learner, kid.track, kid.lang), id);
    if (course && course.type !== "letters") {
      const english = kid.track === "english";
      const items = lessonItems(course, kid.track).map((x) => ({
        big: english ? x.english : x.native,
        sub: english ? x.native : x.english + (x.note ? ` ${x.note}` : ""),
        word: x.word,
        say: english ? x.english : x.native,
        en: english ? x.english : null,
        pic: x.pic,
      }));
      return { kind: "words", id, english, title: course.type === "review" ? "Review" : course.title, items };
    }
    const mathId = params.get("math");
    if (mathId) {
      const m = MATH.find((x) => x.id === mathId) || MATH[0];
      const from = m.id === "m2" ? 6 : 1;
      const words = NUMBER_WORDS[kid.lang];
      const items = Array.from({ length: 5 }, (_, i) => {
        const n = from + i;
        return { big: String(n), sub: words?.[n - 1] || "", word: `#${n}`, say: words?.[n - 1] || String(n) };
      });
      return { kind: "math", title: m.title, items };
    }
    const letters = letterUnits(kid.lang).flatMap((u) => u.letters);
    const letter = params.get("letter") || letters[kid.done ?? 4] || letters[0];
    const items = family(letter).map((f) => ({ big: f, sub: "", word: f, say: f }));
    return { kind: "letter", id, title: usesGeez(kid.lang) ? `The ${letter} family` : `Letter ${letter.toUpperCase()}`, letter, index: letters.indexOf(letter), items };
  }, [kid.lang, kid.done, kid.learner, kid.track, params]);
}

// The browser's English voice (a woman's when it has one), for the "Learn English" words. Resolves when done.
const WOMEN = /female|woman|zira|aria|jenny|michelle|hazel|susan|samantha|victoria|karen|moira|tessa|fiona|google us english/i;
function speakEnglish(text) {
  return new Promise((done) => {
    const s = typeof window !== "undefined" && window.speechSynthesis;
    if (!s || !text) return done(false);
    const voices = s.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voices.find((v) => WOMEN.test(v.name)) || voices[0] || null;
    u.lang = "en-US";
    u.rate = 0.85;
    u.onend = u.onerror = () => done(true);
    s.cancel();
    s.speak(u);
    setTimeout(() => done(true), 6000); // some browsers never fire onend
  });
}

// The microphone: a live sound level, recording one answer, and noticing when the child cuts in.
function useMic() {
  const m = useRef({ stream: null, ctx: null, analyser: null, level: 0, onLoud: null, loudSince: 0, raf: 0 });
  const [level, setLevel] = useState(0);
  const [ok, setOk] = useState(null); // null = not asked yet, true = on, false = blocked or missing

  async function start() {
    if (m.current.stream) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(analyser);
      Object.assign(m.current, { stream, ctx, analyser });
      const buf = new Uint8Array(analyser.fftSize);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += ((v - 128) / 128) ** 2;
        const lv = Math.min(1, Math.sqrt(sum / buf.length) * 4);
        m.current.level = lv;
        setLevel(lv);
        // Cutting in: loud for a quarter of a second while Rodas is talking.
        if (m.current.onLoud && lv > CUT_IN) {
          m.current.loudSince ||= performance.now();
          if (performance.now() - m.current.loudSince > 250) {
            const f = m.current.onLoud;
            m.current.onLoud = null;
            f();
          }
        } else m.current.loudSince = 0;
        m.current.raf = requestAnimationFrame(tick);
      };
      tick();
      setOk(true);
      return true;
    } catch {
      setOk(false);
      return false;
    }
  }

  function end() {
    cancelAnimationFrame(m.current.raf);
    m.current.stream?.getTracks().forEach((t) => t.stop());
    m.current.ctx?.close();
    Object.assign(m.current, { stream: null, ctx: null, analyser: null, onLoud: null });
    setLevel(0);
  }

  // Record one answer. Resolves with the recording, or null when nothing was heard (or `cancel` was called).
  function record(cancelRef) {
    return new Promise((done) => {
      const rec = new MediaRecorder(m.current.stream);
      const chunks = [];
      let heard = false;
      let quietSince = 0;
      const began = performance.now();
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => done(heard ? new Blob(chunks, { type: rec.mimeType }) : null);
      rec.start();
      const watch = setInterval(() => {
        const now = performance.now();
        const lv = m.current.level;
        if (lv > SPEAK) {
          heard = true;
          quietSince = 0;
        } else if (heard) quietSince ||= now;
        const finished = heard ? quietSince && now - quietSince > QUIET_MS : now - began > WAIT_MS;
        if (finished || now - began > 10000 || cancelRef.cancelled) {
          if (cancelRef.cancelled) heard = false;
          clearInterval(watch);
          if (rec.state !== "inactive") rec.stop();
        }
      }, 50);
    });
  }

  useEffect(() => end, []); // turn the microphone off when leaving the page
  return { start, end, record, level, ok, setOnLoud: (f) => (m.current.onLoud = f) };
}

// A row of bars that grow with the child's voice.
function SoundBar({ level, on }) {
  return (
    <div className="flex h-16 items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: 15 }, (_, i) => {
        const shape = 1 - Math.abs(i - 7) / 9;
        const h = on ? 10 + Math.min(1, level * 2.2) * 54 * shape : 8;
        return <span key={i} className={`w-2.5 rounded-full transition-[height] duration-75 ${on && level > SPEAK ? "bg-good" : "bg-brand/40"}`} style={{ height: h }} />;
      })}
    </div>
  );
}

function Lesson() {
  const { kid, update } = useKid();
  const params = useSearchParams();
  const lang = langOf(kid);
  const lesson = useLesson(kid, params);
  const geez = (lesson.kind === "letter" && usesGeez(kid.lang)) || (lesson.kind === "words" && !lesson.english);
  const n = lesson.items.length;
  const mic = useMic();

  const [phase, setPhase] = useState("ready"); // ready | live | paused | done
  const [idx, setIdx] = useState(0);
  const [mood, setMood] = useState("smiling"); // Rodas's state
  const [bubble, setBubble] = useState({ text: "ሰላም!", english: `Hello ${kid.name}! Let's learn ${lesson.title}.` });
  const [listening, setListening] = useState(false);
  const [stars, setStars] = useState([]); // index of every letter that got a star
  const [manual, setManual] = useState(null); // no microphone: a button the child taps after saying it

  const run = useRef({ id: 0 }); // each new run gets a new id; older runs see they are cancelled and stop
  const audio = useRef(null);
  const cut = useRef(false);

  const voiceOn = kid.voice !== false;

  // Play one audio address to the end of Rodas's voice (or until cancelled / cut in).
  function play(url) {
    return playClip(url, (a) => (audio.current = a));
  }
  function hush() {
    audio.current?.pause();
    audio.current = null;
    stopVoice();
  }

  // Rodas says one thing: shows it in her bubble and plays her recordings, if she has made them yet.
  // `parts` is a list of audio addresses played one after another. Returns true if the child cut in.
  async function talk(id, bubbleLine, parts, moodNow = "talking") {
    const alive = () => run.current.id === id;
    setMood(moodNow);
    setBubble(bubbleLine);
    cut.current = false;
    mic.setOnLoud(() => {
      cut.current = true;
      hush();
    });
    let spoke = false;
    for (const url of voiceOn ? parts : []) {
      if (!alive() || cut.current) break;
      if (url?.en) spoke = (await speakEnglish(url.en)) || spoke; // an English word, in the browser's English voice
      else if (url && (await play(url))) spoke = true;
    }
    // Lines she hasn't recorded yet stay on screen long enough to read.
    if (!spoke && alive() && !cut.current) await pause(1700);
    mic.setOnLoud(null);
    return cut.current;
  }

  // Wait for the child's answer: the microphone, or (no microphone) the "I said it" button.
  async function hear(id) {
    setMood("listening");
    setListening(true);
    const cancelRef = run.current;
    let blob = null;
    if (mic.ok) blob = await mic.record(cancelRef);
    else blob = await new Promise((done) => setManual(() => done));
    setManual(null);
    setListening(false);
    return run.current.id === id ? blob : null;
  }

  // Rodas's sound for a line: a file in public/audio/ if there is one, otherwise her recording from the voices
  // project with exactly this text (send the line to her 📁 folder, she records it, it plays here). null = not yet.
  async function sound(file, text) {
    if (await hasFile(file)) return file;
    return recordingUrl(kid.lang, text);
  }

  async function lessonFrom(start) {
    hush();
    run.current.cancelled = true;
    const id = run.current.id + 1;
    run.current = { id, cancelled: false };
    const alive = () => run.current.id === id;
    setPhase("live");
    setManual(null);

    for (let k = start; k < n; k++) {
      const item = lesson.items[k];
      setIdx(k);
      const letterUrl = await recordingUrl(kid.lang, item.word);
      if (!alive()) return;

      // 1. Rodas says the letter (or word).  2. "ሀ በሊ".
      // Learn English: the English word first (English voice), then Rodas says it in the child's language.
      const first = item.en ? [{ en: item.en }, letterUrl] : [letterUrl];
      let cutIn = await talk(id, { text: item.say, english: item.sub ? (item.en ? item.sub : `${item.big} · ${item.sub}`) : "" }, first);
      if (!alive()) return;
      if (!cutIn) {
        const ask = line("sayIt", kid.gender, item.say);
        // Until Rodas records "በሊ", the line only shows (no need to play the letter a second time).
        const beli = await sound(ask.file, ask.text.replace(item.say, "").trim()); // "በሊ" / "በል"
        cutIn = await talk(id, ask, beli ? [item.en ? { en: item.en } : letterUrl, beli] : []);
        if (!alive()) return;
      }

      for (let tries = 1; ; tries++) {
        // 3. Rodas listens.
        const blob = await hear(id);
        if (!alive()) return;
        if (blob === "said" || blob) {
          // 4. The child's own voice back to them.
          if (blob instanceof Blob) {
            setMood("smiling");
            setBubble({ text: "👂", english: "Listen to yourself!" });
            const url = URL.createObjectURL(blob);
            await play(url);
            URL.revokeObjectURL(url);
            if (!alive()) return;
          }
          // 5. "ጽቡቕ ገይርኪ!" and a star.
          setStars((s) => [...new Set([...s, k])]);
          const yay = line("welldone", kid.gender);
          const react = REACTIONS.filter((r) => r.mood === "happy")[Math.floor(Math.random() * 4)];
          const reactFile = `${AUDIO}/react-${react.id}.mp3`;
          await talk(id, yay, [await sound(reactFile, react.text), await sound(yay.file, yay.text)], k % 2 ? "clapping" : "smiling");
          if (!alive()) return;
          break;
        }
        // Nothing heard: "ደጊምኪ በሊ" and listen again (after 3 tries she moves on).
        if (tries >= TRIES) break;
        const again = line("again", kid.gender);
        await talk(id, again, [await sound(again.file, again.text)], "thinking");
        if (!alive()) return;
      }
    }

    // 6. All done: the celebration.
    setPhase("done");
    const all = line("allDone", kid.gender);
    setMood("clapping");
    setBubble(all);
    const allSound = voiceOn && (await sound(all.file, all.text));
    if (allSound) play(allSound);
  }

  async function begin() {
    await mic.start(); // asks the browser for the microphone (no microphone = the "I said it" button)
    lessonFrom(0);
  }

  function stopAll() {
    run.current = { id: run.current.id + 1, cancelled: true };
    run.current.cancelled = true;
    hush();
    mic.setOnLoud(null);
    manual?.(null);
    setListening(false);
    setMood("smiling");
    setPhase("paused");
  }

  useEffect(() => () => hush(), []); // eslint-disable-line react-hooks/exhaustive-deps

  // A finished course lesson keeps its stars (3 = every one said, 2 = at least half, 1 = finished): the path
  // shows it done and opens the next stop.
  useEffect(() => {
    if (phase !== "done" || !lesson.id) return;
    const got = stars.length >= n ? 3 : stars.length >= n / 2 ? 2 : 1;
    if ((kid.stars?.[lesson.id] || 0) < got) update({ stars: { ...(kid.stars || {}), [lesson.id]: got } });
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  function backToPath() {
    // Finishing the current letter opens the next stop on the path.
    if (lesson.kind === "letter" && lesson.index === (kid.done ?? 4)) update({ done: (kid.done ?? 4) + 1 });
  }

  const item = lesson.items[idx];
  const font = geez ? "font-geez" : "font-display";
  // Letters are huge; words and sentences get smaller so they fit.
  const len = [...(item?.big || "")].length;
  const size = len <= 2 ? "text-[9rem]" : len <= 6 ? "text-8xl" : len <= 14 ? "text-6xl" : "text-4xl";
  const subject = lesson.kind === "math" ? `Math in ${lang.name}` : lesson.english ? `English from ${lang.name}` : lesson.kind === "words" ? `${lang.name} words` : `${lang.name} letters`;

  return (
    <main>
      <Link href="/app/path/" className="mb-4 inline-flex items-center gap-1 font-extrabold text-brand hover:underline">
        ← Back to my path
      </Link>

      <div className="grid gap-6 lg:grid-cols-[5fr_7fr]">
        {/* Rodas: alive, with what she says in a speech bubble */}
        <section className="card flex flex-col items-center gap-6 bg-accent-soft p-8 text-center">
          <RodasLive state={mood} size={300} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6">
            <span className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 bg-white" aria-hidden="true" />
            <p className="font-geez text-4xl font-bold text-brand" lang="ti">{bubble.text}</p>
            {bubble.english && <p className="mt-2 text-lg text-muted">{bubble.english}</p>}
          </div>
        </section>

        {/* The lesson: the big letter, the microphone bar, the stars and the big buttons */}
        <section className="card flex flex-col p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="eyebrow text-brand">{subject}</p>
              <h1 className={`mt-1 text-3xl font-bold ${lesson.kind === "letter" && geez ? "font-geez" : ""}`}>{lesson.title}</h1>
            </div>
            <span className="chip">
              <Star width="18" height="18" /> {stars.length} of {n}
            </span>
          </div>

          {/* One spot per letter: a star once the child has said it */}
          <ol className="mt-6 flex flex-wrap gap-2.5" aria-label="Letters in this lesson">
            {lesson.items.map((x, k) => (
              <li
                key={x.big + k}
                title={x.big}
                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] text-2xl font-bold ${font} ${
                  k === idx && phase === "live" ? "border-brand bg-soft" : stars.includes(k) ? "border-good bg-good-soft" : "border-line bg-white"
                }`}
              >
                {x.pic && lesson.kind === "words" ? x.pic : x.big}
                {stars.includes(k) && <Star width="22" height="22" className="absolute -right-2 -top-2" />}
              </li>
            ))}
          </ol>

          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
            {phase === "done" ? (
              <div className="flex flex-col items-center gap-5 text-center">
                <div className="flex gap-3">
                  <Star width="64" height="64" />
                  <Star width="88" height="88" className="-mt-5" />
                  <Star width="64" height="64" />
                </div>
                <h2 className="text-4xl font-bold">You did it, {kid.name}!</h2>
                <p className="text-lg text-muted">
                  {stars.length} {stars.length === 1 ? "star" : "stars"} for <span className={`font-bold text-ink ${geez ? "font-geez" : ""}`}>{lesson.title}</span>.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={() => (setStars([]), lessonFrom(0))} className="btn-line text-lg">
                    Do it again
                  </button>
                  <Link href="/app/path/" onClick={backToPath} className="btn-brand text-lg">
                    Back to my path
                  </Link>
                </div>
              </div>
            ) : phase === "ready" || phase === "paused" ? (
              <div className="flex flex-col items-center gap-6 text-center">
                {item.pic && <span className="text-7xl" aria-hidden="true">{item.pic}</span>}
                <span className={`${size} text-balance font-bold leading-none ${font}`}>{item.big}</span>
                {item.sub && <span className={`text-xl text-muted ${lesson.english ? "font-geez" : ""}`}>{item.sub}</span>}
                <button type="button" onClick={phase === "ready" ? begin : () => lessonFrom(idx)} className="btn-brand px-10 py-5 text-2xl">
                  {phase === "ready" ? "▶ Start with Rodas" : "▶ Keep going"}
                </button>
                <p className="max-w-sm text-muted">
                  Rodas will listen with the microphone. Say each {lesson.kind === "words" ? "word" : "letter"} after her, out loud. You can talk any time, even
                  while she is talking.
                </p>
              </div>
            ) : (
              <>
                {item.pic && <span className="text-7xl" aria-hidden="true">{item.pic}</span>}
                <span className={`${size} text-balance text-center font-bold leading-tight ${font} ${listening ? "text-good" : "text-ink"}`}>{item.big}</span>
                {item.sub && <span className={`text-xl text-muted ${lesson.english ? "font-geez" : ""}`}>{item.sub}</span>}
                {mic.ok ? (
                  <>
                    <SoundBar level={mic.level} on={listening} />
                    <p className="min-h-[1.5em] font-extrabold text-muted">
                      {listening ? "🎤 Rodas is listening… say it!" : "Rodas is talking. You can cut in."}
                    </p>
                  </>
                ) : (
                  manual && (
                    <button type="button" onClick={() => manual("said")} className="btn-sun px-8 py-4 text-xl">
                      ✓ I said it
                    </button>
                  )
                )}
                {mic.ok === false && <p className="text-sm text-muted">The microphone is off, so tap “I said it” after you say it.</p>}
              </>
            )}
          </div>

          {phase === "live" && (
            <div className="grid grid-cols-3 gap-3 border-t-2 border-line pt-6">
              <button type="button" onClick={() => lessonFrom(idx)} className="btn-sun py-5 text-lg">
                🔁 Hear again
              </button>
              <button type="button" onClick={() => lessonFrom(Math.min(idx + 1, n))} className="btn-line py-5 text-lg">
                ⏭ Skip
              </button>
              <button type="button" onClick={stopAll} className="btn-line py-5 text-lg text-accent">
                ⏹ Stop
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

// useSearchParams needs a Suspense wrapper when the site is built as static files.
export default function LessonPage() {
  return (
    <Suspense fallback={null}>
      <Lesson />
    </Suspense>
  );
}
