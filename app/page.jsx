import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import { Rodas, Goat, Sheep, Camel, Grandma } from "../components/Avatars";
import { GamePad, Sheet, Moon } from "../components/Icons";
import GradePicker from "../components/GradePicker";


const STORIES = [
  { title: "The clever goat", meta: "4 minutes · Pre-K and up", Pic: Goat },
  { title: "The camel who counted stars", meta: "5 minutes · Kindergarten and up", Pic: Camel },
  { title: "Bebe finds her way home", meta: "3 minutes · Pre-K and up", Pic: Sheep },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section className="bg-soft">
        <div className="wrap grid items-center gap-12 py-14 md:grid-cols-[1fr_1.15fr] md:py-20">
          <div className="min-w-0">
            <p className="mb-3 font-geez text-xl font-bold text-brand">እንቋዕ ብደሓን መጻእኩም!</p>
            <h1 className="mb-5 text-[clamp(38px,4.8vw,60px)] font-bold leading-[1.08]">
              Turning our language into <span className="text-accent">playful adventures</span>
            </h1>
            <p className="mb-7 max-w-xl text-lg leading-relaxed text-muted">
              Games, stories and short lessons with <b className="text-ink">Rodas, a friendly AI teacher</b>, in the real
              voices of Eritrean families. Math is taught in the same language. From &ldquo;I have to learn&rdquo; to &ldquo;I get to play&rdquo;.
            </p>
            <div className="mb-6 flex flex-wrap gap-3">
              <Link href="/app/" className="btn-brand">Start the free demo</Link>
              <a href="#grades" className="btn-line">Explore the curriculum</a>
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-extrabold">
              <span className="chip bg-white">Eritrean: Tigrinya · Tigre · Bilen · Saho</span>
              <span className="chip bg-white">From Ethiopia: Amharic</span>
              <span className="chip bg-white">Math in the same language</span>
            </div>
          </div>
          <div className="relative min-w-0 p-4">
            <span aria-hidden="true" className="absolute right-2 top-0 flex h-16 w-16 rotate-12 items-center justify-center rounded-2xl bg-sun font-geez text-3xl font-bold text-ink">ሀ</span>
            <span aria-hidden="true" className="absolute bottom-0 left-0 flex h-14 w-14 items-center justify-center rounded-full bg-accent font-display text-xl font-bold text-white">1+2</span>
            <img
              src="/images/hero.jpg"
              alt="Rodas, a young Eritrean teacher in a white dress with a tilet border, shows a letter on a tablet to a smiling girl"
              className="aspect-[16/11] w-full max-w-full rounded-[28px] border-[6px] border-white object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="wrap -mt-8 relative">
        <div className="card grid gap-8 p-8 md:grid-cols-3">
          <Feature color="bg-soft text-brand" Icon={GamePad} title="Engaging games">
            Feed the goat, race the sheep, count coffee cups. Every game teaches words in the language your child picks.
          </Feature>
          <Feature color="bg-[#FFF4D6] text-[#B07D00]" Icon={Sheet} title="Practice sheets">
            Homework that adapts to each child: trace the fidel, match words, count. Print it or do it on screen.
          </Feature>
          <Feature color="bg-accent-soft text-accent" Icon={Moon} title="Bedtime stories">
            Our folk tales as short movies, or audio only for sleepy eyes, told by Grandma Didi.
          </Feature>
        </div>
      </section>

      {/* Curriculum by grade (the tabs switch the language, math included) */}
      <section id="grades" className="wrap py-20">
        <GradePicker />
      </section>

      {/* Meet Rodas */}
      <section className="bg-soft">
        <div className="wrap grid items-center gap-12 py-20 md:grid-cols-[0.8fr_1.2fr]">
          <img
            src="/images/rodas.jpg"
            alt="Rodas, the AI teacher, smiling in a white zuria with a colorful tilet border, holding a tablet"
            className="aspect-[4/5] w-full max-w-md rounded-[28px] border-[6px] border-white object-cover"
          />
          <div className="min-w-0">
            <p className="eyebrow text-brand">Meet your AI teacher</p>
            <h2 className="mb-2 mt-2 text-5xl font-bold">Selam! I&apos;m Rodas.</h2>
            <p className="mb-5 font-geez text-2xl font-bold text-accent">ሰላም! ኣነ ሮዳስ እየ።</p>
            <p className="mb-6 max-w-xl text-lg leading-relaxed">
              I&apos;m an AI teacher, always ready when your child is. I teach first words, the fidel, songs and stories,
              answer questions, and remember which words need more practice.
            </p>
            <p className="eyebrow mb-3 text-muted">Or learn with an animal friend</p>
            <div className="flex flex-wrap gap-3">
              {[["Fiyel the goat", Goat], ["Bebe the sheep", Sheep], ["Gemel the camel", Camel], ["Grandma Didi", Grandma]].map(([n, Pic]) => (
                <span key={n} className="flex items-center gap-2 rounded-2xl bg-white py-1.5 pl-1.5 pr-4 font-extrabold">
                  <Pic size={40} /> {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bedtime stories */}
      <section id="stories" className="wrap py-20">
        <h2 className="mb-1.5 text-center text-4xl font-bold">Bedtime stories, your way</h2>
        <p className="mb-9 text-center text-lg text-muted">Watch a short movie, or turn the screen off and just listen.</p>
        <div className="grid gap-5 md:grid-cols-3">
          {STORIES.map(({ title, meta, Pic }) => (
            <div key={title} className="card overflow-hidden">
              <div className="flex h-40 items-center justify-center bg-[#0F2240]"><Pic size={84} /></div>
              <div className="p-4">
                <p className="text-lg font-extrabold">{title}</p>
                <p className="mb-3 text-sm text-muted">{meta}</p>
                <div className="flex gap-2 text-sm font-extrabold">
                  <span className="rounded-lg bg-brand px-3 py-2 text-white">Watch</span>
                  <span className="rounded-lg bg-soft px-3 py-2">Listen only</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Parents */}
      <section id="parents" className="bg-brand text-white">
        <div className="wrap grid items-center gap-10 py-16 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-4xl font-bold">A report for parents every Friday</h2>
            <p className="text-lg leading-relaxed text-white/90">
              In Tigrinya or English: new words, stars, minutes, homework done, a recording of your child, and a
              5-minute activity to do together.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-ink">
            {[["12", "new words"], ["38", "stars"], ["4/5", "homework"]].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-white p-4">
                <p className="text-3xl font-extrabold tabular-nums">{n}</p>
                <p className="text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="wrap py-20">
        <h2 className="mb-9 text-center text-4xl font-bold">Simple pricing</h2>
        <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
          <div className="card p-8">
            <h3 className="text-2xl font-bold">Free demo</h3>
            <p className="my-3 font-display text-5xl font-bold">$0</p>
            <p className="mb-6 text-muted">First Kindergarten lessons, three games, one bedtime story. No card needed.</p>
            <Link href="/app/" className="btn-line w-full">Play the demo</Link>
          </div>
          <div className="rounded-xl3 bg-ink p-8 text-white">
            <h3 className="text-2xl font-bold">Full access</h3>
            <p className="my-3 font-display text-5xl font-bold">$19.99 <span className="text-lg">/ month per child</span></p>
            <p className="mb-6 text-white/85">Every grade, all five languages and math, games, practice sheets, bedtime stories, Friday reports.</p>
            <Link href="/signup/" className="btn-sun w-full">Start learning</Link>
          </div>
        </div>
        <p className="mt-4 text-center text-muted">Card or PayPal · cancel any time</p>
      </section>

      <footer className="bg-ink text-white">
        <div className="wrap flex flex-wrap justify-between gap-4 py-8 text-sm">
          <span className="font-display text-xl font-bold">HehuLab</span>
          <span>Rodas and the animal friends are AI teachers. Every voice is a real family voice.</span>
          <span>hehulab.org · Mesob International · Privacy · Terms · Credits</span>
        </div>
      </footer>
    </>
  );
}

function Feature({ color, Icon, title, children }) {
  return (
    <div className="flex flex-col gap-2">
      <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}><Icon /></span>
      <h3 className="mt-2 text-xl font-bold">{title}</h3>
      <p className="text-muted">{children}</p>
    </div>
  );
}
