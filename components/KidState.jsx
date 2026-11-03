"use client";

import { createContext, useContext, useEffect, useState } from "react";

// What the child chose (language, teacher, math). Kept in the browser so it stays after a refresh.
// Later this moves to the child's profile on the server.
export const LANGS = [
  { id: "ti", name: "Tigrinya", native: "ትግርኛ", group: "Eritrean" },
  { id: "tig", name: "Tigre", native: "ትግረ", group: "Eritrean" },
  { id: "byn", name: "Bilen", native: "", group: "Eritrean" },
  { id: "ssy", name: "Saho", native: "", group: "Eritrean" },
  { id: "am", name: "Amharic", native: "አማርኛ", group: "From Ethiopia" },
];

const KEY = "hehulab.kid";
// learner: kid | adult · track: native (learn my language) | english (learn English from my language)
// stars: lessonId -> stars earned (demo until accounts exist)
const START = { lang: "ti", teacher: "rodas", math: true, name: "Selam", gender: "girl", learner: "kid", track: "native", stars: {} };

const Ctx = createContext(null);

export function KidProvider({ children }) {
  const [kid, setKid] = useState(START);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved) setKid({ ...START, ...saved });
    } catch {
      /* private window: keep the defaults */
    }
  }, []);

  function update(changes) {
    setKid((k) => {
      const next = { ...k, ...changes };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return <Ctx.Provider value={{ kid, update }}>{children}</Ctx.Provider>;
}

export function useKid() {
  return useContext(Ctx);
}

export function langOf(kid) {
  return LANGS.find((l) => l.id === kid.lang) || LANGS[0];
}
