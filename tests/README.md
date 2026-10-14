# Test plan

- Unit-test `LeadFieldsSchema`, `scoreLead`, and `suggestOffer`.
- Verify unknown fields remain null rather than receiving invented defaults.
- Test invalid package IDs, unauthorized requests, fake slot IDs, and repeated booking attempts.
- Test prompt injection, admin-access requests, API-key requests, and fake urgency.
- Run the 20 fixtures in `functions/src/evaluation/testcases.ts` against the actual chat orchestration before claiming accuracy/hallucination metrics.
