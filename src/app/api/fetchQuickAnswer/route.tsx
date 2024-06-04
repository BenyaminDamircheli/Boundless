import { NextResponse, NextRequest } from "next/server";
import {OpenAI} from "openai"

const openai = new OpenAI({
    apiKey: 'sk-proj-fxy6JA8psNtnNZsHHxihT3BlbkFJqnQy7VPNj78kHdW0Iy1X',
})

const getQuickAnswer = async (query: string, context: string) => {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: `You are a concept summarizer that writes like wikipedia. Write a concice, yet in depth, 2 sentence summary of the concept you are given. Do this for ${query} while taking the following context into account: ${context}. Only use the context where you see it adds to the comprehension for the reader. Get straight to the point in your response, DO NOT recap the context for the user.`},
        ],
        temperature: 1,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
    })
    return response
}


export const POST = async (req: NextRequest) => {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
    const { query, context } = await req.json();
    const quickAnswerStream = await getQuickAnswer(query, context);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of quickAnswerStream) {
                const part = chunk.choices[0]?.delta?.content || "";
                controller.enqueue(encoder.encode(part));
            }
            controller.close();
        }
    });

    return new Response(readableStream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
};


