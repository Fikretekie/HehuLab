/** Ocean Blue (dark): the colors and fonts the whole site uses. The color values live in app/globals.css. */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Dark theme (2026-11-24, Fik): every color is a variable set in app/globals.css (:root), so the whole site
      // switches together. Printing (the certificate) switches back to the light colors there too.
      colors: {
        brand: { DEFAULT: "rgb(var(--c-brand) / <alpha-value>)", dark: "rgb(var(--c-brand-dark) / <alpha-value>)" },
        accent: { DEFAULT: "rgb(var(--c-accent) / <alpha-value>)", soft: "rgb(var(--c-accent-soft) / <alpha-value>)" },
        soft: "rgb(var(--c-soft) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        sun: "#FFC93C",
        good: { DEFAULT: "rgb(var(--c-good) / <alpha-value>)", soft: "rgb(var(--c-good-soft) / <alpha-value>)" },
        panel: "rgb(var(--c-panel) / <alpha-value>)",
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
