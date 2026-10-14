import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { z } from "zod";

const SlotInput = z.object({
  slotId: z.string().datetime({ offset: true }),
});

function requireSignedIn(uid: string | undefined): string {
  if (!uid) {
    throw new HttpsError("unauthenticated", "Sign in is required to reserve a demo slot.");
  }
  return uid;
}

function getUpcomingSlotStarts(now = new Date()): Date[] {
  const starts: Date[] = [];
  const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  for (let offset = 0; offset < 14 && starts.length < 12; offset += 1) {
    const candidateDay = new Date(day);
    candidateDay.setUTCDate(day.getUTCDate() + offset);
    const weekday = candidateDay.getUTCDay();

    if (weekday === 0 || weekday === 6) {
      continue;
    }

    for (const hour of [14, 17]) {
      const start = new Date(candidateDay);
      start.setUTCHours(hour, 0, 0, 0);
      if (start > now) {
        starts.push(start);
      }
      if (starts.length === 12) {
        break;
      }
    }
  }

  return starts;
}

export const listDemoSlots = onCall(async (request) => {
  requireSignedIn(request.auth?.uid);

  const db = getFirestore();
  const starts = getUpcomingSlotStarts();
  const refs = starts.map((start) => db.collection("demo_slots").doc(start.toISOString()));
  const snapshots = await db.getAll(...refs);

  return {
    slots: starts
      .filter((_, index) => !snapshots[index].exists)
      .map((start) => ({ slotId: start.toISOString(), startAt: start.toISOString() })),
  };
});

export const bookDemoSlot = onCall(async (request) => {
  const uid = requireSignedIn(request.auth?.uid);
  const parsed = SlotInput.safeParse(request.data);

  if (!parsed.success) {
    throw new HttpsError("invalid-argument", "Choose one of the available demo slots.");
  }

  const start = new Date(parsed.data.slotId);
  const validStarts = getUpcomingSlotStarts();

  if (!validStarts.some((validStart) => validStart.getTime() === start.getTime())) {
    throw new HttpsError("invalid-argument", "That demo slot is not available.");
  }

  const db = getFirestore();
  const slotRef = db.collection("demo_slots").doc(start.toISOString());
  const bookingRef = db.collection("bookings").doc();

  return db.runTransaction(async (transaction) => {
    const slotSnapshot = await transaction.get(slotRef);

    if (slotSnapshot.exists) {
      const existing = slotSnapshot.data();
      if (existing?.uid === uid && typeof existing.bookingId === "string") {
        return {
          bookingId: existing.bookingId,
          slotId: start.toISOString(),
          startAt: start.toISOString(),
        };
      }
      throw new HttpsError("already-exists", "That demo slot was just reserved. Please choose another.");
    }

    transaction.create(slotRef, {
      bookingId: bookingRef.id,
      startAt: start,
      uid,
      bookedAt: FieldValue.serverTimestamp(),
    });
    transaction.create(bookingRef, {
      bookingType: "demo",
      slotId: start.toISOString(),
      startAt: start,
      uid,
      status: "confirmed",
      bookedAt: FieldValue.serverTimestamp(),
    });

    return {
      bookingId: bookingRef.id,
      slotId: start.toISOString(),
      startAt: start.toISOString(),
    };
  });
});
