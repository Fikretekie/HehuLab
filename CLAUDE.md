# HehuLab — notes for Claude

> Full history of decisions and the voices app: read `docs/HANDOFF.md` too.

HehuLab (hehulab.org) is an AI learning website for Eritrean diaspora kids: Tigrinya (plus Tigre, Bilen, and
Amharic "from Ethiopia") and math taught **in the chosen language** (Tigrinya → math in Tigrinya, Bilen → math in Bilen).
The owner is Fik (GitHub: Fikretekie). He is learning, so explain simply.

## Fik's rules (follow every time)
1. State these rules at the start of each session/task, then begin.
2. **Short replies: about 6 sentences max.** No long pages.
3. **Web (desktop) view first**, not mobile.
4. **Live view while building:** run the site with Preview (`npm run dev`, port 3000) and keep it open so he can
   correct the design before anything is deployed.
5. Small steps, one at a time. Explain every step and every command piece by piece (spell out look-alikes:
   letter O vs zero, lowercase L vs 1). Every command in a copy box.
6. Give full file code when changing code, and exact deploy steps.
7. Use his own wording and ideas.
8. Commit and push to GitHub (`main`) when a screen looks right.

## This repo (the kids' website)
- Next.js 14 (App Router), React 18, Tailwind 3. Static export (`output: "export"`, `trailingSlash: true`) so it can
  be hosted on **S3 + CloudFront** (not set up yet; CI/CD with GitHub Actions later).
- `next.config.mjs`: `PREVIEW=1` only changes the asset folder for Claude's cloud preview. Ignore it locally.
- **Ocean Blue** theme (`tailwind.config.js`): brand #1760CF, accent #B8441C, soft #EEF5FF, ink #102542,
  muted #4D5E78, line #DCE7F7, sun #FFC93C, good #1F8A4C. Fonts: Quicksand (headings), Nunito, Noto Sans Ethiopic.
- Shared pieces in `components/`: `KidState.jsx` (language, teacher, math, name, gender kept in localStorage),
  `KidTopBar.jsx` (kids' menu), `Avatars.jsx` (Rodas photo + Goat, Sheep, Camel, Grandma drawings, `TEACHERS`),
  `Icons.jsx`, `curriculum.js` (letters per language, number words, math units, cheers), `GradePicker.jsx`.

### Teachers
- **Rodas** = AI-generated Eritrean woman (23, in a zuria), photo `public/images/rodas.jpg`. Always labeled
  **"AI teacher"**. Greets "Selam! I'm Rodas." / "ሰላም! ኣነ ሮዳስ እየ።"
- Animal friends + Grandma Abeba are AI teachers too. Footer says every voice is a real family voice.

## Screens (web first)
| # | Screen | Route | Status |
|---|--------|-------|--------|
| 1 | Landing page (hero, features, grade picker Pre-K/K/Grade 1…, Meet Rodas, bedtime stories, parents report, pricing $19.99/mo per child) | `/` | ✅ done |
| 2 | Pick language (Eritrean / From Ethiopia), math on/off, teacher | `/app/` | ✅ done |
| 3 | Learning path: letter units + "Math in {language}", done/current/locked stops, Rodas cheering | `/app/path/` | ✅ done |
| 4 | Lesson: hands-free conversation. Rodas says ሀ, asks the child to say it, listens, replays the child's voice; the child can ask questions out loud | `/app/lesson/` | ⏭ next |
| 5 | Games | `/app/games/` | todo |
| 6 | Bedtime stories (watch a short movie or listen only) | `/app/stories/` | todo |
| 7 | Homework / practice sheets | `/app/homework/` | todo |
| 8 | Settings (grown-ups) | `/app/settings/` | todo |
| 9 | Friday parent report email — **written in Tigrinya** | — | todo |

Design reference (all 9 screens, 3 themes; Fik chose Ocean Blue): https://claude.ai/artifact/2qTtaBW5jJgG8yJHbNSnEi

## The other project: HehuLab Voices (voices.hehulab.org)
Separate app (not in this repo) where families record Tigrinya/Tigre/Bilen/Amharic sentences to train the AI.
Deployed from AWS CloudShell with `~/hehulab-voices/update-api.sh` and `deploy-site.sh` (Lambda + API Gateway +
DynamoDB + S3 + Cognito). Latest deployed update: **48** (one sentence = one person, side-by-side
Tigrinya + English paragraphs, "Mark all ready", up to 3-minute recordings). That work happens in the claude.ai
session, not here.
