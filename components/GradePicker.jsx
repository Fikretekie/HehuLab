"use client";

import { useState } from "react";
import Link from "next/link";
import { usesGeez } from "./curriculum";

// The grade cards follow the language tab: every subject, math included, is taught in that language.
const LANGS = [
  { id: "ti", name: "Tigrinya", group: "Eritrean" },
  { id: "tig", name: "Tigre", group: "Eritrean" },
  { id: "byn", name: "Bilen", group: "Eritrean" },
  { id: "ssy", name: "Saho", group: "Eritrean" },
  { id: "am", name: "Amharic", group: "From Ethiopia" },
];

const GRADES = [
  { name: "Pre-Kindergarten", age: "Ages 3–4 · listen and sing", art: "Hi!", geez: false, bg: "bg-[#FFE3D8]", topics: ["Songs", "Colors"], math: "Count to 5" },
  { name: "Kindergarten", age: "Ages 5–6 · the letters", art: "ሀ ሁ ሂ", geez: true, bg: "bg-[#FFF1C2]", topics: ["Letters"], math: "Count to 20" },
  { name: "Grade 1", age: "Ages 6–7 · first words", art: "1 + 2", geez: false, bg: "bg-[#DDF6EA]", topics: ["Reading"], math: "Add, subtract" },
  { name: "Grade 2", age: "Ages 7–8 · sentences", art: "Read", geez: false, bg: "bg-[#DCEBFF]", topics: ["Short stories"], math: "Numbers to 100" },
  { name: "Grade 3 and up", age: "Ages 8–12 · stories and writing", art: "Write", geez: false, bg: "bg-[#E7E9FF]", topics: ["Proverbs"], math: "Word problems" },
];

export default function GradePicker() {
  const [lang, setLang] = useState("ti");
  const name = LANGS.find((l) => l.id === lang).name;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="mb-1.5 text-4xl font-bold">Pick a grade, start learning</h2>
          <p className="text-lg text-muted">
            Everything is taught in the language your child picks, <b className="text-ink">math too</b>.
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-xl bg-soft p-1 text-sm font-extrabold" role="group" aria-label="Language">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLang(l.id)}
              aria-pressed={lang === l.id}
              className={`rounded-lg px-3.5 py-2 ${lang === l.id ? "bg-brand text-white" : "hover:bg-white"}`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {GRADES.map((g) => (
          <Link key={g.name} href="/app/" className="card overflow-hidden transition hover:border-brand">
            <div className={`${g.bg} flex h-32 items-center justify-center text-4xl font-bold ${g.geez ? "font-geez" : "font-display"}`}>
              {g.geez && !usesGeez(lang) ? "a b c" : g.art}
            </div>
            <div className="p-4">
              <p className="text-lg font-extrabold">{g.name}</p>
              <p className="mb-3 text-sm text-muted">{g.age}</p>
              <p className="flex flex-wrap gap-1.5 text-xs font-extrabold">
                {g.topics.map((t) => (
                  <span key={t} className="rounded-md bg-soft px-2 py-1">{t} in {name}</span>
                ))}
                <span className="rounded-md bg-accent-soft px-2 py-1 text-accent">Math in {name}: {g.math}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-muted">
        A {name} learner does math in {name}. Not sure about the grade? A 2-minute placement game picks it.
      </p>
    </>
  );
}
