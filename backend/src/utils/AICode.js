import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.AIKEY,
});

function stripCodeFences(text) {
  if (typeof text !== "string") return "";
  return text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, "$1").trim();
}

function tryParseJson(text) {
  const cleaned = stripCodeFences(text);
  if (!cleaned) return null;

  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to salvage: grab the first {...} block
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const maybeJson = cleaned.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(maybeJson);
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function getCompletionContent(messages) {
  const response = await openai.chat.completions.create({
    model: process.env.AI_MODEL ?? "kwaipilot/kat-coder-pro:free",
    temperature: 0.2,
    messages,
  });
  return response.choices?.[0]?.message?.content ?? "";
}

export async function reviewCode(code, language) {
  if (!process.env.AIKEY) {
    throw new Error("Missing AIKEY in environment (.env)");
  }
  console.log(`Prompt: ${prompt}, Language: ${language}`)

  const prompt = `
You are a senior software engineer performing a professional code review.

Return ONLY valid JSON (no markdown, no backticks, no extra text).
Schema (keys must match exactly):
{
  "issues": string,
  "improvements": string,
  "explanation": string
}

Analyze the following ${language} code and provide:
1) Bugs or potential issues
2) Improvements (performance, readability, best practices)
3) A clear explanation of what the code does

Code:
${code}
`.trim();

  const baseMessages = [
    {
      role: "system",
      content: "You are a strict but helpful code reviewer.",
    },
    { role: "user", content: prompt },
  ];

  // Attempt 1
  const raw1 = await getCompletionContent(baseMessages);
  const parsed1 = tryParseJson(raw1);
  if (parsed1) return parsed1;

  // Attempt 2 (retry once with explicit correction)
  const raw2 = await getCompletionContent([
    ...baseMessages,
    {
      role: "user",
      content:
        "Your last response was not valid JSON. Return ONLY valid JSON that matches the schema exactly.",
    },
  ]);
  const parsed2 = tryParseJson(raw2);
  if (parsed2) return parsed2;

  // Fallback: never crash the whole request because the model formatted badly
  return {
    issues: "",
    improvements: "",
    explanation:
      "The AI response was not valid JSON. Raw response:\n\n" +
      stripCodeFences(raw2 || raw1),
  };
}
