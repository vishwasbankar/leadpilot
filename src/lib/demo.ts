import type { Lead } from "./types";
export const initialLeads: Lead[] = [
{id:"LD-1042",name:"Priya Sharma",company:"Acme Studio",email:"priya@acme.example",useCase:"Customer support dashboard",score:88,stage:"qualified",budget:"$1,000–$1,500",timeline:"Next month",unknowns:["Decision-maker confirmation"],riskFlags:[]},
{id:"LD-1041",name:"Rahul Mehta",company:"Northstar Labs",email:"rahul@northstar.example",useCase:"Internal workflow automation",score:72,stage:"proposal_sent",budget:"$2,000–$3,000",timeline:"This quarter",unknowns:[],riskFlags:[]},
{id:"LD-1040",name:"Maya Patel",company:"BrightPath",email:"maya@brightpath.example",score:42,stage:"new",budget:"Not provided",timeline:"Not provided",useCase:"Lead management",unknowns:["budget","timeline","decision-maker"],riskFlags:[]}
];