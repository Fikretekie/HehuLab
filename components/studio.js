// HehuLab Studio (DEMO, 2026-11-24): the plan in Fik's doc "HehuLab Studio — Movie, News, Documentary & Ads Plan".
// Everything here is example data. Nothing is generated or charged yet: the real pictures, video and voices come
// later from Amazon Bedrock (Claude for scripts, picture and video models) and our own trained voices.

// 1 credit = $0.10. Our cost is about half of what the customer pays.
export const CREDIT_USD = 0.1;
export const STYLES = [
  { id: "news", name: "News style", note: "Presenter picture, headlines, maps", perMin: 20 },
  { id: "picture", name: "Picture story", note: "Pictures with motion + 10% real AI video", perMin: 120 },
  { id: "video540", name: "Full AI video (540p)", note: "Every shot is AI video", perMin: 900 },
  { id: "video720", name: "Full AI video (720p)", note: "Every shot is AI video, sharper", perMin: 1800 },
];
export const AD_CREDITS = { 15: 500, 30: 990, 60: 1900 }; // one ad, one language, AI video 720p
export const AD_EXTRA_LANG = 150; // each extra language of the same ad ($15)

export const PACKS = [
  { name: "Starter", price: 10, credits: 100, note: "Try it: about 5 minutes of news" },
  { name: "Creator", price: 50, credits: 550, note: "+10% bonus · about 4.5 minutes of picture story" },
  { name: "Studio", price: 200, credits: 2400, note: "+20% bonus · about 1 episode, or 2 ads, or 120 min of news" },
];

export const STUDIO_LANGS = [
  { id: "ti", name: "Tigrinya", native: "ትግርኛ", voice: "Rodas (Adiam): test voice" },
  { id: "am", name: "Amharic", native: "አማርኛ", voice: "mikal: test recordings" },
  { id: "tig", name: "Tigre", native: "ትግሬ", voice: "Needs more recordings" },
  { id: "byn", name: "Bilen", native: "ብሊን", voice: "Needs more recordings" },
  { id: "so", name: "Somali", native: "Soomaali", voice: "Needs more recordings" },
  { id: "kun", name: "Kunama", native: "Kunama", voice: "Needs more recordings" },
];

export const MODES = [
  { id: "series", icon: "🎬", name: "Series & movies", short: "Seasons and episodes with the same characters", sample: "Haile and the match" },
  { id: "news", icon: "📰", name: "Daily news", short: "A news bulletin every morning, read by a presenter", sample: "Morning bulletin" },
  { id: "docu", icon: "🎞️", name: "Documentaries", short: "A narrated film in chapters, from photos and archive", sample: "Kuno Salsti: Eritrean braids" },
  { id: "ad", icon: "📣", name: "Ads", short: "15, 30 or 60-second ads in every language", sample: "Mesob Store weekend offer" },
];

// The six steps every project goes through (shown while the demo "makes" it).
export const STEPS = [
  "Writing the script",
  "Fixing the characters (story bible)",
  "Drawing the pictures",
  "Making the video clips",
  "Adding the voices and subtitles",
  "Joining the episode",
];

// Example storyboards. Each scene: a picture idea (shown as a placeholder), then the line in Tigrinya, Amharic
// and English. Other languages show the English line until their scripts and voices are ready.
export const DEMOS = {
  series: [
    { pic: "🔥", sky: "from-[#16305a] to-[#3a1f3d]", shot: "Night. Haile lights a fire with the match.", ti: "ሃይለ ዕንጨይቲ ኣከበ፡ ብክርቢት ድማ ሓዊ ኣጒደ።", am: "ሃይለ እንጨት ሰበሰበ፣ በክብሪትም እሳት አነደደ።", en: "Haile gathered wood and lit a fire with the match." },
    { pic: "🐺", sky: "from-[#10223f] to-[#1b2e2a]", shot: "Wild animals far away, afraid of the fire.", ti: "ኣብ ርሑቕ ኣራዊት ተሰምዑ፡ ግን ነቲ ሓዊ ርእዮም ኣይቀረቡን።", am: "ከሩቅ የአውሬዎች ድምፅ ተሰማ፣ ነገር ግን እሳቱን አይተው አልቀረቡም።", en: "Wild animals were heard far away, but when they saw the fire, they did not come near." },
    { pic: "🗣️", sky: "from-[#16305a] to-[#2a2142]", shot: "Haile calls for help beside his father.", ti: "ሃይለ ኣብ ጥቓ ኣቦኡ ኮፍ ኢሉ ብሓይሊ ጸወዐ፡ \"ሓግዙና! ሓግዙና!\"", am: "ሃይለ ከአባቱ አጠገብ ተቀምጦ በኃይል ጮኸ፣ \"እርዱን! እርዱን!\"", en: "Haile sat near his father and called loudly, \"Help us! Help us!\"" },
    { pic: "🏮", sky: "from-[#1d2b4f] to-[#3b2a17]", shot: "The mother and neighbours run with lanterns.", ti: "ኣደ ሃይለን ጎረባብትን ፋኑስ ሒዞም ጐየዩ መጹ።", am: "የሃይለ እናትና ጎረቤቶች ፋኖስ ይዘው እየሮጡ መጡ።", en: "Haile's mother and the neighbors came running with lanterns." },
    { pic: "🩺", sky: "from-[#14304a] to-[#123a33]", shot: "At the clinic: the doctor gives medicine.", ti: "ሓኪም ፈውሲ ሃቦም፡ \"ብግዜኹም ስለ ዝመጻእኩም ኣብ ሓደጋ የለን\" በለ።", am: "ሐኪሙ መድኃኒት ሰጣቸውና፣ \"በጊዜ ስለመጣችሁ ከአደጋ ወጥተዋል\" አለ።", en: "The doctor gave him medicine and said, \"Because you came in time, he is out of danger.\"" },
    { pic: "🤗", sky: "from-[#2b3f6b] to-[#4a3a1a]", shot: "Morning. The father hugs Haile.", ti: "ንሃይለ ሓቚፎም፡ \"ወደይ፡ ጀግና ኢኻ\" በልዎ።", am: "ሃይለን አቅፈው፣ \"ልጄ፣ ጀግና ነህ\" አሉት።", en: "He hugged Haile and said, \"My son, you are a hero.\"" },
  ],
  news: [
    { pic: "🎙️", sky: "from-[#16305a] to-[#10223f]", shot: "Presenter in the studio, logo behind her.", ti: "እንቋዕ ብደሓን መጻእኩም። እዚ ናይ ሎሚ ዜና እዩ።", am: "እንኳን ደህና መጣችሁ። ይህ የዛሬ ዜና ነው።", en: "Welcome. This is today's news." },
    { pic: "📚", sky: "from-[#14304a] to-[#1b2e2a]", shot: "Headline card + photo: a new community library.", ti: "ኣብ ከተማና ሓድሽ ቤተ-መጻሕፍቲ ንቆልዑ ተኸፊቱ።", am: "በከተማችን ለልጆች አዲስ ቤተ መጻሕፍት ተከፈተ።", en: "A new children's library has opened in our city." },
    { pic: "🌦️", sky: "from-[#1d2b4f] to-[#16305a]", shot: "Weather map with icons.", ti: "ጽባሕ ብርሃን ኮይኑ፡ ምሸት ግን ዝናብ ክህሉ ይኽእል።", am: "ነገ ፀሐያማ ይሆናል፣ ምሽት ግን ዝናብ ሊኖር ይችላል።", en: "Tomorrow will be sunny, but there may be rain in the evening." },
    { pic: "👋", sky: "from-[#16305a] to-[#2a2142]", shot: "Presenter says goodbye.", ti: "ስለ ዝተኸታተልኩምና የቐንየልና። ጽባሕ ክንራኸብ ኢና።", am: "ስለተከታተላችሁን እናመሰግናለን። ነገ እንገናኛለን።", en: "Thank you for watching. See you tomorrow." },
  ],
  docu: [
    { pic: "🌾", sky: "from-[#3b3020] to-[#16305a]", shot: "Chapter 1. Women working in the fields at harvest.", ti: "ኣብ ወቕቲ ስራሕ ሕርሻ፡ ኣንስቲ ግዜ ስለ ዘይነበረን ብሃወኽ ይቝነና ነበራ።", am: "በእርሻ ወቅት ሴቶች ጊዜ ስላልነበራቸው ሹሩባቸውን በፍጥነት ይሠሩ ነበር።", en: "During the farming season, women had no time, so they braided their hair quickly." },
    { pic: "🐂", sky: "from-[#1b2e2a] to-[#3b3020]", shot: "Chapter 2. Sharing: an ox lent to a neighbour.", ti: "ኣብ ባህልና ሳልስቲ ማለት ምክፋልን ምትሕግጋዝን እዩ።", am: "በባህላችን ሳልስቲ ማለት መካፈልና መረዳዳት ነው።", en: "In our culture, salsti (three days) means sharing and helping each other." },
    { pic: "💇🏾‍♀️", sky: "from-[#3a1f3d] to-[#16305a]", shot: "Chapter 3. January: beautiful braids for the season.", ti: "ኣብ ወርሒ ጥሪ፡ ጽቡቕ ቍኖታት ከም ኣልባሶ፡ ጋመ፡ ስገምን ሳዱላን ይቝነና።", am: "በጥር ወር እንደ አልባሶ፣ ጋመ፣ ስገምና ሳዱላ ያሉ ውብ ሹሩባዎችን ይሠሩ ነበር።", en: "In January, they braided beautiful styles like Albaso, Game, Sigem and Sadula." },
    { pic: "✨", sky: "from-[#2b3f6b] to-[#3a1f3d]", shot: "Ending. Old photos fade into a modern girl's braids.", ti: "ቍኖ ናይ ኤርትራ ጽባቐን ክብሪን ባህልና እዩ።", am: "የኤርትራ ሹሩባ የባህላችን ውበትና ኩራት ነው።", en: "Eritrean braids are the beauty and pride of our culture." },
  ],
  ad: [
    { pic: "🛍️", sky: "from-[#3a2f14] to-[#16305a]", shot: "Logo appears over a warm kitchen.", ti: "መሶብ ስቶር፡ ጣዕሚ ዓድኹም ኣብ ገዛኹም።", am: "መሶብ ስቶር፣ የሀገራችሁ ጣዕም በቤታችሁ።", en: "Mesob Store: the taste of home, at your home." },
    { pic: "☕", sky: "from-[#3b3020] to-[#3a1f3d]", shot: "Close-up: coffee pouring, fresh injera.", ti: "ቡንን እንጀራን፡ ሓድሽን ጥዑምን።", am: "ቡናና እንጀራ፣ ትኩስና ጣፋጭ።", en: "Coffee and injera, fresh and delicious." },
    { pic: "🏷️", sky: "from-[#3d241e] to-[#16305a]", shot: "Big price card: 10% off this weekend.", ti: "ኣብዚ ቀዳመ ሰንበት 10% ቅናሽ!", am: "በዚህ ቅዳሜና እሁድ 10% ቅናሽ!", en: "10% off this weekend!" },
    { pic: "📲", sky: "from-[#16305a] to-[#14304a]", shot: "Website and phone number, logo.", ti: "ሎሚ ኣብ mesobstore.com ዕደጉ።", am: "ዛሬ በ mesobstore.com ይግዙ።", en: "Shop today at mesobstore.com." },
  ],
};

export const credits = (n) => Math.round(n).toLocaleString();
export const dollars = (c) => "$" + (c * CREDIT_USD).toLocaleString(undefined, { maximumFractionDigits: 0 });
