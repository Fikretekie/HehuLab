"use client";

import Link from "next/link";
import { LANGS, langOf, useKid } from "../../components/KidState";
import { TEACHERS } from "../../components/Avatars";

// Screen 2: the child picks a language, math, and a teacher.
export default function PickTeacher() {
  const { kid, update } = useKid();
  const lang = langOf(kid);
  const teacher = TEACHERS.find((t) => t.id === kid.teacher) || TEACHERS[0];
  const teacherName = teacher.id === "rodas" ? "Rodas, your AI teacher," : `${teacher.short}, your AI teacher,`;

  return (
    <main className="flex flex-1 flex-col gap-4 px-5 pb-6 pt-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold">HehuLab</Link>
        <span className="chip">Step 1 of 2</span>
      </div>

      <section>
        <h1 className="text-[26px] font-bold leading-tight">Which language do you want to learn?</h1>
        <p className="mb-3 mt-1 text-sm font-bold text-muted">We&apos;ll remember it. A grown-up can change it in Settings.</p>
        {["Eritrean", "From Ethiopia"].map((group) => (
          <div key={group} className="mb-2">
            <p className="eyebrow mb-1.5 text-muted">{group === "Eritrean" ? "Eritrean languages" : group}</p>
            <div className="grid grid-cols-3 gap-2">
              {LANGS.filter((l) => l.group === group).map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => update({ lang: l.id })}
                  aria-pressed={kid.lang === l.id}
                  className={`rounded-2xl border-[3px] px-1 py-2 text-center font-extrabold ${
                    kid.lang === l.id ? "border-brand bg-soft" : "border-line bg-white"
                  }`}
                >
                  <span className="block">{l.name}</span>
                  <span className="block min-h-[1.4em] font-geez text-sm font-semibold">{l.native}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <button
        type="button"
        role="switch"
        aria-checked={kid.math}
        onClick={() => update({ math: !kid.math })}
        className="flex items-center gap-3 rounded-2xl border-2 border-line bg-white px-4 py-3 text-left"
      >
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-soft font-display font-bold">1+2</span>
        <span className="flex-1">
          <b className="block">Learn math too</b>
          <span className="text-sm text-muted">Math is taught in {lang.name}</span>
        </span>
        <b className={kid.math ? "text-good" : "text-muted"}>{kid.math ? "Yes" : "No"}</b>
      </button>

      <section>
        <h2 className="mb-2 text-[22px] font-bold">Who will teach you?</h2>
        <div className="grid grid-cols-5 gap-2">
          {TEACHERS.map(({ id, name, short, Pic }) => (
            <button
              key={id}
              type="button"
              onClick={() => update({ teacher: id })}
              aria-pressed={kid.teacher === id}
              className={`flex flex-col items-center gap-1 rounded-2xl border-[3px] px-0.5 py-2 text-xs font-extrabold ${
                kid.teacher === id ? "border-brand bg-soft" : "border-line bg-white"
              }`}
            >
              <Pic size={46} />
              {short || name}
            </button>
          ))}
        </div>
      </section>

      <p className="rounded-[20px_20px_20px_6px] border-2 border-line bg-white px-4 py-3 font-bold">
        {teacherName} will talk to you in {lang.name}
        {kid.math ? ` and teach you math in ${lang.name}` : ""}.
      </p>

      <Link href="/app/path/" className="btn-brand mt-auto w-full text-lg">Let&apos;s start</Link>
    </main>
  );
}
