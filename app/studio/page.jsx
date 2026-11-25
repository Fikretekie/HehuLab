"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import {
  AD_CREDITS, AD_EXTRA_LANG, DEMOS, MIXES, MODES, PACKS, PRICE, RECOMMENDED_MIX, SCENE_SECONDS, SHOTS, STEPS, STUDIO_LANGS,
  VOICE_STEPS, credits, dollars, perMinFor,
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
    seasons: 1, episodes: 15, minutes: 20, mix: RECOMMENDED_MIX,
    newsMinutes: 4, newsDays: 30,
    topic: "Kuno Salsti: the story of Eritrean braids", docMinutes: 20, docMix: RECOMMENDED_MIX,
    business: "Mesob Store", offer: "Injera and coffee, 10% off this weekend", adLength: 30, adLangs: ["ti", "am"],
    voiceText: "እንቋዕ ብደሓን መጻእኩም። እዚ ናይ ሎሚ ዜና እዩ።", voiceMinutes: 10,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const [step, setStep] = useState(-1); // -1 nothing yet, 0..5 making, 6 done
  const [scenes, setScenes] = useState([]);
  const [chat, setChat] = useState("");
  const [notes, setNotes] = useState([]);
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);

  // The Studio menu links (#series, #news, #docu, #ad, #voice) open that mode.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (MODES.some((m) => m.id === h)) {
        pick(h);
        document.getElementById("make")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  function pick(id) {
    clearInterval(timer.current);
    setMode(id);
    setStep(-1);
    setScenes([]);
  }
  const steps = mode === "voice" ? VOICE_STEPS : STEPS;

  // Films (series, documentaries) are a mix of picture shots and video shots: the customer sees both parts.
  const isFilm = mode === "series" || mode === "docu";
  const filmMinutes = mode === "series" ? form.seasons * form.episodes * form.minutes : form.docMinutes;
  const mix = mode === "series" ? form.mix : form.docMix;
  const setMix = (v) => set(mode === "series" ? "mix" : "docMix", v);
  const filmCredits = (m) => Math.round(filmMinutes * perMinFor(m));
  const cost =
    isFilm ? filmCredits(mix)
    : mode === "news" ? form.newsMinutes * form.newsDays * PRICE.news.perMin
    : mode === "voice" ? form.voiceMinutes * PRICE.voice.perMin
    : AD_CREDITS[form.adLength] + Math.max(0, form.adLangs.length - 1) * AD_EXTRA_LANG;
  const costLabel = mode === "news" ? "a month" : mode === "series" ? `for ${form.seasons} season${form.seasons > 1 ? "s" : ""}` : mode === "ad" ? "for this ad" : mode === "voice" ? "for this audio" : "for this film";
  // The demo makes only a short sample, so it costs little.
  const sampleCost = mode === "ad" ? AD_CREDITS[form.adLength] : Math.round(isFilm ? perMinFor(mix) : PRICE[mode].perMin);

  function make() {
    clearInterval(timer.current);
    setScenes([]);
    setNotes([]);
    setStep(0);
    let s = 0;
    timer.current = setInterval(() => {
      s += 1;
      setStep(s);
      if (s >= steps.length) {
        clearInterval(timer.current);
        setScenes(DEMOS[mode].map((x, i) => ({ ...x, id: i, change: "", redone: 0, kind: SHOTS[x.shotType]?.kind })));
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
      <SiteHeader area="studio" />
      <main className="wrap pb-24">
        <section className="py-10">
          <p className="eyebrow text-brand">HehuLab Studio · demo</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold md:text-5xl">Movies, news, documentaries, ads and voice in our languages</h1>
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
        <section id="make" className="grid scroll-mt-6 gap-4 md:grid-cols-5">
          {MODES.map((m) => (
            <button key={m.id} onClick={() => { pick(m.id); history.replaceState(null, "", "#" + m.id); }}
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
                <MixPicker value={form.mix} on={(v) => set("mix", v)} />
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
                <MixPicker value={form.docMix} on={(v) => set("docMix", v)} />
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
            {mode === "voice" && (
              <>
                <Field label={`Your text (in ${L.name})`}>
                  <textarea rows={4} value={form.voiceText} onChange={(e) => set("voiceText", e.target.value)} className="input font-geez" />
                </Field>
                <Num label="About how many minutes of audio" v={form.voiceMinutes} min={1} max={120} on={(v) => set("voiceMinutes", v)} />
                <p className="mt-1 text-sm text-muted">For voice-overs, audiobooks, school lessons and phone messages. You get an MP3 with each line, and you can redo any line.</p>
              </>
            )}
          </div>

          <aside className="card flex flex-col gap-3 p-6">
            <p className="eyebrow text-muted">Price</p>
            <p className="font-display text-4xl font-bold">{credits(cost)} <span className="text-lg text-muted">credits</span></p>
            <p className="text-muted">{dollars(cost)} {costLabel}</p>
            {isFilm && (
              <div className="rounded-2xl border border-line p-3 text-sm">
                <p className="mb-1 font-bold">What you pay for</p>
                <Row k={`🖼️ Pictures: ${n1((filmMinutes * (100 - mix)) / 100)} min × ${PRICE.picture.perMin}`} v={Math.round((filmMinutes * (100 - mix) * PRICE.picture.perMin) / 100)} />
                <Row k={`🎥 Video: ${n1((filmMinutes * mix) / 100)} min × ${PRICE.video.perMin}`} v={Math.round((filmMinutes * mix * PRICE.video.perMin) / 100)} />
                <div className="mt-1 border-t border-line pt-1"><Row k="Total" v={cost} bold /></div>
              </div>
            )}
            <hr className="border-line" />
            <p className="text-sm text-muted">Try a short sample first: <b className="text-ink">{credits(sampleCost)} credits</b></p>
            <button onClick={make} disabled={step >= 0 && step < steps.length} className="btn-brand w-full disabled:opacity-60">
              ▶ Make a sample
            </button>
            <p className="text-xs text-muted">Demo: nothing is made or charged yet.</p>
          </aside>
        </section>

        {/* 2b. Compare every mix: full transparency before paying */}
        {isFilm && (
          <section className="card mt-6 overflow-x-auto p-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-2xl font-bold">Compare: how much video do you want?</h2>
              <p className="text-sm text-muted">For your {n1(filmMinutes)} minutes. Click a row to choose it.</p>
            </div>
            <table className="mt-4 w-full min-w-[620px] text-left text-sm">
              <thead className="text-muted">
                <tr><th className="py-2">Video</th><th>🖼️ Picture minutes</th><th>🎥 Video minutes</th><th>Credits</th><th>You pay</th><th></th></tr>
              </thead>
              <tbody>
                {MIXES.map((m) => (
                  <tr key={m} onClick={() => setMix(m)}
                    className={`cursor-pointer border-t border-line ${m === mix ? "bg-brand/15 font-bold" : "hover:bg-brand/5"}`}>
                    <td className="py-2.5">{m}% video{m === 0 ? " (pictures only)" : m === 100 ? " (full video)" : ""}</td>
                    <td>{n1((filmMinutes * (100 - m)) / 100)}</td>
                    <td>{n1((filmMinutes * m) / 100)}</td>
                    <td>{credits(filmCredits(m))}</td>
                    <td className="font-bold">{dollars(filmCredits(m))}</td>
                    <td>{m === RECOMMENDED_MIX ? <span className="chip bg-good/20 text-xs text-good">⭐ Recommended</span> : m === mix ? "✓ Chosen" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-sm text-muted">
              Calm shots (bird's-eye view, slow zoom, slow pan) are pictures with a moving camera. Action shots (running,
              a snake, a fire) are real video. You can swap any scene after the sample.
            </p>
          </section>
        )}

        {/* 3. The six steps */}
        {step >= 0 && (
          <section className="card mt-6 p-6">
            <h2 className="text-2xl font-bold">Making your {MODES.find((m) => m.id === mode).sample}</h2>
            <ol className={`mt-4 grid gap-2 sm:grid-cols-3 ${mode === "voice" ? "" : "lg:grid-cols-6"}`}>
              {steps.map((s, i) => (
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
              <h2 className="text-2xl font-bold">{mode === "voice" ? "Your audio lines" : "Your scenes"}</h2>
              <span className="chip">🎧 {L.name} voice{mode === "voice" ? "" : " · English subtitles"}</span>
            </div>
            {isFilm && scenes[0]?.kind && (() => {
              const vids = scenes.filter((x) => x.kind === "video").length;
              const pct = Math.round((vids / scenes.length) * 100);
              const near = Math.round(pct / 10) * 10;
              return (
                <div className="card mt-3 flex flex-wrap items-center gap-3 p-4 text-sm">
                  <span>🖼️ {scenes.length - vids} pictures + 🎥 {vids} videos = <b>{pct}% video</b> in this sample</span>
                  <span className="text-muted">· the whole {mode === "series" ? "season" : "film"} at {near}%: <b className="text-ink">{dollars(filmCredits(near))}</b></span>
                  {near !== mix && <button onClick={() => setMix(near)} className="btn-line px-3 py-1.5 text-xs">Use {near}% for the whole {mode === "series" ? "season" : "film"}</button>}
                </div>
              );
            })()}
            {lang !== "ti" && lang !== "am" && (
              <p className="mt-2 text-sm text-muted">The {L.name} script and voice come once there are enough {L.name} recordings; the English line shows for now.</p>
            )}
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {scenes.map((x) => (
                <article key={x.id} className="card overflow-hidden">
                  <div className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${x.sky}`}>
                    <span className="text-6xl">{x.pic}</span>
                    <span className="absolute left-3 top-3 chip bg-panel/80 text-xs">{mode === "voice" ? `Line ${x.id + 1} · ▶ play (demo)` : `Scene ${x.id + 1} · AI ${x.kind === "video" ? "video" : "picture"} (demo)`}</span>
                    {x.redone > 0 && <span className="absolute right-3 top-3 chip bg-good text-xs text-white">Redone ✓</span>}
                  </div>
                  <div className="p-4">
                    {x.kind && (
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="chip text-xs">
                          {SHOTS[x.shotType].kind === x.kind ? `${SHOTS[x.shotType].icon} ${SHOTS[x.shotType].name}` : x.kind === "video" ? "🎥 Video" : "🔍 Slow zoom"}
                        </span>
                        <div className="flex rounded-full border border-line p-0.5 text-xs font-bold">
                          {["picture", "video"].map((k) => (
                            <button key={k} onClick={() => setScenes((all) => all.map((y) => (y.id === x.id ? { ...y, kind: k } : y)))}
                              className={`rounded-full px-2.5 py-1 ${x.kind === k ? "bg-brand text-white" : "text-muted"}`}>
                              {k === "picture" ? "🖼️ Picture" : "🎥 Video"}
                            </button>
                          ))}
                        </div>
                        <span className="text-xs text-muted">{n1((PRICE[x.kind].perMin * SCENE_SECONDS) / 60)} credits</span>
                      </div>
                    )}
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
                placeholder={mode === "voice" ? "Change all lines: “slower”, “use a man's voice”, “happier”…" : "Change the whole episode: “make it night”, “use a man's voice”, “add music”…"} className="input min-w-[240px] flex-1" />
              <button onClick={changeAll} className="btn-brand px-5 py-2.5">Apply to all</button>
              <button className="btn-line px-5 py-2.5" onClick={() => alert("Demo: the file downloads here once the Studio is connected.")}>⬇ Download {mode === "voice" ? "MP3" : "MP4"}</button>
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
              <thead className="text-muted"><tr><th className="py-2">What</th><th>Credits</th><th>Price</th></tr></thead>
              <tbody>
                {["picture", "video", "news", "voice"].map((id) => (
                  <tr key={id} className="border-t border-line"><td className="py-2 font-bold">{PRICE[id].name} <span className="font-normal text-muted">· {PRICE[id].note}</span></td><td>{PRICE[id].perMin} per minute</td><td>{dollars(PRICE[id].perMin)} per minute</td></tr>
                ))}
                {[15, 30, 60].map((sec) => (
                  <tr key={sec} className="border-t border-line"><td className="py-2 font-bold">Ad, {sec} seconds <span className="font-normal text-muted">· sharp full video</span></td><td>{credits(AD_CREDITS[sec])} per ad</td><td>{dollars(AD_CREDITS[sec])} per ad</td></tr>
                ))}
                <tr className="border-t border-line"><td className="py-2 font-bold">Same ad, each extra language</td><td>{AD_EXTRA_LANG}</td><td>{dollars(AD_EXTRA_LANG)}</td></tr>
                <tr className="border-t border-line"><td className="py-2 font-bold">Example: 1 season, 15 × 20 min, 20% video</td><td>{credits(300 * perMinFor(20))}</td><td>{dollars(300 * perMinFor(20))}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">Rules: true prices and claims in ads, no fake reviews, no real person's face or voice without their written OK, and every video is labelled “Made with AI”.</p>
          <p className="mt-2 text-sm"><Link href="/" className="font-bold text-brand">📚 Go to HehuLab Education →</Link></p>
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

function MixPicker({ value, on }) {
  return (
    <Field label="How much real video? (the rest is pictures with a moving camera)">
      <div className="flex flex-wrap gap-2">
        {MIXES.map((m) => (
          <button key={m} onClick={() => on(m)}
            className={`chip border-2 ${value === m ? "border-brand bg-brand/20 text-ink" : "border-line text-muted"}`}>
            {m}%{m === RECOMMENDED_MIX ? " ⭐" : ""}
          </button>
        ))}
      </div>
      <input type="range" min={0} max={100} step={10} value={value} onChange={(e) => on(Number(e.target.value))}
        className="mt-3 w-full accent-[rgb(var(--c-brand))]" aria-label="Percent of video" />
      <div className="flex justify-between text-xs text-muted">
        <span>🖼️ All pictures · {PRICE.picture.perMin} credits/min</span>
        <span>⭐ {RECOMMENDED_MIX}% recommended</span>
        <span>🎥 All video · {PRICE.video.perMin} credits/min</span>
      </div>
    </Field>
  );
}

function Row({ k, v, bold }) {
  return (
    <div className={`flex justify-between gap-3 ${bold ? "font-bold" : ""}`}>
      <span>{k}</span>
      <span>{credits(v)}</span>
    </div>
  );
}

const n1 = (x) => (Math.round(x * 10) / 10).toLocaleString();

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
