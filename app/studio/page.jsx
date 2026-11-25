"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import {
  AD_CREDITS, AD_EXTRA_LANG, DEMOS, MODES, PACKS, STEPS, STUDIO_LANGS, STYLES, credits, dollars,
} from "../../components/studio";

// 🎬 HehuLab Studio (DEMO): movies, daily news, documentaries and ads in Tigrinya, Amharic, Tigre, Bilen, Somali
// and Kunama. Pick a mode, describe it, see the price in credits, press Make and watch the six steps; then fix any
// scene by typing. Nothing is generated or charged yet (see components/studio.js).

export default function Studio() {
  const [mode, setMode] = useState("series");
  const [lang, setLang] = useState("ti");
  const [balance, setBalance] = useState(2400);
  const [form, setForm] = useState({
    idea: "A brave shepherd boy, Haile, saves his father after a snake bite.",
    seasons: 1, episodes: 15, minutes: 20, style: "picture",
    newsMinutes: 4, newsDays: 30,
    topic: "Kuno Salsti: the story of Eritrean braids", docMinutes: 20, docStyle: "picture",
    business: "Mesob Store", offer: "Injera and coffee, 10% off this weekend", adLength: 30, adLangs: ["ti", "am"],
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const [step, setStep] = useState(-1); // -1 nothing yet, 0..5 making, 6 done
  const [scenes, setScenes] = useState([]);
  const [chat, setChat] = useState("");
  const [notes, setNotes] = useState([]);
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);

  const per = (id) => STYLES.find((s) => s.id === id).perMin;
  const cost =
    mode === "series" ? form.seasons * form.episodes * form.minutes * per(form.style)
    : mode === "news" ? form.newsMinutes * form.newsDays * per("news")
    : mode === "docu" ? form.docMinutes * per(form.docStyle)
    : AD_CREDITS[form.adLength] + Math.max(0, form.adLangs.length - 1) * AD_EXTRA_LANG;
  const costLabel = mode === "news" ? "a month" : mode === "series" ? `for ${form.seasons} season${form.seasons > 1 ? "s" : ""}` : mode === "ad" ? "for this ad" : "for this film";
  // The demo makes only a short sample, so it costs little.
  const sampleCost = mode === "ad" ? AD_CREDITS[form.adLength] : per(mode === "news" ? "news" : mode === "docu" ? form.docStyle : form.style);

  function make() {
    clearInterval(timer.current);
    setScenes([]);
    setNotes([]);
    setStep(0);
    let s = 0;
    timer.current = setInterval(() => {
      s += 1;
      setStep(s);
      if (s >= STEPS.length) {
        clearInterval(timer.current);
        setScenes(DEMOS[mode].map((x, i) => ({ ...x, id: i, change: "", redone: 0 })));
      }
    }, 700);
  }

  function redo(id, text) {
    if (!text.trim()) return;
    setScenes((all) => all.map((x) => (x.id === id ? { ...x, change: "", redone: x.redone + 1, last: text.trim() } : x)));
  }

  function changeAll() {
    if (!chat.trim()) return;
    setNotes((n) => [...n, chat.trim()]);
    setScenes((all) => all.map((x) => ({ ...x, redone: x.redone + 1, last: chat.trim() })));
    setChat("");
  }

  const L = STUDIO_LANGS.find((l) => l.id === lang);
  const line = (x) => (lang === "ti" || lang === "am" ? x[lang] : null);

  return (
    <>
      <SiteHeader />
      <main className="wrap pb-24">
        <section className="py-10">
          <p className="eyebrow text-brand">HehuLab Studio · demo</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold md:text-5xl">Movies, news, documentaries and ads in our languages</h1>
              <p className="mt-3 text-lg text-muted">
                Type an idea. The Studio writes the script, draws the pictures, makes the video and reads it with
                our own voices. Don't like a scene? Type a change and only that scene is redone.
              </p>
            </div>
            <div className="card px-5 py-4 text-right">
              <p className="text-sm text-muted">Your credits</p>
              <p className="font-display text-3xl font-bold">💳 {credits(balance)}</p>
              <a href="#credits" className="text-sm font-bold text-brand">Buy credits</a>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {STUDIO_LANGS.map((l) => (
              <button key={l.id} onClick={() => setLang(l.id)}
                className={`chip border-2 ${lang === l.id ? "border-brand bg-brand/20 text-ink" : "border-line text-muted"}`}>
                <span className="font-geez">{l.native}</span> · {l.name}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">Voice: {L.voice}</p>
        </section>

        {/* 1. Pick what to make */}
        <section className="grid gap-4 md:grid-cols-4">
          {MODES.map((m) => (
            <button key={m.id} onClick={() => { setMode(m.id); setStep(-1); setScenes([]); }}
              className={`card p-5 text-left transition ${mode === m.id ? "border-brand ring-2 ring-brand/40" : "hover:border-brand/50"}`}>
              <span className="text-3xl">{m.icon}</span>
              <h2 className="mt-2 text-xl font-bold">{m.name}</h2>
              <p className="mt-1 text-sm text-muted">{m.short}</p>
            </button>
          ))}
        </section>

        {/* 2. Describe it + price */}
        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="card p-6">
            {mode === "series" && (
              <>
                <Field label="Your idea">
                  <textarea rows={2} value={form.idea} onChange={(e) => set("idea", e.target.value)} className="input" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Num label="Seasons" v={form.seasons} min={1} max={10} on={(v) => set("seasons", v)} />
                  <Num label="Episodes per season" v={form.episodes} min={1} max={30} on={(v) => set("episodes", v)} />
                  <Num label="Minutes per episode" v={form.minutes} min={1} max={60} on={(v) => set("minutes", v)} />
                </div>
                <Styles value={form.style} on={(v) => set("style", v)} ids={["picture", "video540", "video720"]} />
                <p className="mt-3 text-sm text-muted">
                  Bulk seasons: Claude writes every script first; you approve them; then the Studio makes a few episodes
                  each night, never past your nightly spending limit; you check them in the morning.
                </p>
              </>
            )}
            {mode === "news" && (
              <>
                <Field label="Today's news items (paste text or links from trusted sources)">
                  <textarea rows={3} defaultValue={"New children's library opens downtown\nWeather: sunny, rain in the evening"} className="input" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Num label="Minutes per bulletin" v={form.newsMinutes} min={1} max={15} on={(v) => set("newsMinutes", v)} />
                  <Num label="Bulletins a month" v={form.newsDays} min={1} max={31} on={(v) => set("newsDays", v)} />
                </div>
                <p className="mt-3 text-sm text-muted">Every morning at 6:00 the bulletin is made; a person approves it before it goes out.</p>
              </>
            )}
            {mode === "docu" && (
              <>
                <Field label="Topic">
                  <input value={form.topic} onChange={(e) => set("topic", e.target.value)} className="input" />
                </Field>
                <Field label="Your notes, old photos or archive clips">
                  <div className="rounded-2xl border-2 border-dashed border-line p-5 text-center text-muted">📎 Drop photos or files here (demo)</div>
                </Field>
                <Num label="Length in minutes" v={form.docMinutes} min={1} max={90} on={(v) => set("docMinutes", v)} />
                <Styles value={form.docStyle} on={(v) => set("docStyle", v)} ids={["picture", "video540"]} />
              </>
            )}
            {mode === "ad" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Business name"><input value={form.business} onChange={(e) => set("business", e.target.value)} className="input" /></Field>
                  <Field label="The offer, in one sentence"><input value={form.offer} onChange={(e) => set("offer", e.target.value)} className="input" /></Field>
                </div>
                <Field label="Length">
                  <div className="flex gap-2">
                    {[15, 30, 60].map((s) => (
                      <button key={s} onClick={() => set("adLength", s)} className={`chip border-2 ${form.adLength === s ? "border-brand bg-brand/20" : "border-line"}`}>{s} seconds</button>
                    ))}
                  </div>
                </Field>
                <Field label="Languages (the same ad in each)">
                  <div className="flex flex-wrap gap-2">
                    {STUDIO_LANGS.map((l) => {
                      const on = form.adLangs.includes(l.id);
                      return (
                        <button key={l.id} onClick={() => set("adLangs", on ? form.adLangs.filter((x) => x !== l.id) : [...form.adLangs, l.id])}
                          className={`chip border-2 ${on ? "border-brand bg-brand/20" : "border-line text-muted"}`}>{on ? "✓ " : ""}{l.name}</button>
                      );
                    })}
                  </div>
                </Field>
                <p className="mt-1 text-sm text-muted">Made tall (9:16) for TikTok, Reels and WhatsApp status, and wide (16:9) for YouTube. Brand kit (logo, colors, photos) is saved once.</p>
              </>
            )}
          </div>

          <aside className="card flex flex-col gap-3 p-6">
            <p className="eyebrow text-muted">Price</p>
            <p className="font-display text-4xl font-bold">{credits(cost)} <span className="text-lg text-muted">credits</span></p>
            <p className="text-muted">{dollars(cost)} {costLabel}</p>
            <hr className="border-line" />
            <p className="text-sm text-muted">Try a short sample first: <b className="text-ink">{credits(sampleCost)} credits</b></p>
            <button onClick={make} disabled={step >= 0 && step < STEPS.length} className="btn-brand w-full disabled:opacity-60">
              ▶ Make a sample
            </button>
            <p className="text-xs text-muted">Demo: nothing is made or charged yet.</p>
          </aside>
        </section>

        {/* 3. The six steps */}
        {step >= 0 && (
          <section className="card mt-6 p-6">
            <h2 className="text-2xl font-bold">Making your {MODES.find((m) => m.id === mode).sample}</h2>
            <ol className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {STEPS.map((s, i) => (
                <li key={s} className={`rounded-2xl border-2 p-3 text-sm font-bold ${i < step ? "border-good bg-good/15" : i === step ? "border-brand bg-brand/15" : "border-line text-muted"}`}>
                  <span className="block text-xs">{i < step ? "✓ Done" : i === step ? "⏳ Working" : `Step ${i + 1}`}</span>
                  {s}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* 4. Storyboard: fix any scene by typing */}
        {scenes.length > 0 && (
          <section className="mt-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-2xl font-bold">Your scenes</h2>
              <span className="chip">🎧 {L.name} voice · English subtitles</span>
            </div>
            {lang !== "ti" && lang !== "am" && (
              <p className="mt-2 text-sm text-muted">The {L.name} script and voice come once there are enough {L.name} recordings; the English line shows for now.</p>
            )}
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {scenes.map((x) => (
                <article key={x.id} className="card overflow-hidden">
                  <div className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${x.sky}`}>
                    <span className="text-6xl">{x.pic}</span>
                    <span className="absolute left-3 top-3 chip bg-panel/80 text-xs">Scene {x.id + 1} · AI picture (demo)</span>
                    {x.redone > 0 && <span className="absolute right-3 top-3 chip bg-good text-xs text-white">Redone ✓</span>}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted">{x.shot}</p>
                    {line(x) && <p className="mt-2 font-geez text-lg font-bold">{line(x)}</p>}
                    <p className="mt-1 text-sm">{x.en}</p>
                    {x.last && <p className="mt-2 text-xs text-good">Changed: “{x.last}”</p>}
                    <SceneFix onFix={(t) => redo(x.id, t)} />
                  </div>
                </article>
              ))}
            </div>
            <div className="card sticky bottom-4 mt-6 flex flex-wrap items-center gap-3 p-3">
              <input value={chat} onChange={(e) => setChat(e.target.value)} onKeyDown={(e) => e.key === "Enter" && changeAll()}
                placeholder="Change the whole episode: “make it night”, “use a man's voice”, “add music”…" className="input min-w-[240px] flex-1" />
              <button onClick={changeAll} className="btn-brand px-5 py-2.5">Apply to all</button>
              <button className="btn-line px-5 py-2.5" onClick={() => alert("Demo: the joined MP4 downloads here once the Studio is connected.")}>⬇ Download MP4</button>
            </div>
            {notes.length > 0 && <p className="mt-2 text-sm text-muted">Changes so far: {notes.join(" · ")}</p>}
          </section>
        )}

        {/* 5. Credits */}
        <section id="credits" className="mt-14">
          <h2 className="text-3xl font-bold">Credits</h2>
          <p className="mt-2 text-muted">1 credit = $0.10. Every job shows its price before it runs; a failed job gives the credits back.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {PACKS.map((p) => (
              <div key={p.name} className="card flex flex-col gap-2 p-6">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="font-display text-4xl font-bold">${p.price}</p>
                <p className="font-bold">{credits(p.credits)} credits</p>
                <p className="flex-1 text-sm text-muted">{p.note}</p>
                <button onClick={() => setBalance((b) => b + p.credits)} className="btn-line w-full py-2.5">Buy (demo)</button>
              </div>
            ))}
            <div className="flex flex-col gap-2 rounded-xl3 bg-ink p-6 text-white">
              <h3 className="text-xl font-bold">Studio plan</h3>
              <p className="font-display text-4xl font-bold">$1,000+<span className="text-base"> /mo</span></p>
              <p className="flex-1 text-sm text-white/80">Big monthly credit bundle at a lower price, team logins, bulk seasons, priority queue, your own trained voices.</p>
              <a href="mailto:hello@hehulab.org" className="btn-sun w-full py-2.5">Talk to us</a>
            </div>
          </div>
          <div className="card mt-5 overflow-x-auto p-6">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-muted"><tr><th className="py-2">Style</th><th>Credits per minute</th><th>Price per minute</th></tr></thead>
              <tbody>
                {STYLES.map((s) => (
                  <tr key={s.id} className="border-t border-line"><td className="py-2 font-bold">{s.name} <span className="font-normal text-muted">· {s.note}</span></td><td>{credits(s.perMin)}</td><td>{dollars(s.perMin)}</td></tr>
                ))}
                <tr className="border-t border-line"><td className="py-2 font-bold">Ad, 30 seconds <span className="font-normal text-muted">· AI video 720p</span></td><td>{credits(AD_CREDITS[30])} per ad (+{AD_EXTRA_LANG} each extra language)</td><td>{dollars(AD_CREDITS[30])} per ad</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">Rules: true prices and claims in ads, no fake reviews, no real person's face or voice without their written OK, and every video is labelled “Made with AI”.</p>
          <p className="mt-2 text-sm"><Link href="/" className="font-bold text-brand">← Back to HehuLab</Link></p>
        </section>
      </main>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-bold text-muted">{label}</span>
      {children}
    </label>
  );
}

function Num({ label, v, min, max, on }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <button onClick={() => on(Math.max(min, v - 1))} className="btn-line h-10 w-10 p-0">−</button>
        <span className="w-12 text-center font-display text-2xl font-bold">{v}</span>
        <button onClick={() => on(Math.min(max, v + 1))} className="btn-line h-10 w-10 p-0">+</button>
      </div>
    </Field>
  );
}

function Styles({ value, on, ids }) {
  return (
    <Field label="Look">
      <div className="grid gap-2 sm:grid-cols-3">
        {STYLES.filter((s) => ids.includes(s.id)).map((s) => (
          <button key={s.id} onClick={() => on(s.id)}
            className={`rounded-2xl border-2 p-3 text-left ${value === s.id ? "border-brand bg-brand/15" : "border-line"}`}>
            <b className="block">{s.name}</b>
            <span className="text-xs text-muted">{s.note} · {s.perMin} credits/min</span>
          </button>
        ))}
      </div>
    </Field>
  );
}

function SceneFix({ onFix }) {
  const [t, setT] = useState("");
  return (
    <div className="mt-3 flex gap-2">
      <input value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (onFix(t), setT(""))}
        placeholder="Change this scene…" className="input flex-1 py-2 text-sm" />
      <button onClick={() => { onFix(t); setT(""); }} className="btn-line px-3 py-2 text-sm">Redo</button>
    </div>
  );
}
