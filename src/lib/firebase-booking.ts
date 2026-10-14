"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

export type DemoSlot = { slotId: string; startAt: string };
export type DemoBooking = DemoSlot & { bookingId: string };

function getFirebaseServices() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (Object.values(config).some((value) => !value)) {
    throw new Error("Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* settings to .env.local.");
  }

  const app = getApps().length ? getApp() : initializeApp(config);
  return { auth: getAuth(app), functions: getFunctions(app) };
}

async function ensureSignedIn() {
  const { auth, functions } = getFirebaseServices();
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  return functions;
}

export async function fetchDemoSlots(): Promise<DemoSlot[]> {
  const functions = await ensureSignedIn();
  const listSlots = httpsCallable<void, { slots: DemoSlot[] }>(functions, "listDemoSlots");
  const result = await listSlots();
  return result.data.slots;
}

export async function reserveDemoSlot(slotId: string): Promise<DemoBooking> {
  const functions = await ensureSignedIn();
  const bookSlot = httpsCallable<{ slotId: string }, DemoBooking>(functions, "bookDemoSlot");
  const result = await bookSlot({ slotId });
  return result.data;
}
