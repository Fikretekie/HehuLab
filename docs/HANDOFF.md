# HehuLab — full handoff from the claude.ai session

Everything Fik and Claude did together, so a new Claude Code session can continue without asking again.
Read `CLAUDE.md` first (Fik's rules). Then this file.

---

## 1. Who and what
- **Fik** (GitHub `Fikretekie`) runs HehuLab, an AI learning platform for Eritrean diaspora kids. Domain: hehulab.org.
- Two parts:
  1. **HehuLab Voices** (voices.hehulab.org): families record Tigrinya / Tigre / Bilen / Amharic sentences to
     train the AI. Live and in daily use.
  2. **The kids' website** (this repo, Next.js): lessons with Rodas the AI teacher. Being built screen by screen.
- Languages are grouped as **Eritrean** (Tigrinya, Tigre, Bilen) and **Amharic "from Ethiopia"**.
- **Math is taught in the chosen language**: Tigrinya → math in Tigrinya, Bilen → math in Bilen, and so on.

## 2. Fik's standing rules
Same as `CLAUDE.md`: state the rules at the start; replies of about 6 sentences max; web view first; **live Preview
while building** (he corrects the design before deploying); small steps; explain every command piece by piece and
spell out look-alikes; full file code and exact deploy steps; use his own wording; commit and push when a screen
looks right.

---

## 3. The kids' website (this repo)

### Tech
- Next.js 14.2, React 18.3, Tailwind 3.4. Static export (`output: "export"`, `trailingSlash: true`,
  `images.unoptimized`).
- Hosting plan: **S3 + CloudFront**, then GitHub Actions CI/CD. Not set up yet.
- Local live view: `npm run dev` on port 3000, opened in the Claude desktop app's **Preview** panel. The desktop
  session already has a `launch.json` for this.
- `npm audit` shows 2 warnings in build tools. Leave them for now; fix them safely before going live (not with
  `--force`).

### Design decisions
- Theme **Ocean Blue** (chosen from 3 themes). Colors in `tailwind.config.js`.
- Prototype with all 9 screens: https://claude.ai/artifact/2qTtaBW5jJgG8yJHbNSnEi
- **Rodas**: an AI-generated Eritrean woman, about 23, in a zuria (traditional dress). Photo `public/images/rodas.jpg`.
  She must always be labeled **"AI teacher"**.
- Other teachers: Grandma Abeba, plus animal friends (goat, sheep, camel "Gemel"). Drawings live in
  `components/Avatars.jsx`.
- Curriculum is organized by grade: Pre-K, Kindergarten, Grade 1…
- Features: games, practice sheets/homework, **bedtime stories (watch a short movie or listen only)**, and a
  **Friday report email to parents written in Tigrinya**.
- Pricing shown on the landing page: $19.99 per month per child.

### Hands-free lesson (Screen 4, next to build)
Rodas says a letter (e.g. ሀ), asks the child "can you say ሀ?", listens, **plays the child's own voice back**, and
praises them. The child can also ask questions out loud, like talking to a real person. Use Tigrinya
girl/boy forms (e.g. ጽቡቕ ገይርኪ to a girl, ጽቡቕ ገይርካ to a boy). Start with a front-end demo (browser
microphone + recorded audio); the real AI voice comes later.

### Screens status
1. Landing `/` ✅
2. Pick language / math / teacher `/app/` ✅
3. Learning path `/app/path/` ✅ (letters from `components/curriculum.js`: Tigrinya/Tigre Ge'ez families,
   Amharic adds ሠ ኀ ፀ, Bilen uses Latin a–z; math units with number words ሓደ ክልተ ሰለስተ…)
4. Lesson ⏭ next. 5 Games, 6 Bedtime stories, 7 Homework, 8 Settings, 9 Friday report: still to do.

---

## 4. HehuLab Voices (voices.hehulab.org): not in this repo
The code lives in Fik's AWS CloudShell at `~/hehulab-voices`. Updates were made in the claude.ai session as zips
(`hehulab-updateNN.zip`) and deployed with:
```
cd ~ && unzip -o hehulab-updateNN.zip && cd hehulab-voices && ./update-api.sh && ./deploy-site.sh
```
- AWS: Lambdas `hehulab-voices-api`, `-daily`, `-ai`; API Gateway HTTP API (JWT); DynamoDB single table
  `hehulab-voices` (GSI1, GSI2); S3 `hehulab-voices-data`; Cognito pool `us-east-1_jOONvKxB9`; Bedrock for AI drafts.
- Front end: React + Vite (`web/`). Back end: Python `backend/api/app.py`.
- **Latest deployed: update 48** (confirmed 2026-10-31).

### What the voices app does now
- Record page with folders (Kids learning / Voice / Reviewed), Previous/Next, hands-free reading.
- **Multi-language**: Tigrinya, Tigre, Bilen, Amharic, each with its own totals, review, add text, word fixes,
  and send-back. Reviewers per language. The admin can permanently delete users.
- **One sentence = one person** (updates 41–42): every sentence, letter and Translate prompt goes to one recorder
  and is held for 30 minutes. If it's skipped or the hold runs out, it goes back to the pool; if rejected, it goes
  back too. Rodas's teacher lines go only to her.
- Language cards show recorded / **to record** / to review (update 45).
- **Add text** has 3 sub-screens (update 43): 📊 Overview (simple table), 📝 Prepare sentences (opens on the list
  with work waiting; **✅ Mark all ready**, update 47), ➕ Add new text.
- **🌍 Tigrinya + English side by side** box (updates 46 and 48): a whole paragraph is saved as **one** entry;
  the English may have more or fewer sentences; text up to 3,000 letters; recordings up to 3 minutes for long text.
- New sentences start **Not ready**. Readers only get ✓ Ready ones.
- Rodas's 237 teacher lines are in the "teach" list (update 40).

### Data numbers (end of October 2026)
About 1,600 Tigrinya recordings (~2 hours), about 1,900 different words. Goal: **5,000 different words** and
6–10 hours of recordings. Readers: 2 girls and 2 boys, plus the Rodas voice woman.

### Advice already given (don't repeat unless asked)
- Rodas's voice (text-to-speech) comes from **one woman**. About 30–60 minutes of her is enough if the AI first
  learns from all the voices, then adapts to her. Everyone's voices train **understanding** (speech recognition);
  boys' voices can later become a male character's voice.
- The AI learns word meanings by itself from many sentence pairs; no word-by-word labeling is needed.
  Recommended entry size: 1 sentence (5–20 words, max ~30).
- Bible parallel text is very useful (verses are already paired). Start with Ruth and Luke; skip Song of Solomon.
  Check permission for the Tigrinya translation.
- Don't scan copyrighted books (like the kasahorow dictionary) without permission.
- Make sure the consent form covers using voices to train Rodas, and that parents agree for child readers.

---

## 5. Next steps
1. **Website:** build Screen 4 (Lesson, hands-free) in the web view with Preview open, then Screens 5–9.
2. Then S3 + CloudFront hosting and GitHub Actions deploy.
3. Voices app: keep collecting. Mark the Rodas woman on the People page (`teacherVoice`).
