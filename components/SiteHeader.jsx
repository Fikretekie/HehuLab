import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="wrap flex flex-wrap items-center justify-between gap-4 py-4">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <span className="rounded-xl bg-brand px-2.5 py-0.5 font-geez text-lg font-bold text-white">ሀሁ</span>
        <span className="font-display text-2xl font-bold text-ink">HehuLab</span>
      </Link>
      <nav aria-label="Main" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] font-bold">
        <a href="#features" className="hover:text-brand">Features</a>
        <a href="#grades" className="hover:text-brand">Curriculum</a>
        <a href="#stories" className="hover:text-brand">Bedtime stories</a>
        <a href="#parents" className="hover:text-brand">Parents</a>
        <a href="#pricing" className="hover:text-brand">Pricing</a>
        <Link href="/login/" className="hover:text-brand">Log in</Link>
        <Link href="/app/" className="btn-brand px-5 py-2.5">Try it free</Link>
      </nav>
    </header>
  );
}
