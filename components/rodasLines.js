// What Rodas says in a lesson, in Tigrinya (girl and boy forms) with English under it.
// Each line has a planned audio file in public/audio/ti/. Until Rodas records it, the line only shows on screen.
// {x} is the letter or number she is teaching (played from her own recording of that letter).

export const AUDIO = "/audio/ti";

export const LINES = {
  // "ሀ በሊ" = "Say ሀ": her recording of the letter, then "በሊ" / "በል".
  sayIt: { girl: "{x} በሊ", boy: "{x} በል", english: "Say {x}", file: { girl: "beli", boy: "bel" } },
  again: { girl: "ደጊምኪ በሊ", boy: "ደጊምካ በል", english: "Say it again", file: { girl: "degimki-beli", boy: "degimka-bel" } },
  welldone: { girl: "ጽቡቕ ገይርኪ!", boy: "ጽቡቕ ገይርካ!", english: "Well done!", file: { girl: "tsbuq-geyrki", boy: "tsbuq-geyrka" } },
  listen: { girl: "ስምዕኒ", boy: "ስምዓኒ", english: "Listen to me", file: { girl: "smeni-girl", boy: "smani-boy" } },
  allDone: { girl: "ኮርዒዳ!", boy: "ኮርዒዳ!", english: "Bravo! You did them all!", file: { girl: "korida", boy: "korida" } },
};

// About 30 short reactions with feeling, recorded by Rodas later (public/audio/ti/react-<id>.mp3).
// After a good answer she plays a random "happy" one, so she doesn't sound the same every time.
export const REACTIONS = [
  { id: "ewe", text: "እወ!", english: "Yes!", mood: "happy" },
  { id: "o", text: "ኦ!", english: "Oh!", mood: "happy" },
  { id: "tsbuq", text: "ጽቡቕ!", english: "Good!", mood: "happy" },
  { id: "hray", text: "ሕራይ", english: "Okay", mood: "calm" },
  { id: "laugh", text: "(small laugh)", english: "", mood: "happy" },
  // Fik adds the rest of the ~30 here, in his own wording.
];

// The line in the right form for this child, with {x} filled in.
export function line(id, gender, x = "") {
  const l = LINES[id];
  const g = gender === "boy" ? "boy" : "girl";
  return { text: l[g].replace("{x}", x), english: l.english.replace("{x}", x), file: `${AUDIO}/${l.file[g]}.mp3` };
}
