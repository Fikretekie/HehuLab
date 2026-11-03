"use client";

import Link from "next/link";
import { useState } from "react";
import { LANGS, useKid } from "../../../components/KidState";
import { TEACHERS } from "../../../components/Avatars";
import { LEARNERS, TRACKS } from "../../../components/courses";
import { Check } from "../../../components/Icons";
import { Speaker, say } from "../../../components/Voice";
import Choice from "../../../components/Choice";
import { REPORT_LANGS } from "../../../components/report";

// Screen 8 (web): Settings, for grown-ups. A small math question keeps little fingers out.
// The child's details on the left; teacher and parent options on the right. Every change saves right away.

const GATE = { q: "3 + 4", answer: 7, options: [5, 7, 9, 6] };

const Lock = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="10" width="14" height="11" rx="2" fill="currentColor" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.5" fill="none" />
  </svg>
);

function Field({ label, note, children }) {
  return (
    <div className="border-t-2 border-line py-5 first:border-t-0 first:pt-0">
      <p className="text-lg font-extrabold">{label}</p>
      {note && <p className="mb-3 text-sm text-muted">{note}</p>}
      <div className={note ? "" : "mt-3"}>{children}</div>
    </div>
  );
}

export default function Settings() {
  const { kid, update } = useKid();
  const [open, setOpen] = useState(false);
  const [miss, setMiss] = useState(null);
  const [resetAsk, setResetAsk] = useState(false);

  // The grown-up check
  if (!open) {
    return (
      <main className="flex justify-center py-10">
        <section className="card flex w-full max-w-lg flex-col items-center p-10 text-center">
          <span className="text-brand">
            <Lock />
          </span>
          <h1 className="mt-4 text-3xl font-bold">For grown-ups</h1>
          <p className="mt-2 text-lg text-muted">Answer this to open Settings.</p>
          <p className="my-6 font-display text-5xl font-bold">{GATE.q} = ?</p>
          <div className="grid grid-cols-4 gap-3">
            {GATE.options.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => (n === GATE.answer ? setOpen(true) : setMiss(n))}
                className={`h-16 w-16 rounded-2xl border-[3px] font-display text-2xl font-bold ${
                  miss === n ? "border-accent bg-accent-soft text-accent" : "border-line bg-white hover:border-brand/50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-4 min-h-[1.5em] font-bold text-accent">{miss ? "Not quite. Ask a grown-up!" : ""}</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand">Settings</p>
          <h1 className="mt-1 text-4xl font-bold">{kid.name}&apos;s settings</h1>
          <p className="mt-2 text-lg text-muted">Changes save right away on this device.</p>
        </div>
        <span className="chip bg-good-soft text-base text-good">
          <Check width="16" height="16" /> Saved
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* The child */}
        <section className="card p-7">
          <h2 className="mb-5 text-2xl font-bold">Your child</h2>
          <Field label="Name">
            <input
              type="text"
              value={kid.name}
              onChange={(e) => update({ name: e.target.value })}
              maxLength={20}
              className="w-full max-w-sm rounded-2xl border-[3px] border-line bg-white px-4 py-3 text-lg font-bold outline-none focus:border-brand"
            />
          </Field>
          <Field label="Boy or girl" note="So the teacher says “well done” the right way in Tigrinya.">
            <Choice options={[["girl", "Girl"], ["boy", "Boy"]]} value={kid.gender} onPick={(gender) => update({ gender })} />
          </Field>
          <Field label="Who is learning" note="Grown-ups get their own course (Beginner to Culture), with nothing locked.">
            <Choice options={LEARNERS.map((l) => [l.id, l.title])} value={kid.learner || "kid"} onPick={(learner) => update({ learner })} />
          </Field>
          <Field label="What to learn" note="Learn English: English words, explained in the language below.">
            <Choice options={TRACKS.map((x) => [x.id, x.title])} value={kid.track || "native"} onPick={(track) => update({ track })} />
          </Field>
          <Field label={kid.track === "english" ? "Language you speak" : "Language to learn"}>
            <Choice options={LANGS.map((l) => [l.id, l.name, l.native])} value={kid.lang} onPick={(lang) => update({ lang })} />
          </Field>
          <Field label="Learn math too" note="Math is taught in the language above.">
            <button
              type="button"
              role="switch"
              aria-checked={kid.math}
              onClick={() => update({ math: !kid.math })}
              className={`flex h-9 w-16 items-center rounded-full p-1 ${kid.math ? "justify-end bg-good" : "justify-start bg-line"}`}
            >
              <span className="h-7 w-7 rounded-full bg-white" />
              <span className="sr-only">Learn math too</span>
            </button>
          </Field>
        </section>

        <div className="space-y-8">
          {/* Teacher */}
          <section className="card p-7">
            <h2 className="mb-5 text-2xl font-bold">Teacher</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {TEACHERS.map(({ id, name, short, Pic }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => update({ teacher: id })}
                  aria-pressed={kid.teacher === id}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-[3px] p-3 text-sm font-extrabold transition ${
                    kid.teacher === id ? "border-brand bg-soft" : "border-line bg-white hover:border-brand/50"
                  }`}
                >
                  <Pic size={52} />
                  {short || name}
                </button>
              ))}
            </div>
          </section>

          {/* Parents */}
          <section className="card p-7">
            <h2 className="mb-5 text-2xl font-bold">For parents</h2>
            <Field label="Rodas speaks out loud" note="Rodas reads each step and says the letters in her own voice.">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  role="switch"
                  aria-checked={kid.voice !== false}
                  onClick={() => update({ voice: kid.voice === false })}
                  className={`flex h-9 w-16 items-center rounded-full p-1 ${kid.voice !== false ? "justify-end bg-good" : "justify-start bg-line"}`}
                >
                  <span className="h-7 w-7 rounded-full bg-white" />
                  <span className="sr-only">Rodas speaks out loud</span>
                </button>
                {kid.voice !== false && (
                  <button
                    type="button"
                    onClick={() => say({ lang: kid.lang, word: kid.lang === "ti" ? "ሰላም" : undefined, text: `Hello ${kid.name}! I'm ready to learn with you.` })}
                    className="btn-line py-2"
                  >
                    <Speaker /> Try it
                  </button>
                )}
              </div>
            </Field>
            <Field label="Friday report language" note="Every Friday the family gets an email about the week, in this language.">
              <Choice options={REPORT_LANGS} value={kid.reportLang || "en"} onPick={(reportLang) => update({ reportLang })} />
              <Link href="/app/report/" className="btn-line mt-4 inline-flex py-2">
                See the report
              </Link>
            </Field>
            <Field label="Start the path again" note="Every lesson goes back to the start and the stars are cleared.">
              {resetAsk ? (
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      update({ done: 0, stars: {} });
                      setResetAsk(false);
                    }}
                    className="btn bg-accent text-white hover:brightness-110"
                  >
                    Yes, start again
                  </button>
                  <button type="button" onClick={() => setResetAsk(false)} className="btn-line">
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setResetAsk(true)} className="btn-line">
                  Start again
                </button>
              )}
            </Field>
          </section>
        </div>
      </div>
    </main>
  );
}
