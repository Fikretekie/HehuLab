"use client";

import Link from "next/link";
import { LANGS, langOf, useKid } from "../../components/KidState";
import { TEACHERS } from "../../components/Avatars";

// Screen 2 (web): the child picks a language, math, and a teacher. Language and math on the left, teachers on the right.
export default function PickTeacher() {
  const { kid, update } = useKid();
  const lang = langOf(kid);
  const teacher = TEACHERS.find((t) => t.id === kid.teacher) || TEACHERS[0];
  const who = teacher.id === "rodas" ? "Rodas, your AI teacher," : `${teacher.name}, your AI teacher,`;

  return (
    <main>
      <div className="mb-8">
        <p className="eyebrow text-brand">Let&apos;s get started</p>
        <h1 className="mt-1 text-4xl font-bold">Pick your language and your teacher</h1>
        <p className="mt-2 text-lg text-muted">We&apos;ll remember your choice. A grown-up can change it any time in Settings.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left: language + math */}
        <section className="card p-7">
          <h2 className="mb-5 text-2xl font-bold">1. Which language do you want to learn?</h2>
          {["Eritrean", "From Ethiopia"].map((group) => (
            <div key={group} className="mb-5">
              <p className="eyebrow mb-2 text-muted">{group === "Eritrean" ? "Eritrean languages" : group}</p>
              <div className="grid grid-cols-4 gap-3">
                {LANGS.filter((l) => l.group === group).map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => update({ lang: l.id })}
                    aria-pressed={kid.lang === l.id}
                    className={`rounded-2xl border-[3px] px-2 py-4 text-center text-lg font-extrabold transition ${
                      kid.lang === l.id ? "border-brand bg-soft" : "border-line bg-white hover:border-brand/50"
                    }`}
                  >
                    <span className="block">{l.name}</span>
                    <span className="block min-h-[1.4em] font-geez text-base font-semibold">{l.native}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <h2 className="mb-3 mt-7 text-2xl font-bold">2. Learn math too?</h2>
          <button
            type="button"
            role="switch"
            aria-checked={kid.math}
            onClick={() => update({ math: !kid.math })}
            className="flex w-full items-center gap-4 rounded-2xl border-2 border-line bg-white px-5 py-4 text-left hover:border-brand/50"
          >
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-soft font-display text-lg font-bold">1+2</span>
            <span className="flex-1">
              <b className="block text-lg">Learn math too</b>
              <span className="text-muted">Math is taught in {lang.name}</span>
            </span>
            <span className={`flex h-8 w-14 items-center rounded-full p-1 ${kid.math ? "justify-end bg-good" : "justify-start bg-line"}`}>
              <span className="h-6 w-6 rounded-full bg-white" />
            </span>
          </button>
        </section>

        {/* Right: teachers */}
        <section className="card p-7">
          <h2 className="mb-5 text-2xl font-bold">3. Who will teach you?</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {TEACHERS.map(({ id, name, note, Pic }) => (
              <button
                key={id}
                type="button"
                onClick={() => update({ teacher: id })}
                aria-pressed={kid.teacher === id}
                className={`flex flex-col items-center gap-2 rounded-3xl border-[3px] p-4 text-center transition ${
                  kid.teacher === id ? "border-brand bg-soft" : "border-line bg-white hover:border-brand/50"
                } ${id === "rodas" ? "sm:col-span-1 sm:row-span-2 justify-center" : ""}`}
              >
                <Pic size={id === "rodas" ? 128 : 76} />
                <span className="text-lg font-extrabold leading-tight">{name}</span>
                <span className="text-sm text-muted">{note}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-soft p-5">
            <teacher.Pic size={56} />
            <p className="flex-1 text-lg font-bold">
              {who} will talk to you in {lang.name}
              {kid.math ? ` and teach you math in ${lang.name}` : ""}.
            </p>
            <Link href="/app/path/" className="btn-brand text-lg">Let&apos;s start</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
