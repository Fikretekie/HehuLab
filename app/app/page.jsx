"use client";

import Link from "next/link";
import { LANGS, langOf, useKid } from "../../components/KidState";
import { TEACHERS } from "../../components/Avatars";
import { GRADES, LEARNERS, TRACKS } from "../../components/courses";

// Screen 2 (web): who is learning (a child or a grown-up), what (their own language, or English taught in their
// language), which language, and (for kids) math and a teacher. Choices on the left, teachers on the right.

function Choice({ on, onClick, title, note, big }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`flex flex-col items-start gap-1 rounded-2xl border-[3px] px-5 py-4 text-left transition ${
        on ? "border-brand bg-soft" : "border-line bg-white hover:border-brand/50"
      }`}
    >
      <span className="flex items-center gap-2 text-lg font-extrabold">
        {big && <span className="text-2xl">{big}</span>}
        {title}
      </span>
      <span className="text-sm text-muted">{note}</span>
    </button>
  );
}

export default function Start() {
  const { kid, update } = useKid();
  const lang = langOf(kid);
  const adult = kid.learner === "adult";
  const english = kid.track === "english";
  const teacher = TEACHERS.find((t) => t.id === kid.teacher) || TEACHERS[0];
  const teachers = adult ? TEACHERS.filter((t) => t.id === "rodas" || t.id === "kokob") : TEACHERS;

  return (
    <main>
      <div className="mb-8">
        <p className="eyebrow text-brand">Let&apos;s get started</p>
        <h1 className="mt-1 text-4xl font-bold">Who is learning, and what?</h1>
        <p className="mt-2 text-lg text-muted">We&apos;ll remember your choice. You can change it any time in Settings.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="card space-y-7 p-7">
          <div>
            <h2 className="mb-4 text-2xl font-bold">1. Who is learning?</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {LEARNERS.map((l) => (
                <Choice
                  key={l.id}
                  on={kid.learner === l.id}
                  onClick={() => update({ learner: l.id, ...(l.id === "adult" ? { teacher: "rodas" } : {}) })}
                  title={l.title}
                  note={l.note}
                  big={l.id === "kid" ? "🧒" : "🧑"}
                />
              ))}
            </div>
            {!adult && (
              <>
                <p className="mb-2 mt-5 font-extrabold">Which grade? <span className="font-semibold text-muted">(games fit the age)</span></p>
                <div className="grid grid-cols-5 gap-2">
                  {GRADES.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => update({ grade: g.id })}
                      aria-pressed={kid.grade === g.id}
                      className={`rounded-2xl border-[3px] px-1 py-3 text-center font-extrabold transition ${
                        kid.grade === g.id ? "border-brand bg-soft" : "border-line bg-white hover:border-brand/50"
                      }`}
                    >
                      <span className="block text-[15px] leading-tight">{g.title}</span>
                      <span className="block text-sm font-semibold text-muted">age {g.age}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">2. What do you want to learn?</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {TRACKS.map((t) => (
                <Choice
                  key={t.id}
                  on={kid.track === t.id}
                  onClick={() => update({ track: t.id })}
                  title={t.title}
                  note={t.note}
                  big={t.id === "native" ? "ሀ" : "A"}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">
              3. {english ? "Which language do you speak?" : "Which language do you want to learn?"}
            </h2>
            {["Eritrean", "From Ethiopia"].map((group) => (
              <div key={group} className="mb-4">
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
            {kid.lang !== "ti" && (
              <p className="rounded-2xl bg-accent-soft px-4 py-3 text-sm font-bold text-accent">
                {lang.name} lessons are being recorded by families right now. Letters work today; words and Rodas&apos;s
                voice in {lang.name} come soon.
              </p>
            )}
          </div>

          {!adult && !english && (
            <div>
              <h2 className="mb-3 text-2xl font-bold">4. Learn math too?</h2>
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
            </div>
          )}
        </section>

        <section className="card p-7 lg:self-start">
          <h2 className="mb-5 text-2xl font-bold">{adult ? "Your teacher" : "Who will teach you?"}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {teachers.map(({ id, name, note, Pic }) => (
              <button
                key={id}
                type="button"
                onClick={() => update({ teacher: id })}
                aria-pressed={kid.teacher === id}
                className={`flex flex-col items-center gap-2 rounded-3xl border-[3px] p-4 text-center transition ${
                  kid.teacher === id ? "border-brand bg-soft" : "border-line bg-white hover:border-brand/50"
                }`}
              >
                <Pic size={id === "rodas" ? 104 : 76} />
                <span className="text-lg font-extrabold leading-tight">{name}</span>
                <span className="text-sm text-muted">{note}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-soft p-5">
            <teacher.Pic size={56} />
            <p className="flex-1 text-lg font-bold">
              {english
                ? `${teacher.short || teacher.name} will teach you English, explained in ${lang.name}.`
                : `${teacher.short || teacher.name} will teach you ${lang.name}${!adult && kid.math ? ` and math in ${lang.name}` : ""}.`}
            </p>
            {/* First time: the placement test picks the level. After that, straight to the path. */}
            <Link href={kid.placed ? "/app/path/" : "/app/placement/"} className="btn-brand text-lg">
              Let&apos;s start
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
