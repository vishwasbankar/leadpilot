import { z } from "zod";
export const LeadFieldsSchema = z.object({
  name: z.string().trim().min(1).nullable(),
  email: z.string().email().nullable(),
  company: z.string().trim().min(1).nullable(),
  useCase: z.string().trim().min(1).nullable(),
  budget: z.number().nonnegative().nullable(),
  timeline: z.string().trim().min(1).nullable(),
  decisionMaker: z.string().trim().min(1).nullable()
});
export type LeadFields = z.infer<typeof LeadFieldsSchema>;
export const ToolNameSchema = z.enum(["extractLead", "scoreLead", "suggestOffer", "bookSlot", "handoffToHuman"]);
export const StageSchema = z.enum(["new", "qualified", "proposal_sent", "booked", "won", "lost"]);
