"use client";

import { useCallback } from "react";
import { useKid } from "./KidState";

// The one voice of the app: Rodas. Everything spoken (lessons, games, cheers) is her real recording from the
// HehuLab voices project: one woman who recorded the whole fidel, numbers and everyday words in Tigrinya.
// If she hasn't recorded something, the browser reads the English line in a woman's voice instead.
//
//   public/voices/ti.json         which recording says which text: { "ሀ": "<recId>", "#6": "<recId>", ... }
//   public/voices/ti/<recId>.webm her recordings (copied from s3://hehulab-voices-data/approved/)
//
// In production the recordings can live on S3/CloudFront: set NEXT_PUBLIC_VOICES_URL to that address.
const BASE = process.env.NEXT_PUBLIC_VOICES_URL || "/voices";

// Teacher lines in Tigrinya. Some have a girl and a boy form ("try again" to a girl or a boy).
// Lines Rodas hasn't recorded yet fall back to the English text.
const PHRASES = {
  ti: {
    listen: { girl: "ስምዕኒ", boy: "ስምዓኒ" },
    say: { girl: "ደድሕረይ በሊ።", boy: "ደድሕረይ በል።" },
    again: { girl: "እንደገና ፈትኒ።", boy: "እንደገና ፈትን።" },
    welldone: "ኮርዒዳ!",
    howmany: "ክንደይ?",
    hello: "ሰላም",
  },
};

// Browsers don't say which voices are women's, so look for well-known names (Windows, Mac, Chrome, Edge).
const WOMEN = /female|woman|zira|aria|jenny|michelle|hazel|susan|samantha|victoria|karen|moira|tessa|fiona|google us english/i;

let playing = null;
const indexes = {};

// Load a language's list of recordings once (an empty list when the language has none yet).
function recordings(lang) {
  indexes[lang] ||= fetch(`${BASE}/${lang}.json`)
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}));
  return indexes[lang];
}

function synth() {
  return typeof window !== "undefined" ? window.speechSynthesis : null;
}

// The browser loads its voices a moment after the page opens, so wait for them once.
function voices() {
  const s = synth();
  if (!s) return Promise.resolve([]);
  const now = s.getVoices();
  if (now.length) return Promise.resolve(now);
  return new Promise((done) => {
    const t = setTimeout(() => done(s.getVoices()), 1000);
    s.addEventListener("voiceschanged", () => (clearTimeout(t), done(s.getVoices())), { once: true });
  });
}

export function stop() {
  playing?.pause();
  playing = null;
  synth()?.cancel();
}

// The address of Rodas's recording of `word`, or null if she hasn't recorded it yet.
export async function recordingUrl(lang, word) {
  const id = (await recordings(lang))[word];
  return id ? `${BASE}/${lang}/${id}.webm` : null;
}

// The recordings have up to 3 seconds of quiet before and after Rodas speaks. Find where her voice starts and
// ends (20 ms windows louder than 4% of the loudest sound) so we can skip the quiet. Worked out once per clip.
const bounds = {};
let decoder = null;
function voiceBounds(url) {
  bounds[url] ||= (async () => {
    decoder ||= new AudioContext();
    const buf = await decoder.decodeAudioData(await (await fetch(url)).arrayBuffer());
    const d = buf.getChannelData(0);
    const win = Math.floor(buf.sampleRate * 0.02);
    let peak = 0;
    for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i]));
    let first = -1;
    let last = -1;
    for (let i = 0; i + win <= d.length; i += win) {
      let sum = 0;
      for (let j = i; j < i + win; j++) sum += d[j] * d[j];
      if (Math.sqrt(sum / win) > peak * 0.04) {
        if (first < 0) first = i;
        last = i + win;
      }
    }
    if (first < 0) return null;
    return { start: Math.max(0, first / buf.sampleRate - 0.12), end: Math.min(buf.duration, last / buf.sampleRate + 0.3) };
  })().catch(() => null);
  return bounds[url];
}

// Play one recording from where Rodas starts speaking to where she stops, and resolve when she's done
// (true) or it couldn't play (false). `keep(audio)` lets a page hold on to it so it can pause it.
export async function playClip(url, keep) {
  if (!url) return false;
  const b = await voiceBounds(url);
  return new Promise((done) => {
    const a = new Audio(url);
    playing = a;
    keep?.(a);
    let timer;
    const finish = (ok) => {
      clearTimeout(timer);
      a.onended = a.onerror = a.onpause = a.ontimeupdate = null;
      if (ok && !a.ended) a.pause();
      done(ok);
    };
    a.onended = a.onerror = a.onpause = () => finish(true);
    a.onplaying = () => {
      clearTimeout(timer);
      if (b) timer = setTimeout(() => finish(true), (b.end - a.currentTime) * 1000);
    };
    a.ontimeupdate = () => b && a.currentTime >= b.end && finish(true);
    if (b) a.currentTime = b.start;
    a.play().catch(() => finish(false));
  });
}

// Play Rodas's recording of `word` (a letter, a word, a sentence, or "#3" for a number).
async function playRecording(lang, word) {
  const url = await recordingUrl(lang, word);
  if (!url) return false;
  const b = await voiceBounds(url);
  try {
    const a = new Audio(url);
    playing = a;
    if (b) {
      a.currentTime = b.start;
      a.ontimeupdate = () => a.currentTime >= b.end && a.pause();
    }
    await a.play();
    return true;
  } catch {
    return false;
  }
}

// Say one thing. `word` is the text in the child's language (played from Rodas's recordings); `text` is the
// English line the browser reads when there's no recording. Returns true if something was heard.
export async function say({ word, text, lang = "ti" }) {
  stop();
  if (word && (await playRecording(lang, word))) return true;
  const english = (await voices()).filter((v) => v.lang.toLowerCase().startsWith("en"));
  const voice = english.find((v) => WOMEN.test(v.name)) || english[0];
  if (!text || !voice) return false;
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.pitch = 1.1;
  u.rate = 0.95;
  synth().speak(u);
  return true;
}

// say() for the child: their language filled in, `line` turned into the Tigrinya teacher phrase
// (girl or boy form), and silent when a grown-up turned the voice off in Settings.
export function useVoice() {
  const { kid } = useKid();
  const on = kid.voice !== false;
  return useCallback(
    ({ line, ...opts }) => {
      if (!on) return Promise.resolve(false);
      const phrase = line && PHRASES[kid.lang]?.[line];
      const word = typeof phrase === "object" ? phrase[kid.gender === "boy" ? "boy" : "girl"] : phrase;
      return say({ lang: kid.lang, word, ...opts });
    },
    [on, kid.lang, kid.gender],
  );
}

export const Speaker = (p) => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
    <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

// A small round "hear it again" button for a speech bubble.
export function SpeakButton({ onClick, label = "Hear it again", className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand-dark ${className}`}
    >
      <Speaker />
    </button>
  );
}
