import "./globals.css";

export const metadata = {
  title: "HehuLab: Tigrinya, Tigre, Bilen, Amharic and math for kids",
  description:
    "Games, bedtime stories and short lessons with Rodas, a friendly AI teacher, in the real voices of Eritrean families.",
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts: Quicksand (titles), Nunito (text), Noto Sans Ethiopic (Ge'ez letters) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Nunito:wght@400;600;700;800&family=Noto+Sans+Ethiopic:wght@500;700&display=swap"
        />
      </head>
      <body className="bg-white font-body text-ink antialiased">{children}</body>
    </html>
  );
}
