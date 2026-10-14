import type { LeadFields } from "../schemas/lead";
export function scoreLead(fields: LeadFields) {
 const parts = { useCase: fields.useCase ? 25 : 0, budget: fields.budget !== null ? 25 : 0, timeline: fields.timeline ? 20 : 0, decisionMaker: fields.decisionMaker ? 20 : 0, contact: fields.email ? 10 : 0 };
 const score = Object.values(parts).reduce((a,b)=>a+b,0);
 return { score, parts, qualified: score >= 70, unknowns: Object.entries(parts).filter(([k,v])=>v===0).map(([k])=>k) };
}
