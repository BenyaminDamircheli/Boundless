import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }

    const body = await req.json();
    const {topic} = body;
    const apiBody = {
        "model": "gpt-3.5-turbo-0125",
        "messages": [{ "role": "system", "content": `
        Imagine you are a system tasked with helping a user learn a new concept from start to finish. create a hierarchical "table of contents" where there are main concepts and sub-concepts (which may also have sub-concepts), with the main concepts being a numbered list with bullet point subconcepts underneath.

        Here are the rules you MUST FOLLOW:

        - YOUR RESPONSE SHOULD ONLY BE THE TABLE OF CONTENTS, NOTHING ELSE.

        - BE AS COMPREHENSIVE AS POSSIBLE, we want this person to have a proper list of everything they need to learn to master the subject. 

        - THERE MUST BE MAIN CONCEPTS AND SUBCONCEPTS, WHICH ALSO HAVE SUBCONCEPTS.

        - THE MAIN CONCEPTS SHOULD BE A NUMBERED LIST, WHILE THE SUBCONCEPTS ARE INDENTED BULLET POINTS. 4 SPACES PER INDENT LEVEL

        - TRY TO KEEP THE TITLES LESS THAN 35 CHARACTERS.

        Now do this for: ${topic}
        ` }],
        "temperature": 1,
        "max_tokens": 700,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        
    };
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify(apiBody),
    });

    const data = await response.json();
    console.log(data);
    if (data.choices && data.choices.length > 0) {
        return NextResponse.json(data.choices[0].message.content);
    } else {
        console.error('Unexpected API response:', data);
        throw new Error('Failed to retrieve table of contents');
    }
}

