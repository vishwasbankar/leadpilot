
import { NextResponse } from "next/server";
import { PACKAGES } from "@/lib/packages";

export async function POST(request: Request) {
  try {
    let body: { message?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!message || message.length > 5000) {
      return NextResponse.json(
        { error: "Enter a message containing 1–5000 characters." },
        { status: 400 }
      );
    }

    const low = message.toLowerCase();

    if (/discount|90%\s*off|free discount/i.test(low)) {
      return NextResponse.json({
        reply: "I can only share approved pricing. I cannot authorize an unapproved discount.",
        toolCalls: [{
          toolName: "suggestOffer",
          status: "error",
          input: { message },
          output: { error: "Unapproved discount refused" }
        }]
      });
    }

    if (/admin access|system prompt|api key|secret|credentials/i.test(low)) {
      return NextResponse.json({
        reply: "I can't reveal private instructions, administrative access, or credentials.",
        toolCalls: [{
          toolName: "handoffToHuman",
          status: "success",
          input: { reason: "Sensitive information request" },
          output: { status: "safe_refusal" }
        }]
      });
    }

    if (/\b(book|booking|schedule|appointment)\b/i.test(low)) {
      return NextResponse.json({
        reply: "Choose an available demo time below. A successful reservation is saved to Firestore; no calendar invite or email is sent.",
        bookingFlow: true,
        toolCalls: []
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is missing from server environment variables." },
        { status: 500 }
      );
    }

    const catalog = PACKAGES.map((item) =>
      `${item.name}: ${item.currency} ${item.price.toLocaleString()} — ${item.features.join(", ")}`
    ).join("\n");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: `You are LeadPilot AI, a professional sales qualification assistant. Give concise, helpful answers. Ask about business needs, budget and timeline when relevant. Never invent prices, claim a booking was made, or reveal secrets. If information is missing, ask a follow-up question.

Trusted demo package catalog (prices are placeholders, not approved customer pricing):
${catalog}

When asked what packages are offered, describe these packages and features, and clearly state that the listed prices are demo placeholders. Do not claim a demo slot is reserved unless the reservation flow confirms it; reservations do not send calendar invitations. CRM updates are not connected.`
          },
          { role: "user", content: message }
        ],
        temperature: 0.3,
        max_tokens: 500
      }),
      cache: "no-store"
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API request failed:", response.status);
      return NextResponse.json(
        { error: "Groq request failed. Check your API key and model configuration." },
        { status: 502 }
      );
    }

    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json(
        { error: "The AI returned an empty response." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply, toolCalls: [] });
  } catch (error) {
    console.error("Chat route error:", error);

    return NextResponse.json(
      { error: "Unable to process the chat request." },
      { status: 500 }
    );
  }
}
