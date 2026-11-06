"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { langOf, useKid } from "../../../components/KidState";
import { MINUTES, THEMES, allLessons, levelsFor, themeWords } from "../../../components/courses";
import { usesGeez } from "../../../components/curriculum";

// For parents: the whole plan on one page. Every level, what the learner can do by the end, and a table of its
// 8 units (letters, words, math, story, time). Follows the learner's language and track; switch kids / grown-ups.

const minutesOf = (lessons) => lessons.reduce((n, l) => n + (MINUTES[l.type] || 5), 0);

export default function Curriculum() {
  const { kid } = useKid();
  const lang = langOf(kid);
  const [who, setWho] = useState(kid.learner);
  const english = kid.track === "english";
  const geez = usesGeez(kid.lang) && !english;
  const levels = useMemo(() => levelsFor(who, kid.track, kid.lang, kid.math), [who, kid.track, kid.lang, kid.math]);
  const all = allLessons(levels);
  const subject = english ? `English (taught in ${lang.name})` : lang.name;

  return (
    <main>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand">For parents</p>
          <h1 className="mt-1 text-4xl font-bold">The plan: {subject}</h1>
          <p className="mt-2 text-lg text-muted">
            {levels.length} levels · 8 units each · {all.length} lessons · about {Math.round(minutesOf(all) / 60)} hours in all.
            Each unit takes about 25 minutes: a few short lessons a day.
          </p>
        </div>
        <div className="flex rounded-2xl bg-white p-1 font-extrabold" role="group" aria-label="Who is learning">
          {[["kid", "Kids"], ["adult", "Grown-ups"]].map(([id, name]) => (
            <button key={id} type="button" onClick={() => setWho(id)} aria-pressed={who === id}
              className={`rounded-xl px-5 py-2.5 ${who === id ? "bg-brand text-white" : "text-muted hover:text-ink"}`}>
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Jump to a level */}
      <nav aria-label="Levels" className="mb-6 flex flex-wrap gap-2">
        {levels.map((lv) => (
          <a key={lv.id} href={`#${lv.id}`} className="rounded-2xl border-2 border-line bg-white px-4 py-2 font-extrabold hover:border-brand">{lv.title}</a>
        ))}
      </nav>

      <div className="space-y-8">
        {levels.map((lv) => {
          const ls = all.filter((l) => l.level === lv.id);
          return (
            <section key={lv.id} id={lv.id} className="card scroll-mt-28 overflow-hidden">
              <div className="grid gap-4 bg-soft p-6 md:grid-cols-[1fr_auto]">
                <div>
                  <h2 className="text-3xl font-bold">{lv.title}</h2>
                  <p className="eyebrow mt-3 text-muted">By the end you can</p>
                  <ul className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
                    {lv.goals.map((g) => <li key={g} className="font-bold"><span className="text-good">✓</span> {g}</li>)}
                  </ul>
                </div>
                <div className="self-center rounded-2xl bg-white px-5 py-3 text-center">
                  <p className="font-display text-3xl font-bold">{ls.length}</p>
                  <p className="text-sm font-bold text-muted">lessons · about {Math.round(minutesOf(ls) / 60)} h</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="border-b-2 border-line text-sm text-muted">
                    <tr>
                      <th className="px-5 py-3">Unit</th>
                      <th className="px-3 py-3">Letters</th>
                      <th className="px-3 py-3">Words</th>
                      <th className="px-3 py-3">Math</th>
                      <th className="px-3 py-3">Story</th>
                      <th className="px-5 py-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lv.units.map((u, i) => {
                      const letters = u.lessons.filter((l) => l.type === "letters").map((l) => l.letter);
                      const math = u.lessons.find((l) => l.type === "math");
                      const words = u.themes.flatMap((t) => themeWords(t, kid.lang)).slice(0, 4).map((w) => (english ? w[1].replace(/ \(to a (girl|boy)\)/, "") : w[0]));
                      return (
                        <tr key={u.id} className="border-b border-line align-top last:border-0">
                          <td className="px-5 py-3">
                            <b>{i + 1}. {u.title}</b>
                            {u.focus !== "hear" && <span className="ml-2 chip py-0.5 text-xs">{u.focus === "read" ? "reading" : "sentences"}</span>}
                          </td>
                          <td className={`px-3 py-3 text-lg ${geez ? "font-geez" : ""}`}>{letters.length ? letters.join(" ") : <span className="text-muted">–</span>}</td>
                          <td className="px-3 py-3">
                            <span className="font-bold">{u.themes.map((t) => THEMES[t].title).join(", ")}</span>
                            <span className={`block text-sm text-muted ${geez ? "font-geez" : ""}`}>{words.join(" · ")} …</span>
                          </td>
                          <td className="px-3 py-3">{math ? math.title : <span className="text-muted">–</span>}</td>
                          <td className="px-3 py-3">{u.lessons.some((l) => l.type === "story") ? "📚" : <span className="text-muted">–</span>}</td>
                          <td className="px-5 py-3 text-right font-bold tabular-nums">{minutesOf(u.lessons)} min</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-8 text-center">
        <Link href="/app/path/" className="btn-brand">Back to learning</Link>
      </p>
    </main>
  );
}
