"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { langOf, useKid } from "./KidState";
import { Star } from "./Icons";

const MENU = [
  ["/app/", "Start"],
  ["/app/path/", "Learn"],
  ["/app/games/", "Games"],
  ["/app/stories/", "Stories"],
  ["/app/homework/", "Homework"],
  ["/app/settings/", "Settings"],
];

export default function KidTopBar() {
  const { kid } = useKid();
  const path = usePathname();
  return (
    <header className="sticky top-0 z-10 border-b-2 border-line bg-white">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="rounded-xl bg-brand px-2.5 py-0.5 font-geez text-lg font-bold text-white">ሀሁ</span>
          <span className="font-display text-2xl font-bold">HehuLab</span>
        </Link>
        <nav aria-label="App" className="flex flex-wrap gap-1 text-[15px] font-extrabold">
          {MENU.map(([href, name]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              className={`rounded-xl px-4 py-2 ${path === href ? "bg-brand text-white" : "hover:bg-soft"}`}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 font-extrabold">
          <span className="chip bg-brand text-white">{kid.track === "english" ? `English · ${langOf(kid).name}` : langOf(kid).name}</span>
          <span className="flex items-center gap-1"><Star /> {Object.values(kid.stars || {}).reduce((n, x) => n + x, 0)}</span>
          <span className="rounded-full bg-soft px-3 py-1.5">{kid.name}</span>
        </div>
      </div>
    </header>
  );
}
