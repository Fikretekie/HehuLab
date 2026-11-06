"use client";

import Link from "next/link";
import { useKid } from "./KidState";

// Prizes: finish every lesson of a level (Pre-K, Kindergarten, Grade 1 … or Beginner … Culture) and you win
// that level's prize and a certificate ("Grade 1 passed!"). Won prizes are kept in kid.prizes.

export const PRIZES = {
  k0: { pic: "⭐", name: "Little Star", color: "#B07D00" },
  k1: { pic: "🧭", name: "Letter Explorer", color: "#1F8A4C" },
  k2: { pic: "🧱", name: "Word Builder", color: "#B8441C" },
  k3: { pic: "📚", name: "Super Reader", color: "#1760CF" },
  k4: { pic: "🏆", name: "HehuLab Champion", color: "#7A3FC4" },
  a1: { pic: "🥉", name: "First Words", color: "#B8441C" },
  a2: { pic: "🥈", name: "Everyday Talker", color: "#4D5E78" },
  a3: { pic: "🥇", name: "Reader and Writer", color: "#C99A00" },
  a4: { pic: "🏆", name: "Culture Keeper", color: "#7A3FC4" },
};

export const finishedLevels = (levels, lessons, stars) =>
  levels.filter((lv) => {
    const ls = lessons.filter((l) => l.level === lv.id);
    return ls.length && ls.every((l) => stars[l.id]);
  });

// A level just finished whose prize hasn't been given yet: a big celebration on top of the path.
export function LevelPrize({ levels, lessons }) {
  const { kid, update } = useKid();
  const won = finishedLevels(levels, lessons, kid.stars || {}).find((lv) => !(kid.prizes || []).includes(lv.id));
  if (!won) return null;
  const prize = PRIZES[won.id] || PRIZES.k4;
  const keep = () => update({ prizes: [...(kid.prizes || []), won.id] });

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/60 p-4" role="dialog" aria-modal="true" aria-labelledby="prize-title">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl3 bg-white text-center">
        <Confetti />
        <div className="relative z-10 p-8">
          <p className="prize-pop text-8xl" aria-hidden="true">{prize.pic}</p>
          <p className="eyebrow mt-4 text-brand">You won a prize!</p>
          <h2 id="prize-title" className="mt-1 text-4xl font-bold">{won.title} passed!</h2>
          <p className="mt-2 text-xl font-bold" style={{ color: prize.color }}>{prize.name}</p>
          <p className="mt-3 text-lg text-muted">
            {kid.learner === "adult" ? "You finished every lesson of this level." : `${kid.name} finished every lesson of ${won.title}. Rodas is so proud!`}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={`/app/prize/?level=${won.id}`} onClick={keep} className="btn-brand text-lg">See my certificate</Link>
            <button type="button" onClick={keep} className="btn-line">Keep learning</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// The shelf on the side of the path: every level's prize, bright when won, grey until then.
export function PrizeShelf({ levels, lessons }) {
  const { kid } = useKid();
  const done = finishedLevels(levels, lessons, kid.stars || {}).map((l) => l.id);
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold">My prizes</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {levels.map((lv) => {
          const p = PRIZES[lv.id] || PRIZES.k4;
          const won = done.includes(lv.id);
          const inner = (
            <>
              <span className={`text-4xl ${won ? "" : "opacity-25 grayscale"}`} aria-hidden="true">{p.pic}</span>
              <span className={`text-xs font-extrabold leading-tight ${won ? "" : "text-muted"}`}>{lv.title}</span>
            </>
          );
          return won ? (
            <Link key={lv.id} href={`/app/prize/?level=${lv.id}`} title={`${p.name}: see the certificate`}
              className="flex flex-col items-center gap-1 rounded-2xl bg-soft p-2 text-center hover:ring-2 hover:ring-brand">
              {inner}
            </Link>
          ) : (
            <div key={lv.id} className="flex flex-col items-center gap-1 rounded-2xl p-2 text-center" title={`Finish ${lv.title} to win ${p.name}`}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Paper confetti falling behind the prize (stops for people who asked for less motion).
function Confetti() {
  const colors = ["#1760CF", "#FFC93C", "#B8441C", "#1F8A4C", "#7A3FC4"];
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 9) * 0.25}s`,
            animationDuration: `${2.4 + (i % 5) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
