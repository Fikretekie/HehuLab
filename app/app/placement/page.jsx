"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { langOf, useKid } from "../../../components/KidState";
import { TEACHERS } from "../../../components/Avatars";
import { placementLevels } from "../../../components/placement";
import { SpeakButton, useVoice } from "../../../components/Voice";

// Placement test (before the path): a few friendly questions, easiest first, that decide where the learner starts.
// 2 questions per level; both right = go up a level, otherwise start at this level. A grown-up can still change it.

export default function Placement() {
  const { kid, update } = useKid();
  const lang = langOf(kid);
  const adult = kid.learner === "adult";
  const english = kid.track === "english";
  const teacher = TEACHERS.find((t) => t.id === kid.teacher) || TEACHERS[0];
  const voice = useVoice();

  const [levels, setLevels] = useState(null); // made after the page loads (the questions are mixed at random)
  const [step, setStep] = useState("intro"); // intro | test | result
  const [lv, setLv] = useState(0);
  const [q, setQ] = useState(0);
  const [picked, setPicked] = useState(null);
  const [rightInLevel, setRightInLevel] = useState(0);
  const [placed, setPlaced] = useState(null);

  useEffect(() => setLevels(placementLevels(kid.learner, kid.track, kid.lang)), [kid.learner, kid.track, kid.lang]);

  const level = levels?.[lv];
  const question = level?.qs[q];
  const total = levels ? levels.reduce((n, l) => n + l.qs.length, 0) : 0;
  const doneSoFar = levels ? levels.slice(0, lv).reduce((n, l) => n + l.qs.length, 0) + q : 0;

  // Say the question's word when it appears (listening questions and letters).
  useEffect(() => {
    if (step === "test" && question?.say) voice(question.say);
  }, [step, lv, q]); // eslint-disable-line react-hooks/exhaustive-deps

  function finish(at) {
    setPlaced(levels[at]);
    setStep("result");
    voice({ line: "welldone", text: "Well done! I know where we start." });
  }

  function answer(i) {
    if (picked !== null) return;
    setPicked(i);
    const ok = question.choices[i].ok;
    const right = rightInLevel + (ok ? 1 : 0);
    setTimeout(() => {
      setPicked(null);
      if (q + 1 < level.qs.length) {
        setRightInLevel(right);
        setQ(q + 1);
      } else if (right === level.qs.length && lv + 1 < levels.length) {
        setRightInLevel(0);
        setQ(0);
        setLv(lv + 1);
      } else {
        finish(lv); // missed one here (or passed the top level): start at this level
      }
    }, 900);
  }

  function choose(levelId) {
    update({ placed: levelId });
  }

  return (
    <main className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow text-brand">Placement test</p>
          <h1 className="mt-1 text-4xl font-bold">
            {step === "result" ? "All done!" : adult ? "Where should you start?" : `Let's see what ${kid.name} knows!`}
          </h1>
        </div>
        {step === "test" && (
          <div className="flex gap-1.5" aria-label={`Question ${doneSoFar + 1}`}>
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className={`h-3 w-3 rounded-full ${i < doneSoFar ? "bg-good" : i === doneSoFar ? "bg-brand" : "bg-line"}`} />
            ))}
          </div>
        )}
      </div>

      {step === "intro" && (
        <section className="card grid items-center gap-8 p-8 md:grid-cols-[200px_1fr]">
          <div className="flex justify-center"><teacher.Pic size={170} /></div>
          <div>
            <p className="text-2xl font-bold">
              {adult
                ? `A few quick questions so ${teacher.short || teacher.name} can start you at the right level.`
                : `Selam ${kid.name}! I'll ask a few fun questions. Just tap the answer you think is right.`}
            </p>
            <p className="mt-3 text-lg text-muted">
              {english ? `English, explained in ${lang.name}` : lang.name} · about 2 minutes · it&apos;s not a test you can fail
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" disabled={!levels} onClick={() => setStep("test")} className="btn-brand text-lg">
                Let&apos;s go!
              </button>
              <Link href="/app/path/" className="btn-line">Skip, start from the beginning</Link>
            </div>
          </div>
        </section>
      )}

      {step === "test" && question && (
        <section className="card p-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-3">
            <p className={`text-2xl font-bold ${question.askGeez ? "font-geez" : ""}`}>{question.ask}</p>
            {question.say && <SpeakButton onClick={() => voice(question.say)} />}
          </div>
          {question.show && (
            <p className={`my-6 break-words font-bold ${question.geez ? "font-geez" : "font-display"} ${
              question.kind === "count" ? "text-6xl tracking-widest" : question.show.length > 12 ? "text-4xl" : "text-7xl"
            }`}>
              {question.show}
            </p>
          )}
          {!question.show && <p className="my-6 text-7xl" aria-hidden="true">👂</p>}
          <div className={`mx-auto grid max-w-3xl gap-4 ${question.choices[0].label ? "md:grid-cols-2" : "grid-cols-4"}`}>
            {question.choices.map((c, i) => {
              const state = picked === null ? "" : c.ok ? "border-good bg-good-soft" : picked === i ? "border-accent bg-accent-soft" : "opacity-50";
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => answer(i)}
                  className={`rounded-3xl border-[3px] border-line bg-white p-5 font-bold transition hover:-translate-y-1 hover:border-brand ${state} ${
                    c.label ? "text-xl" : "text-6xl"
                  } ${c.geez ? "font-geez" : ""}`}
                >
                  {c.label || c.big}
                </button>
              );
            })}
          </div>
          <p className="mt-6 h-7 text-lg font-extrabold" aria-live="polite">
            {picked !== null && (question.choices[picked].ok ? <span className="text-good">Yes! ⭐</span> : <span className="text-accent">Good try!</span>)}
          </p>
        </section>
      )}

      {step === "result" && placed && (
        <section className="card overflow-hidden">
          <div className="flex flex-col items-center bg-soft p-8 text-center">
            <p className="text-6xl" aria-hidden="true">🎉</p>
            <p className="mt-3 text-lg font-bold text-muted">{adult ? "You start at" : `${kid.name} starts at`}</p>
            <p className="font-display text-5xl font-bold text-brand">{placed.title}</p>
          </div>
          <div className="p-8">
            <p className="font-extrabold">Grown-ups: want a different level? Tap one.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {levels.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setPlaced(l)}
                  aria-pressed={l.id === placed.id}
                  className={`rounded-2xl border-2 px-4 py-2.5 font-extrabold ${l.id === placed.id ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/50"}`}
                >
                  {l.title}
                </button>
              ))}
            </div>
            <Link href="/app/path/" onClick={() => choose(placed.id)} className="btn-brand mt-6 text-lg">
              Start learning at {placed.title}
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
