import { LeadFieldsSchema, type LeadFields } from "../schemas/lead";
// This deterministic baseline extracts only explicitly supplied facts. Replace/augment with a server-side LLM call, then validate with the same schema.
export function extractLead(input: Partial<LeadFields>): { fields: LeadFields; unknowns: string[] } {
 const fields = LeadFieldsSchema.parse({ name:null,email:null,company:null,useCase:null,budget:null,timeline:null,decisionMaker:null,...input });
 const unknowns = Object.entries(fields).filter(([,v])=>v===null).map(([k])=>k);
 return { fields, unknowns };
}
