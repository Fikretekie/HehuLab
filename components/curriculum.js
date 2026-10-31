// What each language's learning path teaches. Letters first (one stop = one letter family),
// then math taught in the same language. Change a list here and the path changes everywhere.

// Ge'ez letter families in teaching order. Bilen is taught with its Latin alphabet.
const GEEZ_TI = ["ሀ", "ለ", "ሐ", "መ", "ረ", "ሰ", "ሸ", "ቀ", "ቐ", "በ", "ቨ", "ተ", "ቸ", "ነ", "ኘ", "አ",
  "ከ", "ኸ", "ወ", "ዐ", "ዘ", "ዠ", "የ", "ደ", "ጀ", "ገ", "ጠ", "ጨ", "ጰ", "ጸ", "ፈ", "ፐ"];
const GEEZ_AM = ["ሀ", "ለ", "ሐ", "መ", "ሠ", "ረ", "ሰ", "ሸ", "ቀ", "በ", "ቨ", "ተ", "ቸ", "ኀ", "ነ", "ኘ", "አ",
  "ከ", "ኸ", "ወ", "ዐ", "ዘ", "ዠ", "የ", "ደ", "ጀ", "ገ", "ጠ", "ጨ", "ጰ", "ጸ", "ፀ", "ፈ", "ፐ"];
const LATIN = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" ");

export const LETTERS = { ti: GEEZ_TI, tig: GEEZ_TI, am: GEEZ_AM, byn: LATIN };

// The 7 forms of a Ge'ez letter family, e.g. ሀ -> ሀ ሁ ሂ ሃ ሄ ህ ሆ (Unicode keeps them side by side).
export function family(letter) {
  const code = letter.codePointAt(0);
  if (code < 0x1200 || code > 0x137f) return [letter.toUpperCase(), letter];
  return Array.from({ length: 7 }, (_, i) => String.fromCodePoint(code + i));
}

// Numbers 1-10 said in the language (only where we have them checked; others show digits).
export const NUMBER_WORDS = {
  ti: ["ሓደ", "ክልተ", "ሰለስተ", "ኣርባዕተ", "ሓሙሽተ", "ሽዱሽተ", "ሸውዓተ", "ሸሞንተ", "ትሽዓተ", "ዓሰርተ"],
  am: ["አንድ", "ሁለት", "ሶስት", "አራት", "አምስት", "ስድስት", "ሰባት", "ስምንት", "ዘጠኝ", "አስር"],
};

export const MATH = [
  { id: "m1", title: "Count 1 to 5", big: "1-5" },
  { id: "m2", title: "Count 6 to 10", big: "6-10" },
  { id: "m3", title: "More or less", big: "<>" },
  { id: "m4", title: "Add with fingers", big: "1+2" },
  { id: "m5", title: "Take away", big: "3-1" },
  { id: "m6", title: "Shapes", big: "△" },
];

// Split the letters into units of 6 stops each.
export function letterUnits(lang) {
  const list = LETTERS[lang] || GEEZ_TI;
  const units = [];
  for (let i = 0; i < list.length; i += 6) {
    units.push({ id: `u${units.length + 1}`, letters: list.slice(i, i + 6) });
  }
  return units;
}

// "Well done!" from the teacher, in the child's language (girl/boy forms where the language has them).
export function cheer(lang, gender) {
  if (lang === "ti") return { native: gender === "boy" ? "ጽቡቕ ገይርካ!" : "ጽቡቕ ገይርኪ!", english: "Well done!" };
  if (lang === "am") return { native: "ጎበዝ!", english: "Well done!" };
  return { native: "", english: "Well done!" };
}
