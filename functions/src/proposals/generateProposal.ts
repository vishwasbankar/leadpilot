import { PACKAGES } from "../config/packages";
export function generateProposal(lead: {name:string|null;company:string|null;useCase:string|null;budget:number|null;timeline:string|null}, packageId:string) {
 const p=PACKAGES.find(x=>x.id===packageId); if(!p) throw new Error("Unknown package");
 const assumptions:string[]=[]; if(!lead.budget) assumptions.push("Budget has not been confirmed by the prospect."); if(!lead.timeline) assumptions.push("Timeline has not been confirmed by the prospect."); if(!lead.useCase) assumptions.push("Use case needs clarification.");
 const proposalMarkdown=`# Proposal for ${lead.company ?? lead.name ?? "Prospective customer"}\n\n## Recommended package: ${p.name}\n\n**Configured demo price:** ${p.currency} ${p.price.toLocaleString()}\n\n## Included\n${p.features.map(f=>`- ${f}`).join("\n")}\n\n## Intended use case\n${lead.useCase ?? "To be confirmed"}\n\n## Assumptions to confirm\n${assumptions.length?assumptions.map(a=>`- ${a}`).join("\n"):"- No missing assumptions identified from supplied fields."}\n\n> Pricing and features are demo placeholders until replaced with approved commercial terms.`;
 return {proposalMarkdown,assumptions,packageId:p.id};
}
