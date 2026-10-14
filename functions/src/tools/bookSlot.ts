export type BookingResult = { status: "confirmed"; bookingId: string; slotId: string } | { status: "rejected"; reason: string };
// Production adapter must verify slot and atomically reserve it in a Firestore transaction. This function deliberately does not fake a booking.
export async function bookSlot(_leadId: string, slotId: string, slotAvailable: boolean): Promise<BookingResult> {
 if (!slotId.trim() || !slotAvailable) return { status:"rejected", reason:"Slot is invalid or unavailable" };
 throw new Error("Connect this tool to a Firestore transaction before enabling bookings; no booking was created.");
}
