// The placement test: 2 short questions per level, easiest first. Pass both and you go on to the next level;
// miss one and that level is where you start. Kids: Pre-K → Grade 3. Grown-ups: Beginner → Culture.
// Questions are built from the words already in courses.js, so they always match what the lessons teach.

import { themeWords } from "./courses";
import { LETTERS, family, usesGeez } from "./curriculum";

const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const clean = (en) => en.replace(/ \((to a|for a) (girl|boy)\)/, "");

// 4 choices: the right one and 3 others from the same list, mixed.
function choicesFrom(list, right, key) {
  const others = shuffle(list.filter((x) => key(x) !== key(right))).slice(0, 3);
  return shuffle([right, ...others]);
}

// "Hear a word, tap its picture" (no reading needed).
function hearQ(theme, english, lang) {
  const list = themeWords(theme, lang);
  const w = pick(list);
  return {
    kind: "hear",
    ask: "Listen, then tap the picture",
    say: english ? { text: clean(w[1]) } : { word: w[3] || w[0], text: clean(w[1]) },
    show: null,
    choices: choicesFrom(list, w, (x) => x[2]).map((x) => ({ big: x[2], ok: x === w })),
  };
}

// "Read the word, tap its picture" (reading, no sound).
function readQ(theme, english, lang) {
  const list = themeWords(theme, lang).filter((x, i, a) => a.findIndex((y) => y[2] === x[2]) === i);
  const w = pick(list);
  return {
    kind: "read",
    ask: "Read the word, then tap its picture",
    show: english ? clean(w[1]) : w[0],
    geez: !english,
    choices: choicesFrom(list, w, (x) => x[2]).map((x) => ({ big: x[2], ok: x === w })),
  };
}

// "What does it mean?" (a sentence or word, choose the meaning).
function meaningQ(theme, english, lang) {
  const list = themeWords(theme, lang);
  const w = pick(list);
  return {
    kind: "meaning",
    ask: "What does it mean?",
    show: english ? clean(w[1]) : w[0],
    geez: !english,
    choices: choicesFrom(list, w, (x) => clean(x[1])).map((x) => ({
      label: english ? x[0] : clean(x[1]),
      geez: english,
      ok: x === w,
    })),
  };
}

// "Find the same letter."
function sameLetterQ(lang) {
  const list = LETTERS[lang] || LETTERS.ti;
  const l = pick(list.slice(0, 12));
  return {
    kind: "letter",
    ask: "Find the same letter",
    show: l,
    geez: usesGeez(lang),
    say: { word: l },
    choices: choicesFrom(list.slice(0, 16), l, (x) => x).map((x) => ({ big: x, geez: usesGeez(lang), ok: x === l })),
  };
}

// Ge'ez: "Which one is in the ሀ family?"  Latin: "Which is the small letter of B?"
function familyQ(lang) {
  const list = LETTERS[lang] || LETTERS.ti;
  if (!usesGeez(lang)) {
    const l = pick(list);
    const right = l.slice(-1).toLowerCase();
    return {
      kind: "letter",
      ask: "Tap the small letter",
      show: right.toUpperCase(),
      choices: choicesFrom(list.map((x) => x.slice(-1).toLowerCase()), right, (x) => x).map((x) => ({ big: x, ok: x === right })),
    };
  }
  const l = pick(list.slice(0, 16));
  const form = pick(family(l).slice(1, 6));
  const others = shuffle(list.filter((x) => x !== l)).slice(0, 3).map((x) => pick(family(x).slice(1, 6)));
  return {
    kind: "letter",
    ask: `Which letter is in the ${l} family?`,
    askGeez: true,
    show: family(l).join(" "),
    geez: true,
    choices: shuffle([form, ...others]).map((x) => ({ big: x, geez: true, ok: x === form })),
  };
}

// Counting and sums (answers as digits).
function countQ() {
  const n = 2 + Math.floor(Math.random() * 6);
  const thing = pick(["🐐", "☕", "⭐", "🐑", "🍌"]);
  const nums = shuffle([n, ...shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== n)).slice(0, 3)]);
  return { kind: "count", ask: "How many?", show: thing.repeat(n), choices: nums.map((x) => ({ big: String(x), ok: x === n })) };
}
function sumQ(hard) {
  const a = hard ? 6 + Math.floor(Math.random() * 7) : 2 + Math.floor(Math.random() * 5);
  const b = hard ? 3 + Math.floor(Math.random() * 6) : 1 + Math.floor(Math.random() * 4);
  const minus = hard && Math.random() < 0.5;
  const n = minus ? a - b : a + b;
  const wrong = shuffle([n - 2, n - 1, n + 1, n + 2, n + 10].filter((x) => x >= 0)).slice(0, 3);
  return { kind: "count", ask: "Solve it", show: `${a} ${minus ? "−" : "+"} ${b} = ?`, choices: shuffle([n, ...wrong]).map((x) => ({ big: String(x), ok: x === n })) };
}

// The questions for each level (2 each). `english` = the "Learn English" track.
export function placementLevels(learner, track, lang) {
  const en = track === "english";
  if (learner === "adult") {
    return [
      { id: "a1", title: "Beginner", qs: [meaningQ("hello", en, lang), meaningQ("family", en, lang)] },
      { id: "a2", title: "Everyday talk", qs: [meaningQ("food", en, lang), meaningQ("places", en, lang)] },
      { id: "a3", title: "Reading and writing", qs: [meaningQ("sentences", en, lang), meaningQ("sentences", en, lang)] },
      { id: "a4", title: "Culture", qs: [meaningQ("culture", en, lang), meaningQ("evening", en, lang)] },
    ];
  }
  const letters = en ? "en" : lang;
  return [
    { id: "k0", title: "Pre-K", qs: [hearQ("animals", en, lang), sameLetterQ(letters)] },
    { id: "k1", title: "Kindergarten", qs: [countQ(), hearQ("colors", en, lang)] },
    { id: "k2", title: "Grade 1", qs: [readQ("food", en, lang), familyQ(letters)] },
    { id: "k3", title: "Grade 2", qs: [readQ("home", en, lang), sumQ(false)] },
    { id: "k4", title: "Grade 3", qs: [meaningQ("sentences", en, lang), sumQ(true)] },
  ];
}
