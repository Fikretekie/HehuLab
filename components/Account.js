"use client";

// The family's account (DEMO). Until the server exists (AWS Cognito, like voices.hehulab.org), we only keep the
// grown-up's name, email and plan in this browser so the screens can be tested. Passwords are never saved here.

export const PRICE = 13.99; // dollars per child per month
const KEY = "hehulab.account";

export function getAccount() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function saveAccount(changes) {
  const next = { ...(getAccount() || {}), ...changes };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private window */
  }
  return next;
}

export function signOut() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export const money = (n) => `$${n.toFixed(2)}`;
