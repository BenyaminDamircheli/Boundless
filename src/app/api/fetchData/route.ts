import { NextResponse, NextRequest } from 'next/server';
import {OpenAI} from "openai"

async function getTOC(query: string) {
    const openai = new OpenAI({
        apiKey: 'sk-proj-fxy6JA8psNtnNZsHHxihT3BlbkFJqnQy7VPNj78kHdW0Iy1X',
    });

    const stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{
            "role": "system",
            "content": `
            Imagine you are a system tasked with helping a user learn a new concept. Create a hierarchical table of contents where there are main concepts and sub-concepts (which may also have sub-concepts), with the main concepts being a numbered list with bullet point subconcepts underneath.
        
            Here are the rules you MUST FOLLOW:

            - AFTER EVERY CONCEPT, INCLUDING SUBCONCEPTS, MARK THEM WITH "<END>" AT THE END OF THE CONCEPT. MAKE SURE TO STILL MAKE THEM HEIRARCHICAL WITH CONCEPTS AND SUBCONCEPTS.

            - NEVER CONVERSE WITH THE USER. JUST OUTPUT THE TABLE OF CONTENTS.

            - TRY TO KEEP THE TITLES LESS THAN 25 CHARACTERS.

            - EVERY TITLE (ESPECIALLY THE ONES WITH NO CHILDREN) MUST BE SPECIFIC ENOUGH TO WHERE YOU COULD FIND A GOOD IMAGE ABOUT IT, DO NOT REPEAT TITLES, EVEN IN DIFFERENT SECTIONS.
        
            - YOU MUST USE 450 WORDS IN YOUR RESPONSE, YOU MUST FIT EVERY MAJOR CONCEPT WITHIN THIS LIMIT.
        
            - DON'T INCLUDE GENERAL CONCEPTS LIKE "DEFINITIONS" OR "EXAMPLES", JUST STRAIGHT TECHNICAL CONCEPTS.
        
            - DO NOT INCLUDE ANY INTRODUCTION OR CONCLUSION SECTION IN THE TOC. JUST TECHNICAL CONCEPTS RELATING TO THE QUERY. 
        
        
            - BE AS COMPREHENSIVE AS POSSIBLE. GIVE THE USER A BIG LIST OF ALL THE CONCEPTS THEY NEED TO KNOW.
        
            - THERE MUST BE MULTUPLE MAIN CONCEPTS AND SUBCONCEPTS, WHICH ALSO HAVE SUBCONCEPTS.
        
            - THE MAIN CONCEPTS SHOULD BE A NUMBERED LIST, WHILE THE SUBCONCEPTS ARE INDENTED BULLET POINTS. 4 SPACES PER INDENT LEVEL
            
            Now do this for: ${query}.
            `
        }],
        temperature: 1,
        max_tokens: 800,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
    });

    return stream;
}





export const POST = async (req: NextRequest) => {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
    const { query } = await req.json();
    const TOCStream = await getTOC(query);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of TOCStream) {
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
