# HehuLab — open tasks (updated 2026-11-03)

## Done overnight (branch `overnight-curriculum`, merged and pushed to `main` 2026-11-03)
- Start screen: who is learning (child / grown-up) and what (learn my language / learn English from my language).
- Curriculum in `components/courses.js`: kids Pre-K → Grade 3 (74 lessons), grown-ups Beginner → Culture (62);
  English track 42 / 30 lessons. Units mix letter families, word themes (140 words Rodas already recorded),
  review, story and game.
- Path page: level tabs, units, stops for every lesson type; stars saved per lesson; grown-ups have nothing locked.
- Lesson screen plays word lessons (picture + word + meaning) and the English track (English voice + Rodas).
- Stories: real line-by-line player, 3 DRAFT stories (`components/stories.js`) — Fik checks the Tigrinya.
- Games: new "Find the picture" (Bebe says a word, tap its picture) using the unit's words.
- Production build passes (`npx next build`).
- To check: the Tigrinya in the 3 stories; "ሎሚ" and the number 10 have no Rodas recording yet.

## A. Kids/learners website (this repo)
1. ✅ Screen 4 lesson: approved, committed and pushed to `main`.
2. Screen 4 lesson: test the microphone in Chrome (http://localhost:3001/app/lesson/?letter=ሀ).
3. ✅ Rodas skips the quiet at the start and end of her recordings while playing (ሀ: 4.6 s → 0.8 s). Files unchanged.
4. Copy Adiam's new recordings (the 11 lesson lines: በሊ, ጽቡቕ ገይርኪ!, ደጊምኪ በሊ…) into `public/voices` once she records them.
5. ✅ Older work committed (Voice.jsx, Avatars, games/homework/settings/stories folders).
6. ✅ (overnight) Curriculum structure. Next: more themes and phrases per level, math inside the levels.
7. ✅ (overnight) Tracks. Still needed: Tigre, Bilen, Saho, Amharic word lists + recordings (task 22).
8. **Characters with real recorders** (one character = one person's voice, always the same):
   Rodas = Adiam Abraham. Kokob (young girl, replaced Grandma) = **Aki**. Aki records `kokob-lines/kokob-lines-1..5.txt` (500 lines, draft Tigrinya: Fik checks first), then copy her approved recordings to `public/voices/kokob/ti/` + `public/voices/kokob/ti.json`. Until then Kokob is silent. Gemel the camel, Goat, Sheep = Fik picks a recorder for each.
9. Screen 5 Games: ✅ memory match, build the word, letter pop, star map (Kokob), race the camel, speed round.
   ✅ Step 1: grade saved (Pre-K to Grade 3); Games page shows "Best for <age>" first; speed by age.
   ✅ Step 2 = grown-up games (phrase match, sentence builder, listen & choose; `components/GrownUpGames.jsx`).
   Fik checks: "ከመይ ኣሎኺ" has no "?" in the word list;
   ✅ Fixed 2026-11-05: "ኣበይ ቦታ ኢኺ ትነብሪ?" and "ኣነ ክልተ ኣሓት ኣለዋኒ።" (were እበይ / የሕዋት ኣሎዉኒ). Fik listens to
   Rodas's 2 old recordings; if she says the old words, Adiam records them again (then drop the old name in courses.js);
   ✅ Step 3 = English track: games use English letters + numbers, "Play and learn English" title, instructions in
   Tigrinya for Tigrinya speakers (`components/gameText.js`, DRAFT: Fik checks). Still: Aki records
   `kokob-lines/kokob-lines-en.txt` (26 letters); instructions for Amharic, Tigre, Bilen speakers.
10. Screen 6 Stories (each unit ends with a story from its words; watch or listen only).
11. ✅ Homework follows the path (trace, match letters, pictures-and-words, count).
12. ✅ Settings: learner, track, language, reset.
13. ✅ Screen 9 Friday report page (`/app/report/`): family picks English, Tigrinya, Tigre, Bilen, Saho or Amharic. Still: Fik checks the Tigrinya + Amharic drafts; find translators for Tigre, Bilen, Saho; sending the email every Friday needs the server.
14. Hosting: S3 + CloudFront, then GitHub Actions deploy. ✅ PostCSS warning fixed (8.5.30). Next.js warning left: only hits servers, our site is static; fixing needs Next 14 → 16 (big change).

## B. Voices site (voices.hehulab.org) — live: update 55 (consent v3, idle sign-out)
15. Push local commits (updates 49–55) to GitHub; sync CloudShell's copy.
16. Next update (waiting for Fik's yes): "Please re-record" goes back to the same person, not someone new.
17. Move the Bible verses from Adiam's folder: #12–#40 → Aki, the rest → Ruth G. (Fik is doing it).
18. Adiam records the 11 lesson lines (#1–#11 in her folder).
19. Fik checks, then adds Rodas teacher lines to Adiam's folder: chat batches 1–3 (~140) +
    `rodas-lines/rodas-lines-1..10.txt` (812 lines).
20. Run `python3 ~/hehulab-voices/check_duplicates.py` in CloudShell and look at the result.
21. Fix Bible text errors: doubled apostrophes (Naomi''s), "5:" at the start of one English line, "ahweh",
    one English verse that doesn't match its Tigrinya.
22. Find recorders for **Tigre, Bilen, Saho, Amharic** (0 recordings each). Needed before those tracks can talk.
23. Check why Tigre/Bilen/Amharic/Saho each show 1,190 "to record" (probably the shared English Translate list).
24. ✅ Consent v3 live (update 55). Still: have a lawyer read it once.
25. Optional: "🤖 Draft teacher lines" button (AI drafts 50 lines, Fik ticks the good ones).

## C. Later projects
26. Voice conversion: other readers' recordings turned into Rodas's voice (RVC free / ElevenLabs paid).
27. Rodas's AI voice (text-to-speech from 30–60 min of Adiam), then general Tigrinya text-to-speech.
28. Speech recognition, so the lesson knows the child really said ሀ (today it only checks something was said).
29. Rodas video clips (listening, talking, smiling, clapping, thinking) into `public/rodas/`.
30. **TV section (later, Fik's idea 2026-11-05):** after learning, the family relaxes and listens to stories on the TV.
    Needs: many stories (Rodas = Adiam records each one), a "TV mode" (big text, TV-remote arrow keys,
    stories play one after another), works by casting (Chromecast/AirPlay) or a smart-TV browser.
    Only after the site is online (task 14). TV has no mic or touch, so watch-only: stories, songs, "watch and repeat".
    Maybe also a YouTube channel of Rodas stories.
