import { NextResponse, NextRequest } from 'next/server';

async function getTOC(query: string) {

    const apiBody = {
        "model": 'gpt-3.5-turbo-0125',
        "messages": [{ "role": "system", "content": `
        Imagine you are a system tasked with helping a user learn a new concept. Create a hierarchical "table of contents" where there are main concepts and sub-concepts (which may also have sub-concepts), with the main concepts being a numbered list with bullet point subconcepts underneath.

        Here are the rules you MUST FOLLOW:

        - YOU MUST USE 400 WORDS IN YOUR RESPONSE, YOU MUST FIT EVERY CONCEPT WITHIN THIS LIMIT.

        - DON'T INCLUDE GENERAL CONCEPTS LIKE "DEFINITIONS" OR "EXAMPLES", JUST STRAIGHT TECHNICAL CONCEPTS.

        - DO NOT INCLUDE ANY INTRODUCTION OR CONCLUSION SECTION IN THE TOC. JUST TECHNICAL CONCEPTS RELATING TO THE QUERY. 

        - TRY TO KEEP THE TITLES LESS THAN 30 CHARACTERS.

        - BE AS COMPREHENSIVE AS POSSIBLE. GIVE THE USER A BIG LIST OF ALL THE CONCEPTS THEY NEED TO KNOW.

        - THERE MUST BE MULTUPLE MAIN CONCEPTS AND SUBCONCEPTS, WHICH ALSO HAVE SUBCONCEPTS.

        - THE MAIN CONCEPTS SHOULD BE A NUMBERED LIST, WHILE THE SUBCONCEPTS ARE INDENTED BULLET POINTS. 4 SPACES PER INDENT LEVEL
        

        Now do this for: ${query}
        ` }],
        "temperature": 1,
        "max_tokens": 650,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
    }
const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        },
        body: JSON.stringify(apiBody),
        
    });
    const data = await response.json();
    console.log(data);
    if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
    } else {
        console.error('Unexpected API response:', data);
        throw new Error('Failed to retrieve table of contents');
    }
}

    async function getQuickAnswer(query: string) {
        const apiBody = {
        "model": 'gpt-3.5-turbo-0125',
        "messages": [{ "role": "system", "content": `You are a concept summarizer and speak like Wikipedia. Give a 1-2 sentence concise summary about the given topic. Now do this for: ${query} `}],
        "temperature": 1,
        "max_tokens": 120,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        
    }
        console.log('fetching quick answer');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
            },
            body: JSON.stringify(apiBody),
        
        });
        const data = await response.json();
        console.log(data);
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            console.error('Unexpected API response:', data);
            throw new Error('Failed to retrieve quick answer');
        }
    }

    function parseTOC(toc: string, query: string) {
        const lines = toc.split('\n').filter(line => line.trim() !== '');
        const nodes: any[] = [];
        const edges: any[] = [];
        let nodeId = 0;
        const parentStack: { id: number, level: number }[] = [];
    
        // Add the very first node as a noteNode with the title being the query
    
        lines.forEach((line) => {
            const level = (line.match(/^\s*/)?.[0].length ?? 0) / 4; // Adjusted for 4 spaces per level
            const title = line.replace(/^\s*[-\d]+\.\s*/, '').replace(/^—/, '').replace(/^-/, '').replace(/^\s*-\s*/, '').trim();
    
            const node: any = {
                id: nodeId.toString(),
                position: { x: 0, y: 0 }, 
                data: { title: title, level: level, pageTopic: query},
                type: level === 0 ? 'customNode' : 'subConceptNode',
            };
    
            while (parentStack.length > 0 && parentStack[parentStack.length - 1].level >= level) {
                parentStack.pop();
            }
    
            if (level === 0) {
                // Connect all main concept nodes to the first noteNode
                edges.push({
                    id: `e0-${nodeId}`,
                    source: nodeId.toString(),
                    target: '0',
                    style: {
                        strokeWidth: 7, stroke: 'white', zIndex:9999999999, 
                        markerStart: 'arrow'
                    }
                });
            } else if (parentStack.length > 0) {
                const parentNodeId = parentStack[parentStack.length - 1].id;
                node.data.parentNode = parentNodeId.toString();
                edges.push({
                    id: `e${parentNodeId}-${nodeId}`,
                    source: nodeId.toString(),
                    target: parentNodeId.toString(),
                    style: {
                        strokeWidth: 7, stroke: 'white', zIndex:9999999999
                    }
                });
            }
    
            nodes.push(node);
            parentStack.push({ id: nodeId, level: level });
            nodeId++;
        });
    
        console.log(nodes);
        console.log(edges);
        
        return { nodes, edges };
    }

export const POST = async (req: NextRequest) => {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
    const { query } = await req.json();
    const TOC = await getTOC(query);
    const quickAnswer = await getQuickAnswer(query);
    const parsedTOC = await parseTOC(TOC.slice(0), query);
    return NextResponse.json({ TOC: parsedTOC, quickAnswer });
};

