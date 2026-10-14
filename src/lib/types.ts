export type Stage = "new" | "qualified" | "proposal_sent" | "booked" | "won" | "lost";
export type LeadFields = { name:string|null; email:string|null; company:string|null; useCase:string|null; budget:number|null; timeline:string|null; decisionMaker:string|null };
export type Package = { id:string; name:string; price:number; currency:string; features:string[] };
export type ToolName = "extractLead"|"scoreLead"|"suggestOffer"|"bookSlot"|"handoffToHuman";
export type ToolCall = { toolName:ToolName; status:"success"|"error"; input:Record<string,unknown>; output:Record<string,unknown> };
export type Lead = { id:string; name:string; company:string; email:string; useCase:string; score:number; stage:Stage; budget:string; timeline:string; unknowns:string[]; riskFlags:string[] };