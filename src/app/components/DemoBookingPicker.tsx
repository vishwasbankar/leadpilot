"use client";

import { useEffect, useState } from "react";
import { fetchDemoSlots, reserveDemoSlot, type DemoBooking, type DemoSlot } from "@/lib/firebase-booking";

type Props = {
  onBooked: (booking: DemoBooking) => void;
};

export default function DemoBookingPicker({ onBooked }: Props) {
  const [slots, setSlots] = useState<DemoSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchDemoSlots()
      .then((availableSlots) => {
        if (active) setSlots(availableSlots);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Could not load available demo times.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function book(slot: DemoSlot) {
    setBookingSlot(slot.slotId);
    setError("");
    try {
      const reservation = await reserveDemoSlot(slot.slotId);
      onBooked(reservation);
      setSlots((current) => current.filter((item) => item.slotId !== slot.slotId));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not reserve this demo time.");
      try {
        setSlots(await fetchDemoSlots());
      } catch (refreshError) {
        setError(
          refreshError instanceof Error
            ? refreshError.message
            : "Could not refresh available demo times."
        );
      }
    } finally {
      setBookingSlot(null);
    }
  }

  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-4">
      <div className="text-sm font-semibold text-slate-800">Available demo times</div>
      <p className="mt-1 text-xs text-slate-500">Times are shown in your local timezone.</p>
      {loading ? (
        <div className="mt-3 text-xs text-slate-500">Loading available times…</div>
      ) : slots.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {slots.map((slot) => (
            <button
              key={slot.slotId}
              type="button"
              disabled={bookingSlot !== null}
              onClick={() => book(slot)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 disabled:opacity-50"
            >
              {bookingSlot === slot.slotId
                ? "Reserving…"
                : new Date(slot.startAt).toLocaleString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-3 text-xs text-slate-500">No demo times are currently available.</div>
      )}
      {error && <p role="alert" className="mt-3 text-xs text-red-600">{error}</p>}
      <p className="mt-3 text-[10px] text-slate-400">
        Reservations are stored in Firestore. No calendar invitation or email is sent.
      </p>
    </div>
  );
}
