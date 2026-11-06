"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import { PRICE, getAccount, money, saveAccount } from "../../components/Account";

// Checkout: how many children, the monthly total, then pay with a card (Stripe) or PayPal.
// DEMO: the two buttons are placeholders. Tomorrow they get Fik's Stripe and PayPal keys
// (Stripe Checkout / Payment Link and PayPal Subscriptions), which also need a small server (AWS Lambda).

export default function Checkout() {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [kids, setKids] = useState(1);
  const [paying, setPaying] = useState("");

  useEffect(() => setAccount(getAccount()), []);
  const total = PRICE * kids;

  function pay(method) {
    setPaying(method);
    setTimeout(() => {
      saveAccount({ plan: "full", children: kids, payWith: method, demoPayment: true });
      router.push("/app/placement/");
    }, 1200);
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-soft">
        <div className="wrap grid gap-8 py-14 md:grid-cols-[1.1fr_0.9fr]">
          <section className="card p-8">
            <p className="eyebrow text-brand">Step 2 of 3 · Choose your plan</p>
            <h1 className="mt-1 text-4xl font-bold">
              {account?.name ? `Welcome, ${account.name}!` : "Full access for your family"}
            </h1>
            <p className="mt-2 text-lg text-muted">Every grade, all languages, math, games, stories and Friday reports.</p>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-line p-5">
              <div>
                <p className="text-lg font-extrabold">How many children?</p>
                <p className="text-muted">{money(PRICE)} a month for each child. Grown-up learners count as one.</p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" aria-label="One less child" onClick={() => setKids((k) => Math.max(1, k - 1))}
                  className="h-12 w-12 rounded-full border-2 border-line text-2xl font-extrabold hover:border-brand">−</button>
                <span className="w-10 text-center font-display text-3xl font-bold tabular-nums" aria-live="polite">{kids}</span>
                <button type="button" aria-label="One more child" onClick={() => setKids((k) => Math.min(8, k + 1))}
                  className="h-12 w-12 rounded-full border-2 border-line text-2xl font-extrabold hover:border-brand">+</button>
              </div>
            </div>

            <h2 className="mb-3 mt-8 text-2xl font-bold">Pay with</h2>
            <div className="grid gap-3">
              <button type="button" disabled={!!paying} onClick={() => pay("card")}
                className="btn w-full bg-[#635BFF] text-lg text-white hover:brightness-110 disabled:opacity-60">
                💳 {paying === "card" ? "Opening Stripe…" : "Pay with card"}
                <span className="rounded-md bg-white/20 px-2 py-0.5 text-sm">Stripe</span>
              </button>
              <button type="button" disabled={!!paying} onClick={() => pay("paypal")}
                className="btn w-full bg-[#FFC439] text-lg text-[#003087] hover:brightness-95 disabled:opacity-60">
                {paying === "paypal" ? "Opening PayPal…" : <span className="font-display text-xl font-bold italic">Pay<span className="text-[#009CDE]">Pal</span></span>}
              </button>
            </div>
            <p className="mt-4 rounded-2xl bg-accent-soft px-4 py-3 text-sm font-bold text-accent">
              Test mode: no money is taken yet. Stripe and PayPal get connected next.
            </p>
          </section>

          <aside className="card h-fit p-8">
            <h2 className="text-2xl font-bold">Your order</h2>
            <div className="mt-5 space-y-3 text-lg">
              <div className="flex justify-between"><span>Full access × {kids}</span><span className="tabular-nums">{money(total)}</span></div>
              <div className="flex justify-between border-t-2 border-line pt-3 font-extrabold">
                <span>Total each month</span><span className="tabular-nums">{money(total)}</span>
              </div>
            </div>
            <ul className="mt-6 space-y-2 font-semibold text-muted">
              <li>✓ Cancel any time in Settings</li>
              <li>✓ Next: a short placement test for each child</li>
            </ul>
            <Link href="/app/" className="mt-6 block text-center font-bold text-brand">Not now, try the free demo</Link>
          </aside>
        </div>
      </main>
    </>
  );
}
