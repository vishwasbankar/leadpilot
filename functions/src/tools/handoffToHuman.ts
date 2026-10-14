export function handoffToHuman(conversationId: string, reason: string) {
 if (!conversationId.trim() || !reason.trim()) throw new Error("conversationId and reason are required");
 // TODO: persist a handoff record and notify the admin queue via a trusted backend operation.
 return { status:"handoff_requested" as const, conversationId, reason, persisted:false };
}
