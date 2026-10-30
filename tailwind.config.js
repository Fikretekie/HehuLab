/** Ocean Blue: the colors and fonts the whole site uses. Change a color here and it changes everywhere. */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#1760CF", dark: "#0F4AA3" },
        accent: { DEFAULT: "#B8441C", soft: "#FFEDE5" },
        soft: "#EEF5FF",
        ink: "#102542",
        muted: "#4D5E78",
        line: "#DCE7F7",
        sun: "#FFC93C",
        good: { DEFAULT: "#1F8A4C", soft: "#E3F5EA" },
      },
      fontFamily: {
        display: ["Quicksand", "Nunito", "system-ui", "sans-serif"],
        body: ["Nunito", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        geez: ["'Noto Sans Ethiopic'", "Nyala", "'Abyssinica SIL'", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem", xl3: "1.75rem" },
    },
  },
  plugins: [],
};
