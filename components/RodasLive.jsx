"use client";

import { useEffect, useState } from "react";

// Rodas, alive. She has 5 states: listening, talking, smiling, clapping, thinking.
// If a clip exists in public/rodas/ (e.g. listening.mp4) it plays as a loop. If not, her photo moves gently
// with CSS (see globals.css): a soft bob while listening, a glow while talking, a bounce when happy, a slow tilt
// while thinking. Drop the clips in later and nothing else needs to change.
export const STATES = ["listening", "talking", "smiling", "clapping", "thinking"];

const found = {}; // state -> Promise<boolean>: does public/rodas/<state>.mp4 exist?
function hasClip(state) {
  found[state] ||= fetch(`/rodas/${state}.mp4`, { method: "HEAD" })
    .then((r) => r.ok && (r.headers.get("content-type") || "").startsWith("video"))
    .catch(() => false);
  return found[state];
}

export default function RodasLive({ state = "listening", size = 320 }) {
  const [clip, setClip] = useState(false);
  useEffect(() => {
    let on = true;
    hasClip(state).then((ok) => on && setClip(ok));
    return () => {
      on = false;
    };
  }, [state]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`rodas-live rodas-${state} overflow-hidden rounded-full border-[6px] border-white bg-white`}
        style={{ width: size, height: size }}
      >
        {clip ? (
          <video key={state} src={`/rodas/${state}.mp4`} autoPlay loop muted playsInline className="h-full w-full object-cover" />
        ) : (
          <img src="/images/rodas.jpg" alt="Rodas" className="h-full w-full object-cover" style={{ objectPosition: "50% 18%" }} />
        )}
      </div>
      <p className="mt-4 text-xl font-extrabold">Rodas</p>
      <span className="chip mt-1 bg-white">AI teacher</span>
    </div>
  );
}
