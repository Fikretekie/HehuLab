// Bedtime stories: each one is a list of lines [Tigrinya, English, picture].
// DRAFTS: Fik checks the Tigrinya, then the teller records each line in the voices site (send the story to her
// 📁 folder in one go, so one story = one voice). A line plays her recording when its text matches exactly;
// until then it shows on screen and the story moves on by itself.

import { Camel, Goat, Sheep } from "./Avatars";

export const STORIES = [
  {
    id: "goat",
    title: "The little goat",
    minutes: 2,
    age: "Pre-K and up",
    Pic: Goat,
    lines: [
      ["ሓደ ግዜ ሓንቲ ንእሽቶ ጤል ነይራ።", "Once there was a little goat.", "🐐"],
      ["እታ ጤል ኣብ ጎቦ ትጻወት ነበረት።", "The goat was playing on the hill.", "⛰️"],
      ["ሓደ መዓልቲ ኣደኣ ሰኣነታ።", "One day she lost her mother.", "😟"],
      ["ጤል፡ \"ኣደይ ኣበይ ኣለኺ?\" በለት።", "The goat said, \"Mother, where are you?\"", "📣"],
      ["ኣደኣ ድማ ብቕልጡፍ መጸት።", "And her mother came quickly.", "🏃‍♀️"],
      ["ክልቲአን ብሓጎስ ናብ ገዛ ተመልሳ።", "Both went home happily.", "🏡"],
    ],
  },
  {
    id: "camel",
    title: "The camel who counted stars",
    minutes: 2,
    age: "Kindergarten and up",
    Pic: Camel,
    lines: [
      ["ሓደ ግዜ ኣብ በረኻ ሓደ ገመል ነይሩ።", "Once there was a camel in the desert.", "🐫"],
      ["ገመል ለይቲ ኣብ ሰማይ ኮኾባት ይቖጽር ነበረ።", "At night the camel counted the stars in the sky.", "✨"],
      ["ሓደ፡ ክልተ፡ ሰለስተ…", "One, two, three…", "🔢"],
      ["ብዙሓት ኮኾባት ስለ ዝነበሩ ደኸመ።", "There were so many stars that he got tired.", "🥱"],
      ["ሽዑ ገመል ደቀሰ።", "Then the camel fell asleep.", "😴"],
      ["ብሩኽ ለይቲ", "Good night!", "🌙"],
    ],
  },
  {
    id: "sheep",
    title: "Bebe finds her way home",
    minutes: 2,
    age: "Pre-K and up",
    Pic: Sheep,
    lines: [
      ["በበ ንእሽቶ በጊዕ እያ።", "Bebe is a little sheep.", "🐑"],
      ["ሓደ መዓልቲ ካብ ኣደኣ ርሒቓ ከደት።", "One day she went far from her mother.", "🌾"],
      ["በበ ፈሪሃ፡ \"ኣደይ ኣበይ ኣለኺ?\" በለት።", "Bebe got scared and said, \"Mother, where are you?\"", "😢"],
      ["ሓንቲ ርግቢት ናብ ገዛ መገዲ ኣርኣየታ።", "A dove showed her the way home.", "🕊️"],
      ["በበ ምስ ኣደኣ ተራኸበት። ሕጉስ እያ!", "Bebe found her mother. She is happy!", "💛"],
    ],
  },
];
