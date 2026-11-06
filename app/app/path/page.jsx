"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { langOf, useKid } from "../../../components/KidState";
import { TEACHERS } from "../../../components/Avatars";
import { Check, GamePad, Moon, Star } from "../../../components/Icons";
import { cheer, family, usesGeez } from "../../../components/curriculum";
import { HAS_WORDS, MINUTES, allLessons, levelsFor } from "../../../components/courses";
import { SpeakButton, useVoice } from "../../../components/Voice";
import { LevelPrize, PrizeShelf } from "../../../components/Prizes";

// Screen 3 (web): the learning path. Level tabs on top (Pre-K … Grade 3 for kids; Beginner … Culture for grown-ups),
// what you'll be able to do by the end of the level, a big "Next" button, then the level's 8 units.
// The unit you're on is open, with its lessons on a winding road. Finished units fold up (tap to open again);
// units still to come show their title and how long they take.
// A stop is done (green check), current (big blue, "Start"), open, or locked (grown-ups have nothing locked).

const Lock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.4" fill="none" />
  </svg>
);

const TYPE_NAME = { letters: "Letters", words: "Words", math: "Math", story: "Story", game: "Game", review: "Quiz" };
const minutesOf = (lessons) => lessons.reduce((n, l) => n + (MINUTES[l.type] || 5), 0);

function Stop({ state, big, label, sub, href, geez, type }) {
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
      <span className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-muted">{TYPE_NAME[type]}</span>
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
      <span className={`mt-2 text-center text-sm font-extrabold leading-tight ${state === "locked" ? "text-muted/70" : ""}`}>{label}</span>
      {sub && <span className="text-center font-geez text-xs text-muted">{sub}</span>}
      {state === "current" && <span className="btn-brand mt-2 px-4 py-1.5 text-sm">Start</span>}
    </>
  );
  const cls = "flex w-28 flex-col items-center";
  return state === "locked" ? (
    <div className={cls} aria-label={`${label}, locked`}>{inner}</div>
  ) : (
    <Link href={href} className={`${cls} transition hover:-translate-y-0.5`}>{inner}</Link>
  );
}

// The stops on a winding road: up, down, up, down… with a curvy line behind them.
function Road({ stops }) {
  const n = stops.length;
  const y = (i) => (i % 2 ? 150 : 40); // where the circle's middle is, in px from the top
  const x = (i) => ((i + 0.5) / n) * 1000;
  let d = `M ${x(0)} ${y(0)}`;
  for (let i = 1; i < n; i++) {
    const mx = (x(i - 1) + x(i)) / 2;
    d += ` C ${mx} ${y(i - 1)}, ${mx} ${y(i)}, ${x(i)} ${y(i)}`;
  }
  return (
    <div className="relative h-[290px]">
      <svg className="absolute inset-x-0 top-[22px] h-[200px] w-full" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
        <path d={d} stroke="#DCE7F7" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d={d} stroke="#FFFFFF" strokeWidth="3" strokeDasharray="10 14" fill="none" />
      </svg>
      <ol>
        {stops.map(({ key, ...s }, i) => (
          <li key={key} className="absolute -translate-x-1/2" style={{ left: `${((i + 0.5) / n) * 100}%`, top: y(i) - 40 + 2 }}>
            <Stop {...s} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function Unit({ n, unit, stops, state, open, onToggle }) {
  const done = unit.lessons.filter((l, i) => stops[i].state === "done").length;
  const mins = minutesOf(unit.lessons);
  const head = (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={`flex h-11 w-11 flex-none items-center justify-center rounded-2xl text-lg font-extrabold ${
          state === "done" ? "bg-good text-white" : state === "current" ? "bg-brand text-white" : "bg-soft text-muted"
        }`}
      >
        {state === "done" ? <Check width="20" height="20" /> : n}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-bold leading-tight">
          Unit {n}: {unit.title}
        </h2>
        <p className="text-sm font-bold text-muted">
          {unit.lessons.length} lessons · about {mins} min
          {unit.focus === "read" ? " · reading" : unit.focus === "talk" ? " · talking in sentences" : ""}
        </p>
      </div>
      <span className="text-sm font-extrabold text-muted">
        {done} of {unit.lessons.length} done
      </span>
      <span className={`text-xl text-muted transition ${open ? "rotate-180" : ""}`} aria-hidden="true">⌄</span>
    </div>
  );
  return (
    <section className={`card ${state === "current" ? "border-brand shadow-[0_6px_0_#DCE7F7]" : ""}`}>
      <button type="button" onClick={onToggle} aria-expanded={open} className="w-full p-5 text-left">
        {head}
      </button>
      {open && (
        <div className="overflow-x-auto px-5 pb-2">
          <div className="min-w-[640px]">
            <Road stops={stops} />
          </div>
        </div>
      )}
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
  const yay = cheer(kid.lang, kid.gender);
  const voice = useVoice();
  const stars = kid.stars || {};

  const levels = useMemo(() => levelsFor(kid.learner, kid.track, kid.lang, kid.math), [kid.learner, kid.track, kid.lang, kid.math]);
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

  // Which units are open: the current one, plus any the learner taps open.
  const [opened, setOpened] = useState({});
  const isOpen = (u) => opened[u.id] ?? u.id === current.unit;

  const stateOf = (l) => (stars[l.id] ? "done" : l.id === current.id ? "current" : adult || order[l.id] < currentAt ? "open" : "locked");
  const unitState = (u) =>
    u.lessons.every((l) => stars[l.id]) ? "done" : u.id === current.unit ? "current" : u.lessons.some((l) => stateOf(l) !== "locked") ? "open" : "locked";

  const stop = (l) => ({
    key: l.id,
    type: l.type,
    state: stateOf(l),
    href: hrefOf(l),
    geez: l.type === "letters" && geez,
    big: l.type === "letters" ? l.letter : <span className="text-[2rem]">{l.pic}</span>,
    label: l.type === "letters" ? (geez ? `The ${l.letter} family` : `Letter ${l.letter.toUpperCase()}`) : l.title,
    sub: l.type === "letters" && geez ? family(l.letter).join(" ") : "",
  });

  const subject = english ? `English (from ${lang.name})` : lang.name;
  const nextName = current.type === "letters" ? `The ${current.letter} ${geez ? "family" : "letter"}` : current.title;
  const levelLessons = lessons.filter((l) => l.level === level.id);

  return (
    <main className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
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

        {/* The big "Next" button: a child always knows what to tap */}
        <Link href={hrefOf(current)} className="flex items-center gap-5 rounded-xl3 bg-brand p-5 text-white shadow-[0_6px_0_#0F4AA3] transition hover:-translate-y-0.5">
          <span className={`flex h-20 w-20 flex-none items-center justify-center rounded-full bg-white text-4xl font-bold text-brand ${current.type === "letters" && geez ? "font-geez" : ""}`}>
            {current.type === "letters" ? current.letter : current.pic}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold uppercase tracking-wider text-white/75">
              {doneCount ? "Next up" : "Start here"} · {TYPE_NAME[current.type]}
            </span>
            <span className={`block text-3xl font-bold ${current.type === "letters" && geez ? "font-geez" : ""}`}>{nextName}</span>
          </span>
          <span className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-sun text-3xl text-ink" aria-hidden="true">▶</span>
        </Link>

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

        {/* What this level teaches */}
        <section className="card grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow text-muted">{level.title} · by the end you can</p>
            <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {level.goals.map((g) => (
                <li key={g} className="flex gap-2 font-bold">
                  <span className="text-good">✓</span> {g}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-soft px-5 py-3 text-center">
            <p className="font-display text-3xl font-bold">{level.units.length}</p>
            <p className="text-sm font-bold text-muted">units · {levelLessons.length} lessons</p>
            <p className="text-sm font-bold text-muted">about {Math.round(minutesOf(levelLessons) / 60)} hours</p>
          </div>
        </section>

        {noWords && (
          <p className="rounded-2xl bg-accent-soft px-5 py-4 font-bold text-accent">
            {lang.name} words are being recorded by families. For now the word lessons show Tigrinya; the letters are{" "}
            {lang.name}.
          </p>
        )}

        <LevelPrize levels={levels} lessons={lessons} />

        <div className="space-y-4">
          {level.units.map((u, i) => (
            <Unit
              key={u.id}
              n={i + 1}
              unit={u}
              stops={u.lessons.map(stop)}
              state={unitState(u)}
              open={isOpen(u)}
              onToggle={() => setOpened((o) => ({ ...o, [u.id]: !isOpen(u) }))}
            />
          ))}
        </div>

        <p className="text-center font-bold text-muted">
          <Link href="/app/curriculum/" className="text-brand">See the whole plan, level by level →</Link>
        </p>
      </div>

      {/* Right side: the teacher cheering, progress, prizes, quick links */}
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
              Next: <b className={current.type === "letters" && geez ? "font-geez" : ""}>{nextName}</b>. I&apos;ll say it, then you say it back!
            </p>
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
