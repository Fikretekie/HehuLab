"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { langOf, useKid } from "../../../components/KidState";
import { Rodas } from "../../../components/Avatars";
import { Moon, Play } from "../../../components/Icons";
import { STORIES } from "../../../components/stories";
import { allLessons, levelsFor } from "../../../components/courses";
import { playClip, recordingUrl, stop as stopVoice } from "../../../components/Voice";

// Screen 6 (web): Bedtime stories, told by Rodas in her own voice. The player is big on the left; the stories are on the right.
// The story goes line by line: a picture, the line in Tigrinya and in English. A line plays the teller's recording
// when there is one; otherwise it stays on screen long enough to read and the story moves on.
// "Learn English" shows the English big (read by the browser's English voice) and Tigrinya small.
// "Listen only" dims the screen to almost black so sleepy eyes can rest.
// A "Story time" stop on the path opens here with ?lesson=… and is done when the story ends.

const Pause = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
  </svg>
);

// A few fixed stars for the night sky (fixed, so the sky looks the same every time).
const SKY = [[8, 12], [22, 30], [35, 8], [48, 22], [62, 10], [75, 28], [88, 14], [15, 55], [92, 48], [5, 80], [95, 78]];

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

// The browser's English voice, for "Learn English" stories. Resolves when it has finished.
function speakEnglish(text) {
  return new Promise((done) => {
    const s = typeof window !== "undefined" && window.speechSynthesis;
    if (!s) return done(false);
    const u = new SpeechSynthesisUtterance(text);
    u.voice = s.getVoices().find((v) => v.lang.toLowerCase().startsWith("en")) || null;
    u.lang = "en-US";
    u.rate = 0.85;
    u.onend = u.onerror = () => done(true);
    s.cancel();
    s.speak(u);
    setTimeout(() => done(true), 9000);
  });
}

function StoriesPage() {
  const { kid, update } = useKid();
  const lang = langOf(kid);
  const english = kid.track === "english";
  const params = useSearchParams();
  const lessonId = params.get("lesson");

  // A story stop on the path gets a story by its place: the 1st story stop tells the 1st story, and so on.
  const fromPath = useMemo(() => {
    if (!lessonId) return null;
    const stops = allLessons(levelsFor(kid.learner, kid.track, kid.lang)).filter((l) => l.type === "story");
    const at = stops.findIndex((l) => l.id === lessonId);
    return at < 0 ? null : STORIES[at % STORIES.length].id;
  }, [lessonId, kid.learner, kid.track, kid.lang]);

  const [storyId, setStoryId] = useState(STORIES[0].id);
  useEffect(() => fromPath && setStoryId(fromPath), [fromPath]);
  const [mode, setMode] = useState("watch");
  const [playing, setPlaying] = useState(false);
  const [at, setAt] = useState(0); // which line
  const [ended, setEnded] = useState(false);
  const story = STORIES.find((s) => s.id === storyId);
  const run = useRef(0);
  const audio = useRef(null);

  function hush() {
    audio.current?.pause();
    audio.current = null;
    stopVoice();
  }

  // Tell the story from line `from` to the end. A newer run (pause, another story) stops this one.
  async function tell(from) {
    hush();
    const id = ++run.current;
    const alive = () => run.current === id;
    setPlaying(true);
    setEnded(false);
    for (let k = from; k < story.lines.length; k++) {
      setAt(k);
      const [ti, en] = story.lines[k];
      let heard = false;
      if (kid.voice !== false) {
        if (english) heard = await speakEnglish(en);
        else {
          const url = await recordingUrl(kid.lang, ti);
          if (url && alive()) heard = await playClip(url, (a) => (audio.current = a));
        }
      }
      if (!alive()) return;
      await pause(heard ? 700 : Math.max(2500, ti.length * 110)); // time to look, or to read a line with no voice yet
      if (!alive()) return;
    }
    setPlaying(false);
    setEnded(true);
    if (lessonId && !(kid.stars || {})[lessonId]) update({ stars: { ...(kid.stars || {}), [lessonId]: 3 } });
  }

  function pauseStory() {
    run.current++;
    hush();
    setPlaying(false);
  }

  function pick(id) {
    pauseStory();
    setStoryId(id);
    setAt(0);
    setEnded(false);
  }

  useEffect(() => () => (run.current++, hush()), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [ti, en, pic] = story.lines[at];
  const dark = mode === "listen" && playing;
  const big = english ? en : ti;
  const small = english ? ti : en;

  return (
    <main>
      <div className="mb-8">
        <p className="eyebrow text-accent">Bedtime stories</p>
        <h1 className="mt-1 text-4xl font-bold">Stories with Rodas</h1>
        <p className="mt-2 text-lg text-muted">
          {english ? `Stories in English, with ${lang.name} under each line.` : `Our stories in ${lang.name}.`} Watch, or turn the
          screen dark and just listen.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* The player */}
        <section className="overflow-hidden rounded-xl3 bg-[#0F2240] text-white">
          <div className={`relative flex h-[420px] flex-col items-center justify-center gap-5 px-8 text-center transition-colors duration-700 ${dark ? "bg-[#050B16]" : ""}`}>
            {!dark &&
              SKY.map(([x, y], i) => (
                <span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-white/70" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true" />
              ))}
            <span className={`absolute right-10 top-8 text-sun transition ${dark ? "opacity-30" : ""}`}>
              <Moon width="56" height="56" />
            </span>

            {dark ? (
              <div className="text-white/40">
                <p className="text-2xl font-bold">Close your eyes and listen</p>
                <p className="mt-1">Rodas is telling the story</p>
              </div>
            ) : playing || ended || at > 0 ? (
              <>
                <span className="text-8xl" aria-hidden="true">{ended ? "🌙" : pic}</span>
                <p className={`max-w-2xl text-balance text-4xl font-bold leading-snug ${english ? "" : "font-geez"}`} lang={english ? "en" : "ti"}>
                  {ended ? (english ? "The end. Good night!" : "ብሩኽ ለይቲ") : big}
                </p>
                <p className={`max-w-2xl text-xl text-white/70 ${english ? "font-geez" : ""}`}>{ended ? (english ? "ብሩኽ ለይቲ" : "The end. Good night!") : small}</p>
              </>
            ) : (
              <div className="flex items-end gap-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-white/10 p-3">
                    <Rodas size={120} />
                  </div>
                  <span className="text-sm font-bold text-white/70">Rodas</span>
                </div>
                <div className="rounded-full bg-white/10 p-5">
                  <story.Pic size={170} />
                </div>
              </div>
            )}

            {/* Big play button in the middle until the story starts */}
            {!playing && at === 0 && !ended && (
              <button
                type="button"
                onClick={() => tell(0)}
                aria-label={`Play ${story.title}`}
                className="absolute flex h-24 w-24 items-center justify-center rounded-full bg-sun text-ink transition hover:scale-105"
              >
                <Play width="44" height="44" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-5 bg-[#0B1A33] p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{story.title}</h2>
                <p className="text-white/60">
                  {story.lines.length} lines · {story.age}
                </p>
              </div>
              <div className="flex rounded-2xl bg-white/10 p-1 font-extrabold" role="group" aria-label="How to play">
                {[["watch", "Watch"], ["listen", "Listen only"]].map(([id, name]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMode(id)}
                    aria-pressed={mode === id}
                    className={`rounded-xl px-5 py-2.5 ${mode === id ? "bg-white text-ink" : "text-white/80 hover:text-white"}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => (playing ? pauseStory() : tell(ended ? 0 : at))}
                aria-label={playing ? "Pause" : "Play"}
                className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-sun text-ink"
              >
                {playing ? <Pause /> : <Play width="28" height="28" />}
              </button>
              <span className="w-16 text-sm font-bold text-white/70">
                {Math.min(at + 1, story.lines.length)} of {story.lines.length}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuemin={0} aria-valuemax={story.lines.length} aria-valuenow={ended ? story.lines.length : at}>
                <div className="h-full rounded-full bg-sun transition-[width]" style={{ width: `${((ended ? story.lines.length : at) / story.lines.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </section>

        {/* All stories */}
        <aside className="space-y-4">
          <div className="card flex items-center gap-4 bg-accent-soft p-5">
            <Rodas size={64} />
            <p className="font-bold">&ldquo;Come sit with me, {kid.name}. Which story tonight?&rdquo;</p>
          </div>
          {STORIES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => pick(s.id)}
              aria-pressed={s.id === storyId}
              className={`card flex w-full items-center gap-4 p-3 text-left transition ${s.id === storyId ? "border-accent" : "hover:border-accent/50"}`}
            >
              <span className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl bg-[#0F2240]">
                <s.Pic size={58} />
              </span>
              <span className="flex-1">
                <b className="block text-lg leading-tight">{s.title}</b>
                <span className="text-sm text-muted">
                  {s.lines.length} lines · {s.age}
                </span>
              </span>
            </button>
          ))}
        </aside>
      </div>
    </main>
  );
}

// useSearchParams needs a Suspense wrapper when the site is built as static files.
export default function Stories() {
  return (
    <Suspense fallback={null}>
      <StoriesPage />
    </Suspense>
  );
}
