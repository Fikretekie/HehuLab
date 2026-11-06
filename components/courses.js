// The whole curriculum. Who is learning (a kid or a grown-up) and what (their own language, or English taught
// in their language) picks the levels; each level has units, each unit has lessons:
//   letters (one letter family) · words (a theme) · phrases · story · game · review
// Change a list here and the path, the lessons, the stories and the games all follow.
//
// The Tigrinya words below are ones Rodas has already recorded (public/voices/ti.json), so the lessons talk
// (only "ሎሚ" and the number 10 are still missing: they show as text until she records them).
// Tigre, Bilen, Saho and Amharic have no recordings yet: their word lessons wait for recorders (letters still work).

import { LETTERS, NUMBER_WORDS } from "./curriculum";
import { SOMALI, SOMALI_SENTENCES } from "./somali";

export const LEARNERS = [
  { id: "kid", title: "A child", note: "Ages 3 to 9: letters, words, songs, games" },
  { id: "adult", title: "A grown-up", note: "Talk, read and write, at your own pace" },
];

// A child's grade (the same ids as the kids' levels below). It picks which games fit and how fast they go.
export const GRADES = [
  { id: "k0", title: "Pre-K", age: "3–4" },
  { id: "k1", title: "Kinder­garten", age: "5" }, // ­: may break as "Kinder-garten" on a narrow screen
  { id: "k2", title: "Grade 1", age: "6" },
  { id: "k3", title: "Grade 2", age: "7" },
  { id: "k4", title: "Grade 3", age: "8–9" },
];

// The age group: small (Pre-K, K), mid (Grade 1–2), big (Grade 3) or adult.
export const AGE_GROUPS = {
  small: "Pre-K and Kindergarten",
  mid: "Grade 1 and 2",
  big: "Grade 3",
  adult: "grown-ups",
};
export function ageGroup(kid) {
  if (kid.learner === "adult") return "adult";
  if (kid.grade === "k0" || kid.grade === "k1") return "small";
  if (kid.grade === "k4") return "big";
  return "mid";
}

export const TRACKS = [
  { id: "native", title: "Learn my language", note: "Tigrinya, Tigre, Bilen, Saho, Amharic or Somali" },
  { id: "english", title: "Learn English", note: "Taught in Tigrinya, Tigre, Bilen, Saho, Amharic or Somali" },
];

// Theme words: [Tigrinya, English, picture]. Only Tigrinya for now (the languages with recordings).
export const THEMES = {
  hello: {
    title: "Hello!",
    pic: "👋",
    words: [
      ["ሰላም", "hello", "👋"],
      ["ከመይ ኣሎኺ", "how are you? (to a girl)", "🙂"],
      ["ከመይ ኣሎኻ?", "how are you? (to a boy)", "🙂"],
      ["ይቕሬታ", "sorry", "🙏"],
      ["ብሩኽ ለይቲ", "good night", "🌙"],
      ["ኣንቛዕ ብደሓን መጻኺ!", "welcome! (to a girl)", "🤗"],
      ["ኣንቛዕ ብደሓን መጻኻ!", "welcome! (to a boy)", "🤗"],
    ],
  },
  animals: {
    title: "Animals",
    pic: "🐐",
    words: [
      ["ከልቢ", "dog", "🐕"],
      ["ድሙ", "cat", "🐈"],
      ["ላም", "cow", "🐄"],
      ["ፈረስ", "horse", "🐎"],
      ["ገመል", "camel", "🐫"],
      ["ኣድጊ", "donkey", "🫏"],
      ["በጊዕ", "sheep", "🐑"],
      ["ጤል", "goat", "🐐"],
      ["ዶርሆ", "chicken", "🐔"],
      ["ዓሳ", "fish", "🐟"],
      ["ርግቢት", "dove", "🕊️"],
    ],
  },
  colors: {
    title: "Colors",
    pic: "🎨",
    words: [
      ["ቀይሕ", "red", "🟥"],
      ["ሰማያዊ", "blue", "🟦"],
      ["ቀጠልያ", "green", "🟩"],
      ["ብጫ", "yellow", "🟨"],
      ["ጻዕዳ", "white", "⬜"],
      ["ጸሊም", "black", "⬛"],
      ["ቡናዊ", "brown", "🟫"],
      ["ሮዛ", "pink", "🌸"],
    ],
  },
  family: {
    title: "My family",
    pic: "👪",
    words: [
      ["ኣደ", "mother", "👩"],
      ["ኣቦ", "father", "👨"],
      ["ሓፍቲ", "sister", "👧"],
      ["ኣባሓጎ", "grandfather", "👴"],
      ["ዓባየይ", "my grandmother", "👵"],
      ["ኣሞ", "aunt", "👩‍🦱"],
      ["ወዲ ሓዎቦ", "cousin", "🧒"],
      ["ዉሉድ", "children", "👫"],
    ],
  },
  body: {
    title: "My body",
    pic: "🧍",
    words: [
      ["ርእሲ", "head", "🙂"],
      ["ገጽ", "face", "😊"],
      ["ዓይኒ", "eye", "👁️"],
      ["እዝኒ", "ear", "👂"],
      ["ኣፍንጫ", "nose", "👃"],
      ["ኣፍ", "mouth", "👄"],
      ["ስኒ", "tooth", "🦷"],
      ["መልሓስ", "tongue", "👅"],
      ["ጨጉሪ", "hair", "💇"],
      ["ክሳድ", "neck", "🧣"],
      ["ልቢ", "heart", "❤️"],
    ],
  },
  food: {
    title: "Food and drinks",
    pic: "🍞",
    words: [
      ["ባኒ", "bread", "🍞"],
      ["ማይ", "water", "💧"],
      ["ጸባ", "milk", "🥛"],
      ["ቡን", "coffee", "☕"],
      ["ሻሂ", "tea", "🍵"],
      ["መዓር", "honey", "🍯"],
      ["ሽኮር", "sugar", "🧂"],
      ["ጨው", "salt", "🧂"],
      ["ባናና", "banana", "🍌"],
      ["እንቋቑሖ", "egg", "🥚"],
    ],
  },
  home: {
    title: "Home and school",
    pic: "🏠",
    words: [
      ["ገዛ", "house", "🏠"],
      ["ማዕጾ", "door", "🚪"],
      ["ዓራት", "bed", "🛏️"],
      ["ጣውላ", "table", "🪑"],
      ["ሰድያ", "chair", "🪑"],
      ["መፍትሕ", "key", "🔑"],
      ["ክሽነ", "kitchen", "🍳"],
      ["ቤትትምህርቲ", "school", "🏫"],
      ["መጽሓፍ", "book", "📖"],
      ["ርሳስ", "pencil", "✏️"],
      ["ወረቀት", "paper", "📄"],
      ["ቦርሳ", "bag", "🎒"],
      ["መምህር", "teacher", "🧑‍🏫"],
    ],
  },
  actions: {
    title: "Do it!",
    pic: "🏃",
    words: [
      ["ነዓ", "come (to a boy)", "👉"],
      ["ኪድ", "go (to a boy)", "🚶"],
      ["ብላዕ", "eat (to a boy)", "🍽️"],
      ["ደቅስ", "sleep (to a boy)", "😴"],
      ["ተጻወት", "play (to a boy)", "⚽"],
      ["ዘምር", "sing (to a boy)", "🎵"],
      ["ተዛረብ", "speak (to a boy)", "🗣️"],
      ["ኮፍ በል!", "sit down! (to a boy)", "🪑"],
      ["ጠጠው በል!", "stop! (to a boy)", "✋"],
    ],
  },
  feelings: {
    title: "Feelings",
    pic: "😊",
    words: [
      ["ሕጉስ", "happy", "😊"],
      ["ሕዙን", "sad", "😢"],
      ["ደኺሙ", "tired", "🥱"],
      ["ጥምየት", "hunger", "🍽️"],
    ],
  },
  questions: {
    title: "Questions",
    pic: "❓",
    words: [
      ["እንታይ", "what", "❓"],
      ["መን", "who", "🧑"],
      ["ኣበይ?", "where?", "📍"],
      ["መዓስ", "when", "🕐"],
      ["ስለምንታይ", "why", "🤔"],
      ["ክንደይ?", "how many?", "🔢"],
      ["ኣየናይ", "which", "👆"],
      ["እዚ እንታይ እዩ?", "what is this?", "👇"],
      ["እቲ እንታይ እዩ?", "what is that?", "👉"],
    ],
  },
  places: {
    title: "Places",
    pic: "🏙️",
    words: [
      ["ከተማ", "city", "🏙️"],
      ["ዓዲ", "village", "🏡"],
      ["ሃገር", "country", "🗺️"],
      ["ድኳን", "shop", "🏪"],
      ["ጎደና", "street", "🛣️"],
      ["ክፍሊ", "classroom", "🏫"],
      ["ማዕርፎ ነፈርቲ", "airport", "✈️"],
    ],
  },
  time: {
    title: "Day and time",
    pic: "🕐",
    words: [
      ["ሎሚ", "today", "📅"],
      ["ጽባሕ", "tomorrow", "🌅"],
      ["ትማሊ", "yesterday", "⏪"],
      ["ሕጂ", "now", "⏰"],
      ["መዓልቲ", "day", "☀️"],
      ["ለይቲ", "night", "🌙"],
      ["ወርሒ", "moon / month", "🌕"],
      ["ዳሕራይ", "later", "⏩"],
    ],
  },
  culture: {
    title: "Holidays and culture",
    pic: "🎉",
    words: [
      ["ቡን", "coffee ceremony", "☕"],
      ["ፋሲካ", "Easter", "🐣"],
      ["በዓል ልደት", "Christmas", "🎄"],
      ["ኣውደእመት", "New Year", "🎊"],
      ["መርዓ", "wedding", "💍"],
      ["መዝሙር", "song", "🎵"],
      ["ጸሎት", "prayer", "🙏"],
      ["ታሪኽ", "story", "📚"],
    ],
  },
  sentences: {
    title: "Talk about me",
    pic: "💬",
    words: [
      ["ስመይ ሰላም ይበሃል።", "My name is Selam.", "🙋"],
      ["ኣነ ጽቡቕ ኣሎኹ የቀንየለይ።", "I am fine, thank you.", "🙂"],
      ["ንስኻ ኸ ከመይ ኣሎኻ?", "And you, how are you? (to a boy)", "🤝"],
      ["ንስኺ ኸ ከመይ ኣሎኺ?", "And you, how are you? (to a girl)", "🤝"],
      ["ኣበይ ቦታ ኢኺ ትነብሪ?", "Where do you live? (to a girl)", "🏠", "እበይ ቦታ ኢኺ ትነብሪ?"], // fixed text; the recording still has the old name
      ["ኣነ ክልተ ኣሓት ኣለዋኒ።", "I have two sisters.", "👭", "ኣነ ክልተ የሕዋት ኣሎዉኒ።"], // fixed text; the recording still has the old name
      ["እዚ ኣቦይ እዩ።", "This is my father.", "👨"],
      ["ኣደይ ኣበይ ኣላ?", "Where is my mother?", "👩"],
      ["ኣቦይ ኣበይ ኣሎ?", "Where is my father?", "👨"],
      ["ዓባየይ ኣብ ኣስመራ ትነብር።", "My grandmother lives in Asmara.", "👵"],
      ["መምህረይ ለዋህ እዩ።", "My teacher is kind.", "🧑‍🏫"],
      ["ካምቻይ ቀያሕ እያ።", "My shirt is red.", "👕"],
    ],
  },
  evening: {
    title: "Kind words",
    pic: "💛",
    words: [
      ["ከመይ ኣምሲኻ።", "Good evening. (to a boy)", "🌆"],
      ["ከመይ ዊዒልካ?", "How was your day? (to a boy)", "☀️"],
      ["ከመይ ዊዒልኪ?", "How was your day? (to a girl)", "☀️"],
      ["ብኣኻ ሕቡን እየ።", "I am proud of you. (to a boy)", "🏅"],
      ["ኣነ የፍቅረካ እየ።", "I love you. (to a boy)", "❤️"],
    ],
  },
};

// Numbers as a theme (recorded by meaning: "#3" = three).
function numberTheme(from, to) {
  const en = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  return {
    title: `Numbers ${from} to ${to}`,
    pic: "🔢",
    words: Array.from({ length: to - from + 1 }, (_, i) => {
      const n = from + i;
      return [NUMBER_WORDS.ti[n - 1], en[n - 1], String(n), `#${n}`];
    }),
  };
}
THEMES.num1 = numberTheme(1, 5);
THEMES.num2 = numberTheme(6, 10);

// One unit: letter families (if any), then theme words, then a story, a game and a review.
function unit(id, title, { letters = [], themes = [], story = false } = {}) {
  const lessons = [
    ...letters.map((l) => ({ id: `${id}-l-${l}`, type: "letters", letter: l, title: l })),
    ...themes.map((t) => ({ id: `${id}-w-${t}`, type: "words", theme: t, title: THEMES[t].title, pic: THEMES[t].pic })),
  ];
  if (themes.length) lessons.push({ id: `${id}-review`, type: "review", themes, title: "Review", pic: "⭐" });
  if (story) lessons.push({ id: `${id}-story`, type: "story", title: "Story time", pic: "📚" });
  lessons.push({ id: `${id}-game`, type: "game", themes, title: "Play", pic: "🎮" });
  return { id, title, lessons };
}

// The letter families of a language, split into groups of n.
function letterGroups(lang, n) {
  const all = LETTERS[lang] || LETTERS.ti;
  const out = [];
  for (let i = 0; i < all.length; i += n) out.push(all.slice(i, i + n));
  return out;
}

// The levels for each learner. Letters are spread over the kids' levels; grown-ups get them faster.
export function levelsFor(learner, track, lang) {
  const english = track === "english";
  const g = letterGroups(lang, english ? 99 : 4); // English learners don't need the fidel lessons
  const L = (i) => (english ? [] : g[i] || []);
  if (learner === "adult") {
    const a = letterGroups(lang, 8);
    const A = (i) => (english ? [] : a[i] || []);
    return [
      { id: "a1", title: "Beginner", units: [
        unit("a1u1", "Say hello", { letters: A(0), themes: ["hello", "num1"] }),
        unit("a1u2", "People and numbers", { letters: A(1), themes: ["family", "num2"] }),
      ] },
      { id: "a2", title: "Everyday talk", units: [
        unit("a2u1", "Food and coffee", { letters: A(2), themes: ["food", "actions"] }),
        unit("a2u2", "Getting around", { letters: A(3), themes: ["places", "time", "questions"] }),
      ] },
      { id: "a3", title: "Reading and writing", units: [
        unit("a3u1", "Read about me", { letters: A(4), themes: ["sentences"], story: true }),
        unit("a3u2", "Feelings and kind words", { themes: ["feelings", "evening"], story: true }),
      ] },
      { id: "a4", title: "Culture", units: [unit("a4u1", "Holidays and the coffee ceremony", { themes: ["culture"], story: true })] },
    ];
  }
  return [
    { id: "k0", title: "Pre-K", units: [
      unit("k0u1", "Hello, Rodas!", { letters: L(0).slice(0, 2), themes: ["hello", "animals"] }),
      unit("k0u2", "Colors and numbers", { letters: L(0).slice(2), themes: ["colors", "num1"], story: true }),
    ] },
    { id: "k1", title: "Kindergarten", units: [
      unit("k1u1", "My family", { letters: L(1), themes: ["family", "num2"] }),
      unit("k1u2", "My body", { letters: L(2), themes: ["body"], story: true }),
    ] },
    { id: "k2", title: "Grade 1", units: [
      unit("k2u1", "Food", { letters: L(3), themes: ["food"] }),
      unit("k2u2", "Home and school", { letters: L(4), themes: ["home", "actions"], story: true }),
    ] },
    { id: "k3", title: "Grade 2", units: [
      unit("k3u1", "How do I feel?", { letters: L(5), themes: ["feelings", "questions"] }),
      unit("k3u2", "Places and time", { letters: L(6), themes: ["places", "time"], story: true }),
    ] },
    { id: "k4", title: "Grade 3", units: [
      unit("k4u1", "Talk about me", { letters: L(7), themes: ["sentences", "evening"] }),
      unit("k4u2", "Holidays", { letters: L(8), themes: ["culture"], story: true }),
    ] },
  ];
}

// Every lesson of a course in order (for "what's next" and stars).
export function allLessons(levels) {
  return levels.flatMap((lv) => lv.units.flatMap((u) => u.lessons.map((l) => ({ ...l, level: lv.id, unit: u.id }))));
}

export function findLesson(levels, id) {
  return allLessons(levels).find((l) => l.id === id) || null;
}

// The words a lesson teaches, ready for the lesson screen.
// Native track: big = the word, small = English. English track: big = English, small = the word in your language.
export function lessonItems(lesson, track, lang) {
  const themes = lesson.type === "words" ? [lesson.theme] : lesson.themes || [];
  let words = themes.flatMap((t) => themeWords(t, lang));
  // A review takes 8 words spread over the unit's themes. Always the same 8 (no shuffling here), so the page drawn on
  // the server and in the browser match; the game mixes its rounds after the page loads.
  if (lesson.type === "review" && words.length > 8) words = Array.from({ length: 8 }, (_, i) => words[Math.floor((i * words.length) / 8)]);
  return words.map(([ti, en, pic, key]) => ({
    native: ti,
    english: en.replace(/ \(to a (girl|boy)\)/, ""),
    note: (en.match(/\(to a (girl|boy)\)/) || [""])[0],
    pic,
    word: key || ti, // the name of Rodas's recording
    track,
  }));
}

// Does this language have its own words yet? Somali's come from Fik's lists (recordings are on the voices site).
export const HAS_WORDS = { ti: true, so: true };

// Languages whose words are matched to the Tigrinya list by their English meaning.
const TRANSLATED = { so: SOMALI };
const meaningKey = (en) => en.replace(/ (to a (girl|boy))/, "").toLowerCase().replace(/[.!?]$/, "");

// A theme's words in a language: [word, English, picture, recording name]. Tigrinya (and languages without their
// own list yet) get the Tigrinya words; Somali gets only the words it has, plus its own sentences.
export function themeWords(theme, lang) {
  const table = TRANSLATED[lang];
  if (!table) return THEMES[theme].words;
  if (theme === "sentences" && lang === "so") return SOMALI_SENTENCES;
  const out = THEMES[theme].words
    .filter((w) => table[meaningKey(w[1])])
    .map((w) => [table[meaningKey(w[1])], w[1], w[2], `${lang}:${table[meaningKey(w[1])]}`]);
  return out.length ? out : THEMES[theme].words;
}
