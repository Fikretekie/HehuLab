// What the games say on screen. Learning Tigrinya: the instructions are in English (the child knows English).
// Learning English from Tigrinya: the instructions are in Tigrinya, so a Tigrinya speaker understands them.
// The other languages keep English until a family checks a translation.
// DRAFT Tigrinya: Fik checks every line first. Girl and boy forms where Tigrinya has them.

const EN = {
  geez: false,
  goat: (x) => `Fiyel wants ${x}!`,
  again: "Not that one. Try again!",
  pop: (x) => `Pop ${x}!`,
  popMiss: "Not that letter. Look again!",
  nextStar: "Next star:",
  starMiss: (x) => `Not yet! Find ${x} first.`,
  find: "Find",
  howMany: "How many?",
  countAgain: "Count again!",
  raceHow: "Count the dots and tap the number. Be quicker than the goat!",
  raceStart: "Start the race",
};

const TI = (boy) => ({
  geez: true,
  goat: (x) => `ፍየል ${x} ትደሊ!`,
  again: boy ? "ኣይኮነን። ደጊምካ ፈትን!" : "ኣይኮነን። ደጊምኪ ፈትኒ!",
  pop: (x) => (boy ? `${x} ዘለዎ ፊኛ ጠውቕ!` : `${x} ዘለዎ ፊኛ ጠውቒ!`),
  popMiss: boy ? "እዚ ፊደል ኣይኮነን። ደጊምካ ርአ!" : "እዚ ፊደል ኣይኮነን። ደጊምኪ ርአዪ!",
  nextStar: "ዝቕጽል ኮኾብ:",
  starMiss: (x) => (boy ? `ገና! ቅድም ${x} ድለ።` : `ገና! ቅድም ${x} ድለዪ።`),
  find: boy ? "ድለ" : "ድለዪ",
  howMany: "ክንደይ ኣለዉ?",
  countAgain: boy ? "ደጊምካ ቁጸር!" : "ደጊምኪ ቁጸሪ!",
  raceHow: boy ? "ነጥብታት ቁጸር እሞ ቁጽሪ ጠውቕ። ካብ ፍየል ቀልጢፍካ!" : "ነጥብታት ቁጸሪ እሞ ቁጽሪ ጠውቒ። ካብ ፍየል ቀልጢፍኪ!",
  raceStart: boy ? "ጉያ ጀምር" : "ጉያ ጀምሪ",
});

export function gameText(kid) {
  if (kid.track === "english" && kid.lang === "ti") return TI(kid.gender === "boy");
  return EN;
}
