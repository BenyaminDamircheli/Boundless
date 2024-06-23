import { NextResponse, NextRequest } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const getQuickSummary = async (query: string, context: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a concept summarizer that writes like wikipedia. Write a concice 2 sentence summary of the concept you are given. Do this for ${query} while taking the following context into account: ${context}. Favour the last context in your response and only use the context where you see it adds to the comprehension for the reader. Get straight to the point in your response, DO NOT recap the context for the user.`,
      },
    ],
    temperature: 1,
    max_tokens: 200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response.choices[0].message.content;
};

export const POST = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  const { query, context } = await req.json();
  const quickSummary = await getQuickSummary(query, context);

  return NextResponse.json({ quickSummary: quickSummary });
};
