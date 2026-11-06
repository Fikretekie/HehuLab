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

// Big themes are also split in two halves ("animals1", "animals2"), so the youngest learn a few words at a time.
for (const t of Object.keys(THEMES)) {
  const { title, pic, words } = THEMES[t];
  if (words.length < 9) continue;
  const half = Math.ceil(words.length / 2);
  THEMES[`${t}1`] = { title: `${title} 1`, pic, words: words.slice(0, half) };
  THEMES[`${t}2`] = { title: `${title} 2`, pic, words: words.slice(half) };
}

// About how long each kind of lesson takes (minutes), for the parents' plan and the unit cards.
export const MINUTES = { letters: 5, words: 6, math: 5, story: 4, game: 5, review: 4 };

// One unit = one theme, about 25–30 minutes:
//   new letter families (if any) · the theme's words · math · a story (every other unit) · a game · a quiz.
// `focus` says how the words are taught at that level: hear (say it back), read, or talk (sentences).
function unit(id, title, { letters = [], themes = [], math = null, story = false, focus = "hear" } = {}) {
  const lessons = [
    ...letters.map((l) => ({ id: `${id}-l-${l}`, type: "letters", letter: l, title: l })),
    ...themes.map((t) => ({ id: `${id}-w-${t}`, type: "words", theme: t, title: THEMES[t].title, pic: THEMES[t].pic })),
  ];
  if (math) lessons.push({ id: `${id}-m`, type: "math", math, title: MATH_LESSONS[math].title, pic: MATH_LESSONS[math].pic });
  if (story) lessons.push({ id: `${id}-story`, type: "story", title: "Story time", pic: "📚" });
  if (themes.length) lessons.push({ id: `${id}-game`, type: "game", themes, title: "Play", pic: "🎮" });
  if (themes.length) lessons.push({ id: `${id}-review`, type: "review", themes, title: "Quiz", pic: "⭐" });
  return { id, title, focus, themes, lessons };
}

// Math taught in the learner's language. Each one is 5 "say it back" steps on the lesson screen
// (Rodas says the answer's number word when it is 1 to 9: the numbers she has recorded).
export const MATH_LESSONS = {
  c13: { title: "Count 1 to 3", pic: "🔢", kind: "count", from: 1, to: 3 },
  c15: { title: "Count 1 to 5", pic: "🔢", kind: "count", from: 1, to: 5 },
  c610: { title: "Count 6 to 10", pic: "🔢", kind: "count", from: 6, to: 10 },
  c110: { title: "Count to 10", pic: "🔟", kind: "count", from: 1, to: 10 },
  more5: { title: "Which is more?", pic: "⚖️", kind: "more", max: 5 },
  more10: { title: "More or less", pic: "⚖️", kind: "more", max: 10 },
  add5: { title: "Add to 5", pic: "➕", kind: "add", max: 5 },
  sub5: { title: "Take away to 5", pic: "➖", kind: "sub", max: 5 },
  add10: { title: "Add to 10", pic: "➕", kind: "add", max: 10 },
  sub10: { title: "Take away to 10", pic: "➖", kind: "sub", max: 10 },
  tens: { title: "Count by tens", pic: "💯", kind: "tens" },
  add20: { title: "Add to 20", pic: "➕", kind: "add", max: 20 },
  sub20: { title: "Take away to 20", pic: "➖", kind: "sub", max: 20 },
  x2: { title: "2 times table", pic: "✖️", kind: "times", n: 2 },
  x3: { title: "3 times table", pic: "✖️", kind: "times", n: 3 },
  x4: { title: "4 times table", pic: "✖️", kind: "times", n: 4 },
  x5: { title: "5 times table", pic: "✖️", kind: "times", n: 5 },
  x10: { title: "10 times table", pic: "✖️", kind: "times", n: 10 },
};

// The 5 steps of a math lesson: { big, sub, word, say }. Always the same steps (no random), so the page drawn on
// the server and in the browser match.
export function mathItems(id, lang) {
  const m = MATH_LESSONS[id] || MATH_LESSONS.c15;
  const words = NUMBER_WORDS[lang] || NUMBER_WORDS.ti;
  const step = (big, n) => ({ big, tile: String(n), sub: n >= 1 && n <= 10 ? words[n - 1] : String(n), word: n >= 1 && n <= 9 ? `#${n}` : null, say: n >= 1 && n <= 10 ? words[n - 1] : String(n) });
  const five = [0, 1, 2, 3, 4];
  if (m.kind === "count") {
    const span = m.to - m.from;
    return five.slice(0, Math.min(5, span + 1)).map((i) => {
      const n = m.from + Math.round((i * span) / Math.min(4, span || 1));
      return { ...step(String(n), n), pic: "🍎".repeat(Math.min(n, 10)) };
    });
  }
  if (m.kind === "more") {
    const pairs = m.max <= 5 ? [[3, 1], [2, 5], [4, 2], [1, 3], [5, 4]] : [[7, 4], [3, 9], [8, 6], [5, 10], [9, 2]];
    return pairs.map(([a, b]) => step(`${a} or ${b}? → ${Math.max(a, b)}`, Math.max(a, b)));
  }
  if (m.kind === "add" || m.kind === "sub") {
    const sums = {
      5: [[1, 1], [2, 1], [2, 2], [3, 2], [4, 1]],
      10: [[3, 4], [5, 2], [6, 3], [4, 4], [7, 3]],
      20: [[8, 5], [9, 6], [7, 7], [12, 5], [11, 9]],
    }[m.max];
    return sums.map(([a, b]) => (m.kind === "add" ? step(`${a} + ${b} = ${a + b}`, a + b) : step(`${a + b} − ${b} = ${a}`, a)));
  }
  if (m.kind === "tens") return [10, 20, 30, 50, 100].map((n) => ({ big: String(n), tile: String(n), sub: "", word: null, say: String(n), pic: "🔟".repeat(Math.min(n / 10, 5)) }));
  return [2, 3, 4, 5, 6].map((k) => step(`${m.n} × ${k} = ${m.n * k}`, m.n * k));
}

// The letter families of a language, split into groups: how many each level gets.
function letterSplit(lang, sizes) {
  const all = LETTERS[lang] || LETTERS.ti;
  let at = 0;
  return sizes.map((n, i) => {
    const part = i === sizes.length - 1 ? all.slice(at) : all.slice(at, at + n);
    at += n;
    return part;
  });
}

// Spread a level's letters over its 8 units (one or two per unit, from the first unit on).
function spread(letters, units = 8) {
  const per = Array.from({ length: units }, () => []);
  letters.forEach((l, i) => per[Math.floor((i * units) / letters.length)].push(l));
  return per;
}

// A level: its 8 units from a plan of [title, theme, math, focus]. Story time in every other unit.
function level(id, title, goals, letters, plan, mathOn) {
  const per = spread(letters, plan.length);
  return {
    id,
    title,
    goals,
    units: plan.map(([t, theme, math, focus], i) =>
      unit(`${id}u${i + 1}`, t, { letters: per[i], themes: [theme], math: mathOn ? math : null, story: i % 2 === 1, focus }),
    ),
  };
}

// The levels for each learner: 8 units per level. `math` = the child wants math (kids, "learn my language").
// Kids: Pre-K → Grade 3 (letters spread 4 · 8 · 8 · 8 · the rest). Grown-ups: Beginner → Culture.
export function levelsFor(learner, track, lang, math = true) {
  const english = track === "english";
  if (learner === "adult") {
    const [a1, a2, a3] = english ? [[], [], []] : letterSplit(lang, [16, 16, 99]);
    return [
      level("a1", "Beginner", ["Greet people and say how you are", "Count to 10", "Name your family, colors and food", "Read the first 16 letter families"], a1, [
        ["Say hello", "hello"], ["Numbers 1 to 5", "num1"], ["My family", "family"], ["Numbers 6 to 10", "num2"],
        ["Colors", "colors"], ["My body", "body"], ["Food and drinks", "food"], ["Day and time", "time"],
      ]),
      level("a2", "Everyday talk", ["Ask and answer simple questions", "Talk about food, places and time", "Give and follow short instructions", "Read all the letter families"], a2, [
        ["At the table", "food"], ["Do it!", "actions"], ["Around town", "places"], ["When?", "time"],
        ["At home", "home"], ["Ask questions", "questions"], ["Animals", "animals"], ["Feelings", "feelings"],
      ]),
      level("a3", "Reading and writing", ["Read and write short sentences", "Introduce yourself and your family", "Read a short story"], a3, [
        ["About me", "sentences1"], ["My family and home", "sentences2"], ["Questions in sentences", "questions"], ["Kind words", "evening"],
        ["Read: home and school", "home"], ["Read: places", "places"], ["Read: actions", "actions"], ["Read: holidays", "culture"],
      ]),
      level("a4", "Culture", ["Talk about holidays and the coffee ceremony", "Use kind words with elders", "Tell a short story"], [], [
        ["The coffee ceremony", "culture"], ["Kind words", "evening"], ["Greeting elders", "hello"], ["Family visits", "family"],
        ["Feast food", "food"], ["How do you feel?", "feelings"], ["Talk about me", "sentences"], ["Big review", "questions"],
      ]),
    ];
  }
  const mathOn = math && !english;
  const [p, k, g1, g2, g3] = english ? [[], [], [], [], []] : letterSplit(lang, [4, 8, 8, 8, 99]);
  return [
    level("k0", "Pre-K", ["Say hello and good night", "Name animals, colors and family", "Count 1 to 5", "Know the first 4 letter families"], p, [
      ["Hello, Rodas!", "hello", "c13"], ["Farm animals", "animals1", "c15"], ["Colors", "colors", "more5"], ["Numbers 1 to 5", "num1", "c13"],
      ["My family", "family", "c15"], ["More animals", "animals2", "more5"], ["My face", "body1", "add5"], ["Yummy food", "food1", "c15"],
    ], mathOn),
    level("k1", "Kindergarten", ["Count to 10 and add to 5", "Name body parts, food and home", "Say how you feel", "Know 12 letter families"], k, [
      ["Numbers 6 to 10", "num2", "c610"], ["My body", "body2", "c110"], ["Food and drinks", "food2", "more10"], ["My home", "home1", "add5"],
      ["Feelings", "feelings", "sub5"], ["At school", "home2", "add5"], ["Do it!", "actions1", "sub5"], ["Day and night", "time", "c110"],
    ], mathOn),
    level("k2", "Grade 1", ["Read short words", "Add and take away to 10", "Ask who, what, where", "Know 20 letter families"], g1, [
      ["Do it! 2", "actions2", "add10"], ["Places", "places", "sub10"], ["Questions", "questions1", "add10"], ["Holidays", "culture", "sub10"],
      ["Read: my family", "family", "tens", "read"], ["Read: colors", "colors", "more10", "read"], ["More questions", "questions2", "add10"], ["Kind words", "evening", "sub10"],
    ], mathOn),
    level("k3", "Grade 2", ["Read and say short sentences", "Add and take away to 20", "Start the 2 times table", "Know 28 letter families"], g2, [
      ["About me", "sentences1", "add20"], ["My family and home", "sentences2", "sub20"], ["Read: animals", "animals", "tens", "read"], ["Read: food", "food", "add20", "read"],
      ["Read: home and school", "home", "sub20", "read"], ["Read: my body", "body", "x2", "read"], ["Read: places", "places", "add20", "read"], ["Read: day and time", "time", "sub20", "read"],
    ], mathOn),
    level("k4", "Grade 3", ["Talk in sentences about yourself", "Times tables 2, 3, 4, 5 and 10", "Read a whole story", "Know every letter family"], g3, [
      ["Talk: hello", "hello", "x2", "talk"], ["Talk: my family", "family", "x5", "talk"], ["Talk: questions", "questions", "x10", "talk"], ["Talk: feelings", "feelings", "x3", "talk"],
      ["Talk: holidays", "culture", "x4", "talk"], ["Talk: kind words", "evening", "x5", "talk"], ["Talk about me", "sentences", "x3", "talk"], ["Big review", "actions", "x10", "talk"],
    ], mathOn),
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
  if (theme.startsWith("sentences") && lang === "so") {
    const half = Math.ceil(SOMALI_SENTENCES.length / 2);
    return theme === "sentences1" ? SOMALI_SENTENCES.slice(0, half) : theme === "sentences2" ? SOMALI_SENTENCES.slice(half) : SOMALI_SENTENCES;
  }
  const out = THEMES[theme].words
    .filter((w) => table[meaningKey(w[1])])
    .map((w) => [table[meaningKey(w[1])], w[1], w[2], `${lang}:${table[meaningKey(w[1])]}`]);
  return out.length ? out : THEMES[theme].words;
}
