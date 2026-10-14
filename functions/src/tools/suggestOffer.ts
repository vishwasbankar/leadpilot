import { PACKAGES } from "../config/packages";
export function suggestOffer(packageId: string) {
 const found = PACKAGES.find(p=>p.id===packageId);
 if (!found) throw new Error("Package is not in the approved catalog");
 // Return only server-owned values; never accept a price/discount from model output.
 return { ...found };
}
