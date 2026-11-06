"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteHeader from "./SiteHeader";
import { PRICE, money, saveAccount } from "./Account";

// Sign up and Log in share this page: social buttons on top (Google, Apple), then email.
// DEMO: nothing is sent anywhere yet. Real accounts come with AWS Cognito (Google and Apple need their own app keys).

const Google = () => (
  <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);
const Apple = () => (
  <svg width="20" height="22" viewBox="0 0 384 512" aria-hidden="true">
    <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

export default function AuthForm({ mode }) {
  const signup = mode === "signup";
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");

  function done(account) {
    saveAccount({ ...account, since: new Date().toISOString().slice(0, 10) });
    // New families choose a plan; returning families go straight to learning.
    router.push(signup ? "/checkout/" : "/app/");
  }

  function social(provider) {
    setNote(`${provider} sign-in is a demo for now. It works for real once HehuLab is online.`);
    setTimeout(() => done({ name: name || "Parent", email: email || `demo@${provider.toLowerCase()}`, provider }), 900);
  }

  function submit(e) {
    e.preventDefault();
    if (password.length < 8) return setNote("Please use at least 8 letters or numbers for the password.");
    done({ name: name || email.split("@")[0], email, provider: "email" }); // the password is never stored
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-soft">
        <div className="wrap grid items-center gap-10 py-14 md:grid-cols-[1fr_0.9fr]">
          <section className="card mx-auto w-full max-w-lg p-8">
            <p className="eyebrow text-brand">{signup ? "For parents and grown-up learners" : "Welcome back"}</p>
            <h1 className="mt-1 text-4xl font-bold">{signup ? "Create your family account" : "Log in"}</h1>
            <p className="mt-2 text-muted">
              {signup ? "One account for the whole family. Add each child after." : "Pick up where you left off."}
            </p>

            <div className="mt-6 grid gap-3">
              <button type="button" onClick={() => social("Google")} className="btn-line w-full">
                <Google /> Continue with Google
              </button>
              <button type="button" onClick={() => social("Apple")} className="btn w-full bg-ink text-white hover:bg-black">
                <Apple /> Continue with Apple
              </button>
            </div>

            <div className="my-6 flex items-center gap-3 text-sm font-bold text-muted">
              <span className="h-0.5 flex-1 bg-line" /> or with email <span className="h-0.5 flex-1 bg-line" />
            </div>

            <form onSubmit={submit} className="grid gap-4">
              {signup && (
                <label className="grid gap-1.5 font-extrabold">
                  Your name
                  <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name"
                    className="rounded-2xl border-2 border-line px-4 py-3 font-semibold outline-none focus:border-brand" />
                </label>
              )}
              <label className="grid gap-1.5 font-extrabold">
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
                  className="rounded-2xl border-2 border-line px-4 py-3 font-semibold outline-none focus:border-brand" />
              </label>
              <label className="grid gap-1.5 font-extrabold">
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                  autoComplete={signup ? "new-password" : "current-password"}
                  className="rounded-2xl border-2 border-line px-4 py-3 font-semibold outline-none focus:border-brand" />
                {signup && <span className="text-sm font-semibold text-muted">At least 8 letters or numbers</span>}
              </label>
              {!signup && <a href="#" className="-mt-2 text-sm font-bold text-brand">Forgot password?</a>}
              {note && <p role="status" className="rounded-2xl bg-accent-soft px-4 py-3 text-sm font-bold text-accent">{note}</p>}
              <button type="submit" className="btn-brand w-full text-lg">{signup ? "Create account" : "Log in"}</button>
            </form>

            <p className="mt-5 text-center font-semibold text-muted">
              {signup ? "Already have an account? " : "New to HehuLab? "}
              <Link href={signup ? "/login/" : "/signup/"} className="font-extrabold text-brand">
                {signup ? "Log in" : "Create an account"}
              </Link>
            </p>
            {signup && (
              <p className="mt-3 text-center text-xs text-muted">
                By creating an account you agree to the Terms and Privacy policy. We never show ads to children.
              </p>
            )}
          </section>

          <aside className="hidden md:block">
            <img src="/images/rodas.jpg" alt="Rodas, the AI teacher, smiling in a white zuria"
              className="aspect-[4/5] w-full max-w-sm rounded-[28px] border-[6px] border-white object-cover" />
            <ul className="mt-6 space-y-2 text-lg font-bold">
              <li>⭐ A short placement test finds the right level</li>
              <li>🎮 Games, stories and lessons for every grade</li>
              <li>📬 A report for parents every Friday</li>
              <li>💳 {money(PRICE)} a month per child · cancel any time</li>
            </ul>
          </aside>
        </div>
      </main>
    </>
  );
}
