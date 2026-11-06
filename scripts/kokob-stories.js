// Makes kokob-lines/kokob-stories.txt (the bedtime story lines Aki records as Kokob) from components/stories.js.
// Run from the project folder:  node scripts/kokob-stories.js
const fs = require("fs");

const src = fs.readFileSync("components/stories.js", "utf8");
const out = [
  "# Bedtime stories for Aki (Kokob) to record. One line = one recording. Read the Tigrinya (left).",
  "# DRAFT: Fik checks the Tigrinya first. Send each story to Aki in one go (one story = one voice).",
];
const line = new RegExp('\\["((?:[^"\\\\]|\\\\.)*)", "((?:[^"\\\\]|\\\\.)*)", "[^"]*"\\]', "g");
for (const block of src.split(/\r?\n  \{\r?\n/).slice(1)) {
  out.push("", "## " + (block.match(/title: "([^"]+)"/) || [])[1]);
  for (const m of block.matchAll(line)) out.push(m[1].replaceAll('\\"', '"') + " | " + m[2].replaceAll('\\"', '"'));
}
fs.writeFileSync("kokob-lines/kokob-stories.txt", out.join("\n") + "\n");
console.log(`${out.length} lines written`);
