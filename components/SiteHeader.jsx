import Link from "next/link";

// Two sides of HehuLab, each with its own menu:
//   📚 Education = the kids' learning site (curriculum, stories, parents, pricing)
//   🎬 Studio    = making media (movies, news, documentaries, ads, voice / text to speech, credits)
const MENUS = {
  edu: [
    { href: "/#features", label: "Features" },
    { href: "/#grades", label: "Curriculum" },
    { href: "/#stories", label: "Bedtime stories" },
    { href: "/#parents", label: "Parents" },
    { href: "/#pricing", label: "Pricing" },
  ],
  studio: [
    { href: "/studio/#series", label: "Movies" },
    { href: "/studio/#news", label: "News" },
    { href: "/studio/#docu", label: "Documentaries" },
    { href: "/studio/#ad", label: "Ads" },
    { href: "/studio/#voice", label: "Voice" },
    { href: "/studio/#credits", label: "Credits" },
  ],
};

export default function SiteHeader({ area = "edu" }) {
  const studio = area === "studio";
  const tab = (on) =>
    `rounded-full px-4 py-1.5 text-sm font-bold transition ${on ? "bg-brand text-white" : "text-muted hover:text-ink"}`;
  return (
    <header className="wrap flex flex-wrap items-center justify-between gap-4 py-4">
      <div className="flex flex-wrap items-center gap-5">
        <Link href={studio ? "/studio/" : "/"} className="flex items-center gap-2.5 no-underline">
          <span className="rounded-xl bg-brand px-2.5 py-0.5 font-geez text-lg font-bold text-white">ሀሁ</span>
          <span className="font-display text-2xl font-bold text-ink">HehuLab</span>
        </Link>
        <div className="flex rounded-full border border-line bg-panel p-1" role="tablist" aria-label="HehuLab sections">
          <Link href="/" className={tab(!studio)} aria-selected={!studio}>📚 Education</Link>
          <Link href="/studio/" className={tab(studio)} aria-selected={studio}>🎬 Studio</Link>
        </div>
      </div>
      <nav aria-label="Main" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] font-bold">
        {MENUS[area].map((m) => (
          <a key={m.href} href={m.href} className="hover:text-brand">{m.label}</a>
        ))}
        <Link href="/login/" className="hover:text-brand">Log in</Link>
        {studio ? (
          <a href="/studio/#credits" className="btn-brand px-5 py-2.5">Buy credits</a>
        ) : (
          <Link href="/app/" className="btn-brand px-5 py-2.5">Try it free</Link>
        )}
      </nav>
    </header>
  );
}
