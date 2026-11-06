"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { langOf, useKid } from "../../../components/KidState";
import { allLessons, levelsFor } from "../../../components/courses";
import { PRIZES, finishedLevels } from "../../../components/Prizes";

// The certificate for a finished level: the learner's name, the level, the date, signed by Rodas (AI teacher).
// "Print" makes a one-page paper certificate for the fridge.

function Certificate() {
  const { kid } = useKid();
  const params = useSearchParams();
  const levels = useMemo(() => levelsFor(kid.learner, kid.track, kid.lang), [kid.learner, kid.track, kid.lang]);
  const lessons = useMemo(() => allLessons(levels), [levels]);
  const id = params.get("level");
  const level = levels.find((l) => l.id === id);
  const won = level && finishedLevels(levels, lessons, kid.stars || {}).some((l) => l.id === id);
  const prize = PRIZES[id] || PRIZES.k4;
  const subject = kid.track === "english" ? "English" : langOf(kid).name;
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  if (!level || !won) {
    return (
      <main className="card mx-auto max-w-xl p-8 text-center">
        <p className="text-6xl" aria-hidden="true">{prize.pic}</p>
        <h1 className="mt-3 text-3xl font-bold">Not won yet</h1>
        <p className="mt-2 text-lg text-muted">Finish every lesson of {level?.title || "this level"} to win this certificate.</p>
        <Link href="/app/path/" className="btn-brand mt-6">Back to learning</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl">
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/app/path/" className="font-extrabold text-brand">← Back to learning</Link>
        <button type="button" onClick={() => window.print()} className="btn-brand">🖨️ Print the certificate</button>
      </div>

      <section className="relative overflow-hidden rounded-xl3 border-[10px] bg-white p-10 text-center" style={{ borderColor: prize.color }}>
        <div className="pointer-events-none absolute inset-3 rounded-[20px] border-2 border-dashed" style={{ borderColor: prize.color }} aria-hidden="true" />
        <div className="flex items-center justify-center gap-2.5">
          <span className="rounded-xl bg-brand px-2.5 py-0.5 font-geez text-lg font-bold text-white">ሀሁ</span>
          <span className="font-display text-2xl font-bold">HehuLab</span>
        </div>
        <p className="eyebrow mt-6 text-muted">Certificate of achievement</p>
        <p className="mt-6 text-lg">This certificate is proudly given to</p>
        <p className="mt-2 font-display text-6xl font-bold text-brand">{kid.name}</p>
        <p className="mt-6 text-xl">
          for finishing <b>{level.title}</b> in <b>{subject}</b>
        </p>
        <p className="mt-6 text-8xl" aria-hidden="true">{prize.pic}</p>
        <p className="mt-2 font-display text-3xl font-bold" style={{ color: prize.color }}>{prize.name}</p>
        {kid.lang === "ti" && kid.track !== "english" && <p className="mt-2 font-geez text-2xl font-bold">ብጣዕሚ ጽቡቕ!</p>}

        <div className="mt-10 grid grid-cols-2 items-end gap-8 text-left">
          <div>
            <p className="border-b-2 border-ink pb-1 text-lg font-bold">{date}</p>
            <p className="mt-1 text-sm text-muted">Date</p>
          </div>
          <div className="flex items-end gap-3">
            <img src="/images/rodas.jpg" alt="" className="h-16 w-16 rounded-full object-cover" />
            <div className="flex-1">
              <p className="border-b-2 border-ink pb-1 font-display text-2xl font-bold italic">Rodas</p>
              <p className="mt-1 text-sm text-muted">Rodas, AI teacher</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// useSearchParams needs a Suspense wrapper when the site is built as static files.
export default function PrizePage() {
  return (
    <Suspense fallback={null}>
      <Certificate />
    </Suspense>
  );
}
