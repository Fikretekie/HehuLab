"use client";

import { useEffect, useRef, useState } from "react";
import { voiceLevel } from "./Voice";

const LOUD = 0.15; // her voice louder than this (of her loudest) = mouth moving
const QUIET_MS = 120; // quiet this long = mouth closes
const REST = 0.4; // seconds into talking.mp4 where her mouth is closed (frame 0 has it open)

// Rodas, alive. She has 5 states: listening, talking, smiling, clapping, thinking.
// If a clip exists in public/rodas/ (e.g. listening.mp4) it plays as a loop. If not, her photo moves gently
// with CSS (see globals.css): a soft bob while listening, a glow while talking, a bounce when happy, a slow tilt
// while thinking. Drop the clips in later and nothing else needs to change.
//
// All her clips are loaded once and stacked on top of each other; only the one for her state is shown.
// So she changes face instantly (no loading gap), and the talking clip starts from the top each time she speaks.
export const STATES = ["listening", "talking", "smiling", "clapping", "thinking"];

const found = {}; // state -> Promise<boolean>: does public/rodas/<state>.mp4 exist?
function hasClip(state) {
  found[state] ||= fetch(`/rodas/${state}.mp4`, { method: "HEAD" })
    .then((r) => r.ok && (r.headers.get("content-type") || "").startsWith("video"))
    .catch(() => false);
  return found[state];
}

// `size` = width in pixels on big screens. `small` = width on phones and narrow windows (under 1024 px wide).
export default function RodasLive({ state = "listening", size = 320, small = size, label = true }) {
  const [clips, setClips] = useState({}); // state -> true when that clip exists
  const videos = useRef({});

  useEffect(() => {
    let on = true;
    Promise.all(STATES.map((s) => hasClip(s).then((ok) => [s, ok]))).then((list) => on && setClips(Object.fromEntries(list)));
    return () => {
      on = false;
    };
  }, []);

  // When she starts talking, start the talking clip from the beginning so her mouth opens with the sound.
  useEffect(() => {
    const v = videos.current[state];
    if (!v) return;
    if (state === "talking") v.currentTime = REST;
    v.play().catch(() => {});
  }, [state, clips]);

  // Mouth follows her voice: while she talks, the talking clip plays only when her recording is loud and
  // goes back to a frame with her mouth closed in the quiet gaps between words.
  useEffect(() => {
    const v = videos.current.talking;
    if (state !== "talking" || !v) return;
    let raf = 0;
    let quietSince = 0;
    const tick = () => {
      const lv = voiceLevel();
      const now = performance.now();
      if (lv === null || lv > LOUD) {
        quietSince = 0;
        if (v.paused) v.play().catch(() => {});
      } else {
        quietSince ||= now;
        if (now - quietSince > QUIET_MS && !v.paused) {
          v.pause();
          v.currentTime = REST;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [state, clips]);

  const showClip = clips[state];
  // The CSS movement (bob, bounce, tilt) is only for when there is no video clip: the clip already moves,
  // and moving the whole circle as well made her picture jump.
  const move = showClip ? "" : `rodas-${state}`;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`rodas-live ${move} relative overflow-hidden rounded-full border-[6px] border-white bg-white`}
        style={{ width: "var(--rodas-size)", height: "var(--rodas-size)", "--rodas-small": `${small}px`, "--rodas-big": `${size}px` }}
      >
        <img src="/images/rodas.jpg" alt="Rodas" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 18%" }} />
        {STATES.filter((s) => clips[s]).map((s) => (
          <video
            key={s}
            ref={(el) => (videos.current[s] = el)}
            src={`/rodas/${s}.mp4`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 h-full w-full object-cover ${showClip && s === state ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
      {label && (
        <>
          <p className="mt-3 text-xl font-extrabold">Rodas</p>
          <span className="chip mt-1 bg-white">AI teacher</span>
        </>
      )}
    </div>
  );
}
