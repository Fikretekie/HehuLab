"use client";

import Link from "next/link";
import { langOf, useKid } from "../../../components/KidState";
import { TEACHERS } from "../../../components/Avatars";
import { Check, GamePad, Moon, Star } from "../../../components/Icons";
import { MATH, NUMBER_WORDS, cheer, family, letterUnits } from "../../../components/curriculum";

// Screen 3 (web): the learning path. Letter units in the chosen language, then math in the same language.
// Each stop is done (green check), current (big blue, "Start"), or locked (grey).

const Lock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.4" fill="none" />
  </svg>
);

function Stop({ state, big, label, sub, href }) {
  const ring =
    state === "done"
      ? "border-good bg-good-soft text-good"
      : state === "current"
        ? "border-brand bg-brand text-white shadow-[0_6px_0_#0F4AA3] scale-110"
        : "border-line bg-white text-muted/60";
  const inner = (
    <>
      <span className={`relative flex h-20 w-20 items-center justify-center rounded-full border-[3px] font-geez text-3xl font-bold transition ${ring}`}>
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
      {sub && <span className="font-geez text-xs text-muted">{sub}</span>}
      {state === "current" && <span className="btn-brand mt-2 px-4 py-1.5 text-sm">Start</span>}
    </>
  );
  return state === "locked" ? (
    <div className="flex w-28 flex-col items-center" aria-label={`${label}, locked`}>{inner}</div>
  ) : (
    <Link href={href} className="flex w-28 flex-col items-center hover:-translate-y-0.5 transition">{inner}</Link>
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
          {stops.map((s) => (
            <li key={s.key}>
              <Stop {...s} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function LearningPath() {
  const { kid } = useKid();
  const lang = langOf(kid);
  const teacher = TEACHERS.find((t) => t.id === kid.teacher) || TEACHERS[0];
  const done = kid.done ?? 4; // lessons finished so far (demo until accounts exist)
  const units = letterUnits(kid.lang).slice(0, 3);
  const words = NUMBER_WORDS[kid.lang];
  const yay = cheer(kid.lang, kid.gender);
  const stateOf = (n) => (n < done ? "done" : n === done ? "current" : "locked");
  const total = letterUnits(kid.lang).reduce((n, u) => n + u.letters.length, 0); // all letters, not only the units shown
  const geez = kid.lang !== "byn";

  let n = 0;
  const letterBlocks = units.map((u, ui) => ({
    title: `Unit ${ui + 1}: Letters ${u.letters[0]} to ${u.letters[u.letters.length - 1]}`,
    note: `${lang.name} letters`,
    stops: u.letters.map((l) => {
      const i = n++;
      return {
        key: l,
        state: stateOf(i),
        big: l,
        label: geez ? `The ${l} family` : `Letter ${l.toUpperCase()}`,
        sub: family(l).join(" "),
        href: `/app/lesson/?letter=${encodeURIComponent(l)}`,
      };
    }),
  }));

  return (
    <main className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div>
          <p className="eyebrow text-brand">Your learning path</p>
          <h1 className="mt-1 text-4xl font-bold">
            {kid.name}&apos;s {lang.name}
            {kid.math ? " and math" : ""}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
              <div className="h-full rounded-full bg-good" style={{ width: `${Math.round((done / total) * 100)}%` }} />
            </div>
            <span className="text-sm font-extrabold text-muted">
              {done} of {total} letters
            </span>
          </div>
        </div>

        {letterBlocks.map((u) => (
          <Unit key={u.title} {...u} />
        ))}

        {kid.math && (
          <Unit
            title={`Math in ${lang.name}`}
            note={words ? `${words[0]}, ${words[1]}, ${words[2]} …` : "Numbers 1 to 10"}
            stops={MATH.map((m, i) => ({
              key: m.id,
              state: i === 0 ? "current" : "locked",
              big: <span className="font-display text-2xl">{m.big}</span>,
              label: m.title,
              sub: i === 0 && words ? words.slice(0, 5).join(" ") : "",
              href: `/app/lesson/?math=${m.id}`,
            }))}
          />
        )}

        <p className="text-center text-sm font-bold text-muted">More units open as {kid.name} learns.</p>
      </div>

      {/* Right side: the teacher cheering, today's goal, quick links */}
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="card overflow-hidden">
          <div className="flex flex-col items-center bg-soft px-6 pb-5 pt-6 text-center">
            <teacher.Pic size={112} />
            <p className="mt-3 text-lg font-extrabold">{teacher.name}</p>
            <span className="chip mt-1 bg-white">AI teacher</span>
          </div>
          <div className="p-6 text-center">
            {yay.native && <p className="font-geez text-3xl font-bold text-brand">{yay.native}</p>}
            <p className={yay.native ? "mt-1 text-muted" : "text-2xl font-bold text-brand"}>{yay.english}</p>
            <p className="mt-3 text-[15px]">
              Next: the <b className="font-geez">{letterBlocks.flatMap((u) => u.stops)[done]?.big}</b>{" "}
              {geez ? "family" : "letter"}. I&apos;ll say it, then you say it back!
            </p>
            <Link href="/app/lesson/" className="btn-brand mt-5 w-full text-lg">
              Start today&apos;s lesson
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold">Today</h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold text-muted">Lessons</span>
            <span className="font-extrabold">1 of 3</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-soft">
            <div className="h-full w-1/3 rounded-full bg-brand" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold text-muted">Stars</span>
            <span className="flex items-center gap-1 font-extrabold">
              <Star /> 38
            </span>
          </div>
        </div>

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
