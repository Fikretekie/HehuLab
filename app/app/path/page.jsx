"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { langOf, useKid } from "../../../components/KidState";
import { TEACHERS } from "../../../components/Avatars";
import { Check, GamePad, Moon, Star } from "../../../components/Icons";
import { MATH, NUMBER_WORDS, cheer, family, usesGeez } from "../../../components/curriculum";
import { HAS_WORDS, allLessons, levelsFor } from "../../../components/courses";
import { SpeakButton, useVoice } from "../../../components/Voice";
import { LevelPrize, PrizeShelf } from "../../../components/Prizes";

// Screen 3 (web): the learning path. Level tabs on top (Pre-K … Grade 3 for kids; Beginner … Culture for grown-ups),
// then the level's units. Each stop is one lesson: a letter family, a word theme, a review, a story or a game.
// A stop is done (green check), current (big blue, "Start"), or locked (grey; grown-ups have nothing locked).

const Lock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.4" fill="none" />
  </svg>
);

function Stop({ state, big, label, sub, href, geez }) {
  const ring =
    state === "done"
      ? "border-good bg-good-soft text-good"
      : state === "current"
        ? "border-brand bg-brand text-white shadow-[0_6px_0_#0F4AA3] scale-110"
        : state === "open"
          ? "border-line bg-white text-ink hover:border-brand"
          : "border-line bg-white text-muted/60";
  const inner = (
    <>
      <span
        className={`relative flex h-20 w-20 items-center justify-center rounded-full border-[3px] text-3xl font-bold transition ${
          geez ? "font-geez" : ""
        } ${ring}`}
      >
        {state === "locked" ? <Lock /> : big}
        {state === "done" && (
          <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-good text-white">
            <Check width="16" height="16" />
          </span>
        )}
      </span>
      <span className={`mt-3 text-center text-sm font-extrabold leading-tight ${state === "locked" ? "text-muted/70" : ""}`}>
        {label}
      </span>
      {sub && <span className="text-center font-geez text-xs text-muted">{sub}</span>}
      {state === "current" && <span className="btn-brand mt-2 px-4 py-1.5 text-sm">Start</span>}
    </>
  );
  return state === "locked" ? (
    <div className="flex w-28 flex-col items-center" aria-label={`${label}, locked`}>
      {inner}
    </div>
  ) : (
    <Link href={href} className="flex w-28 flex-col items-center transition hover:-translate-y-0.5">
      {inner}
    </Link>
  );
}

function Unit({ title, note, stops }) {
  return (
    <section className="card p-6">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <span className="text-sm font-bold text-muted">{note}</span>
      </div>
      <div className="relative">
        {/* the road between the stops */}
        <div className="absolute left-10 right-10 top-10 h-1.5 rounded-full bg-line" aria-hidden="true" />
        <ol className="relative flex flex-wrap justify-between gap-y-6">
          {stops.map(({ key, ...s }) => (
            <li key={key}>
              <Stop {...s} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Where each kind of lesson opens.
function hrefOf(l) {
  if (l.type === "story") return `/app/stories/?lesson=${l.id}`;
  if (l.type === "game") return `/app/games/?lesson=${l.id}`;
  return `/app/lesson/?lesson=${l.id}${l.letter ? `&letter=${encodeURIComponent(l.letter)}` : ""}`;
}

export default function LearningPath() {
  const { kid } = useKid();
  const lang = langOf(kid);
  const adult = kid.learner === "adult";
  const english = kid.track === "english";
  const geez = usesGeez(kid.lang);
  const teacher = TEACHERS.find((t) => t.id === kid.teacher) || TEACHERS[0];
  const words = NUMBER_WORDS[kid.lang];
  const yay = cheer(kid.lang, kid.gender);
  const voice = useVoice();
  const stars = kid.stars || {};

  const levels = useMemo(() => levelsFor(kid.learner, kid.track, kid.lang), [kid.learner, kid.track, kid.lang]);
  const lessons = useMemo(() => allLessons(levels), [levels]);
  const doneCount = lessons.filter((l) => stars[l.id]).length;
  // The placement test can start the learner at a later level (the levels before it stay open, not locked).
  const placedAt = Math.max(0, lessons.findIndex((l) => l.level === kid.placed));
  const current = lessons.find((l, i) => i >= placedAt && !stars[l.id]) || lessons[lessons.length - 1];
  const [levelId, setLevelId] = useState(current.level);
  useEffect(() => setLevelId(current.level), [current.level]);
  const level = levels.find((lv) => lv.id === levelId) || levels[0];
  const order = Object.fromEntries(lessons.map((l, i) => [l.id, i]));
  const currentAt = order[current.id];
  const noWords = !english && !HAS_WORDS[kid.lang];

  const stateOf = (l) => (stars[l.id] ? "done" : l.id === current.id ? "current" : adult || order[l.id] < currentAt ? "open" : "locked");

  const stop = (l) => ({
    key: l.id,
    state: stateOf(l),
    href: hrefOf(l),
    geez: l.type === "letters" && geez,
    big: l.type === "letters" ? l.letter : <span className="text-[2rem]">{l.pic}</span>,
    label: l.type === "letters" ? (geez ? `The ${l.letter} family` : `Letter ${l.letter.toUpperCase()}`) : l.title,
    sub: l.type === "letters" && geez ? family(l.letter).join(" ") : "",
  });

  const subject = english ? `English (from ${lang.name})` : lang.name;

  return (
    <main className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div>
          <p className="eyebrow text-brand">{adult ? "Your course" : "Your learning path"}</p>
          <h1 className="mt-1 text-4xl font-bold">
            {adult ? subject : `${kid.name}'s ${subject}`}
            {!adult && !english && kid.math ? " and math" : ""}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={lessons.length} aria-valuenow={doneCount}>
              <div className="h-full rounded-full bg-good" style={{ width: `${Math.round((doneCount / lessons.length) * 100)}%` }} />
            </div>
            <span className="text-sm font-extrabold text-muted">
              {doneCount} of {lessons.length} lessons
            </span>
          </div>
        </div>

        {!kid.placed && (
          <Link href="/app/placement/" className="flex items-center gap-4 rounded-2xl border-2 border-brand bg-white px-5 py-4 hover:bg-soft">
            <span className="text-3xl" aria-hidden="true">🧭</span>
            <span className="flex-1">
              <b className="block text-lg">Not sure where to start?</b>
              <span className="text-muted">Take the 2-minute placement test and we&apos;ll pick the right level.</span>
            </span>
            <span className="btn-brand px-4 py-2">Take the test</span>
          </Link>
        )}

        {/* Level tabs */}
        <nav aria-label="Levels" className="flex flex-wrap gap-2">
          {levels.map((lv) => {
            const ls = lessons.filter((l) => l.level === lv.id);
            const d = ls.filter((l) => stars[l.id]).length;
            return (
              <button
                key={lv.id}
                type="button"
                onClick={() => setLevelId(lv.id)}
                aria-pressed={lv.id === level.id}
                className={`rounded-2xl border-2 px-4 py-2.5 text-left font-extrabold transition ${
                  lv.id === level.id ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/50"
                }`}
              >
                {d === ls.length && <span aria-label="finished">🏆 </span>}
                {lv.title}
                <span className={`ml-2 text-xs ${lv.id === level.id ? "text-white/80" : "text-muted"}`}>
                  {d}/{ls.length}
                </span>
              </button>
            );
          })}
        </nav>

        {noWords && (
          <p className="rounded-2xl bg-accent-soft px-5 py-4 font-bold text-accent">
            {lang.name} words are being recorded by families. For now the word lessons show Tigrinya; the letters are
            {" "}{lang.name}.
          </p>
        )}

        <LevelPrize levels={levels} lessons={lessons} />

        {level.units.map((u, i) => (
          <Unit
            key={u.id}
            title={`Unit ${i + 1}: ${u.title}`}
            note={`${u.lessons.filter((l) => stars[l.id]).length} of ${u.lessons.length} done`}
            stops={u.lessons.map(stop)}
          />
        ))}

        {!adult && !english && kid.math && level.id === levels[0].id && (
          <Unit
            title={`Math in ${lang.name}`}
            note={words ? `${words[0]}, ${words[1]}, ${words[2]} …` : "Numbers 1 to 10"}
            stops={MATH.map((m, i) => ({
              key: m.id,
              state: i === 0 ? "open" : "locked",
              big: <span className="font-display text-2xl">{m.big}</span>,
              label: m.title,
              sub: i === 0 && words ? words.slice(0, 5).join(" ") : "",
              href: `/app/lesson/?math=${m.id}`,
            }))}
          />
        )}
      </div>

      {/* Right side: the teacher cheering, the next lesson, quick links */}
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="card overflow-hidden">
          <div className="relative flex flex-col items-center bg-soft px-6 pb-5 pt-6 text-center">
            <teacher.Pic size={112} />
            <p className="mt-3 text-lg font-extrabold">{teacher.name}</p>
            <span className="chip mt-1 bg-white">AI teacher</span>
            <SpeakButton
              onClick={() => voice({ line: "welldone", text: `${yay.english} Let's do the next lesson together!` })}
              label={`Hear ${teacher.short || teacher.name}`}
              className="absolute right-4 top-4"
            />
          </div>
          <div className="p-6 text-center">
            {yay.native && <p className="font-geez text-3xl font-bold text-brand">{yay.native}</p>}
            <p className={yay.native ? "mt-1 text-muted" : "text-2xl font-bold text-brand"}>{yay.english}</p>
            <p className="mt-3 text-[15px]">
              Next:{" "}
              <b className={current.type === "letters" && geez ? "font-geez" : ""}>
                {current.type === "letters" ? `the ${current.letter} ${geez ? "family" : "letter"}` : current.title}
              </b>
              . I&apos;ll say it, then you say it back!
            </p>
            <Link href={hrefOf(current)} className="btn-brand mt-5 w-full text-lg">
              {doneCount ? "Keep going" : "Start the first lesson"}
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold">Progress</h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold text-muted">Lessons done</span>
            <span className="font-extrabold">
              {doneCount} of {lessons.length}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold text-muted">Stars</span>
            <span className="flex items-center gap-1 font-extrabold">
              <Star /> {Object.values(stars).reduce((a, b) => a + b, 0)}
            </span>
          </div>
        </div>

        <PrizeShelf levels={levels} lessons={lessons} />

        <div className="grid grid-cols-2 gap-3">
          <Link href="/app/games/" className="card flex flex-col items-center gap-1 p-4 font-extrabold text-brand hover:border-brand">
            <GamePad /> <span className="text-ink">Games</span>
          </Link>
          <Link href="/app/stories/" className="card flex flex-col items-center gap-1 p-4 font-extrabold text-accent hover:border-brand">
            <Moon /> <span className="text-ink">Stories</span>
          </Link>
        </div>
      </aside>
    </main>
  );
}
