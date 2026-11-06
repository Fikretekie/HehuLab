// Turns somali-lines/*.txt ("somali | english") into components/somali.js: English meaning -> Somali word.
const fs = require("fs");
const dir = "somali-lines";
const map = {};
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".txt") && !f.includes("alphabet")).sort()) {
  for (const line of fs.readFileSync(`${dir}/${f}`, "utf8").split(/\r?\n/)) {
    const [so, en] = line.split("|").map((s) => s && s.trim());
    if (!so || !en) continue;
    for (const meaning of en.split(/,\s*/)) {
      const key = meaning.toLowerCase().replace(/[.!?]$/, "");
      if (!map[key]) map[key] = so;
    }
  }
}
const out = `// Somali words, made from Fik's word lists in somali-lines/ (the same lines the Somali recorder read on
// voices.hehulab.org). English meaning -> Somali word. Made by a script: edit the .txt files, not this file.
export const SOMALI = ${JSON.stringify(map, null, 0).replace(/","/g, '",\n  "').replace(/^\{/, "{\n  ").replace(/\}$/, ",\n}")};
`;
fs.writeFileSync("components/somali.js", out);
console.log(Object.keys(map).length, "meanings");
// Somali's own short sentences (the "Talk about me" lessons use these instead of translations).
const sent = fs.readFileSync(`${dir}/somali-words-11-short-sentences.txt`, "utf8").split(/\r?\n/)
  .map((l) => l.split("|").map((s) => s && s.trim())).filter(([so, en]) => so && en && /\s/.test(so)).slice(0, 30)
  .map(([so, en]) => [so, en, "💬"]);
fs.appendFileSync("components/somali.js", `\nexport const SOMALI_SENTENCES = ${JSON.stringify(sent).replace(/\],\[/g, "],\n  [").replace(/^\[\[/, "[\n  [").replace(/\]\]$/, "],\n]")};\n`);
