"use client";

import { useEffect, useState } from "react";
import { langOf, useKid } from "../../../components/KidState";
import { Camel, Goat, Grandma, Sheep } from "../../../components/Avatars";
import { Moon, Play } from "../../../components/Icons";

// Screen 6 (web): Bedtime stories, told by Grandma Didi. The player is big on the left; the stories are on the right.
// "Watch" shows the story scene. "Listen only" dims the screen to almost black so sleepy eyes can rest.

const STORIES = [
  { id: "goat", title: "The clever goat", minutes: 4, age: "Pre-K and up", Pic: Goat },
  { id: "camel", title: "The camel who counted stars", minutes: 5, age: "Kindergarten and up", Pic: Camel },
  { id: "sheep", title: "Bebe finds her way home", minutes: 3, age: "Pre-K and up", Pic: Sheep },
];

const Pause = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
  </svg>
);

// A few fixed stars for the night sky (fixed, so the sky looks the same every time).
const SKY = [[8, 12], [22, 30], [35, 8], [48, 22], [62, 10], [75, 28], [88, 14], [15, 55], [92, 48], [5, 80], [95, 78]];

function clock(sec) {
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
}

export default function Stories() {
  const { kid } = useKid();
  const lang = langOf(kid);
  const [storyId, setStoryId] = useState("goat");
  const [mode, setMode] = useState("watch");
  const [playing, setPlaying] = useState(false);
  const [sec, setSec] = useState(0);
  const story = STORIES.find((s) => s.id === storyId);
  const total = story.minutes * 60;

  // Demo player: the clock runs while playing (the real recordings come later).
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setSec((s) => Math.min(s + 1, total)), 1000);
    return () => clearInterval(t);
  }, [playing, total]);

  useEffect(() => {
    if (sec >= total) setPlaying(false);
  }, [sec, total]);

  function pick(id) {
    setStoryId(id);
    setSec(0);
    setPlaying(false);
  }

  const dark = mode === "listen" && playing;

  return (
    <main>
      <div className="mb-8">
        <p className="eyebrow text-accent">Bedtime stories</p>
        <h1 className="mt-1 text-4xl font-bold">Stories with Grandma Didi</h1>
        <p className="mt-2 text-lg text-muted">Our folk tales in {lang.name}. Watch a short movie, or turn the screen off and just listen.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* The player */}
        <section className="overflow-hidden rounded-xl3 bg-[#0F2240] text-white">
          {/* The night sky scene */}
          <div className={`relative flex h-[400px] items-center justify-center transition-colors duration-700 ${dark ? "bg-[#050B16]" : ""}`}>
            {!dark &&
              SKY.map(([x, y], i) => (
                <span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-white/70" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true" />
              ))}
            <span className={`absolute right-10 top-8 text-sun transition ${dark ? "opacity-30" : ""}`}>
              <Moon width="56" height="56" />
            </span>

            {dark ? (
              <div className="text-center text-white/40">
                <p className="text-2xl font-bold">Close your eyes and listen</p>
                <p className="mt-1">Grandma Didi is telling the story</p>
              </div>
            ) : (
              <div className="flex items-end gap-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-white/10 p-3">
                    <Grandma size={120} />
                  </div>
                  <span className="text-sm font-bold text-white/70">Grandma Didi</span>
                </div>
                <div className="rounded-full bg-white/10 p-5">
                  <story.Pic size={170} />
                </div>
              </div>
            )}

            {/* Big play button in the middle until the story starts */}
            {!playing && (
              <button
                type="button"
                onClick={() => setPlaying(true)}
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
                <p className="text-white/60">{story.minutes} minutes · {story.age}</p>
              </div>
              {/* Watch or listen only */}
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
                onClick={() => (sec >= total ? (setSec(0), setPlaying(true)) : setPlaying(!playing))}
                aria-label={playing ? "Pause" : "Play"}
                className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-sun text-ink"
              >
                {playing ? <Pause /> : <Play width="28" height="28" />}
              </button>
              <span className="w-12 text-sm font-bold text-white/70">{clock(sec)}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={sec}>
                <div className="h-full rounded-full bg-sun transition-[width]" style={{ width: `${(sec / total) * 100}%` }} />
              </div>
              <span className="w-12 text-right text-sm font-bold text-white/70">{clock(total)}</span>
            </div>
          </div>
        </section>

        {/* All stories */}
        <aside className="space-y-4">
          <div className="card flex items-center gap-4 bg-accent-soft p-5">
            <Grandma size={64} />
            <p className="font-bold">&ldquo;Come sit with me, {kid.name}. Which story tonight?&rdquo;</p>
          </div>
          {STORIES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => pick(s.id)}
              aria-pressed={s.id === storyId}
              className={`card flex w-full items-center gap-4 p-3 text-left transition ${
                s.id === storyId ? "border-accent" : "hover:border-accent/50"
              }`}
            >
              <span className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl bg-[#0F2240]">
                <s.Pic size={58} />
              </span>
              <span className="flex-1">
                <b className="block text-lg leading-tight">{s.title}</b>
                <span className="text-sm text-muted">{s.minutes} minutes · {s.age}</span>
              </span>
            </button>
          ))}
        </aside>
      </div>
    </main>
  );
}
