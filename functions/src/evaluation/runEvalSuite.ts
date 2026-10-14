import { TESTCASES } from "./testcases";
// This starter validates suite integrity only. It intentionally does not claim to execute the LLM conversations.
const categories = [...new Set(TESTCASES.map(t=>t.category))];
const report = { suiteId:"leadpilot-v1", status:"FIXTURE_VALIDATION_ONLY", totalCases:TESTCASES.length, categoryCount:categories.length, cases:TESTCASES.map(t=>({id:t.id,category:t.category,fixtureValid:Boolean(t.input.length&&t.expected&&t.mustNot.length)})), note:"Wire each fixture to the deployed chatTurn function and compute metrics from observed outputs before claiming evaluation results." };
if (require.main === module) console.log(JSON.stringify(report,null,2));
export { report };
