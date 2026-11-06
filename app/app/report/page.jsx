"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { langOf, useKid } from "../../../components/KidState";
import { Rodas } from "../../../components/Avatars";
import { Check, Star } from "../../../components/Icons";
import Choice from "../../../components/Choice";
import { allLessons, lessonItems, levelsFor } from "../../../components/courses";
import { DRAFT, REPORT_LANGS, reportText } from "../../../components/report";

// Screen 9 (web): the Friday report email, shown the way the family will get it.
// The grown-ups pick its language here or in Settings (English, Tigrinya, Tigre, Bilen, Saho, Amharic).
// Sending the email every Friday needs the server (accounts); this page is what it will say.

const GEEZ = { ti: true, tig: true, am: true };

function Stat({ label, value, icon }) {
  return (
    <div className="flex-1 rounded-2xl bg-soft p-5">
      <p className="flex items-center gap-2 font-display text-4xl font-bold">
        {icon}
        {value}
      </p>
      <p className="mt-1 font-bold text-muted">{label}</p>
    </div>
  );
}

function Part({ title, children }) {
  return (
    <div className="border-t-2 border-line pt-5">
      <p className="mb-3 text-lg font-extrabold">{title}</p>
      {children}
    </div>
  );
}

export default function Report() {
  const { kid, update } = useKid();
  const [date, setDate] = useState("");
  useEffect(() => setDate(new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })), []);

  const lang = kid.reportLang || "en";
  const { t, missing } = reportText(lang);
  const girl = kid.gender !== "boy";
  const name = kid.name || "Selam";

  // What the child has done: every lesson with stars on the current course.
  const stars = kid.stars || {};
  const lessons = allLessons(levelsFor(kid.learner, kid.track, kid.lang));
  const done = lessons.filter((l) => stars[l.id]);
  const starCount = done.reduce((n, l) => n + stars[l.id], 0);
  const letters = done.filter((l) => l.type === "letters").map((l) => l.letter);
  const words = done.filter((l) => l.type === "words").flatMap((l) => lessonItems(l, kid.track, kid.lang).slice(0, 4));
  const next = lessons.find((l) => !stars[l.id]);
  const practice = letters[letters.length - 1] || words[words.length - 1]?.native || lessons.find((l) => l.type === "letters")?.letter;

  return (
    <main>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand">For grown-ups · Friday report</p>
          <h1 className="mt-1 text-4xl font-bold">{name}&apos;s Friday report</h1>
          <p className="mt-2 text-lg text-muted">Pick the language the family reads best. It saves right away.</p>
        </div>
        <Link href="/app/settings/" className="btn-line py-2">
          Back to Settings
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* The language choice */}
        <section className="card h-fit p-7">
          <h2 className="mb-2 text-2xl font-bold">Report language</h2>
          <p className="mb-4 text-sm text-muted">{name} learns {langOf(kid).name}. The report can be in any language.</p>
          <Choice options={REPORT_LANGS} value={lang} onPick={(reportLang) => update({ reportLang })} />
          {missing && (
            <p className="mt-5 rounded-2xl bg-accent-soft p-4 text-sm font-bold text-accent">
              The {REPORT_LANGS.find(([id]) => id === lang)?.[1]} translation is not written yet, so this shows English. A family
              member who writes {REPORT_LANGS.find(([id]) => id === lang)?.[1]} can translate it.
            </p>
          )}
          {DRAFT[lang] && (
            <p className="mt-5 rounded-2xl bg-soft p-4 text-sm font-bold text-muted">Draft translation: Fik checks the words before families get it.</p>
          )}
        </section>

        {/* The email, as the family sees it */}
        <section className="card overflow-hidden">
          <div className="border-b-2 border-line bg-soft px-7 py-4 text-sm">
            <p>
              <span className="font-extrabold">From:</span> Rodas at HehuLab
            </p>
            <p>
              <span className="font-extrabold">Subject:</span> <span className={GEEZ[lang] ? "font-geez" : ""}>{t.subject(name)}</span>
            </p>
            <p className="text-muted">{date}</p>
          </div>

          <div className={`space-y-6 p-7 ${GEEZ[lang] && !missing ? "font-geez" : ""}`}>
            <div className="flex items-center gap-4">
              <Rodas size={72} />
              <div>
                <p className="text-2xl font-bold">{t.hello(name)}</p>
                <p className="mt-1 text-lg text-muted">{done.length ? t.summary(name, girl, done.length, starCount) : t.none(girl)}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Stat label={t.lessons} value={done.length} icon={<Check width="30" height="30" className="text-good" />} />
              <Stat label={t.stars} value={starCount} icon={<Star width="30" height="30" />} />
            </div>

            {letters.length > 0 && (
              <Part title={t.letters(girl)}>
                <div className="flex flex-wrap gap-2">
                  {letters.map((l) => (
                    <span key={l} className="chip bg-good-soft font-geez text-2xl text-good">
                      {l}
                    </span>
                  ))}
                </div>
              </Part>
            )}

            {words.length > 0 && (
              <Part title={t.words(girl)}>
                <div className="flex flex-wrap gap-2">
                  {words.map((w) => (
                    <span key={w.word} className="chip text-base">
                      {w.pic} <span className="font-geez">{w.native}</span>
                      <span className="font-body font-semibold text-muted">{w.english}</span>
                    </span>
                  ))}
                </div>
              </Part>
            )}

            {next && (
              <Part title={t.next}>
                <span className="chip text-base">
                  {next.pic || <span className="font-geez text-xl">{next.letter}</span>} {next.type === "letters" ? "" : next.title}
                </span>
              </Part>
            )}

            {practice && (
              <div className="rounded-2xl bg-sun/30 p-5">
                <p className="text-lg font-extrabold">{t.tipTitle}</p>
                <p className="mt-1 text-lg">{t.tip(name, girl, practice)}</p>
              </div>
            )}

            <p className="font-bold text-muted">{t.sign}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
