"use client";

import { Kokob } from "./Avatars";

// "Watch" mode of the bedtime stories: a small moving picture for every line, drawn by us (no outside video,
// so no copyright worries and it always matches the story). The sky, the hills and the story's animal move;
// the line's picture pops in next to the animal; the words show at the bottom like a movie's subtitles.
// Kokob (Aki's voice) is the narrator.

// Each story's place: sky colors (top, bottom), hill colors (far, near) and what grows on the hills.
const PLACES = {
  hills: { sky: ["#3A5BA0", "#F6B26B"], hills: ["#5E9C5A", "#3F7D3C"], deco: "🌳" },
  desert: { sky: ["#24356B", "#E89A5B"], hills: ["#D9A55F", "#C48A43"], deco: "🌵" },
  meadow: { sky: ["#4C8FD6", "#FCD9A0"], hills: ["#8CC76B", "#5FA548"], deco: "🌼" },
};

// Lines whose picture means night get a dark sky and the moon comes up.
const NIGHT = ["✨", "🌙", "😴", "🥱", "⭐"];

export default function StoryScene({ story, at, line, ended, english, playing }) {
  const place = PLACES[story.place] || PLACES.hills;
  const [ti, en, pic] = line;
  const night = ended || NIGHT.includes(pic);
  // The animal walks to a new spot on every line (left, middle, right…), facing the way it walks.
  const spots = [18, 46, 70, 32, 58, 24, 64];
  const x = spots[at % spots.length];
  const prev = spots[(at + spots.length - 1) % spots.length];
  const big = english ? en : ti;
  const small = english ? ti : en;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-label={`Scene: ${en}`}>
      {/* sky: day colors, turning dark blue at night */}
      <div className="absolute inset-0 transition-colors duration-1000"
        style={{ background: night ? "linear-gradient(#0B1530, #1D2D5C)" : `linear-gradient(${place.sky[0]}, ${place.sky[1]})` }} />
      {night && [[10, 10], [24, 22], [38, 8], [55, 18], [68, 6], [82, 20], [92, 9], [16, 34], [74, 32]].map(([l, t], i) => (
        <span key={i} className="scene-twinkle absolute h-1.5 w-1.5 rounded-full bg-white" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${i * 0.3}s` }} aria-hidden="true" />
      ))}
      <span className={`absolute right-[10%] text-6xl transition-all duration-1000 ${night ? "top-[8%] opacity-100" : "top-[40%] opacity-0"}`} aria-hidden="true">🌙</span>
      {!night && <span className="scene-drift absolute left-[8%] top-[12%] text-5xl opacity-90" aria-hidden="true">☁️</span>}
      {!night && <span className="scene-drift absolute left-[60%] top-[6%] text-4xl opacity-80" style={{ animationDelay: "-6s" }} aria-hidden="true">☁️</span>}

      {/* hills that slide slowly (far ones slower: it looks deep) */}
      <svg className="scene-hills-far absolute bottom-[22%] left-0 h-[30%] w-[200%]" viewBox="0 0 800 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 60 Q100 10 200 55 T400 50 T600 55 T800 60 V100 H0Z" fill={night ? "#22365E" : place.hills[0]} />
      </svg>
      <svg className="scene-hills-near absolute bottom-0 left-0 h-[34%] w-[200%]" viewBox="0 0 800 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 30 Q100 0 200 25 T400 22 T600 28 T800 30 V100 H0Z" fill={night ? "#1A2B4D" : place.hills[1]} />
      </svg>
      <span className="absolute bottom-[24%] left-[6%] text-5xl" aria-hidden="true">{place.deco}</span>
      <span className="absolute bottom-[26%] right-[8%] text-4xl" aria-hidden="true">{place.deco}</span>

      {/* the story's animal walking to its spot, and the line's picture popping in next to it */}
      <div key={`walk-${at}`} className="scene-walk absolute bottom-[26%]"
        style={{ "--from": `${prev}%`, "--to": `${x}%`, left: `${x}%` }}>
        <div className={playing ? "scene-bob" : ""} style={{ transform: x < prev ? "scaleX(-1)" : undefined }}>
          <story.Pic size={150} />
        </div>
      </div>
      {!ended && (
        <span key={`pic-${at}`} className="prize-pop absolute bottom-[52%] text-7xl drop-shadow-lg" style={{ left: `calc(${x}% + 120px)` }} aria-hidden="true">
          {pic}
        </span>
      )}

      {/* the narrator */}
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/30 py-1 pl-1 pr-4 text-sm font-bold text-white">
        <span className="rounded-full bg-white/90"><Kokob size={40} /></span> Told by Kokob
      </div>

      {/* subtitles */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-8 pb-5 pt-10 text-center">
        <p className={`text-balance text-3xl font-bold leading-snug text-white ${english ? "" : "font-geez"}`} lang={english ? "en" : "ti"}>
          {ended ? (english ? "The end. Good night!" : "ብሩኽ ለይቲ") : big}
        </p>
        <p className={`mt-1 text-lg text-white/80 ${english ? "font-geez" : ""}`}>{ended ? (english ? "ብሩኽ ለይቲ" : "The end. Good night!") : small}</p>
      </div>
    </div>
  );
}
