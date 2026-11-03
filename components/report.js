// The Friday report for families, in the language the grown-ups pick in Settings.
// English is the base. Tigrinya and Amharic are DRAFTS (Fik checks them). Tigre, Bilen and Saho have no
// translation yet: they show the English text with a note until a family member translates them.
// Every line has a girl and a boy form where the language needs one: (name, girl) => text.

import { LANGS } from "./KidState";

export const REPORT_LANGS = [["en", "English"], ...LANGS.map((l) => [l.id, l.name, l.native])];

const en = {
  subject: (name) => `${name}'s Friday report`,
  hello: (name) => `Hello, ${name}'s family!`,
  summary: (name, girl, lessons, stars) => `So far ${name} has finished ${lessons} lessons and earned ${stars} stars.`,
  lessons: "Lessons done",
  stars: "Stars",
  letters: () => "Letters learned",
  words: () => "Words learned",
  next: "Next lesson",
  tipTitle: "Practice at home",
  tip: (name, girl, letter) => `Ask ${name} to say ${letter} to you, then say it back together.`,
  none: () => "Nothing yet. The first lesson is waiting!",
  sign: "Rodas, AI teacher at HehuLab",
};

const ti = {
  subject: (name) => `ናይ ${name} ጸብጻብ ዓርቢ`,
  hello: (name) => `ሰላም ስድራ ቤት ${name}!`,
  summary: (name, girl, lessons, stars) =>
    girl
      ? `${name} ክሳብ ሕጂ ${lessons} ትምህርቲ ወዲኣ ${stars} ኮኾብ ረኺባ።`
      : `${name} ክሳብ ሕጂ ${lessons} ትምህርቲ ወዲኡ ${stars} ኮኾብ ረኺቡ።`,
  lessons: "ዝተወድአ ትምህርቲ",
  stars: "ኮኾብ",
  letters: (girl) => (girl ? "ዝተማህረቶ ፊደላት" : "ዝተማህሮ ፊደላት"),
  words: (girl) => (girl ? "ዝተማህረቶ ቃላት" : "ዝተማህሮ ቃላት"),
  next: "ዝቕጽል ትምህርቲ",
  tipTitle: "ኣብ ገዛ ልምምድ",
  tip: (name, girl, letter) =>
    girl ? `${name} “${letter}” ክትብለኩም ሕተትዋ፣ ብሓባር ድማ ድገሙዎ።` : `${name} “${letter}” ክብለኩም ሕተትዎ፣ ብሓባር ድማ ድገሙዎ።`,
  none: (girl) => (girl ? "ገና ኣይጀመረትን። ቀዳማይ ትምህርቲ ይጽበያ ኣሎ!" : "ገና ኣይጀመረን። ቀዳማይ ትምህርቲ ይጽበዮ ኣሎ!"),
  sign: "ሮዳስ፣ AI መምህር ኣብ HehuLab",
};

const am = {
  subject: (name) => `የ${name} የዓርብ ሪፖርት`,
  hello: (name) => `ሰላም የ${name} ቤተሰብ!`,
  summary: (name, girl, lessons, stars) =>
    girl
      ? `${name} እስካሁን ${lessons} ትምህርቶችን ጨርሳ ${stars} ኮከቦችን አግኝታለች።`
      : `${name} እስካሁን ${lessons} ትምህርቶችን ጨርሶ ${stars} ኮከቦችን አግኝቷል።`,
  lessons: "የተጠናቀቁ ትምህርቶች",
  stars: "ኮከቦች",
  letters: (girl) => (girl ? "የተማረችው ፊደላት" : "የተማረው ፊደላት"),
  words: (girl) => (girl ? "የተማረችው ቃላት" : "የተማረው ቃላት"),
  next: "ቀጣዩ ትምህርት",
  tipTitle: "በቤት ውስጥ ልምምድ",
  tip: (name, girl, letter) =>
    girl ? `${name} “${letter}” እንድትል ጠይቋት፣ ከዚያም አብራችሁ ድገሙት።` : `${name} “${letter}” እንዲል ጠይቁት፣ ከዚያም አብራችሁ ድገሙት።`,
  none: (girl) => (girl ? "ገና አልጀመረችም። የመጀመሪያው ትምህርት እየጠበቃት ነው!" : "ገና አልጀመረም። የመጀመሪያው ትምህርት እየጠበቀው ነው!"),
  sign: "ሮዳስ፣ በHehuLab የAI መምህር",
};

const TEXTS = { en, ti, am };
export const DRAFT = { ti: true, am: true }; // translations Fik still checks

// The texts for a report language, and whether it is only the English stand-in.
export function reportText(lang) {
  return { t: TEXTS[lang] || en, missing: !TEXTS[lang] };
}
